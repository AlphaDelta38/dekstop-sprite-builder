import { contextBridge, ipcRenderer } from 'electron';

const VALID_CHANNELS_SEND = ['render-complete', 'render-error', 'log'];
const VALID_CHANNELS_ON = ['start-render'];

contextBridge.exposeInMainWorld('electronAPI', {
	send: (channel, data) => {
		if (VALID_CHANNELS_SEND.includes(channel)) {
			ipcRenderer.send(channel, data);
		}
	},

	on: (channel, func) => {
		if (VALID_CHANNELS_ON.includes(channel)) {
			ipcRenderer.on(channel, (event, ...args) => func(...args));
		}
	},
});