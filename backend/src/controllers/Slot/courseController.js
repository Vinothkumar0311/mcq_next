// controllers/courseController.js
const { Course, Module, SlotTest } = require('../../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

const courseController = {
  // Get all courses
  getAllCourses: async (req, res) => {
    try {
      const courses = await Course.findAll({
        include: [{
          model: Module,
          as: 'modules',
          attributes: ['id', 'title', 'status']
        }],
        order: [['createdAt', 'DESC']]
      });
      
      res.json({
        success: true,
        data: courses
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get course by ID
  getCourseById: async (req, res) => {
    try {
      const { id } = req.params;
      const course = await Course.findByPk(id, {
        include: [{
          model: Module,
          as: 'module',
          include: [{
            model: SlotTest,
            attributes: ['id', 'name', 'status']
          }]
        }]
      });
      
      if (!course) {
        return res.status(404).json({
          success: false,
          error: 'Course not found'
        });
      }
      
      res.json({
        success: true,
        data: course
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Create new course
  createCourse: async (req, res) => {
    try {
      const { name, description, tags, published } = req.body;
      
      // Handle image upload
      let imagePath = null;
      if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;
      }
      
      const course = await Course.create({
        name,
        description,
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : []),
        image: imagePath,
        published: published || false
      });
      
      res.status(201).json({
        success: true,
        data: course,
        message: 'Course created successfully'
      });
    } catch (error) {
      // Clean up uploaded file if course creation fails
      if (req.file) {
        const filePath = path.join(__dirname, '../../../uploads', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Update course
  updateCourse: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, tags, published } = req.body;
      
      const course = await Course.findByPk(id);
      if (!course) {
        return res.status(404).json({
          success: false,
          error: 'Course not found'
        });
      }
      
      // Handle image upload
      let imagePath = course.image; // Keep existing image by default
      if (req.file) {
        // Delete old image if it exists
        if (course.image) {
          const oldImagePath = path.join(__dirname, '../../../', course.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        imagePath = `/uploads/${req.file.filename}`;
      }
      
      await course.update({
        name,
        description,
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : []),
        image: imagePath,
        published
      });
      
      res.json({
        success: true,
        data: course,
        message: 'Course updated successfully'
      });
    } catch (error) {
      // Clean up uploaded file if update fails
      if (req.file) {
        const filePath = path.join(__dirname, '../../../uploads', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Delete course
  deleteCourse: async (req, res) => {
    try {
      const { id } = req.params;
      
      const course = await Course.findByPk(id);
      if (!course) {
        return res.status(404).json({
          success: false,
          error: 'Course not found'
        });
      }
      
      // Delete associated image file
      if (course.image) {
        const imagePath = path.join(__dirname, '../../../', course.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      await course.destroy();
      
      res.json({
        success: true,
        message: 'Course deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Toggle course publish status
  togglePublish: async (req, res) => {
    console.log("Toggle publish called");
    try {
      const { id } = req.params;
      
      const course = await Course.findByPk(id);
      if (!course) {
        return res.status(404).json({
          success: false,
          error: 'Course not found'
        });
      }
      
      await course.update({
        published: !course.published
      });
      
      res.json({
        success: true,
        data: course,
        message: `Course ${course.published ? 'published' : 'unpublished'} successfully`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = courseController;