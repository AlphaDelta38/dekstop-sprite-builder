import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export async function convertFramesToMov(
  ffmpeg: FFmpeg,
  frames: File[], 
  fps: number = 30,
  name: string = 'animation.mov'
): Promise<File | null> {
  // const ffmpeg = new FFmpeg();
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

  ffmpeg.on('log', ({ message }) => {
    console.log('%cFFmpeg:', 'color: cyan', message);
  });

  try {
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  } catch (e) {
    console.error("Ошибка загрузки FFmpeg:", e);
    return null;
  }

  for (let i = 0; i < frames.length; i++) {
    const file = frames[i];
    const num = String(i).padStart(3, '0'); // "000", "001", "002"
    const fileName = `frame_${num}.png`;
    
    const fileData = await fetchFile(file);
    await ffmpeg.writeFile(fileName, fileData);
  }


  // -framerate: частота кадров
  // -i frame_%03d.png: брать файлы frame_000.png, frame_001.png...
  // -c:v libx264: кодек видео (стандартный H.264)
  // -pix_fmt yuv420p: важно для совместимости с QuickTime/Mac
  await ffmpeg.exec([
    '-framerate', String(fps),
    '-i', 'frame_%03d.png',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',

    // pad to even width and height
    '-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2',

    'output.mov' 
  ]);


  const data = await ffmpeg.readFile('output.mov');

  for (let i = 0; i < frames.length; i++) {
    const num = String(i).padStart(3, '0');
    await ffmpeg.deleteFile(`frame_${num}.png`);
  }
  await ffmpeg.deleteFile('output.mov');


  return new File([data as BlobPart], `${name}.mov`, { type: 'video/quicktime' });
}

export default convertFramesToMov;