import { app, BrowserWindow, protocol, net } from 'electron';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

protocol.registerSchemesAsPrivileged([
  { 
    scheme: 'media', 
    privileges: { 
      secure: true, 
      standard: true, 
      supportFetchAPI: true,
      corsEnabled: true 
    } 
  }
]);

function createDekstopApp() {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			contextIsolation: true
		}
	});

	win.loadURL('http://localhost:3000');
}

function createWorkerWindow() {
	const workerWindow = new BrowserWindow({
		show: true,
		width: 100,
		height: 100,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			contextIsolation: true,
			sandbox: false,
			backgroundThrottling: false
		}
	});

	workerWindow.loadFile(path.join(__dirname, 'spine-renderer/index.html'));
}

app.whenReady().then(() => {
	createDekstopApp();
	createWorkerWindow();

	protocol.handle('media', (request) => {
		let pathToDecode = request.url.slice('media://'.length);

		let urlPath = decodeURIComponent(pathToDecode);

		if (urlPath[1] !== ':' && /^[a-zA-Z]/.test(urlPath)) {
			urlPath = urlPath[0] + ':' + (urlPath[1] === '/' ? '' : '/') + urlPath.slice(1);
		}

		try {
			const fileUrl = pathToFileURL(urlPath).toString();
			return net.fetch(fileUrl);
		} catch (e) {
			console.error('Error in media protocol:', e);
			return new Response('Internal Error', { status: 500 });
		}
	});

});

