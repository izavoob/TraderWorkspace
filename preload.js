const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Presession methods
  savePresession: (presessionData) => ipcRenderer.invoke('savePresession', presessionData),
  updatePresession: (presessionData) => ipcRenderer.invoke('updatePresession', presessionData),
  getPresession: (id) => ipcRenderer.invoke('getPresession', id),
  getAllPresessions: () => ipcRenderer.invoke('getAllPresessions'),
  deletePresession: (id) => ipcRenderer.invoke('deletePresession', id),
  
  // Existing methods
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
  saveNote: (note) => ipcRenderer.invoke('saveNote', note),
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
  
  // Performance analysis methods
  savePerformanceAnalysis: (analysis) => ipcRenderer.invoke('savePerformanceAnalysis', analysis),
  getPerformanceAnalyses: (type) => ipcRenderer.invoke('getPerformanceAnalyses', type),
  getPerformanceAnalysis: (id) => ipcRenderer.invoke('getPerformanceAnalysis', id),
  updatePerformanceAnalysis: (id, analysis) => ipcRenderer.invoke('updatePerformanceAnalysis', id, analysis),
  deletePerformanceAnalysis: (id) => ipcRenderer.invoke('deletePerformanceAnalysis', id),
  
  // Notes methods
  getAllNoteTags: () => ipcRenderer.invoke('getAllNoteTags'),
  addNoteTag: (name) => ipcRenderer.invoke('addNoteTag', name),
  addNote: (note) => ipcRenderer.invoke('addNote', note),
  updateNote: (note) => ipcRenderer.invoke('updateNote', note),
  getNoteById: (id) => ipcRenderer.invoke('getNoteById', id),
  getNotesBySource: (sourceType, sourceId) => ipcRenderer.invoke('getNotesBySource', sourceType, sourceId),
  getAllNotes: () => ipcRenderer.invoke('getAllNotes'),
  deleteNote: (id) => ipcRenderer.invoke('deleteNote', id),
  addNoteImage: (noteId, imagePath, comment) => ipcRenderer.invoke('addNoteImage', noteId, imagePath, comment),
  getNoteImages: (noteId) => ipcRenderer.invoke('getNoteImages', noteId),
  deleteNoteImage: (imageId) => ipcRenderer.invoke('deleteNoteImage', imageId),
  updateNoteImageComment: (imageId, comment) => ipcRenderer.invoke('updateNoteImageComment', imageId, comment),
  updateNotesWithTradeData: (tradeId) => ipcRenderer.invoke('updateNotesWithTradeData', tradeId),
  updateNotesWithPresessionData: (presessionId) => ipcRenderer.invoke('updateNotesWithPresessionData', presessionId),
  addPostSession: (postSession) => ipcRenderer.invoke('addPostSession', postSession),
  updatePostSession: (postSession) => ipcRenderer.invoke('updatePostSession', postSession),
  getPostSessionById: (id) => ipcRenderer.invoke('getPostSessionById', id),
  getAllPostSessions: () => ipcRenderer.invoke('getAllPostSessions'),
});