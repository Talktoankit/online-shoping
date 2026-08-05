const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
      if (error) reject(error);
      else resolve({ url: result.secure_url, public_id: result.public_id });
    });
    stream.end(fileBuffer);
  });
};

exports.deleteFromCloudinary = (publicId) => cloudinary.uploader.destroy(publicId);