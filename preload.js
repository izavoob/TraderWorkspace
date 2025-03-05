const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveTrade: (trade) => ipcRenderer.invoke('save-trade', trade),
  getTrades: () => ipcRenderer.invoke('get-trades'),
  updateTrade: (tradeId, updatedTrade) => ipcRenderer.invoke('update-trade', tradeId, updatedTrade),
  deleteTrade: (tradeId) => ipcRenderer.invoke('delete-trade', tradeId),
  saveFile: (file) => ipcRenderer.invoke('save-file', file),
  saveBlobAsFile: (buffer) => ipcRenderer.invoke('save-blob-as-file', buffer),
  saveDailyRoutine: (routine) => ipcRenderer.invoke('save-daily-routine', routine),
  getDailyRoutine: (date) => ipcRenderer.invoke('get-daily-routine', date),
  getTrade: (id) => ipcRenderer.invoke('get-trade', id),
  toggleSidebar: (isCollapsed) => ipcRenderer.send('toggle-sidebar', isCollapsed),
  saveNoteWithTrade: (note) => ipcRenderer.invoke('saveNoteWithTrade', note),
  getAllNotes: () => ipcRenderer.invoke('getAllNotes'),
  deleteNote: (id) => ipcRenderer.invoke('deleteNote', id),
  
  // Account management methods
  getAllAccounts: () => ipcRenderer.invoke('getAllAccounts'),
  addAccount: (account) => ipcRenderer.invoke('addAccount', account),
  updateAccount: (account) => ipcRenderer.invoke('updateAccount', account),
  deleteAccount: (id) => ipcRenderer.invoke('deleteAccount', id),
  getAccountById: (id) => ipcRenderer.invoke('getAccountById', id),
  updateAccountBalance: (accountId, profitPercent) => ipcRenderer.invoke('updateAccountBalance', accountId, profitPercent),
  
  // Execution database methods
  getAllExecutionItems: (section) => ipcRenderer.invoke('getAllExecutionItems', section),
  addExecutionItem: (section, name) => ipcRenderer.invoke('addExecutionItem', section, name),
  updateExecutionItem: (section, id, name) => ipcRenderer.invoke('updateExecutionItem', section, id, name),
  deleteExecutionItem: (section, id) => ipcRenderer.invoke('deleteExecutionItem', section, id),
});