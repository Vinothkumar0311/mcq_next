const axios = require('axios');

async function quickTest() {
  const API_BASE = 'http://localhost:5000';
  
  try {
    console.log('🔍 Quick Module System Test\n');
    
    // Test 1: Health Check
    console.log('1️⃣ Health check...');
    await axios.get(`${API_BASE}/api/health`);
    console.log('✅ Server is running\n');
    
    // Test 2: Create Course
    console.log('2️⃣ Creating course...');
    const course = await axios.post(`${API_BASE}/api/courses`, {
      name: 'Quick Test Course',
      description: 'Quick test',
      tags: ['test']
    });
    const courseId = course.data.data.id;
    console.log(`✅ Course created: ${courseId}\n`);
    
    // Test 3: Create Module
    console.log('3️⃣ Creating module...');
    const module = await axios.post(`${API_BASE}/modules/course/${courseId}`, {
      title: 'Quick Test Module',
      description: 'Quick test module',
      duration: 60,
      status: 'published'
    });
    const moduleId = module.data.data.id;
    console.log(`✅ Module created: ${moduleId}\n`);
    
    // Test 4: Create MCQ Test
    console.log('4️⃣ Creating MCQ test...');
    const mcqTest = await axios.post(`${API_BASE}/api/modules/${moduleId}/tests`, {
      name: 'Quick MCQ Test',
      type: 'mcq',
      tags: ['quick'],
      difficulty: 'easy'
    });
    const mcqTestId = mcqTest.data.data.id;
    console.log(`✅ MCQ Test created: ${mcqTestId}\n`);
    
    // Test 5: Add MCQ Question
    console.log('5️⃣ Adding MCQ question...');
    await axios.post(`${API_BASE}/api/tests/${mcqTestId}/mcq/questions`, {
      questions: [{
        question: 'What is 2+2?',
        optionA: '3',
        optionB: '4',
        optionC: '5',
        optionD: '6',
        correct: 'B'
      }]
    });
    console.log('✅ MCQ question added\n');
    
    // Test 6: Get Tests
    console.log('6️⃣ Retrieving tests...');
    const tests = await axios.get(`${API_BASE}/api/modules/${moduleId}/tests`);
    console.log(`✅ Found ${tests.data.data.length} test(s)\n`);
    
    // Cleanup
    console.log('🧹 Cleaning up...');
    await axios.delete(`${API_BASE}/api/tests/${mcqTestId}`);
    await axios.delete(`${API_BASE}/api/courses/${courseId}`);
    console.log('✅ Cleanup completed\n');
    
    console.log('🎉 QUICK TEST PASSED - SYSTEM IS WORKING!\n');
    
  } catch (error) {
    console.error('❌ QUICK TEST FAILED:', error.response?.data || error.message);
    console.log('\n🔧 POSSIBLE ISSUES:');
    console.log('1. Backend server not running');
    console.log('2. Database connection issues');
    console.log('3. Missing database tables');
    console.log('4. Model association errors');
  }
}

quickTest();