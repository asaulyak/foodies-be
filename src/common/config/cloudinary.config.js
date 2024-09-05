import cloudinary from 'cloudinary';

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

cloudinary.v2.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true, // insures, that https is used while creating URLs
  hide_sensitive: true // Relevant for Node SDK only. Ensures that tokens, API keys and API secrets aren’t shown in error responses. Default: false.
});

export default cloudinary;
