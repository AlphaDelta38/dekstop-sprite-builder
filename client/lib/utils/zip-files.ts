import JSZip from "jszip";
import mimeExtension from "../constants/mime-type";

async function zipFiles(fileMap: Record<string, File>) {
  const zip = new JSZip();

  for (const path in fileMap) {
    const file = fileMap[path];

    const parts = path.split("/");
    let folder = zip;

    for (let i = 0; i < parts.length - 1; i++) {
      folder = folder.folder(parts[i])!;
    }

    let fileName = parts[parts.length - 1];
    
    if (!fileName.includes(".")) {
      const ext = mimeExtension[file.type] || "";
      fileName += ext;
    }

    folder.file(fileName, file, { binary: true });
  }

  const blob = await zip.generateAsync({ type: "blob" });
  
  return blob;
}

export default zipFiles;