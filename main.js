const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { saveTrade, getTrades } = require('./storage');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // Вимикаємо nodeIntegration для безпеки
      contextIsolation: true, // Вмикаємо ізоляцію
      preload: path.join(__dirname, 'preload.js'), // Додаємо preload-скрипт
    },
  });
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Обробники IPC
ipcMain.handle('save-trade', async (event, trade) => {
  return await saveTrade(trade);
});

ipcMain.handle('get-trades', async () => {
  return await getTrades();
});