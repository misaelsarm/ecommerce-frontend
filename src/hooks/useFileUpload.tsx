import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';
import { makeRequest } from '@/utils/makeRequest';

interface FileUploadHook {
  handleFileUpload: (file: File) => Promise<string | null>;
  uploading: boolean
}

const useFileUpload = ({ folder }: { folder: string }): FileUploadHook => {

  const [uploading, setUploading] = useState(false)

  const handleFileUpload = useCallback(async (file: File): Promise<string | null> => {

    if (!file) {
      return null;
    }

    setUploading(true)

    let formData = new FormData(); // Initialize formData outside the conditional block

    let fileData: any

    const fileType = file.type

    if (fileType.startsWith("image/")) {
      // It's an image, let's compress it
      const options = {
        maxSizeMB: 3,
        maxWidthOrHeight: 1500,
        useWebWorker: true,
      };

      try {
        const compressedBlob = await imageCompression(file, options);
        const compressedFile = new File([compressedBlob], compressedBlob.name);
        fileData = compressedFile;
      } catch (error) {
        console.error("Error compressing image:", error);
        // Handle the error, maybe fall back to the original file
        fileData = file;
      }
    } else {
      // It's not an image (e.g., a PDF), don't compress
      fileData = file;
    }

    try {
      formData.append('file', fileData);
      formData.append('folder', folder);
      const data = await makeRequest('post', '/api/admin/files/single', formData);
      toast.success('Archivo cargado');
      setUploading(false)
      return data.Location;
    } catch (error: any) {
      console.log({ error })
      const responseError = error.response?.data?.message || 'Error uploading file'
      setUploading(false)
      toast.error(responseError);
      return null;
    }
  }, []);

  return { handleFileUpload, uploading };
};

export default useFileUpload;