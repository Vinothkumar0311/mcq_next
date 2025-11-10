const express = require('express');
const router = express.Router();

// Course storage (in production, use a proper database)
let courses = [];
let modules = [];
let tests = [];

// Get all courses
router.get('/', (req, res) => {
  try {
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Create a new course
router.post('/', (req, res) => {
  try {
    const { name, description, tags, image } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Course name is required' });
    }

    const newCourse = {
      id: Date.now(),
      name: name.trim(),
      description: description?.trim() || '',
      tags: Array.isArray(tags) ? tags : [],
      image: image?.trim() || '',
      published: false,
      moduleCount: 0,
      studentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 1
    };

    courses.push(newCourse);
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Get a specific course
router.get('/:id', (req, res) => {
  try {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Update a course
router.put('/:id', (req, res) => {
  try {
    const courseIndex = courses.findIndex(c => c.id === parseInt(req.params.id));
    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const { name, description, tags, image, published } = req.body;
    
    courses[courseIndex] = {
      ...courses[courseIndex],
      name: name?.trim() || courses[courseIndex].name,
      description: description?.trim() || courses[courseIndex].description,
      tags: Array.isArray(tags) ? tags : courses[courseIndex].tags,
      image: image?.trim() || courses[courseIndex].image,
      published: published !== undefined ? published : courses[courseIndex].published,
      updatedAt: new Date().toISOString()
    };

    res.json(courses[courseIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete a course
router.delete('/:id', (req, res) => {
  try {
    const courseIndex = courses.findIndex(c => c.id === parseInt(req.params.id));
    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Remove associated modules and tests
    const courseModules = modules.filter(m => m.courseId === parseInt(req.params.id));
    courseModules.forEach(module => {
      tests = tests.filter(t => t.moduleId !== module.id);
    });
    modules = modules.filter(m => m.courseId !== parseInt(req.params.id));
    
    courses.splice(courseIndex, 1);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Get modules for a course
router.get('/:id/modules', (req, res) => {
  try {
    const courseModules = modules.filter(m => m.courseId === parseInt(req.params.id));
    res.json(courseModules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

// Create a module for a course
router.post('/:id/modules', (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
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
    
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Module title is required' });
    }

    const newModule = {
      id: Date.now(),
      courseId,
      title: title.trim(),
      description: description?.trim() || '',
      duration: duration || 60,
      published: status === 'published',
      mcqPassCriteria: mcqPassCriteria || 90,
      codingPassCriteria: codingPassCriteria || 100,
      questionsToDisplay: questionsToDisplay || 10,
      randomizeQuestions: randomizeQuestions !== false,
      status: status || 'draft',
      resources: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 1
    };

    modules.push(newModule);
    
    // Update course module count
    course.moduleCount = modules.filter(m => m.courseId === courseId).length;
    course.updatedAt = new Date().toISOString();

    res.status(201).json(newModule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create module' });
  }
});

module.exports = router;