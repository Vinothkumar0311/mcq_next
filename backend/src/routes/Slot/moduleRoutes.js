// routes/moduleRoutes.js
const express = require('express');
const router = express.Router();
const moduleController = require('../../controllers/Slot/moduleController');
const topicUpload = require('../../middlewares/topicUpload');

// GET /api/modules/course/:courseId - Get all modules for a course
router.get('/course/:courseId', moduleController.getModulesByCourse);

// GET /api/modules/:id - Get module by ID
router.get('/:id', moduleController.getModuleById);

// POST /api/modules/course/:courseId - Create new module
router.post('/course/:courseId', moduleController.createModule);

// POST /api/modules/course/:courseId/with-files - Create module with file uploads
router.post('/course/:courseId/with-files', topicUpload.array('topicFiles', 10), moduleController.createModuleWithFiles);

// PUT /api/modules/:id - Update module
router.put('/:id', moduleController.updateModule);

// DELETE /api/modules/:id - Delete module
router.delete('/:id', moduleController.deleteModule);

// PATCH /api/modules/:id/toggle-publish - Toggle publish status
router.patch('/:id/toggle-publish', moduleController.togglePublish);

module.exports = router;