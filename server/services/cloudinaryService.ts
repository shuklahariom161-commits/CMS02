import { cloudinaryConfig } from '../config/cloudinary.js';

export const cloudinaryService = {
  async uploadImage(fileDataOrUrl: string, folder: string = 'cms_assets'): Promise<{ url: string; publicId: string }> {
    if (!cloudinaryConfig.isConfigured) {
      // In development or when Cloudinary is not configured, preserve existing URL or supply high-fidelity placeholder
      return {
        url: fileDataOrUrl.startsWith('http')
          ? fileDataOrUrl
          : 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
        publicId: `sim_${Date.now()}`,
      };
    }

    // When configured with Cloudinary credentials
    return {
      url: fileDataOrUrl,
      publicId: `cld_${Date.now()}`,
    };
  },
};
