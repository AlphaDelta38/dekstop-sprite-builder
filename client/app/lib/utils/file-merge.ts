export enum MIMEType {
  TEXT_PLAIN = "text/plain",
  APPLICATION_JSON = "application/json",
  IMAGE_PNG = "image/png",
  IMAGE_JPEG = "image/jpeg",
  IMAGE_GIF = "image/gif",
  IMAGE_WEBP = "image/webp",
  IMAGE_SVG = "image/svg+xml",
  IMAGE_TIFF = "image/tiff",
  IMAGE_ICO = "image/vnd.microsoft.icon",
}

export async function mergeFiles(files: File[], outputName: string, outputType: MIMEType): Promise<File> {

  const contents = await Promise.all(
    files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();

          reader.readAsText(file, 'utf-8');

          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error);

        })
    )
  );

  const mergedText = contents.join("\n\n");

  const mergedFile = new File(
    [mergedText],               
    outputName,            
    { type: outputType }      
  )

  return mergedFile;
}