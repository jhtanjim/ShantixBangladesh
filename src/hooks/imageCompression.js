// src/utils/imageCompression.js

/**
 * Compress image file
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width (default: 800)
 * @param {number} options.maxHeight - Maximum height (default: 600)
 * @param {number} options.quality - JPEG quality 0-1 (default: 0.8)
 * @param {string} options.outputFormat - Output format 'jpeg' or 'webp' (default: 'jpeg')
 * @param {number} options.maxSizeKB - Maximum file size in KB (default: 500)
 * @returns {Promise<File>} Compressed image file
 */
export const compressImage = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 800,
      maxHeight = 600,
      quality = 0.8,
      outputFormat = 'jpeg',
      maxSizeKB = 500
    } = options;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      // Resize if needed
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob with compression
      const mimeType = outputFormat === 'webp' ? 'image/webp' : 'image/jpeg';
      
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to compress image'));
          return;
        }

        // Check file size and reduce quality if needed
        const sizeKB = blob.size / 1024;
        
        if (sizeKB > maxSizeKB && quality > 0.1) {
          // Recursively compress with lower quality
          const newQuality = Math.max(0.1, quality - 0.1);
          compressImage(file, { ...options, quality: newQuality })
            .then(resolve)
            .catch(reject);
          return;
        }

        // Create new file from blob
        const compressedFile = new File([blob], file.name, {
          type: mimeType,
          lastModified: Date.now()
        });

        resolve(compressedFile);
      }, mimeType, quality);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load image
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Validate image file
 * @param {File} file - The image file to validate
 * @param {Object} options - Validation options
 * @param {number} options.maxSizeMB - Maximum file size in MB (default: 10)
 * @param {string[]} options.allowedTypes - Allowed MIME types (default: ['image/jpeg', 'image/png', 'image/webp'])
 * @returns {Object} Validation result
 */
export const validateImage = (file, options = {}) => {
  const {
    maxSizeMB = 10,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  } = options;

  const errors = [];

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }

  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    errors.push(`File size ${fileSizeMB.toFixed(2)}MB exceeds maximum ${maxSizeMB}MB`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Create image preview URL
 * @param {File} file - The image file
 * @returns {Promise<string>} Preview URL
 */
export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Get image dimensions
 * @param {File} file - The image file
 * @returns {Promise<{width: number, height: number}>} Image dimensions
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};