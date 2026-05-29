type UploadFileOptions = {
  onProgress?: (progress: number) => void;
};

export const uploadFileToUrl = (
  uploadUrl: string,
  file: File,
  options: UploadFileOptions = {},
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }

      options.onProgress?.(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Upload failed"));
    };

    xhr.open("PUT", uploadUrl);

    xhr.setRequestHeader("Content-Type", file.type);

    xhr.send(file);
  });
};
