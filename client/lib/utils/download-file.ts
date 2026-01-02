function downLoadFile(file: File) {
  const blobUrl = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = file.name;
  link.click();

  URL.revokeObjectURL(blobUrl);
}


export default downLoadFile;
