const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveTrade: (trade) => ipcRenderer.invoke('save-trade', trade),
  getTrades: () => ipcRenderer.invoke('get-trades'),
  updateTrade: (tradeId, updatedTrade) => ipcRenderer.invoke('update-trade', tradeId, updatedTrade),
  deleteTrade: (tradeId) => ipcRenderer.invoke('delete-trade', tradeId),
});