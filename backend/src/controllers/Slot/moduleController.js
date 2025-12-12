// // controllers/moduleController.js
// const { Module, Course, SlotTest, questionsslot } = require('../../models');

// const moduleController = {
//   // Get all modules for a course
//   getModulesByCourse: async (req, res) => {
//     try {
//       const { courseId } = req.params;
      
//       const modules = await Module.findAll({
//         where: { courseId },
//         include: [{
//           model: Course,
//           attributes: ['id', 'name']
//         }, {
//           model: SlotTest,
//           attributes: ['id', 'name', 'status']
//         }],
//         order: [['createdAt', 'ASC']]
//       });
      
//       res.json({
//         success: true,
//         data: modules
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message
//       });
//     }
//   },

//   // Get module by ID
//   getModuleById: async (req, res) => {
//     try {
//       const { id } = req.params;
      
//       const module = await Module.findByPk(id, {
//         include: [{
//           model: Course,
//           attributes: ['id', 'name']
//         }, {
//           model: SlotTest,
//           include: ['SlotTestSection']
//         }, {
//           model: questionsslot
//         }]
//       });
      
//       if (!module) {
//         return res.status(404).json({
//           success: false,
//           error: 'Module not found'
//         });
//       }
      
//       res.json({
//         success: true,
//         data: module
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message
//       });
//     }
//   },

//   // Create new module
//   createModule: async (req, res) => {
//     try {
//       const { courseId } = req.params;
//       const moduleData = req.body;
      
//       // Verify course exists
//       const course = await Course.findByPk(courseId);
//       if (!course) {
//         return res.status(404).json({
//           success: false,
//           error: 'Course not found'
//         });
//       }
      
//       const module = await Module.create({
//         ...moduleData,
//         courseId
//       });
      
//       // Update course module count
//       await course.increment('moduleCount');
      
//       res.status(201).json({
//         success: true,
//         data: module,
//         message: 'Module created successfully'
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message
//       });
//     }
//   },

//   // Update module
//   updateModule: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const moduleData = req.body;
      
//       const module = await Module.findByPk(id);
//       if (!module) {
//         return res.status(404).json({
//           success: false,
//           error: 'Module not found'
//         });
//       }
      
//       await module.update(moduleData);
      
//       res.json({
//         success: true,
//         data: module,
//         message: 'Module updated successfully'
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message
//       });
//     }
//   },

//   // Delete module
//   deleteModule: async (req, res) => {
//     try {
//       const { id } = req.params;
      
//       const module = await Module.findByPk(id);
//       if (!module) {
//         return res.status(404).json({
//           success: false,
//           error: 'Module not found'
//         });
//       }
      
//       // Update course module count
//       await Course.decrement('moduleCount', {
//         where: { id: module.courseId }
//       });
      
//       await module.destroy();
      
//       res.json({
//         success: true,
//         message: 'Module deleted successfully'
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message
//       });
//     }
//   },

//   // Toggle module publish status
//   togglePublish: async (req, res) => {
//     try {
//       const { id } = req.params;
      
//       const module = await Module.findByPk(id);
//       if (!module) {
//         return res.status(404).json({
//           success: false,
//           error: 'Module not found'
//         });
//       }
      
//       await module.update({
//         published: !module.published,
//         status: !module.published ? 'published' : 'draft'
//       });
      
//       res.json({
//         success: true,
//         data: module,
//         message: `Module ${module.published ? 'published' : 'unpublished'} successfully`
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message
//       });
//     }
//   }
// };

// module.exports = moduleController;

// controllers/moduleController.js
const { Module, Course, SlotTest, SlotQuestion,SlotTestSession } = require('../../models');
const Topic = require('../../models/Slot/Topic');
const path = require('path');
const fs = require('fs');
const { sequelize } = require('../../models');

const moduleController = {
  // Get all modules for a course
  getModulesByCourse: async (req, res) => {
    try {
      const { courseId } = req.params;
      
      const modules = await Module.findAll({
        where: { courseId },
        include: [{
          model: Course,
          as: 'course',
          attributes: ['id', 'name']
        }, {
          model: SlotTest,
          as: 'slotTest',
          attributes: ['id', 'name', 'status']
        }, {
          model: Topic,
          as: 'topics',
          attributes: ['id', 'title', 'resourceLink', 'documentPath', 'order'],
          order: [['order', 'ASC']]
        }],
        order: [['createdAt', 'ASC']]
      });
      
      res.json({
        success: true,
        data: modules
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get module by ID
  // getModuleById: async (req, res) => {
  //   try {
  //     const { id } = req.params;
      
  //     const module = await Module.findByPk(id, {
  //       include: [{
  //         model: Course,
  //         as: 'course', // <-- FIX: Added 'as' keyword
  //         attributes: ['id', 'name']
  //       }, {
  //         model: SlotTest,
  //         as: 'slotTest',
  //         include: ['SlotTestSection']
  //         // Note: If SlotTest also has an alias, you'll need 'as' here.
  //         // The string include ['SlotTestSection'] implies SlotTest *has* an association aliased 'SlotTestSection'.
  //       }, {
  //         model: questionsslot,
  //         as: 'questions' // <-- FIX: Added 'as' keyword
  //         // Note: If questionsslot also has an alias, you'll need to add it here.
  //       }]
  //     });
      
  //     if (!module) {
  //       return res.status(404).json({
  //         success: false,
  //         error: 'Module not found'
  //       });
  //     }
      
  //     res.json({
  //       success: true,
  //       data: module
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       error: error.message
  //     });
  //   }
  // },


  getModuleById: async (req, res) => {
  try {
    const { id } = req.params;

    const module = await Module.findByPk(id, {
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'name']
        },
        {
          model: SlotTest,
          as: 'slotTest',
          include: [
            {
              model: SlotTestSession,
              as: 'sessions'
            }
          ]
        },
        {
          model: SlotQuestion,
          as: 'questions'
        }
      ]
    });

    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    res.json({
      success: true,
      data: module
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
},



  // Create new module with topics
  createModule: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { courseId } = req.params;
      const { topics, ...moduleData } = req.body;
      
      // Verify course exists
      const course = await Course.findByPk(courseId);
      if (!course) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'Course not found'
        });
      }
      
      // Create module
      const module = await Module.create({
        ...moduleData,
        courseId
      }, { transaction });
      
      // Create topics if provided
      if (topics && Array.isArray(topics)) {
        const topicsToCreate = topics.map((topic, index) => ({
          moduleId: module.id,
          title: topic.title,
          resourceLink: topic.resourceLink || null,
          documentPath: topic.documentPath || null,
          order: index
        }));
        
        await Topic.bulkCreate(topicsToCreate, { transaction });
      }
      
      // Update course module count
      await course.increment('moduleCount', { transaction });
      
      await transaction.commit();
      
      // Fetch the complete module with topics
      const completeModule = await Module.findByPk(module.id, {
        include: [{
          model: Topic,
          as: 'topics',
          attributes: ['id', 'title', 'resourceLink', 'documentPath', 'order'],
          order: [['order', 'ASC']]
        }]
      });
      
      res.status(201).json({
        success: true,
        data: completeModule,
        message: 'Module created successfully'
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Update module with topics
  updateModule: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { id } = req.params;
      const { topics, ...moduleData } = req.body;
      
      const module = await Module.findByPk(id);
      if (!module) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'Module not found'
        });
      }
      
      // Update module
      await module.update(moduleData, { transaction });
      
      // Update topics if provided
      if (topics && Array.isArray(topics)) {
        // Delete existing topics
        const existingTopics = await Topic.findAll({ where: { moduleId: id } });
        
        // Clean up old files
        for (const topic of existingTopics) {
          if (topic.documentPath) {
            const filePath = path.join(__dirname, '../../../', topic.documentPath);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
        }
        
        await Topic.destroy({ where: { moduleId: id }, transaction });
        
        // Create new topics
        const topicsToCreate = topics.map((topic, index) => ({
          moduleId: id,
          title: topic.title,
          resourceLink: topic.resourceLink || null,
          documentPath: topic.documentPath || null,
          order: index
        }));
        
        await Topic.bulkCreate(topicsToCreate, { transaction });
      }
      
      await transaction.commit();
      
      // Fetch the complete module with topics
      const completeModule = await Module.findByPk(id, {
        include: [{
          model: Topic,
          as: 'topics',
          attributes: ['id', 'title', 'resourceLink', 'documentPath', 'order'],
          order: [['order', 'ASC']]
        }]
      });
      
      res.json({
        success: true,
        data: completeModule,
        message: 'Module updated successfully'
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Delete module with topics cleanup
  deleteModule: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { id } = req.params;
      
      const module = await Module.findByPk(id, {
        include: [{
          model: Topic,
          as: 'topics'
        }]
      });
      
      if (!module) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'Module not found'
        });
      }
      
      // Clean up topic files
      if (module.topics) {
        for (const topic of module.topics) {
          if (topic.documentPath) {
            const filePath = path.join(__dirname, '../../../', topic.documentPath);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
        }
      }
      
      // Clean up module directory
      const moduleDir = path.join(__dirname, '../../../uploads/modules', id.toString());
      if (fs.existsSync(moduleDir)) {
        fs.rmSync(moduleDir, { recursive: true, force: true });
      }
      
      // Delete topics first (foreign key constraint)
      await Topic.destroy({ where: { moduleId: id }, transaction });
      
      // Update course module count
      await Course.decrement('moduleCount', {
        where: { id: module.courseId },
        transaction
      });
      
      // Delete module
      await module.destroy({ transaction });
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: 'Module deleted successfully'
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Create module with file uploads
  createModuleWithFiles: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { courseId } = req.params;
      const moduleData = JSON.parse(req.body.moduleData || '{}');
      const topicsData = JSON.parse(req.body.topicsData || '[]');
      
      // Verify course exists
      const course = await Course.findByPk(courseId);
      if (!course) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'Course not found'
        });
      }
      
      // Create module
      const module = await Module.create({
        ...moduleData,
        courseId
      }, { transaction });
      
      // Process topics with file uploads
      const createdTopics = [];
      for (let i = 0; i < topicsData.length; i++) {
        const topicData = topicsData[i];
        const uploadedFile = req.files && req.files.find(f => f.fieldname === `topicFile_${i}`);
        
        const topic = await Topic.create({
          moduleId: module.id,
          title: topicData.title,
          resourceLink: topicData.resourceLink || null,
          documentPath: uploadedFile ? `/uploads/modules/${module.id}/topics/${uploadedFile.filename}` : null,
          order: i
        }, { transaction });
        
        createdTopics.push(topic);
      }
      
      // Update course module count
      await course.increment('moduleCount', { transaction });
      
      await transaction.commit();
      
      res.status(201).json({
        success: true,
        data: {
          ...module.toJSON(),
          topics: createdTopics
        },
        message: 'Module created successfully'
      });
    } catch (error) {
      await transaction.rollback();
      
      // Clean up uploaded files on error
      if (req.files) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Toggle module publish status
  togglePublish: async (req, res) => {
    try {
      const { id } = req.params;
      
      const module = await Module.findByPk(id);
      if (!module) {
        return res.status(404).json({
          success: false,
          error: 'Module not found'
        });
      }
      
      await module.update({
        published: !module.published,
        status: !module.published ? 'published' : 'draft'
      });
      
      res.json({
        success: true,
        data: module,
        message: `Module ${module.published ? 'published' : 'unpublished'} successfully`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = moduleController;