export const getBlobFromUri = (uri: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
      resolve(xhr.response);
    };

    xhr.onerror = function () {
      reject(new TypeError('Network request failed'));
    };

    xhr.responseType = 'blob';

    xhr.open('GET', uri, true);
    xhr.send(null);
  });
};

export const blobToBase64 = (blob: Blob): Promise<string | ArrayBuffer | null> => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};

export const getBase64BlobFromUri = async (uri: string) => {
  const blob = await getBlobFromUri(uri);
  return blobToBase64(blob);
};
