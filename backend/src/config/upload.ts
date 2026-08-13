import multer from 'multer';

// 1. Use memory storage instead of disk storage for serverless compatibility
const storage = multer.memoryStorage();

// 2. Keep your strong file validation
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  // We can remove standard images/videos from this array since we will catch them dynamically below
  const allowedTypes = [
    'application/pdf', 
    'application/msword',
    'audio/mpeg', 
    'audio/wav', 
    'audio/mp3'
  ];

  // 🔥 FIX: Allow ANY image type OR ANY video type, plus the specific files above
  if (
    file.mimetype.startsWith('image/') || 
    file.mimetype.startsWith('video/') || 
    allowedTypes.some(type => file.mimetype.includes(type))
  ) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed!`), false);
  }
};

// 3. Export the configured upload middleware
export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});