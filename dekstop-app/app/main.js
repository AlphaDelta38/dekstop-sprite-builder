import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createDekstopApp() {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	});

	win.loadFile(path.join(__dirname, 'index.html'));
}

function createWorkerWindow() {
	const workerWindow = new BrowserWindow({
		show: true,
		width: 100,
		height: 100,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			sandbox: false,
			backgroundThrottling: false
		}
	});

	workerWindow.loadFile(path.join(__dirname, 'spine-renderer/index.html'));
}

app.whenReady().then(() => {
	createDekstopApp();
	createWorkerWindow();
});
