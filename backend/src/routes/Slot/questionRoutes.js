// routes/questionRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const questionController = require('../../controllers/Slot/questionController');

const upload = multer({ storage: multer.memoryStorage() });

// GET /api/questions/module/:moduleId - Get all questions for a module
router.get('/module/:moduleId', questionController.getQuestionsByModule);

// POST /api/questions/module/:moduleId - Create new question
router.post('/module/:moduleId', questionController.createQuestion);

// POST /api/questions/module/:moduleId/upload - Upload questions from Excel
router.post('/module/:moduleId/upload', upload.single('file'), questionController.uploadQuestions);

// PUT /api/questions/:id - Update question
router.put('/:id', questionController.updateQuestion);

// DELETE /api/questions/:id - Delete question
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;