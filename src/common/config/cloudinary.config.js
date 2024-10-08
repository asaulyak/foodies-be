import { v2 as cloudinary } from 'cloudinary';
import { ENV_CONFIG } from './index.js';

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = ENV_CONFIG;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true, // insures, that https is used while creating URLs
  hide_sensitive: true // Relevant for Node SDK only. Ensures that tokens, API keys and API secrets aren’t shown in error responses. Default: false.
});

export default cloudinary;
