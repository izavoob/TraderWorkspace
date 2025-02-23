const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveTrade: (trade) => ipcRenderer.invoke('save-trade', trade),
  getTrades: () => ipcRenderer.invoke('get-trades'),
});