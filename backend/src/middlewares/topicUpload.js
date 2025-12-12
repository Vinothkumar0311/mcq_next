const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage for topic documents
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const moduleId = req.body.moduleId || req.params.moduleId;
    // Sanitize moduleId to prevent path traversal
    const sanitizedModuleId = parseInt(moduleId);
    if (!sanitizedModuleId || sanitizedModuleId <= 0) {
      return cb(new Error('Invalid module ID'), null);
    }
    
    const uploadsDir = path.join(__dirname, '../../uploads/modules', sanitizedModuleId.toString(), 'topics');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `topic-${baseName}-${uniqueSuffix}${ext}`);
  }
});

// File filter for documents and images
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOCX, PPT, images, and text files are allowed.'), false);
  }
};

// Configure multer
const topicUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = topicUpload;