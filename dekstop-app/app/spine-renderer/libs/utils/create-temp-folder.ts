import fs from 'fs';
import os from 'os';
import path from 'path';

export function createTempFolder(folderName: string): string {
  const tempBaseDir = os.tmpdir(); 
  const myTempFolder = path.join(tempBaseDir, 'spine-renderer-assets', folderName + '-' + Date.now().toString());

  if (!fs.existsSync(myTempFolder)) {
    fs.mkdirSync(myTempFolder, { recursive: true });
  }

  return myTempFolder;
}