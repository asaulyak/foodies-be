import cloudinary from '../config/cloudinary.config.js';
import { HttpError } from '../errors/http-error.js';

const options = {
  overwrite: true,
  transformation: [{ height: 600, width: 600, gravity: 'face', crop: 'thumb' }]
};

const uploadAvatar = async imagePath => {
  try {
    return await cloudinary.uploader.upload(imagePath, options);
  } catch ({ status, message }) {
    throw HttpError(status, message);
  }
};

const deleteAvatar = async avatarPublicId => {
  try {
    await cloudinary.uploader.destroy(avatarPublicId);
  } catch ({ status, message }) {
    throw HttpError(status, message);
  }
};

export { uploadAvatar, deleteAvatar };
