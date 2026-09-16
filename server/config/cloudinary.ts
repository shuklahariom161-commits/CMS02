// Cloudinary Configuration stub for production file storage
export const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  isConfigured: Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ),
};

export const getCloudinaryStatus = () => ({
  configured: cloudinaryConfig.isConfigured,
  cloudName: cloudinaryConfig.cloudName ? `${cloudinaryConfig.cloudName.slice(0, 3)}***` : 'Not configured',
});
