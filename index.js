import { app, BrowserWindow } from 'electron';
import { SerialPort } from 'serialport';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(path.join(__dirname, 'preload.js'))
let mainWindow;
let port;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        },
    });

    mainWindow.loadURL('http://localhost:5173'); // Vite dev server
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

      // Replace with your port name (you can list ports to find it)
    port = new SerialPort({
        path: '/dev/ttyUSB0',
        baudRate: 115200,
    });

    port.on('data', (data) => {
        // Send to renderer
        mainWindow.webContents.send('esp32-data', data.toString());
    });

    port.on('error', (err) => {
        console.error('Serial Error:', err.message);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});