import { useCallback } from 'react';
import imageCompression from 'browser-image-compression';

export function useImageCompression() {
  const convertToWebP = useCallback(async (file) => {
    const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, fileType: 'image/webp' };
    return await imageCompression(file, options);
  }, []);

  return { convertToWebP };
}
