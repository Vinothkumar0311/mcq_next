const express = require('express');
const router = express.Router();
const testController = require('../../controllers/Slot/testController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for Excel uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.resolve(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, `upload-${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'), false);
    }
  }
});

// GET /api/modules/:moduleId/tests - Get all tests for a module
router.get('/modules/:moduleId/tests', testController.getTestsByModule);

// POST /api/modules/:moduleId/tests - Create new test
router.post('/modules/:moduleId/tests', upload.any(), testController.createTest);

// POST /api/tests/:testId/mcq/questions - Add MCQ questions
router.post('/tests/:testId/mcq/questions', testController.addMCQQuestions);

// POST /api/tests/:testId/coding/problems - Add coding problems
router.post('/tests/:testId/coding/problems', testController.addCodingProblems);

// POST /api/tests/:testId/bulk-upload/mcq - Bulk upload MCQ
router.post('/tests/:testId/bulk-upload/mcq', upload.single('file'), testController.bulkUploadMCQ);

// POST /api/tests/:testId/bulk-upload/coding - Bulk upload coding
router.post('/tests/:testId/bulk-upload/coding', upload.single('file'), testController.bulkUploadCoding);

// DELETE /api/tests/:testId - Delete test
router.delete('/tests/:testId', testController.deleteTest);

// GET /api/templates/mcq - Download MCQ template
router.get('/templates/mcq', (req, res) => {
  try {
    const { generateMCQTemplate } = require('../../utils/templateGenerator');
    const templatePath = generateMCQTemplate();
    res.download(templatePath, 'mcq-template.xlsx', (err) => {
      if (err) {
        console.error('Template download error:', err);
        res.status(500).json({ success: false, error: 'Failed to download template' });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate template' });
  }
});

// GET /api/templates/coding - Download Coding template
router.get('/templates/coding', (req, res) => {
  try {
    const { generateCodingTemplate } = require('../../utils/templateGenerator');
    const templatePath = generateCodingTemplate();
    res.download(templatePath, 'coding-template.xlsx', (err) => {
      if (err) {
        console.error('Template download error:', err);
        res.status(500).json({ success: false, error: 'Failed to download template' });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate template' });
  }
});

module.exports = router;