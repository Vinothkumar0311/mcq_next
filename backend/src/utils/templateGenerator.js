const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const generateMCQTemplate = () => {
  const data = [
    {
      question: 'What is the correct way to declare a variable in JavaScript?',
      optionA: 'var x = 5;',
      optionB: 'variable x = 5;',
      optionC: 'v x = 5;',
      optionD: 'declare x = 5;',
      correct: 'A'
    },
    {
      question: 'Which method is used to add an element to the end of an array?',
      optionA: 'push()',
      optionB: 'add()',
      optionC: 'append()',
      optionD: 'insert()',
      correct: 'A'
    }
  ];

  const ws = xlsx.utils.json_to_sheet(data);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'MCQ Questions');
  
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  const templatePath = path.join(publicDir, 'mcq-template.xlsx');
  xlsx.writeFile(wb, templatePath);
  return templatePath;
};

const generateCodingTemplate = () => {
  const data = [
    {
      name: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      input: 'First line contains n (array size). Second line contains n integers. Third line contains target.',
      output: 'Two space-separated integers representing the indices.',
      constraints: '2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9',
      tags: 'array,hash-table',
      sample_input: '4\n2 7 11 15\n9',
      sample_output: '0 1',
      hidden_tests: '[{"input":"3\\n3 2 4\\n6","output":"1 2"},{"input":"2\\n3 3\\n6","output":"0 1"}]'
    }
  ];

  const ws = xlsx.utils.json_to_sheet(data);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Coding Problems');
  
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  const templatePath = path.join(publicDir, 'coding-template.xlsx');
  xlsx.writeFile(wb, templatePath);
  return templatePath;
};

module.exports = {
  generateMCQTemplate,
  generateCodingTemplate
};