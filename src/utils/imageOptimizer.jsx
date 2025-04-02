import imageCompression from 'image-browser-compression';

async function convertToWebp(file){
    const options = {maxSizeMB:1, maxWidthOrHeight: 1024, fileType: 'assets/webp'};
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
}

// attach globally
window.convertToWebp = convertToWebp;

export default convertToWebp;