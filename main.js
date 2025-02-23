const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { saveTrade, getTrades } = require('./storage');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Лог про завантаження
  console.log('Завантаження index.html:', path.join(__dirname, 'index.html'));
  win.loadFile('index.html');
  console.log('Платформа:', process.platform, 'Версія Node.js:', process.version);

  // Видаляємо лог CSP, оскільки getContentSecurityPolicy не підтримується
  // win.webContents.on('did-finish-load', () => {
  //   const csp = win.webContents.getContentSecurityPolicy();
  //   console.log('Поточна CSP:', csp);
  // });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// IPC для зберігання
ipcMain.handle('save-trade', async (event, trade) => {
  return await saveTrade(trade);
});

ipcMain.handle('get-trades', async () => {
  return await getTrades();
});