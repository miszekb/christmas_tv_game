import { contextBridge, ipcRenderer } from 'electron';
console.log('✅ Preload script loaded');
contextBridge.exposeInMainWorld('esp32', {
  onData: (callback) => ipcRenderer.on('esp32-data', (_, data) => callback(data)),
  send: (message) => ipcRenderer.send('esp32-send', message),
});