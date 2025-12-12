# Module Test Management API Documentation

## Overview
Complete API for managing MCQ and Coding tests within modules.

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### 1. Get Tests by Module
```http
GET /modules/{moduleId}/tests
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "JavaScript Basics Quiz",
      "type": "mcq",
      "tags": ["javascript", "basics"],
      "difficulty": "easy",
      "description": "Test your JavaScript fundamentals",
      "status": "draft",
      "mcqQuestions": [
        {
          "id": 1,
          "question": "What is the correct way to declare a variable?",
          "order": 0
        }
      ]
    }
  ]
}
```

### 2. Create Test
```http
POST /modules/{moduleId}/tests
```

**Request Body:**
```json
{
  "name": "JavaScript Quiz",
  "type": "mcq",
  "tags": ["javascript", "basics"],
  "difficulty": "easy",
  "description": "Test description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "JavaScript Quiz",
    "type": "mcq",
    "tags": ["javascript", "basics"],
    "difficulty": "easy",
    "description": "Test description",
    "status": "draft"
  },
  "message": "Test created successfully"
}
```

### 3. Add MCQ Questions
```http
POST /tests/{testId}/mcq/questions
```

**Request Body:**
```json
{
  "questions": [
    {
      "question": "What is the correct way to declare a variable in JavaScript?",
      "optionA": "var x = 5;",
      "optionB": "variable x = 5;",
      "optionC": "v x = 5;",
      "optionD": "declare x = 5;",
      "correct": "A"
    }
  ]
}
```

### 4. Add Coding Problems
```http
POST /tests/{testId}/coding/problems
```

**Request Body:**
```json
{
  "problems": [
    {
      "name": "Two Sum",
      "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      "inputFormat": "First line contains n (array size). Second line contains n integers. Third line contains target.",
      "outputFormat": "Two space-separated integers representing the indices.",
      "constraints": "2 <= nums.length <= 10^4",
      "tags": ["array", "hash-table"],
      "sampleInput": "4\n2 7 11 15\n9",
      "sampleOutput": "0 1",
      "hiddenTests": [
        {
          "input": "3\n3 2 4\n6",
          "output": "1 2"
        }
      ]
    }
  ]
}
```

### 5. Bulk Upload MCQ
```http
POST /tests/{testId}/bulk-upload/mcq
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Excel file with MCQ questions

**Excel Format:**
| question | optionA | optionB | optionC | optionD | correct |
|----------|---------|---------|---------|---------|---------|
| What is 2+2? | 3 | 4 | 5 | 6 | B |

### 6. Bulk Upload Coding
```http
POST /tests/{testId}/bulk-upload/coding
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Excel file with coding problems

**Excel Format:**
| name | description | input | output | constraints | tags | sample_input | sample_output | hidden_tests |
|------|-------------|-------|--------|-------------|------|--------------|---------------|--------------|
| Two Sum | Find two numbers... | First line... | Two integers... | 2 <= n <= 10^4 | array,hash | 4\n2 7 11 15\n9 | 0 1 | [{"input":"3\n3 2 4\n6","output":"1 2"}] |

### 7. Download Templates
```http
GET /templates/mcq
GET /templates/coding
```

Returns Excel template files for bulk upload.

### 8. Delete Test
```http
DELETE /tests/{testId}
```

**Response:**
```json
{
  "success": true,
  "message": "Test deleted successfully"
}
```

## Database Schema

### ModuleTest Table
```sql
CREATE TABLE ModuleTest (
  id INT PRIMARY KEY AUTO_INCREMENT,
  moduleId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  type ENUM('mcq', 'coding') NOT NULL,
  tags JSON DEFAULT '[]',
  difficulty ENUM('easy', 'medium', 'hard'),
  description TEXT,
  status ENUM('draft', 'published') DEFAULT 'draft',
  createdAt DATETIME DEFAULT NOW(),
  updatedAt DATETIME DEFAULT NOW()
);
```

### MCQQuestion Table
```sql
CREATE TABLE MCQQuestion (
  id INT PRIMARY KEY AUTO_INCREMENT,
  testId INT NOT NULL,
  question TEXT NOT NULL,
  optionA TEXT NOT NULL,
  optionB TEXT NOT NULL,
  optionC TEXT NOT NULL,
  optionD TEXT NOT NULL,
  correct ENUM('A', 'B', 'C', 'D') NOT NULL,
  `order` INT DEFAULT 0
);
```

### CodingProblem Table
```sql
CREATE TABLE CodingProblem (
  id INT PRIMARY KEY AUTO_INCREMENT,
  testId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  inputFormat TEXT NOT NULL,
  outputFormat TEXT NOT NULL,
  constraints TEXT,
  tags JSON DEFAULT '[]',
  sampleInput TEXT NOT NULL,
  sampleOutput TEXT NOT NULL,
  hiddenTests JSON DEFAULT '[]',
  `order` INT DEFAULT 0
);
```

## Frontend Integration

### Creating a Test with Questions
```javascript
// 1. Create test
const testResponse = await axios.post(`/api/modules/${moduleId}/tests`, {
  name: 'JavaScript Quiz',
  type: 'mcq',
  tags: ['javascript'],
  difficulty: 'easy'
});

const testId = testResponse.data.data.id;

// 2. Add questions
await axios.post(`/api/tests/${testId}/mcq/questions`, {
  questions: [
    {
      question: 'What is JavaScript?',
      optionA: 'A programming language',
      optionB: 'A markup language',
      optionC: 'A database',
      optionD: 'An operating system',
      correct: 'A'
    }
  ]
});
```

### Bulk Upload
```javascript
const formData = new FormData();
formData.append('file', selectedFile);

await axios.post(`/api/tests/${testId}/bulk-upload/mcq`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

## Workflow

1. **Admin creates module** → Module exists
2. **Admin creates test** → Test created with type (MCQ/Coding)
3. **Admin adds questions/problems** → Content added to test
4. **Admin publishes test** → Students can access
5. **Students take test** → Answers recorded
6. **Results generated** → Performance analytics