async function getFileFromDisk(fullPath: string): Promise<File> {
  try {
    const normalizedPath = fullPath.replace(/\\/g, '/');
    const safeUrl = `media://${encodeURI(normalizedPath)}`
  
    const res = await fetch(safeUrl);
    const blob = await res.blob();
  
    const fileName = fullPath.replace(/^.*[\\\/]/, '');
    const fileType = blob.type || getMimeType(fileName); 
  
    const file = new File([blob], fileName, { type: fileType });
  
    Object.defineProperty(file, 'path', {
        value: fullPath,
        writable: true
    });
  
    return file;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function getMimeType(filename: string) {
  if (filename.endsWith('.png')) return 'image/png';
  if (filename.endsWith('.jpg')) return 'image/jpeg';
  if (filename.endsWith('.json')) return 'application/json';
  if (filename.endsWith('.atlas')) return 'text/plain';
  return 'application/octet-stream';
}

export default getFileFromDisk;
