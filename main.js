const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const AccountsDB = require('./src/database/accountsDB');
const ExecutionDB = require('./src/database/executionDB');
const NotesDB = require('./src/database/notesDB');
const RoutinesDB = require('./src/database/routinesDB');

let db = null;
let accountsDB = null;
let executionDB = null;
let performanceDB = null;
let vaultPath = null;
let mainWindow = null;
let notesDB;
let routinesDB;

async function reorderTradeNumbers() {
  return new Promise((resolve, reject) => {
    db.all('SELECT id FROM trades ORDER BY date DESC', [], async (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      for (let i = 0; i < rows.length; i++) {
        await new Promise((updateResolve, updateReject) => {
          db.run('UPDATE trades SET no = ? WHERE id = ?', [i + 1, rows[i].id], (updateErr) => {
            if (updateErr) updateReject(updateErr);
            else updateResolve();
          });
        });
      }
      resolve();
    });
  });
}

async function initializeDatabase() {
  if (vaultPath && db) return;
  
  vaultPath = path.join(app.getPath('documents'), 'TraderWorkspaceVault');
  console.log('Vault path:', vaultPath);
  
  const dbPath = path.join(vaultPath, 'trades.db');
  const accountsDbPath = path.join(vaultPath, 'accounts.db');
  const executionDbPath = path.join(vaultPath, 'execution.db');
  const performanceDbPath = path.join(vaultPath, 'performance.db');
  const notesDbPath = path.join(vaultPath, 'notes.db');
  const routinesDbPath = path.join(vaultPath, 'routines.db');
  
  console.log('Database paths:');
  console.log('- trades.db:', dbPath);
  console.log('- accounts.db:', accountsDbPath);
  console.log('- execution.db:', executionDbPath);
  console.log('- performance.db:', performanceDbPath);
  console.log('- notes.db:', notesDbPath);
  console.log('- routines.db:', routinesDbPath);
  
  try {
    await fs.mkdir(vaultPath, { recursive: true });
    console.log('Vault directory created/verified');
    
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error connecting to trades database:', err);
      } else {
        // Create trades table if it doesn't exist
        db.run(`
          CREATE TABLE IF NOT EXISTS trades (
            id TEXT PRIMARY KEY,
            no INTEGER,
            date TEXT,
            pair TEXT,
            direction TEXT,
            entry_price REAL,
            stop_loss REAL,
            take_profit REAL,
            risk_reward REAL,
            outcome TEXT,
            pnl REAL,
            notes TEXT,
            account TEXT,
            positionType TEXT,
            risk TEXT,
            result TEXT,
            rr TEXT,
            profitLoss TEXT,
            gainedPoints TEXT,
            followingPlan INTEGER,
            bestTrade INTEGER,
            session TEXT,
            pointA TEXT,
            trigger TEXT,
            volumeConfirmation TEXT,
            entryModel TEXT,
            entryTF TEXT,
            fta TEXT,
            slPosition TEXT,
            score TEXT,
            category TEXT,
            topDownAnalysis TEXT,
            execution TEXT,
            management TEXT,
            conclusion TEXT,
            parentTradeId TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            console.error('Error creating trades table:', err);
          } else {
            console.log('trades.db initialized successfully');
          }
        });
      }
    });

    // Initialize accounts database
    accountsDB = new AccountsDB(accountsDbPath);
    
    // Initialize execution database
    executionDB = new ExecutionDB(executionDbPath);

    // Initialize performance database
    performanceDB = new sqlite3.Database(performanceDbPath, (err) => {
      if (err) {
        console.error('performance.db connection failed:', err);
        throw new Error(`Performance database connection failed: ${err.message}`);
      }
      console.log('performance.db initialized successfully');
    });

    // Initialize notes database
    notesDB = new NotesDB(notesDbPath);
    console.log('notes.db initialized');

    // Initialize routines database
    routinesDB = new RoutinesDB(routinesDbPath);
    if (!routinesDB) {
      throw new Error('Failed to create routinesDB instance');
    }
    console.log('routines.db initialized at:', routinesDbPath);
    console.log('routinesDB:', routinesDB); // Added this line to log routinesDB
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    backgroundColor: '#1a1a1a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize(); // Додаємо максимізацію вікна
    mainWindow.show();
  });

  mainWindow.loadFile('index.html');
  initializeDatabase().catch(console.error);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (db) db.close((err) => {
    if (err) console.error('Error closing database:', err);
    console.log('Database closed');
  });
  if (process.platform !== 'darwin') app.quit();
});

const ensureDatabaseInitialized = async () => {
  if (!db) {
    await initializeDatabase();
  }
  if (!db) throw new Error('Database not initialized');
};

ipcMain.handle('saveNote', async (event, note) => {
  try {
    if (note.id) {
      await notesDB.updateNote(note);
      return note.id;
    } else {
      const noteId = await notesDB.addNote(note);
      return noteId;
    }
  } catch (error) {
    console.error('Error saving note:', error);
    throw error;
  }
});

ipcMain.handle('getAllNotes', async () => {
  try {
    return await notesDB.getAllNotes();
  } catch (error) {
    console.error('Error getting all notes:', error);
    throw error;
  }
});

ipcMain.handle('deleteNote', async (event, id) => {
  return await notesDB.deleteNote(id);
});

ipcMain.on('toggle-sidebar', (event, isCollapsed) => {
  mainWindow.webContents.send('sidebar-state-changed', isCollapsed);
});

ipcMain.handle('get-trade', async (event, id) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    console.log('Отримання трейду з бази даних, ID:', id);
    
    db.get('SELECT * FROM trades WHERE id = ?', [id], (err, trade) => {
      if (err) {
        console.error('Помилка при отриманні трейду:', err);
        reject(err);
        return;
      }
      
      if (trade) {
        console.log('Трейд знайдено в базі даних');
        console.log('volumeConfirmation до парсингу:', trade.volumeConfirmation);
        
        try {
          // Перетворюємо JSON рядки в об'єкти
          trade.topDownAnalysis = JSON.parse(trade.topDownAnalysis || '[]');
          trade.execution = JSON.parse(trade.execution || '{}');
          trade.management = JSON.parse(trade.management || '{}');
          trade.conclusion = JSON.parse(trade.conclusion || '{}');
          trade.notes = JSON.parse(trade.notes || '[]');
          trade.volumeConfirmation = JSON.parse(trade.volumeConfirmation || '[]');
          
          console.log('volumeConfirmation після парсингу:', trade.volumeConfirmation);
          
          // Переконуємося що no існує
          if (!trade.no) {
            trade.no = id;
          }
          
          resolve(trade);
        } catch (parseError) {
          console.error('Помилка при парсингу JSON:', parseError);
          reject(parseError);
        }
      } else {
        console.log('Трейд не знайдено');
        resolve(null);
      }
    });
  });
});

ipcMain.handle('save-trade', async (event, trade) => {
  await ensureDatabaseInitialized();
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Початок збереження трейду');
      
      // Get next trade number
      const row = await new Promise((res, rej) => {
        db.get('SELECT MAX(no) as maxNo FROM trades', [], (err, row) => {
          if (err) rej(err);
          else res(row);
        });
      });
      
      const nextNo = (row.maxNo || 0) + 1;
      const volumeConfirmationJson = JSON.stringify(Array.isArray(trade.volumeConfirmation) ? trade.volumeConfirmation : []);
      
      // Save trade
      await new Promise((res, rej) => {
        db.run(
          `INSERT OR REPLACE INTO trades (
            id, no, date, account, pair, direction, positionType, 
            risk, result, rr, profitLoss, gainedPoints, 
            followingPlan, bestTrade, session, pointA, trigger, 
            volumeConfirmation, entryModel, entryTF, fta, 
            slPosition, score, category, topDownAnalysis, 
            execution, management, conclusion, parentTradeId
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            trade.id,
            nextNo,
            trade.date || '',
            trade.account || '',
            trade.pair || '',
            trade.direction || '',
            trade.positionType || '',
            trade.risk || '',
            trade.result || '',
            trade.rr || '',
            trade.profitLoss || '',
            trade.gainedPoints || '',
            trade.followingPlan ? 1 : 0,
            trade.bestTrade ? 1 : 0,
            trade.session || '',
            trade.pointA || '',
            trade.trigger || '',
            volumeConfirmationJson,
            trade.entryModel || '',
            trade.entryTF || '',
            trade.fta || '',
            trade.slPosition || '',
            trade.score || '',
            trade.category || '',
            JSON.stringify(trade.topDownAnalysis || []),
            JSON.stringify(trade.execution || {}),
            JSON.stringify(trade.management || {}),
            JSON.stringify(trade.conclusion || {}),
            trade.parentTradeId || null
          ],
          function(err) {
            if (err) rej(err);
            else res();
          }
        );
      });

      // Save notes if present
      if (trade.notes && trade.notes.length > 0) {
        for (const note of trade.notes) {
          await notesDB.addNote({
            ...note,
            sourceType: 'trade',
            sourceId: trade.id,
            tradeNo: nextNo,
            tradeDate: trade.date
          });
        }
      }

      console.log('Трейд успішно збережено');
      resolve(true);
    } catch (error) {
      console.error('Error saving trade:', error);
      reject(error);
    }
  });
});

ipcMain.handle('update-trade', async (event, tradeId, updatedTrade) => {
  await ensureDatabaseInitialized();
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Початок оновлення трейду');
      
      const volumeConfirmationJson = JSON.stringify(Array.isArray(updatedTrade.volumeConfirmation) ? updatedTrade.volumeConfirmation : []);
      
      // Update trade
      await new Promise((res, rej) => {
        db.run(
          `UPDATE trades SET 
            date = ?, account = ?, pair = ?, direction = ?, 
            positionType = ?, risk = ?, result = ?, rr = ?, 
            profitLoss = ?, gainedPoints = ?, followingPlan = ?, 
            bestTrade = ?, session = ?, pointA = ?, trigger = ?, 
            volumeConfirmation = ?, entryModel = ?, entryTF = ?, 
            fta = ?, slPosition = ?, score = ?, category = ?, 
            topDownAnalysis = ?, execution = ?, management = ?, 
            conclusion = ?, parentTradeId = ? 
          WHERE id = ?`,
          [
            updatedTrade.date || '',
            updatedTrade.account || '',
            updatedTrade.pair || '',
            updatedTrade.direction || '',
            updatedTrade.positionType || '',
            updatedTrade.risk || '',
            updatedTrade.result || '',
            updatedTrade.rr || '',
            updatedTrade.profitLoss || '',
            updatedTrade.gainedPoints || '',
            updatedTrade.followingPlan ? 1 : 0,
            updatedTrade.bestTrade ? 1 : 0,
            updatedTrade.session || '',
            updatedTrade.pointA || '',
            updatedTrade.trigger || '',
            volumeConfirmationJson,
            updatedTrade.entryModel || '',
            updatedTrade.entryTF || '',
            updatedTrade.fta || '',
            updatedTrade.slPosition || '',
            updatedTrade.score || '',
            updatedTrade.category || '',
            JSON.stringify(updatedTrade.topDownAnalysis) || '[]',
            JSON.stringify(updatedTrade.execution) || '{}',
            JSON.stringify(updatedTrade.management) || '{}',
            JSON.stringify(updatedTrade.conclusion) || '{}',
            updatedTrade.parentTradeId || null,
            tradeId
          ],
          function(err) {
            if (err) rej(err);
            else res();
          }
        );
      });

      // Delete existing notes for this trade
      const existingNotes = await notesDB.getNotesBySource('trade', tradeId);
      for (const note of existingNotes) {
        await notesDB.deleteNote(note.id);
      }

      // Add new notes
      if (updatedTrade.notes && updatedTrade.notes.length > 0) {
        for (const note of updatedTrade.notes) {
          await notesDB.addNote({
            ...note,
            sourceType: 'trade',
            sourceId: tradeId,
            tradeNo: updatedTrade.no,
            tradeDate: updatedTrade.date
          });
        }
      }

      resolve(true);
    } catch (error) {
      console.error('Error updating trade:', error);
      reject(error);
    }
  });
});

ipcMain.handle('get-trades', async () => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    // Додаємо параметризований запит з можливістю сортування
    const query = `
      SELECT * FROM trades 
      ORDER BY 
      CASE 
        WHEN no IS NULL THEN 1 
        ELSE 0 
      END,
      CAST(no AS INTEGER) DESC
    `;
    
    db.all(query, [], async (err, tradeRows) => {
      if (err) {
        console.error('Error fetching trades:', err);
        reject(err);
        return;
      }

      try {
        const trades = tradeRows.map(row => ({
          ...row,
          topDownAnalysis: JSON.parse(row.topDownAnalysis || '[]'),
          execution: JSON.parse(row.execution || '{}'),
          management: JSON.parse(row.management || '{}'),
          conclusion: JSON.parse(row.conclusion || '{}'),
          volumeConfirmation: JSON.parse(row.volumeConfirmation || '[]'),
          notes: [],
        }));

        // Get notes for each trade using notesDB
        for (const trade of trades) {
          const notes = await notesDB.getNotesBySource('trade', trade.id);
          trade.notes = notes || [];
        }

        resolve(trades);
      } catch (error) {
        console.error('Error processing trades:', error);
        reject(error);
      }
    });
  });
});

ipcMain.handle('delete-trade', async (event, tradeId) => {
  await ensureDatabaseInitialized();
  return new Promise(async (resolve, reject) => {
    try {
      // Спочатку видаляємо пов'язані нотатки
      await notesDB.deleteNotesBySource('trade', tradeId);
      
      // Потім видаляємо сам трейд
      await new Promise((resolveDelete, rejectDelete) => {
        db.run('DELETE FROM trades WHERE id = ?', [tradeId], (err) => {
          if (err) {
            rejectDelete(err);
          } else {
            resolveDelete();
          }
        });
      });
      
      resolve(true);
    } catch (error) {
      console.error('Error deleting trade:', error);
      reject(error);
    }
  });
});

ipcMain.handle('save-file', async (event, file) => {
  await ensureDatabaseInitialized();
  const screenshotsPath = path.join(vaultPath, 'screenshots');
  await fs.mkdir(screenshotsPath, { recursive: true });
  const filePath = path.join(screenshotsPath, `${Date.now()}-${file.name}`);
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
  return filePath;
});

ipcMain.handle('save-blob-as-file', async (event, buffer) => {
  await ensureDatabaseInitialized();
  const screenshotsPath = path.join(vaultPath, 'screenshots');
  await fs.mkdir(screenshotsPath, { recursive: true });
  const filePath = path.join(screenshotsPath, `${Date.now()}.png`);
  await fs.writeFile(filePath, Buffer.from(buffer));
  return filePath;
});

ipcMain.handle('save-daily-routine', async (event, routine) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO daily_routines (date, preSession, postSession, emotions, notes) VALUES (?, ?, ?, ?, ?)`,
      [
        routine.date,
        JSON.stringify(routine.preSession || '[]'),
        JSON.stringify(routine.postSession || '[]'),
        JSON.stringify(routine.emotions || '[]'),
        JSON.stringify(routine.notes || ''),
      ],
      (err) => {
        if (err) {
          console.error('Error saving daily routine:', err);
          reject(err);
        } else {
          resolve(true);
        }
      }
    );
  });
});

ipcMain.handle('get-daily-routine', async (event, date) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM daily_routines WHERE date = ?', [date], (err, row) => {
      if (err) {
        console.error('Error fetching daily routine:', err);
        reject(err);
      } else if (row) {
        resolve({
          date: row.date,
          preSession: JSON.parse(row.preSession || '[]'),
          postSession: JSON.parse(row.postSession || '[]'),
          emotions: JSON.parse(row.emotions || '[]'),
          notes: JSON.parse(row.notes || '[]'),
        });
      } else {
        resolve({
          date,
          preSession: [],
          postSession: [],
          emotions: [],
          notes: [],
        });
      }
    });
  });
});

ipcMain.handle('saveNoteWithTrade', async (event, note) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO notes (title, text, tradeId) 
      VALUES (?, ?, ?)
    `;
    
    db.run(query, [note.title, note.text, note.tradeId], function(err) {
      if (err) {
        console.error('Error saving note with trade:', err);
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
});

ipcMain.handle('getAllNoteTags', async () => {
  return await notesDB.getAllTags();
});

ipcMain.handle('addNoteTag', async (event, name) => {
  return await notesDB.addTag(name);
});

ipcMain.handle('addNote', async (event, note) => {
  return await notesDB.addNote(note);
});

ipcMain.handle('updateNote', async (event, note) => {
  return await notesDB.updateNote(note);
});

ipcMain.handle('getNoteById', async (event, id) => {
  return await notesDB.getNoteById(id);
});

ipcMain.handle('getNotesBySource', async (event, sourceType, sourceId) => {
  return await notesDB.getNotesBySource(sourceType, sourceId);
});

ipcMain.handle('updateNotesWithTradeData', async (event, tradeId) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Starting to update notes with trade data for tradeId:', tradeId);
    console.log('Database instance:', db);
    await notesDB.updateNotesWithTradeData(db, tradeId);
    console.log('Notes updated with trade data successfully');
  } catch (error) {
    console.error('Error updating notes with trade data:', error);
    throw error;
  }
});

ipcMain.handle('addNoteImage', async (event, noteId, imagePath) => {
  return await notesDB.addNoteImage(noteId, imagePath);
});

ipcMain.handle('getNoteImages', async (event, noteId) => {
  return await notesDB.getNoteImages(noteId);
});

ipcMain.handle('deleteNoteImage', async (event, imageId) => {
  return await notesDB.deleteNoteImage(imageId);
});

ipcMain.handle('testUpdateNotes', async (event, tradeId) => {
  try {
    await ensureDatabaseInitialized();
    console.log('Testing updateNotesWithTradeData for tradeId:', tradeId);
    await notesDB.updateNotesWithTradeData(db, tradeId);
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Error during test:', error);
  }
});

// Account management handlers
ipcMain.handle('getAllAccounts', async () => {
  try {
    return accountsDB.getAllAccounts();
  } catch (error) {
    console.error('Error getting accounts:', error);
    throw error;
  }
});

ipcMain.handle('addAccount', async (event, account) => {
  try {
    return accountsDB.addAccount(account);
  } catch (error) {
    console.error('Error adding account:', error);
    throw error;
  }
});

ipcMain.handle('updateAccount', async (event, account) => {
  try {
    return accountsDB.updateAccount(account);
  } catch (error) {
    console.error('Error updating account:', error);
    throw error;
  }
});

ipcMain.handle('deleteAccount', async (event, id) => {
  try {
    return accountsDB.deleteAccount(id);
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
});

ipcMain.handle('getAccountById', async (event, id) => {
  await ensureDatabaseInitialized();
  return accountsDB.getAccountById(id);
});

ipcMain.handle('updateAccountBalance', async (event, accountId, profitPercent) => {
  await ensureDatabaseInitialized();
  try {
    const account = await accountsDB.getAccountById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    // Розраховуємо прибуток/збиток в доларах від поточного currentEquity
    const profitAmount = (account.currentEquity * profitPercent) / 100;
    
    // Оновлюємо баланс
    const newBalance = account.balance + profitAmount;
    
    // Оновлюємо акаунт з новим балансом
    const updatedAccount = {
      ...account,
      balance: newBalance
    };

    return await accountsDB.updateAccount(updatedAccount);
  } catch (error) {
    console.error('Error updating account balance:', error);
    throw error;
  }
});

// Execution database handlers
ipcMain.handle('getAllExecutionItems', async (event, section) => {
  try {
    return await executionDB.getAllItems(section);
  } catch (error) {
    console.error('Error getting execution items:', error);
    throw error;
  }
});

ipcMain.handle('addExecutionItem', async (event, section, name) => {
  try {
    return await executionDB.addItem(section, name);
  } catch (error) {
    console.error('Error adding execution item:', error);
    throw error;
  }
});

ipcMain.handle('updateExecutionItem', async (event, section, id, name) => {
  try {
    return await executionDB.updateItem(section, id, name);
  } catch (error) {
    console.error('Error updating execution item:', error);
    throw error;
  }
});

ipcMain.handle('deleteExecutionItem', async (event, section, id) => {
  try {
    return await executionDB.deleteItem(section, id);
  } catch (error) {
    console.error('Error deleting execution item:', error);
    throw error;
  }
});

// Performance analysis handlers
ipcMain.handle('savePerformanceAnalysis', async (event, analysis) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    const {
      id, type, startDate, endDate, weekNumber, monthNumber,
      quarterNumber, year, totalTrades, missedTrades,
      executionCoefficient, winrate, followingPlan,
      narrativeAccuracy, gainedRR, potentialRR, averageRR,
      profit, realisedPL, averagePL, averageLoss
    } = analysis;

    performanceDB.run(`
      INSERT OR REPLACE INTO performance_analysis (
        id, type, startDate, endDate, weekNumber, monthNumber,
        quarterNumber, year, totalTrades, missedTrades,
        executionCoefficient, winrate, followingPlan,
        narrativeAccuracy, gainedRR, potentialRR, averageRR,
        profit, realisedPL, averagePL, averageLoss
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, type, startDate, endDate, weekNumber, monthNumber,
      quarterNumber, year, totalTrades, missedTrades,
      executionCoefficient, winrate, followingPlan,
      narrativeAccuracy, gainedRR, potentialRR, averageRR,
      profit, realisedPL, averagePL, averageLoss
    ], function(err) {
      if (err) {
        console.error('Error saving performance analysis:', err);
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
});

ipcMain.handle('getPerformanceAnalyses', async (event, type) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    performanceDB.all(
      'SELECT * FROM performance_analysis WHERE type = ? ORDER BY startDate DESC',
      [type],
      (err, rows) => {
        if (err) {
          console.error('Error getting performance analyses:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
});

ipcMain.handle('getPerformanceAnalysis', async (event, id) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    performanceDB.get(
      'SELECT * FROM performance_analysis WHERE id = ?',
      [id],
      (err, row) => {
        if (err) {
          console.error('Error getting performance analysis:', err);
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
});

ipcMain.handle('updatePerformanceAnalysis', async (event, id, analysis) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    const {
      type, startDate, endDate, weekNumber, monthNumber,
      quarterNumber, year, totalTrades, missedTrades,
      executionCoefficient, winrate, followingPlan,
      narrativeAccuracy, gainedRR, potentialRR, averageRR,
      profit, realisedPL, averagePL, averageLoss
    } = analysis;

    performanceDB.run(`
      UPDATE performance_analysis SET
        type = ?, startDate = ?, endDate = ?, weekNumber = ?,
        monthNumber = ?, quarterNumber = ?, year = ?,
        totalTrades = ?, missedTrades = ?, executionCoefficient = ?,
        winrate = ?, followingPlan = ?, narrativeAccuracy = ?,
        gainedRR = ?, potentialRR = ?, averageRR = ?,
        profit = ?, realisedPL = ?, averagePL = ?,
        averageLoss = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      type, startDate, endDate, weekNumber, monthNumber,
      quarterNumber, year, totalTrades, missedTrades,
      executionCoefficient, winrate, followingPlan,
      narrativeAccuracy, gainedRR, potentialRR, averageRR,
      profit, realisedPL, averagePL, averageLoss, id
    ], function(err) {
      if (err) {
        console.error('Error updating performance analysis:', err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
});

ipcMain.handle('deletePerformanceAnalysis', async (event, id) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    performanceDB.run(
      'DELETE FROM performance_analysis WHERE id = ?',
      [id],
      (err) => {
        if (err) {
          console.error('Error deleting performance analysis:', err);
          reject(err);
        } else {
          resolve(true);
        }
      }
    );
  });
});

// Pre-session handlers
ipcMain.handle('getPresession', async (event, id) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Getting pre-session by ID:', id);
    const presession = await routinesDB.getPreSessionById(id);
    console.log('Retrieved pre-session:', presession);
    return presession;
  } catch (error) {
    console.error('Error getting pre-session:', error);
    throw error;
  }
});

ipcMain.handle('getAllPresessions', async () => {
  await ensureDatabaseInitialized();
  try {
    console.log('Getting all pre-sessions');
    const presessions = await routinesDB.getAllPreSessions();
    console.log(`Retrieved ${presessions.length} pre-sessions`);
    return presessions;
  } catch (error) {
    console.error('Error getting all pre-sessions:', error);
    throw error;
  }
});

ipcMain.handle('savePresession', async (event, presessionData) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Saving pre-session data:', presessionData);
    console.log('Database path:', routinesDB.dbPath);
    
    let result;
    if (presessionData.id) {
      console.log('Updating existing pre-session with ID:', presessionData.id);
      result = await routinesDB.updatePreSession(presessionData);
    } else {
      console.log('Creating new pre-session');
      result = await routinesDB.addPreSession(presessionData);
    }
    
    console.log('Pre-session saved successfully. Result:', result);
    console.log('Database location:', path.join(app.getPath('documents'), 'TraderWorkspaceVault', 'routines.db'));
    
    return { success: true, id: presessionData.id || result };
  } catch (error) {
    console.error('Error saving pre-session:', error);
    throw error;
  }
});

ipcMain.handle('deletePresession', async (event, id) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Deleting pre-session:', id);
    await routinesDB.deletePreSession(id);
    return true;
  } catch (error) {
    console.error('Error deleting pre-session:', error);
    throw error;
  }
});

ipcMain.handle('app-ready', () => {
  return true;
});

ipcMain.handle('updatePresession', async (event, presessionData) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Updating pre-session data:', presessionData);
    const result = await routinesDB.updatePreSession(presessionData);
    console.log('Pre-session updated successfully');
    return result;
  } catch (error) {
    console.error('Error updating presession:', error);
    throw error;
  }
});

ipcMain.handle('updateNotesWithPresessionData', async (event, presessionId) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Starting to update notes with presession data for presessionId:', presessionId);
    await notesDB.updateNotesWithPresessionData(routinesDB.db, presessionId);
    console.log('Notes updated with presession data successfully');
  } catch (error) {
    console.error('Error updating notes with presession data:', error);
    throw error;
  }
});

// Post-session handlers
ipcMain.handle('addPostSession', async (event, postSession) => {
  await ensureDatabaseInitialized();
  try {
    return await routinesDB.addPostSession(postSession);
  } catch (error) {
    console.error('Error adding post session:', error);
    throw error;
  }
});

ipcMain.handle('updatePostSession', async (event, postSession) => {
  await ensureDatabaseInitialized();
  try {
    return await routinesDB.updatePostSession(postSession);
  } catch (error) {
    console.error('Error updating post session:', error);
    throw error;
  }
});

ipcMain.handle('getPostSessionById', async (event, id) => {
  await ensureDatabaseInitialized();
  try {
    return await routinesDB.getPostSessionById(id);
  } catch (error) {
    console.error('Error getting post session:', error);
    throw error;
  }
});

ipcMain.handle('getAllPostSessions', async () => {
  await ensureDatabaseInitialized();
  try {
    return await routinesDB.getAllPostSessions();
  } catch (error) {
    console.error('Error getting all post sessions:', error);
    throw error;
  }
});