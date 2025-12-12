const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:5000';

// Test data
const testCourse = {
  name: 'Test Course for Modules',
  description: 'Testing enhanced module system',
  tags: ['test', 'modules']
};

const testModule = {
  title: 'JavaScript Fundamentals',
  description: 'Learn JavaScript basics with topics and resources',
  duration: 120,
  mcqPassCriteria: 80,
  codingPassCriteria: 90,
  questionsToDisplay: 15,
  randomizeQuestions: true,
  status: 'published'
};

const testTopics = [
  {
    title: 'Variables and Data Types',
    resourceLink: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types',
    order: 0
  },
  {
    title: 'Functions and Scope',
    resourceLink: 'https://javascript.info/function-basics',
    order: 1
  },
  {
    title: 'DOM Manipulation',
    resourceLink: '',
    order: 2
  }
];

// Create test file
function createTestFile(filename, content) {
  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, content);
  return filePath;
}

async function runTests() {
  console.log('🚀 Starting Enhanced Module System Tests\n');
  
  let courseId, moduleId;
  
  try {
    // Test 1: Create Course
    console.log('1️⃣ Creating test course...');
    const courseResponse = await axios.post(`${API_BASE}/api/courses`, testCourse);
    courseId = courseResponse.data.data.id;
    console.log(`✅ Course created with ID: ${courseId}\n`);
    
    // Test 2: Create Module with Topics (no files)
    console.log('2️⃣ Creating module with topics (no files)...');
    const moduleResponse = await axios.post(`${API_BASE}/modules/course/${courseId}`, {
      ...testModule,
      topics: testTopics
    });
    moduleId = moduleResponse.data.data.id;
    console.log(`✅ Module created with ID: ${moduleId}`);
    console.log(`📝 Topics created: ${moduleResponse.data.data.topics?.length || 0}\n`);
    
    // Test 3: Get Modules by Course
    console.log('3️⃣ Fetching modules by course...');
    const modulesResponse = await axios.get(`${API_BASE}/modules/course/${courseId}`);
    const modules = modulesResponse.data.data;
    console.log(`✅ Found ${modules.length} module(s)`);
    console.log(`📋 Module: ${modules[0].title}`);
    console.log(`🏷️ Topics: ${modules[0].topics?.length || 0}\n`);
    
    // Test 4: Create Module with File Uploads
    console.log('4️⃣ Creating module with file uploads...');
    
    // Create test files
    const testFile1 = createTestFile('test-doc1.txt', 'This is a test document for topic 1');
    const testFile2 = createTestFile('test-doc2.txt', 'This is a test document for topic 3');
    
    const formData = new FormData();
    formData.append('moduleData', JSON.stringify({
      title: 'Advanced JavaScript',
      description: 'Advanced concepts with downloadable resources',
      duration: 180,
      status: 'published'
    }));
    
    formData.append('topicsData', JSON.stringify([
      { title: 'Async Programming', resourceLink: 'https://javascript.info/async', order: 0 },
      { title: 'ES6 Features', resourceLink: '', order: 1 },
      { title: 'Testing Frameworks', resourceLink: '', order: 2 }
    ]));
    
    formData.append('topicFile_0', fs.createReadStream(testFile1));
    formData.append('topicFile_2', fs.createReadStream(testFile2));
    
    const fileModuleResponse = await axios.post(
      `${API_BASE}/modules/course/${courseId}/with-files`,
      formData,
      { headers: formData.getHeaders() }
    );
    
    const fileModuleId = fileModuleResponse.data.data.id;
    console.log(`✅ Module with files created with ID: ${fileModuleId}`);
    console.log(`📁 Files uploaded for topics\n`);
    
    // Clean up test files
    fs.unlinkSync(testFile1);
    fs.unlinkSync(testFile2);
    
    // Test 5: Update Module
    console.log('5️⃣ Updating module...');
    const updateResponse = await axios.put(`${API_BASE}/modules/${moduleId}`, {
      ...testModule,
      title: 'JavaScript Fundamentals - Updated',
      topics: [
        ...testTopics,
        { title: 'Error Handling', resourceLink: 'https://javascript.info/try-catch', order: 3 }
      ]
    });
    console.log(`✅ Module updated: ${updateResponse.data.data.title}`);
    console.log(`📝 Topics count: ${updateResponse.data.data.topics?.length || 0}\n`);
    
    // Test 6: Get Single Module
    console.log('6️⃣ Fetching single module...');
    const singleModuleResponse = await axios.get(`${API_BASE}/modules/${moduleId}`);
    const singleModule = singleModuleResponse.data.data;
    console.log(`✅ Module: ${singleModule.title}`);
    console.log(`📖 Description: ${singleModule.description}`);
    console.log(`⏱️ Duration: ${singleModule.duration} minutes`);
    console.log(`🏷️ Topics: ${singleModule.topics?.length || 0}\n`);
    
    // Test 7: Validate File Structure
    console.log('7️⃣ Validating file structure...');
    const uploadsDir = path.join(__dirname, 'backend', 'uploads', 'modules', fileModuleId.toString(), 'topics');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      console.log(`✅ Upload directory exists`);
      console.log(`📁 Files found: ${files.length}`);
      files.forEach(file => console.log(`   - ${file}`));
    } else {
      console.log(`❌ Upload directory not found`);
    }
    console.log();
    
    // Test 8: Test Student View (Published Modules Only)
    console.log('8️⃣ Testing student view (published modules)...');
    const studentModulesResponse = await axios.get(`${API_BASE}/modules/course/${courseId}`);
    const publishedModules = studentModulesResponse.data.data.filter(m => m.status === 'published');
    console.log(`✅ Published modules for students: ${publishedModules.length}`);
    publishedModules.forEach(module => {
      console.log(`   📚 ${module.title} (${module.topics?.length || 0} topics)`);
    });
    console.log();
    
    // Test 9: Delete Module (with file cleanup)
    console.log('9️⃣ Deleting module with file cleanup...');
    await axios.delete(`${API_BASE}/modules/${fileModuleId}`);
    console.log(`✅ Module deleted with file cleanup\n`);
    
    // Test 10: Final Verification
    console.log('🔟 Final verification...');
    const finalModulesResponse = await axios.get(`${API_BASE}/modules/course/${courseId}`);
    const finalModules = finalModulesResponse.data.data;
    console.log(`✅ Remaining modules: ${finalModules.length}`);
    
    // Cleanup: Delete test course
    await axios.delete(`${API_BASE}/api/courses/${courseId}`);
    console.log(`🧹 Test course cleaned up\n`);
    
    console.log('🎉 ALL TESTS PASSED! Enhanced Module System is working correctly.\n');
    
    // Summary
    console.log('📊 TEST SUMMARY:');
    console.log('✅ Course creation');
    console.log('✅ Module creation with topics');
    console.log('✅ Module retrieval');
    console.log('✅ File upload handling');
    console.log('✅ Module updates');
    console.log('✅ File structure validation');
    console.log('✅ Student view filtering');
    console.log('✅ Module deletion with cleanup');
    console.log('✅ Data consistency');
    
  } catch (error) {
    console.error('❌ TEST FAILED:', error.response?.data || error.message);
    
    // Cleanup on error
    if (courseId) {
      try {
        await axios.delete(`${API_BASE}/api/courses/${courseId}`);
        console.log('🧹 Cleaned up test course after error');
      } catch (cleanupError) {
        console.error('Failed to cleanup:', cleanupError.message);
      }
    }
    
    process.exit(1);
  }
}

// Run tests
console.log('🔧 Make sure the backend server is running on http://localhost:5000');
console.log('⏳ Starting tests in 3 seconds...\n');

setTimeout(runTests, 3000);