// // // controllers/questionController.js
// // const { questionsslot:Question, Module, SlotTestSession } = require('../../models');
// // const XLSX = require('xlsx');

// // const questionController = {
// //   // Get all questions for a module
// //   getQuestionsByModule: async (req, res) => {
// //     try {
// //       const { moduleId } = req.params;
      
// //       const questions = await Question.findAll({
// //         where: { moduleId },
// //         include: [{
// //           model: SlotTestSession,
// //           attributes: ['id', 'name', 'type']
// //         }],
// //         order: [['createdAt', 'ASC']]
// //       });
      
// //       res.json({
// //         success: true,
// //         data: questions
// //       });
// //     } catch (error) {
// //       res.status(500).json({
// //         success: false,
// //         error: error.message
// //       });
// //     }
// //   },

// //   // Create question
// //   createQuestion: async (req, res) => {
// //     try {
// //       const { moduleId } = req.params;
// //       const questionData = req.body;
      
// //       // Verify module exists
// //       const module = await Module.findByPk(moduleId);
// //       if (!module) {
// //         return res.status(404).json({
// //           success: false,
// //           error: 'Module not found'
// //         });
// //       }
      
// //       const question = await Question.create({
// //         ...questionData,
// //         moduleId
// //       });
      
// //       // Update section question count if sectionId is provided
// //       if (questionData.sectionId) {
// //         await SlotTestSession.increment('questionCount', {
// //           where: { id: questionData.sectionId }
// //         });
// //       }
      
// //       res.status(201).json({
// //         success: true,
// //         data: question,
// //         message: 'Question created successfully'
// //       });
// //     } catch (error) {
// //       res.status(500).json({
// //         success: false,
// //         error: error.message
// //       });
// //     }
// //   },

// //   // Upload questions from Excel
// //   uploadQuestions: async (req, res) => {
// //     try {
// //       const { moduleId } = req.params;
      
// //       if (!req.file) {
// //         return res.status(400).json({
// //           success: false,
// //           error: 'No file uploaded'
// //         });
// //       }
      
// //       // Verify module exists
// //       const module = await Module.findByPk(moduleId);
// //       if (!module) {
// //         return res.status(404).json({
// //           success: false,
// //           error: 'Module not found'
// //         });
// //       }
      
// //       // Read Excel file
// //       const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
// //       const sheetName = workbook.SheetNames[0];
// //       const worksheet = workbook.Sheets[sheetName];
// //       const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
// //       const questions = [];
      
// //       for (const row of jsonData) {
// //         let questionData = {
// //           moduleId,
// //           type: row.type || 'mcq'
// //         };
        
// //         if (questionData.type === 'mcq') {
// //           questionData = {
// //             ...questionData,
// //             question: row.question_text,
// //             option1: row.option_A,
// //             option2: row.option_B,
// //             option3: row.option_C,
// //             option4: row.option_D,
// //             correctAnswer: row.correct_option,
// //             marks: row.marks || 1,
// //             negativeMarks: row.negative_marks || 0,
// //             explanation: row.explanation,
// //             tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
// //             difficulty: row.difficulty || 'easy'
// //           };
// //         } else {
// //           questionData = {
// //             ...questionData,
// //             title: row.problem_title,
// //             description: row.description,
// //             allowedLanguages: row.allowed_languages ? row.allowed_languages.split(',').map(lang => lang.trim()) : [],
// //             sampleInput: row.sample_input,
// //             sampleOutput: row.sample_output,
// //             hiddenTestcases: row.hidden_testcases,
// //             points: row.points || 10,
// //             timeLimitSec: row.time_limit_sec || 2,
// //             memoryLimitMb: row.memory_limit_mb || 256,
// //             tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
// //             difficulty: row.difficulty || 'easy'
// //           };
// //         }
        
// //         questions.push(questionData);
// //       }
      
// //       // Bulk create questions
// //       const createdQuestions = await Question.bulkCreate(questions);
      
// //       res.json({
// //         success: true,
// //         data: createdQuestions,
// //         message: `${createdQuestions.length} questions uploaded successfully`
// //       });
// //     } catch (error) {
// //       res.status(500).json({
// //         success: false,
// //         error: error.message
// //       });
// //     }
// //   },

// //   // Update question
// //   updateQuestion: async (req, res) => {
// //     try {
// //       const { id } = req.params;
// //       const questionData = req.body;
      
// //       const question = await Question.findByPk(id);
// //       if (!question) {
// //         return res.status(404).json({
// //           success: false,
// //           error: 'Question not found'
// //         });
// //       }
      
// //       await question.update(questionData);
      
// //       res.json({
// //         success: true,
// //         data: question,
// //         message: 'Question updated successfully'
// //       });
// //     } catch (error) {
// //       res.status(500).json({
// //         success: false,
// //         error: error.message
// //       });
// //     }
// //   },

// //   // Delete question
// //   deleteQuestion: async (req, res) => {
// //     try {
// //       const { id } = req.params;
      
// //       const question = await Question.findByPk(id);
// //       if (!question) {
// //         return res.status(404).json({
// //           success: false,
// //           error: 'Question not found'
// //         });
// //       }
      
// //       // Update section question count if sectionId exists
// //       if (question.sectionId) {
// //         await SlotTestSession.decrement('questionCount', {
// //           where: { id: question.sectionId }
// //         });
// //       }
      
// //       await question.destroy();
      
// //       res.json({
// //         success: true,
// //         message: 'Question deleted successfully'
// //       });
// //     } catch (error) {
// //       res.status(500).json({
// //         success: false,
// //         error: error.message
// //       });
// //     }
// //   }
// // };

// // module.exports = questionController;

// // controllers/questionController.js
// const { Question, Module, SlotTestSession } = require('../../models');
// const XLSX = require('xlsx');

// const questionController = {
//   // Get all questions for a module
//   getQuestionsByModule: async (req, res) => {
//     try {
//       const { moduleId } = req.params;
      
//       const questions = await Question.findAll({
//         where: { moduleId },
//         include: [{
//           model: SlotTestSession,
//           attributes: ['id', 'name', 'type']
//         }],
//         order: [['createdAt', 'ASC']]
//       });
      
//       res.json({ success: true, data: questions });
//     } catch (error) {
//       res.status(500).json({ success: false, error: error.message });
//     }
//   },

//   // Create question
//   createQuestion: async (req, res) => {
//     try {
//       const { moduleId } = req.params;
//       const questionData = req.body;
      
//       const module = await Module.findByPk(moduleId);
//       if (!module) return res.status(404).json({ success: false, error: 'Module not found' });
      
//       const question = await Question.create({ ...questionData, moduleId });
      
//       if (questionData.sectionId) {
//         await SlotTestSession.increment('questionCount', { where: { id: questionData.sectionId } });
//       }
      
//       res.status(201).json({
//         success: true,
//         data: question,
//         message: 'Question created successfully'
//       });
//     } catch (error) {
//       res.status(500).json({ success: false, error: error.message });
//     }
//   },

//   // Upload questions from Excel
//   uploadQuestions: async (req, res) => {
//     try {
//       const { moduleId } = req.params;
//       if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
      
//       const module = await Module.findByPk(moduleId);
//       if (!module) return res.status(404).json({ success: false, error: 'Module not found' });

//       const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
//       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
//       const questions = jsonData.map(row => {
//         if ((row.type || 'mcq') === 'mcq') {
//           return {
//             moduleId,
//             type: 'mcq',
//             question: row.question_text,
//             option1: row.option_A,
//             option2: row.option_B,
//             option3: row.option_C,
//             option4: row.option_D,
//             correctAnswer: row.correct_option,
//             marks: row.marks || 1,
//             negativeMarks: row.negative_marks || 0,
//             explanation: row.explanation,
//             tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
//             difficulty: row.difficulty || 'easy'
//           };
//         } else {
//           return {
//             moduleId,
//             type: row.type,
//             title: row.problem_title,
//             description: row.description,
//             allowedLanguages: row.allowed_languages ? row.allowed_languages.split(',').map(l => l.trim()) : [],
//             sampleInput: row.sample_input,
//             sampleOutput: row.sample_output,
//             hiddenTestcases: row.hidden_testcases,
//             points: row.points || 10,
//             timeLimitSec: row.time_limit_sec || 2,
//             memoryLimitMb: row.memory_limit_mb || 256,
//             tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
//             difficulty: row.difficulty || 'easy'
//           };
//         }
//       });

//       const createdQuestions = await Question.bulkCreate(questions);
//       res.json({
//         success: true,
//         data: createdQuestions,
//         message: `${createdQuestions.length} questions uploaded successfully`
//       });
//     } catch (error) {
//       res.status(500).json({ success: false, error: error.message });
//     }
//   },

//   // Update question
//   updateQuestion: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const questionData = req.body;

//       const question = await Question.findByPk(id);
//       if (!question) return res.status(404).json({ success: false, error: 'Question not found' });

//       await question.update(questionData);
//       res.json({ success: true, data: question, message: 'Question updated successfully' });
//     } catch (error) {
//       res.status(500).json({ success: false, error: error.message });
//     }
//   },

//   // Delete question
//   deleteQuestion: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const question = await Question.findByPk(id);
//       if (!question) return res.status(404).json({ success: false, error: 'Question not found' });

//       if (question.sectionId) {
//         await SlotTestSession.decrement('questionCount', { where: { id: question.sectionId } });
//       }

//       await question.destroy();
//       res.json({ success: true, message: 'Question deleted successfully' });
//     } catch (error) {
//       res.status(500).json({ success: false, error: error.message });
//     }
//   }
// };

// module.exports = questionController;


// controllers/questionController.js
const { questionsslot: Question, Module, SlotTestSession } = require('../../models');
const XLSX = require('xlsx');

const questionController = {
  // Get all questions for a module
  getQuestionsByModule: async (req, res) => {
    try {
      const { moduleId } = req.params;

      const questions = await Question.findAll({
        where: { moduleId },
        include: [
          {
            model: Module,
            as: 'module', // ✅ alias required
            attributes: ['id', 'title']
          },
          {
            model: SlotTestSession,
            as: 'session', // ✅ alias required
            attributes: ['id', 'name', 'type']
          }
        ],
        order: [['createdAt', 'ASC']]
      });

      res.json({ success: true, data: questions });
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Create question
  createQuestion: async (req, res) => {
    try {
      const { moduleId } = req.params;
      const questionData = req.body;

      const module = await Module.findByPk(moduleId);
      if (!module) {
        return res.status(404).json({ success: false, error: 'Module not found' });
      }

      const question = await Question.create({ ...questionData, moduleId });

      if (questionData.sectionId) {
        await SlotTestSession.increment('questionCount', { where: { id: questionData.sectionId } });
      }

      res.status(201).json({
        success: true,
        data: question,
        message: 'Question created successfully'
      });
    } catch (error) {
      console.error('Error creating question:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Upload questions from Excel
  uploadQuestions: async (req, res) => {
    try {
      const { moduleId } = req.params;
      if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });

      const module = await Module.findByPk(moduleId);
      if (!module) return res.status(404).json({ success: false, error: 'Module not found' });

      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const questions = jsonData.map(row => {
        console.log("Processing row:", row);
        if ((row.type || 'mcq') === 'mcq') {
          return {
            moduleId,
            type: 'mcq',
            question: row.question_text,
            option1: row.option_A,
            option2: row.option_B,
            option3: row.option_C,
            option4: row.option_D,
            correctAnswer: row.correct_option,
            marks: row.marks || 1,
            negativeMarks: row.negative_marks || 0,
            explanation: row.explanation,
            tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
            difficulty: row.difficulty || 'easy'
          };
        } else {
          return {
            moduleId,
            type: row.type,
            title: row.problem_title,
            description: row.description,
            allowedLanguages: row.allowed_languages ? row.allowed_languages.split(',').map(l => l.trim()) : [],
            sampleInput: row.sample_input,
            sampleOutput: row.sample_output,
            hiddenTestcases: row.hidden_testcases,
            points: row.points || 10,
            timeLimitSec: row.time_limit_sec || 2,
            memoryLimitMb: row.memory_limit_mb || 256,
            tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
            difficulty: row.difficulty || 'easy'
          };
        }
      });

      const createdQuestions = await Question.bulkCreate(questions);
      res.json({
        success: true,
        data: createdQuestions,
        message: `${createdQuestions.length} questions uploaded successfully`
      });
    } catch (error) {
      console.error('Error uploading questions:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Update question
  updateQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      const questionData = req.body;

      const question = await Question.findByPk(id);
      if (!question) return res.status(404).json({ success: false, error: 'Question not found' });

      await question.update(questionData);
      res.json({ success: true, data: question, message: 'Question updated successfully' });
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Delete question
  deleteQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      const question = await Question.findByPk(id);
      if (!question) return res.status(404).json({ success: false, error: 'Question not found' });

      if (question.sectionId) {
        await SlotTestSession.decrement('questionCount', { where: { id: question.sectionId } });
      }

      await question.destroy();
      res.json({ success: true, message: 'Question deleted successfully' });
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = questionController;
