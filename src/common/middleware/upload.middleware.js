import multer from 'multer';
import { v4 as uuid } from 'uuid';
import tempDir from 'temp-dir';

const MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];

const fileFilter = (_, file, cb) => {
  if (MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb({ message: 'Unsupported file format ' }, false);
  }
};

const storage = multer.diskStorage({
  destination: tempDir,
  filename: (_, file, cb) => {
    const uniquePrefix = uuid();
    const fileName = `${uniquePrefix}_${file.originalname}`;
    cb(null, fileName);
  }
});

const limits = {
  fileSize: 1024 * 1024 * 5
};

export const upload = multer({ storage, limits, fileFilter });
