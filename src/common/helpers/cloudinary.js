import cloudinary from '../config/cloudinary.config.js';
import { HttpError } from '../errors/http-error.js';

const folder = 'foodies_avatars';

const options = {
  folder,
  transformation: [{ height: 600, width: 600, gravity: 'face', crop: 'thumb' }]
};

function extractFilename(url) {
  const parts = url.split('/');
  const filenameWithExt = parts.pop();
  const fileName = `${folder}/${filenameWithExt.split('.')[0]}`;

  return fileName;
}

export const uploadAvatar = async imagePath => {
  try {
    return await cloudinary.uploader.upload(imagePath, options);
  } catch ({ status, message }) {
    throw HttpError(status, message);
  }
};

export const uploadRecipeThumb = async imagePath => {
  const options = {
    folder: 'recipe_thumbnails',
    transformation: [{ height: 400, width: 550 }]
  };

  try {
    return await cloudinary.uploader.upload(imagePath, options);
  } catch ({ status, message }) {
    throw HttpError(status, message);
  }
};

export const deleteAvatar = async avatarUrl => {
  try {
    const avatarPublicId = extractFilename(avatarUrl);
    await cloudinary.uploader.destroy(avatarPublicId);
  } catch ({ status, message }) {
    throw HttpError(status, message);
  }
};
