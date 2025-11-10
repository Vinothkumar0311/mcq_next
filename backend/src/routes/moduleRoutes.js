const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Module storage (in production, use a proper database)
let modules = [];
let tests = [];
let questions = [];

// Get a specific module
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const module = modules.find(m => m.id === parseInt(req.params.id));
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }
    res.json(module);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch module' });
  }
});

// Update a module
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const moduleIndex = modules.findIndex(m => m.id === parseInt(req.params.id));
    if (moduleIndex === -1) {
      return res.status(404).json({ error: 'Module not found' });
    }

    const { 
      title, 
      description, 
      duration, 
      mcqPassCriteria, 
      codingPassCriteria, 
      questionsToDisplay, 
      randomizeQuestions, 
      status 
    } = req.body;
    
    modules[moduleIndex] = {
      ...modules[moduleIndex],
      title: title?.trim() || modules[moduleIndex].title,
      description: description?.trim() || modules[moduleIndex].description,
      duration: duration || modules[moduleIndex].duration,
      mcqPassCriteria: mcqPassCriteria || modules[moduleIndex].mcqPassCriteria,
      codingPassCriteria: codingPassCriteria || modules[moduleIndex].codingPassCriteria,
      questionsToDisplay: questionsToDisplay || modules[moduleIndex].questionsToDisplay,
      randomizeQuestions: randomizeQuestions !== undefined ? randomizeQuestions : modules[moduleIndex].randomizeQuestions,
      status: status || modules[moduleIndex].status,
      published: status === 'published',
      updatedAt: new Date().toISOString()
    };

    res.json(modules[moduleIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update module' });
  }
});

// Delete a module
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const moduleIndex = modules.findIndex(m => m.id === parseInt(req.params.id));
    if (moduleIndex === -1) {
      return res.status(404).json({ error: 'Module not found' });
    }

    // Remove associated tests and questions
    tests = tests.filter(t => t.moduleId !== parseInt(req.params.id));
    questions = questions.filter(q => q.moduleId !== parseInt(req.params.id));
    
    modules.splice(moduleIndex, 1);
    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete module' });
  }
});

// Get questions for a module
router.get('/:id/questions', authMiddleware, (req, res) => {
  try {
    const moduleQuestions = questions.filter(q => q.moduleId === parseInt(req.params.id));
    res.json(moduleQuestions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Upload questions via Excel
router.post('/:id/questions/upload', authMiddleware, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const moduleId = parseInt(req.params.id);
    const module = modules.find(m => m.id === moduleId);
    
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    // Read Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({ error: 'Excel file is empty' });
    }

    // Process questions based on type (MCQ or Coding)
    const newQuestions = [];
    
    data.forEach((row, index) => {
      try {
        if (row.question_text || row.problem_title) {
          // MCQ Question
          if (row.question_text) {
            const question = {
              id: Date.now() + index,
              moduleId,
              type: 'mcq',
              question: row.question_text,
              option1: row.option_A || '',
              option2: row.option_B || '',
              option3: row.option_C || '',
              option4: row.option_D || '',
              correctAnswer: row.correct_option || 'A',
              marks: parseInt(row.marks) || 1,
              negativeMarks: parseFloat(row.negative_marks) || 0,
              explanation: row.explanation || '',
              tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
              difficulty: row.difficulty || 'medium',
              createdAt: new Date().toISOString(),
              createdBy: req.user.id
            };
            newQuestions.push(question);
          }
          
          // Coding Question
          if (row.problem_title) {
            const question = {
              id: Date.now() + index + 1000,
              moduleId,
              type: 'coding',
              title: row.problem_title,
              description: row.description || '',
              allowedLanguages: row.allowed_languages ? row.allowed_languages.split(',').map(lang => lang.trim()) : ['C', 'C++', 'Python'],
              sampleInput: row.sample_input || '',
              sampleOutput: row.sample_output || '',
              hiddenTestcases: row.hidden_testcases || '',
              points: parseInt(row.points) || 10,
              timeLimitSec: parseInt(row.time_limit_sec) || 2,
              memoryLimitMb: parseInt(row.memory_limit_mb) || 256,
              tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
              difficulty: row.difficulty || 'medium',
              createdAt: new Date().toISOString(),
              createdBy: req.user.id
            };
            newQuestions.push(question);
          }
        }
      } catch (error) {
        console.error(`Error processing row ${index + 1}:`, error);
      }
    });

    if (newQuestions.length === 0) {
      return res.status(400).json({ error: 'No valid questions found in the Excel file' });
    }

    // Add questions to storage
    questions.push(...newQuestions);

    // Clean up uploaded file
    const fs = require('fs');
    fs.unlinkSync(req.file.path);

    res.json({
      message: `Successfully uploaded ${newQuestions.length} questions`,
      questionsAdded: newQuestions.length,
      questions: newQuestions
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process Excel file' });
  }
});

// Create a test for a module
router.post('/:id/tests', authMiddleware, (req, res) => {
  try {
    const moduleId = parseInt(req.params.id);
    const module = modules.find(m => m.id === moduleId);
    
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    const { 
      name, 
      description, 
      instructions, 
      duration, 
      randomizeQuestions, 
      sections 
    } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Test name is required' });
    }

    if (!sections || sections.length === 0) {
      return res.status(400).json({ error: 'At least one section is required' });
    }

    const newTest = {
      id: Date.now(),
      moduleId,
      name: name.trim(),
      description: description?.trim() || '',
      instructions: instructions?.trim() || '',
      duration: duration || 60,
      randomizeQuestions: randomizeQuestions !== false,
      status: 'draft',
      sections: sections.map((section, index) => ({
        ...section,
        id: Date.now() + index,
        testId: Date.now()
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: req.user.id
    };

    tests.push(newTest);
    
    // Update module with test ID
    module.testId = newTest.id;
    module.updatedAt = new Date().toISOString();

    res.status(201).json(newTest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create test' });
  }
});

// Get tests for a module
router.get('/:id/tests', authMiddleware, (req, res) => {
  try {
    const moduleTests = tests.filter(t => t.moduleId === parseInt(req.params.id));
    res.json(moduleTests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
});

module.exports = router;