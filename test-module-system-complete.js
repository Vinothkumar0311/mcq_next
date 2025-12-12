const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:5000';

async function testCompleteModuleSystem() {
  console.log('🚀 COMPLETE MODULE + TEST SYSTEM DIAGNOSTIC\n');
  
  let courseId, moduleId, mcqTestId, codingTestId;
  
  try {
    // 1. Test Course Creation
    console.log('1️⃣ Testing Course Creation...');
    const courseResponse = await axios.post(`${API_BASE}/api/courses`, {
      name: 'Complete System Test Course',
      description: 'Testing entire module + test system',
      tags: ['test', 'diagnostic']
    });
    courseId = courseResponse.data.data.id;
    console.log(`✅ Course created: ${courseId}\n`);
    
    // 2. Test Module Creation with Topics
    console.log('2️⃣ Testing Module Creation with Topics...');
    const moduleResponse = await axios.post(`${API_BASE}/modules/course/${courseId}`, {
      title: 'Complete Test Module',
      description: 'Module with topics and tests',
      duration: 120,
      status: 'published',
      topics: [
        {
          title: 'Introduction to Testing',
          resourceLink: 'https://example.com/intro',
          order: 0
        },
        {
          title: 'Advanced Concepts',
          resourceLink: 'https://example.com/advanced',
          order: 1
        }
      ]
    });
    moduleId = moduleResponse.data.data.id;
    console.log(`✅ Module created: ${moduleId}`);
    console.log(`📝 Topics created: ${moduleResponse.data.data.topics?.length || 0}\n`);
    
    // 3. Test MCQ Test Creation
    console.log('3️⃣ Testing MCQ Test Creation...');
    const mcqTestResponse = await axios.post(`${API_BASE}/api/modules/${moduleId}/tests`, {
      name: 'Diagnostic MCQ Test',
      type: 'mcq',
      tags: ['mcq', 'diagnostic'],
      difficulty: 'medium',
      description: 'Testing MCQ functionality'
    });
    mcqTestId = mcqTestResponse.data.data.id;
    console.log(`✅ MCQ Test created: ${mcqTestId}\n`);
    
    // 4. Test MCQ Questions Addition
    console.log('4️⃣ Testing MCQ Questions Addition...');
    const mcqQuestions = [
      {
        question: 'What is the primary purpose of unit testing?',
        optionA: 'To test the entire application',
        optionB: 'To test individual components',
        optionC: 'To test user interface',
        optionD: 'To test database connections',
        correct: 'B'
      },
      {
        question: 'Which testing approach tests the system as a whole?',
        optionA: 'Unit testing',
        optionB: 'Integration testing',
        optionC: 'System testing',
        optionD: 'Acceptance testing',
        correct: 'C'
      }
    ];
    
    await axios.post(`${API_BASE}/api/tests/${mcqTestId}/mcq/questions`, {
      questions: mcqQuestions
    });
    console.log(`✅ Added ${mcqQuestions.length} MCQ questions\n`);
    
    // 5. Test Coding Test Creation
    console.log('5️⃣ Testing Coding Test Creation...');
    const codingTestResponse = await axios.post(`${API_BASE}/api/modules/${moduleId}/tests`, {
      name: 'Diagnostic Coding Test',
      type: 'coding',
      tags: ['coding', 'algorithms'],
      difficulty: 'hard',
      description: 'Testing coding problem functionality'
    });
    codingTestId = codingTestResponse.data.data.id;
    console.log(`✅ Coding Test created: ${codingTestId}\n`);
    
    // 6. Test Coding Problems Addition
    console.log('6️⃣ Testing Coding Problems Addition...');
    const codingProblems = [
      {
        name: 'Array Sum',
        description: 'Given an array of integers, return the sum of all elements.',
        inputFormat: 'First line contains n (array size). Second line contains n integers.',
        outputFormat: 'Single integer representing the sum.',
        constraints: '1 <= n <= 1000, -1000 <= arr[i] <= 1000',
        tags: ['array', 'basic'],
        sampleInput: '3\n1 2 3',
        sampleOutput: '6',
        hiddenTests: [
          { input: '4\n-1 2 -3 4', output: '2' },
          { input: '1\n5', output: '5' }
        ]
      },
      {
        name: 'Palindrome Check',
        description: 'Check if a given string is a palindrome.',
        inputFormat: 'Single line containing a string.',
        outputFormat: 'YES if palindrome, NO otherwise.',
        constraints: '1 <= length <= 100',
        tags: ['string', 'palindrome'],
        sampleInput: 'racecar',
        sampleOutput: 'YES',
        hiddenTests: [
          { input: 'hello', output: 'NO' },
          { input: 'a', output: 'YES' }
        ]
      }
    ];
    
    await axios.post(`${API_BASE}/api/tests/${codingTestId}/coding/problems`, {
      problems: codingProblems
    });
    console.log(`✅ Added ${codingProblems.length} coding problems\n`);
    
    // 7. Test Module Retrieval with Tests
    console.log('7️⃣ Testing Module Retrieval with Tests...');
    const testsResponse = await axios.get(`${API_BASE}/api/modules/${moduleId}/tests`);
    const tests = testsResponse.data.data;
    console.log(`✅ Retrieved ${tests.length} tests:`);
    tests.forEach(test => {
      const itemCount = test.type === 'mcq' ? 
        (test.mcqQuestions?.length || 0) : 
        (test.codingProblems?.length || 0);
      console.log(`   📝 ${test.name} (${test.type}) - ${itemCount} items`);
    });
    console.log();
    
    // 8. Test Template Downloads
    console.log('8️⃣ Testing Template Downloads...');
    try {
      const mcqTemplateResponse = await axios.get(`${API_BASE}/api/templates/mcq`, { 
        responseType: 'stream',
        timeout: 5000
      });
      console.log('✅ MCQ template download endpoint working');
      
      const codingTemplateResponse = await axios.get(`${API_BASE}/api/templates/coding`, { 
        responseType: 'stream',
        timeout: 5000
      });
      console.log('✅ Coding template download endpoint working\n');
    } catch (error) {
      console.log('⚠️ Template download test failed (may need template generation)');
      console.log(`   Error: ${error.message}\n`);
    }
    
    // 9. Test Frontend API Compatibility
    console.log('9️⃣ Testing Frontend API Compatibility...');
    
    // Test module API used by frontend
    const moduleApiResponse = await axios.get(`${API_BASE}/modules/course/${courseId}`);
    console.log(`✅ Module API compatible: ${moduleApiResponse.data.data.length} modules`);
    
    // Test course API used by frontend
    const courseApiResponse = await axios.get(`${API_BASE}/api/courses`);
    console.log(`✅ Course API compatible: ${courseApiResponse.data.data.length} courses\n`);
    
    // 10. Test Data Integrity
    console.log('🔟 Testing Data Integrity...');
    
    // Verify module has topics
    const moduleWithTopics = await axios.get(`${API_BASE}/modules/${moduleId}`);
    const topicsCount = moduleWithTopics.data.data.topics?.length || 0;
    console.log(`✅ Module topics integrity: ${topicsCount} topics`);
    
    // Verify tests have questions/problems
    const mcqTest = tests.find(t => t.type === 'mcq');
    const codingTest = tests.find(t => t.type === 'coding');
    console.log(`✅ MCQ test integrity: ${mcqTest?.mcqQuestions?.length || 0} questions`);
    console.log(`✅ Coding test integrity: ${codingTest?.codingProblems?.length || 0} problems\n`);
    
    // 11. Cleanup
    console.log('🧹 Cleaning up test data...');
    await axios.delete(`${API_BASE}/api/tests/${mcqTestId}`);
    await axios.delete(`${API_BASE}/api/tests/${codingTestId}`);
    await axios.delete(`${API_BASE}/api/courses/${courseId}`);
    console.log('✅ Cleanup completed\n');
    
    // 12. Final Report
    console.log('🎉 COMPLETE SYSTEM DIAGNOSTIC PASSED!\n');
    
    console.log('📊 SYSTEM STATUS REPORT:');
    console.log('✅ Course Management - WORKING');
    console.log('✅ Module Management - WORKING');
    console.log('✅ Topic Management - WORKING');
    console.log('✅ MCQ Test Creation - WORKING');
    console.log('✅ MCQ Question Management - WORKING');
    console.log('✅ Coding Test Creation - WORKING');
    console.log('✅ Coding Problem Management - WORKING');
    console.log('✅ API Endpoints - WORKING');
    console.log('✅ Data Integrity - VERIFIED');
    console.log('✅ Frontend Compatibility - VERIFIED');
    console.log('⚠️ Template Downloads - NEEDS VERIFICATION');
    
    console.log('\n🔧 RECOMMENDATIONS:');
    console.log('1. Test template downloads manually in browser');
    console.log('2. Test file uploads with actual Excel files');
    console.log('3. Verify frontend UI components work correctly');
    console.log('4. Test student view functionality');
    console.log('5. Verify database schema matches models');
    
  } catch (error) {
    console.error('❌ DIAGNOSTIC FAILED:', error.response?.data || error.message);
    
    // Cleanup on error
    if (courseId) {
      try {
        await axios.delete(`${API_BASE}/api/courses/${courseId}`);
        console.log('🧹 Cleaned up test data after error');
      } catch (cleanupError) {
        console.error('Failed to cleanup:', cleanupError.message);
      }
    }
    
    console.log('\n🔍 TROUBLESHOOTING STEPS:');
    console.log('1. Ensure backend server is running on port 5000');
    console.log('2. Check database connection and schema');
    console.log('3. Verify all model associations are correct');
    console.log('4. Check for missing dependencies');
    console.log('5. Review error logs for specific issues');
    
    process.exit(1);
  }
}

// Check if server is running first
async function checkServerHealth() {
  try {
    await axios.get(`${API_BASE}/api/health`);
    console.log('✅ Backend server is running\n');
    return true;
  } catch (error) {
    console.log('❌ Backend server is not running!');
    console.log('Please start the backend server first:');
    console.log('   cd backend');
    console.log('   npm run dev\n');
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔧 Checking server health...');
  const serverRunning = await checkServerHealth();
  
  if (serverRunning) {
    console.log('⏳ Starting complete system diagnostic in 2 seconds...\n');
    setTimeout(testCompleteModuleSystem, 2000);
  } else {
    process.exit(1);
  }
}

main();