import multer from 'multer';
import path from 'node:path';

const MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];

const uploadDir = path.resolve('uploads');

const fileFilter = (_, file, cb) => {
  if (MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb({ message: 'Unsupported file format ' }, false);
  }
};

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_, file, cb) => {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e3)}`;
    const fileName = `${uniquePrefix}_${file.originalname}`;
    cb(null, fileName);
  }
});

const limits = {
  fileSize: 1024 * 1024 * 5
};

const upload = multer({ storage, limits, fileFilter });

export default upload;
