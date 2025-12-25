import esbuild from 'esbuild'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

esbuild.build({
  entryPoints: [path.join(__dirname, 'index.ts')], 
  outfile: path.join(__dirname, 'dist/index.js'),
  bundle: true,
  platform: 'node',
  target: ['node16'],
  external: ['electron'],
}).then(() => {
  console.log('Build successful: ./dist/index.js');
}).catch(() => process.exit(1));