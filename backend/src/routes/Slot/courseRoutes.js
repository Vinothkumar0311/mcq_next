// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/Slot/courseController');
const upload = require('../../middlewares/imageUpload');

// GET /api/courses - Get all courses
router.get('/', courseController.getAllCourses);

// GET /api/courses/:id - Get course by ID
router.get('/:id', courseController.getCourseById);

// POST /api/courses - Create new course
router.post('/', upload.single('image'), courseController.createCourse);

// PUT /api/courses/:id - Update course
router.put('/:id', upload.single('image'), courseController.updateCourse);

// DELETE /api/courses/:id - Delete course
router.delete('/:id', courseController.deleteCourse);

// PATCH /api/courses/:id/toggle-publish - Toggle publish status
router.put('/:id/toggle-publish', courseController.togglePublish);

module.exports = router;