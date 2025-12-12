const { Module, SlotQuestion } = require('../../models');
const ModuleTest = require('../../models/Slot/ModuleTest');
const MCQQuestion = require('../../models/Slot/MCQQuestion');
const CodingProblem = require('../../models/Slot/CodingProblem');
const { sequelize } = require('../../models');
// const SlotQuestion = require('../../models/Slot/Question');
const XLSX = require('xlsx');

const testController = {
  // Get all tests for a module
  getTestsByModule: async (req, res) => {
    try {
      const { moduleId } = req.params;
      
      const tests = await ModuleTest.findAll({
        where: { moduleId },
        include: [
          {
            model: MCQQuestion,
            as: 'mcqQuestions',
            attributes: ['id', 'question', 'order']
          },
          {
            model: CodingProblem,
            as: 'codingProblems',
            attributes: ['id', 'name', 'order']
          }
        ],
        order: [['createdAt', 'ASC']]
      });
      
      res.json({
        success: true,
        data: tests
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Create new test
  // createTest: async (req, res) => {
  //   try {
  //     const { moduleId } = req.params;
  //     const { name, type, tags, difficulty, description, files_section } = req.body;

  //     console.log("Creating test with data:", { moduleId, name, type, tags, difficulty, description });
      
  //     const module = await Module.findByPk(moduleId);
  //     if (!module) {
  //       return res.status(404).json({
  //         success: false,
  //         error: 'Module not found'
  //       });
  //     }
      
  //     const test = await ModuleTest.create({
  //       moduleId,
  //       name,
  //       type,
  //       tags: Array.isArray(tags) ? tags : [],
  //       difficulty,
  //       description
  //     });
      
  //     res.status(201).json({
  //       success: true,
  //       data: test,
  //       message: 'Test created successfully'
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       error: error.message
  //     });
  //   }
  // },
  createTest: async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { name, type, tags, difficulty, description } = req.body;

    console.log("Creating test with data:", { moduleId, name, type, tags, difficulty, description });

    // Check module exists
    const module = await Module.findByPk(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    // Create the Test record
    const test = await ModuleTest.create({
      moduleId,
      name,
      type,
      tags: Array.isArray(tags) ? tags : [],
      difficulty,
      description
    });

    // -------------------------
    //  FILE UPLOAD HANDLING
    // -------------------------
    if (req.files && req.files.length > 0) {
      const file = req.files[0];
      const filePath = file.path;

      console.log("Excel file received:", filePath);

      // Read Excel file
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      console.log("Parsed Excel Rows:", data.length);

      let questionsToInsert = [];

      for (const row of data) {
        // Detect MCQ or Coding type automatically
        const isCoding = row["Sample Input"] || row["Hidden Testcases"];

        const questionData = {
          moduleId: moduleId,
          sectionId: row["Section ID"] || null,
          type: isCoding ? "coding" : "mcq",
          question: row["question_text"] || null,
          title: row["Title"] || "",
          description: row["Description"] || "",
          option1: row["option_A"] || null,
          option2: row["option_B"] || null,
          option3: row["option_C"] || null,
          option4: row["option_D"] || null,
          correctAnswer: row["correct_option"] || null,
          marks: row["marks"] || 1,
          negativeMarks: row["negative_marks"] || 0,
          explanation: row["explanation"] || "",
          allowedLanguages: row["Allowed Languages"] ? JSON.parse(row["Allowed Languages"]) : null,
          sampleInput: row["Sample Input"] || null,
          sampleOutput: row["Sample Output"] || null,
          hiddenTestcases: row["Hidden Testcases"] || null,
          points: row["Points"] || 1,
          timeLimitSec: row["Time Limit"] || 2,
          memoryLimitMb: row["Memory Limit"] || 256,
          difficulty: row["Difficulty"] || "easy",
          tags: row["Tags"] ? row["Tags"].split(",") : []
        };

        questionsToInsert.push(questionData);
      }

      // Bulk insert questions
      await SlotQuestion.bulkCreate(questionsToInsert);
      console.log("Questions inserted:", questionsToInsert.length);
    }

    // Final response
    res.status(201).json({
      success: true,
      data: test,
      message: 'Test created successfully with questions'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
},

  // Add MCQ questions
  addMCQQuestions: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { testId } = req.params;
      const { questions } = req.body;
      
      const test = await ModuleTest.findByPk(testId);
      if (!test || test.type !== 'mcq') {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'MCQ test not found'
        });
      }
      
      const mcqQuestions = questions.map((q, index) => ({
        testId,
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correct: q.correct.toUpperCase(),
        order: index
      }));
      
      const createdQuestions = await MCQQuestion.bulkCreate(mcqQuestions, { transaction });
      
      await transaction.commit();
      
      res.status(201).json({
        success: true,
        data: createdQuestions,
        message: `${createdQuestions.length} MCQ questions added`
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Add coding problems
  addCodingProblems: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { testId } = req.params;
      const { problems } = req.body;
      
      const test = await ModuleTest.findByPk(testId);
      if (!test || test.type !== 'coding') {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'Coding test not found'
        });
      }
      
      const codingProblems = problems.map((p, index) => ({
        testId,
        name: p.name,
        description: p.description,
        inputFormat: p.inputFormat,
        outputFormat: p.outputFormat,
        constraints: p.constraints,
        tags: Array.isArray(p.tags) ? p.tags : [],
        sampleInput: p.sampleInput,
        sampleOutput: p.sampleOutput,
        hiddenTests: Array.isArray(p.hiddenTests) ? p.hiddenTests : [],
        order: index
      }));
      
      const createdProblems = await CodingProblem.bulkCreate(codingProblems, { transaction });
      
      await transaction.commit();
      
      res.status(201).json({
        success: true,
        data: createdProblems,
        message: `${createdProblems.length} coding problems added`
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Bulk upload MCQ from Excel
  bulkUploadMCQ: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { testId } = req.params;
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Excel file is required'
        });
      }
      
      const test = await ModuleTest.findByPk(testId);
      if (!test || test.type !== 'mcq') {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'MCQ test not found'
        });
      }
      
      const workbook = xlsx.readFile(req.file.path);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(worksheet);
      
      const questions = data.map((row, index) => ({
        testId,
        question: row.question,
        optionA: row.optionA,
        optionB: row.optionB,
        optionC: row.optionC,
        optionD: row.optionD,
        correct: row.correct.toString().toUpperCase(),
        order: index
      }));
      
      const createdQuestions = await MCQQuestion.bulkCreate(questions, { transaction });
      
      await transaction.commit();
      
      res.json({
        success: true,
        data: createdQuestions,
        message: `${createdQuestions.length} MCQ questions uploaded`
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Bulk upload Coding from Excel
  bulkUploadCoding: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { testId } = req.params;
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Excel file is required'
        });
      }
      
      const test = await ModuleTest.findByPk(testId);
      if (!test || test.type !== 'coding') {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'Coding test not found'
        });
      }
      
      const workbook = xlsx.readFile(req.file.path);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(worksheet);
      
      const problems = data.map((row, index) => ({
        testId,
        name: row.name,
        description: row.description,
        inputFormat: row.input,
        outputFormat: row.output,
        constraints: row.constraints,
        tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
        sampleInput: row.sample_input,
        sampleOutput: row.sample_output,
        hiddenTests: row.hidden_tests ? JSON.parse(row.hidden_tests) : [],
        order: index
      }));
      
      const createdProblems = await CodingProblem.bulkCreate(problems, { transaction });
      
      await transaction.commit();
      
      res.json({
        success: true,
        data: createdProblems,
        message: `${createdProblems.length} coding problems uploaded`
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Delete test
  deleteTest: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { testId } = req.params;
      
      const test = await ModuleTest.findByPk(testId);
      if (!test) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'Test not found'
        });
      }
      
      // Delete associated questions/problems
      if (test.type === 'mcq') {
        await MCQQuestion.destroy({ where: { testId }, transaction });
      } else {
        await CodingProblem.destroy({ where: { testId }, transaction });
      }
      
      await test.destroy({ transaction });
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: 'Test deleted successfully'
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = testController;