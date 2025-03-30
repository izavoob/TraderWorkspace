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
  
  // Trade-Presession linking methods
  linkTradeToPresession: (tradeId, presessionId) => ipcRenderer.invoke('linkTradeToPresession', tradeId, presessionId),
  unlinkTradeFromPresession: (tradeId) => ipcRenderer.invoke('unlinkTradeFromPresession', tradeId),
  getLinkedPresession: (tradeId) => ipcRenderer.invoke('getLinkedPresession', tradeId),
  getLinkedTrades: (presessionId) => ipcRenderer.invoke('getLinkedTrades', presessionId),
  
  // Account management methods
  getAllAccounts: () => ipcRenderer.invoke('getAllAccounts'),
  addAccount: (account) => ipcRenderer.invoke('addAccount', account),
  updateAccount: (account) => ipcRenderer.invoke('updateAccount', account),
  deleteAccount: (id) => ipcRenderer.invoke('deleteAccount', id),
  getAccountById: (id) => ipcRenderer.invoke('getAccountById', id),
  updateAccountBalance: (accountId, profitPercent) => ipcRenderer.invoke('updateAccountBalance', accountId, profitPercent),
  updateAccountWithTrade: (accountId, trade) => ipcRenderer.invoke('updateAccountWithTrade', accountId, trade),
  
  // Execution database methods
  getAllExecutionItems: (section) => ipcRenderer.invoke('getAllExecutionItems', section),
  addExecutionItem: (section, name) => ipcRenderer.invoke('addExecutionItem', section, name),
  updateExecutionItem: (section, id, name) => ipcRenderer.invoke('updateExecutionItem', section, id, name),
  deleteExecutionItem: (section, id) => ipcRenderer.invoke('deleteExecutionItem', section, id),
  getTradeRecommendations: () => ipcRenderer.invoke('getTradeRecommendations'),
  
  // API для роботи з архівом рекомендацій
  getArchivedRecommendations: () => ipcRenderer.invoke('getArchivedRecommendations'),
  archiveRecommendation: (recommendation) => ipcRenderer.invoke('archiveRecommendation', recommendation),
  deleteArchivedRecommendation: (recommendationKey) => ipcRenderer.invoke('deleteArchivedRecommendation', recommendationKey),
  
  // API для роботи з патернами високого вінрейту
  getHighWinratePatterns: () => ipcRenderer.invoke('getHighWinratePatterns'),
  
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
  
  // STER methods
  getSTERAssessments: () => ipcRenderer.invoke('getSTERAssessments'),
  addSTERAssessment: (assessment) => ipcRenderer.invoke('addSTERAssessment', assessment),
  updateSTERAssessment: (id, assessment) => ipcRenderer.invoke('updateSTERAssessment', id, assessment),
  deleteSTERAssessment: (id) => ipcRenderer.invoke('deleteSTERAssessment', id),
  
  // Demons methods
  getAllDemons: () => ipcRenderer.invoke('getAllDemons'),
  getDemonsByCategory: (category) => ipcRenderer.invoke('getDemonsByCategory', category),
  getDemonById: (id) => ipcRenderer.invoke('getDemonById', id),
  addDemon: (demon) => ipcRenderer.invoke('addDemon', demon),
  updateDemon: (id, demon) => ipcRenderer.invoke('updateDemon', id, demon),
  deleteDemon: (id) => ipcRenderer.invoke('deleteDemon', id),
  
  // Методы для работы с постсессиями напрямую
  getAllPostSessions: () => ipcRenderer.invoke('get-all-post-sessions'),
  getPostSessionById: (id) => ipcRenderer.invoke('get-post-session-by-id', id),
  updatePostSession: (postSession) => ipcRenderer.invoke('update-post-session', postSession),
  deletePostSession: (id) => ipcRenderer.invoke('delete-post-session', id)
});