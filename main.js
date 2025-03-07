const { app, BrowserWindow, ipcMain } = require('electron');
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
  const dbPath = path.join(vaultPath, 'trades.db');
  const accountsDbPath = path.join(vaultPath, 'accounts.db');
  const executionDbPath = path.join(vaultPath, 'execution.db');
  const performanceDbPath = path.join(vaultPath, 'performance.db');
  const notesDbPath = path.join(vaultPath, 'notes.db');
  const routinesDbPath = path.join(vaultPath, 'routines.db');
  
  try {
    await fs.mkdir(vaultPath, { recursive: true });
    
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) throw new Error(`Database connection failed: ${err.message}`);
      console.log('SQLite database initialized at:', dbPath);
    });

    // Initialize accounts database
    accountsDB = new AccountsDB(accountsDbPath);
    
    // Initialize execution database
    executionDB = new ExecutionDB(executionDbPath);

    // Initialize performance database
    performanceDB = new sqlite3.Database(performanceDbPath, (err) => {
      if (err) throw new Error(`Performance database connection failed: ${err.message}`);
      console.log('Performance database initialized at:', performanceDbPath);
    });

    // Initialize notes database
    notesDB = new NotesDB(notesDbPath);

    // Initialize routines database
    routinesDB = new RoutinesDB(routinesDbPath);

    await new Promise((resolve, reject) => {
      db.serialize(() => {
        // 1. Створюємо основну таблицю trades
        db.run(`
          CREATE TABLE IF NOT EXISTS trades (
            id TEXT PRIMARY KEY,
            no INTEGER,
            date TEXT,
            account TEXT,
            pair TEXT,
            direction TEXT,
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
            notes TEXT,
            parentTradeId TEXT
          )
        `);

        // 2. Створюємо таблицю learning_notes з правильними полями
        db.run(`
          CREATE TABLE IF NOT EXISTS learning_notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            tradeId TEXT,
            FOREIGN KEY (tradeId) REFERENCES trades(id)
          )
        `);

        // 3. Створюємо таблицю presession
        db.run(`
          CREATE TABLE IF NOT EXISTS presession (
            id TEXT PRIMARY KEY,
            date TEXT NOT NULL,
            pair TEXT,
            narrative TEXT,
            execution TEXT,
            outcome TEXT,
            plan_outcome INTEGER DEFAULT 0,
            forex_factory_news TEXT,
            topDownAnalysis TEXT,
            video_url TEXT,
            plans TEXT,
            chart_processes TEXT,
            mindset_preparation TEXT,
            the_zone TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Перевіряємо чи існує стовпець tradeId
        db.all("PRAGMA table_info(learning_notes)", [], (err, rows) => {
          if (!err) {
            const hasTradeId = rows.some(row => row.name === 'tradeId');
            if (!hasTradeId) {
              db.run("ALTER TABLE learning_notes ADD COLUMN tradeId TEXT REFERENCES trades(id)");
            }
          }
        });

        db.run(`
          CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tradeId TEXT,
            title TEXT,
            text TEXT,
            FOREIGN KEY (tradeId) REFERENCES trades(id)
          )
        `, (err) => {
          if (err) reject(new Error(`Table notes creation failed: ${err.message}`));
        });

        db.run(`
          CREATE TABLE IF NOT EXISTS daily_routines (
            date TEXT PRIMARY KEY,
            preSession TEXT,
            postSession TEXT,
            emotions TEXT,
            notes TEXT
          )
        `, (err) => {
          if (err) reject(new Error(`Table daily_routines creation failed: ${err.message}`));
        });

        // Перевіряємо чи існує стовпець parentTradeId
        db.all("PRAGMA table_info(trades)", [], (err, rows) => {
          if (!err) {
            const hasParentTradeId = rows.some(row => row.name === 'parentTradeId');
            if (!hasParentTradeId) {
              db.run("ALTER TABLE trades ADD COLUMN parentTradeId TEXT");
            }
          }
        });

        resolve();
      });
    });

    // Перенумеровуємо trades після створення всіх таблиць
    await reorderTradeNumbers();

    await new Promise((resolve, reject) => {
      performanceDB.serialize(() => {
        performanceDB.run(`
          CREATE TABLE IF NOT EXISTS performance_analysis (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            startDate TEXT NOT NULL,
            endDate TEXT NOT NULL,
            weekNumber INTEGER,
            monthNumber INTEGER,
            quarterNumber INTEGER,
            year INTEGER,
            totalTrades INTEGER,
            missedTrades INTEGER,
            executionCoefficient REAL,
            winrate REAL,
            followingPlan INTEGER,
            narrativeAccuracy REAL,
            gainedRR REAL,
            potentialRR REAL,
            averageRR REAL,
            profit REAL,
            realisedPL REAL,
            averagePL REAL,
            averageLoss REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) reject(new Error(`Table performance_analysis creation failed: ${err.message}`));
        });
      });
      resolve();
    });

  } catch (error) {
    console.error('Error initializing database:', error);
    throw new Error('Database initialization failed');
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
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    if (note.id) {
      db.run(
        'UPDATE learning_notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [note.title, note.content, note.id],
        function(err) {
          if (err) {
            console.error('Error updating learning note:', err);
            reject(err);
          } else {
            resolve(note.id);
          }
        }
      );
    } else {
      db.run(
        'INSERT INTO learning_notes (title, content) VALUES (?, ?)',
        [note.title, note.content],
        function(err) {
          if (err) {
            console.error('Error creating learning note:', err);
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    }
  });
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
  return new Promise((resolve, reject) => {
    console.log('Початок збереження трейду');
    console.log('volumeConfirmation до перетворення:', trade.volumeConfirmation);
    
    db.get('SELECT MAX(no) as maxNo FROM trades', [], (err, row) => {
      if (err) {
        console.error('Помилка при отриманні maxNo:', err);
        reject(err);
        return;
      }
      
      const nextNo = (row.maxNo || 0) + 1;
      const volumeConfirmationJson = JSON.stringify(Array.isArray(trade.volumeConfirmation) ? trade.volumeConfirmation : []);
      console.log('volumeConfirmation після перетворення в JSON:', volumeConfirmationJson);
      
      db.run(
        `INSERT OR REPLACE INTO trades (
          id, no, date, account, pair, direction, positionType, 
          risk, result, rr, profitLoss, gainedPoints, 
          followingPlan, bestTrade, session, pointA, trigger, 
          volumeConfirmation, entryModel, entryTF, fta, 
          slPosition, score, category, topDownAnalysis, 
          execution, management, conclusion, notes, parentTradeId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          JSON.stringify(trade.notes || []),
          trade.parentTradeId || null
        ],
        async function(err) {
          if (err) {
            console.error('Error saving trade:', err);
            reject(err);
            return;
          }

          // Видаляємо старі нотатки перед додаванням нових
          try {
            await new Promise((resolve, reject) => {
              db.run('DELETE FROM notes WHERE tradeId = ?', [trade.id], (err) => {
                if (err) reject(err);
                else resolve();
              });
            });

            // Додаємо нові нотатки
            if (trade.notes && trade.notes.length > 0) {
              for (const note of trade.notes) {
                await new Promise((resolve, reject) => {
                  db.run(
                    'INSERT INTO notes (tradeId, title, text) VALUES (?, ?, ?)',
                    [trade.id, note.title, note.text],
                    (err) => {
                      if (err) reject(err);
                      else resolve();
                    }
                  );
                });
              }
            }
            
            resolve(true);
          } catch (error) {
            console.error('Error handling notes:', error);
            reject(error);
          }
        }
      );
    });
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

      const trades = tradeRows.map(row => {
        console.log('Отримано трейд з бази даних:', row.id);
        console.log('volumeConfirmation до парсингу:', row.volumeConfirmation);
        const trade = {
          ...row,
          topDownAnalysis: JSON.parse(row.topDownAnalysis || '[]'),
          execution: JSON.parse(row.execution || '{}'),
          management: JSON.parse(row.management || '{}'),
          conclusion: JSON.parse(row.conclusion || '{}'),
          volumeConfirmation: JSON.parse(row.volumeConfirmation || '[]'),
          notes: [],
        };
        console.log('volumeConfirmation після парсингу:', trade.volumeConfirmation);
        return trade;
      });

      if (trades.length === 0) {
        resolve(trades);
        return;
      }

      // Отримуємо нотатки для трейдів
      const tradeIds = trades.map(trade => trade.id);
      db.all(
        'SELECT * FROM notes WHERE tradeId IN (' + tradeIds.map(() => '?').join(',') + ')',
        tradeIds,
        (err, noteRows) => {
          if (err) {
            console.error('Error fetching notes:', err);
            reject(err);
            return;
          }

          trades.forEach(trade => {
            trade.notes = noteRows
              .filter(note => note.tradeId === trade.id)
              .map(note => ({ title: note.title, text: note.text }));
          });
          resolve(trades);
        }
      );
    });
  });
});

ipcMain.handle('update-trade', async (event, tradeId, updatedTrade) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    console.log('Початок оновлення трейду');
    console.log('volumeConfirmation до перетворення:', updatedTrade.volumeConfirmation);
    
    const volumeConfirmationJson = JSON.stringify(Array.isArray(updatedTrade.volumeConfirmation) ? updatedTrade.volumeConfirmation : []);
    console.log('volumeConfirmation після перетворення в JSON:', volumeConfirmationJson);
    
    db.run(
      `UPDATE trades SET 
        date = ?, account = ?, pair = ?, direction = ?, 
        positionType = ?, risk = ?, result = ?, rr = ?, 
        profitLoss = ?, gainedPoints = ?, followingPlan = ?, 
        bestTrade = ?, session = ?, pointA = ?, trigger = ?, 
        volumeConfirmation = ?, entryModel = ?, entryTF = ?, 
        fta = ?, slPosition = ?, score = ?, category = ?, 
        topDownAnalysis = ?, execution = ?, management = ?, 
        conclusion = ?, notes = ?, parentTradeId = ? 
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
        JSON.stringify(updatedTrade.notes) || '[]',
        updatedTrade.parentTradeId || null,
        tradeId,
      ],
      async (err) => {
        if (err) {
          console.error('Error updating trade:', err);
          reject(err);
          return;
        }
        await new Promise((delResolve, delReject) => {
          db.run('DELETE FROM notes WHERE tradeId = ?', [tradeId], (delErr) => {
            if (delErr) delReject(delErr);
            else delResolve();
          });
        });
        if (updatedTrade.notes && updatedTrade.notes.length > 0) {
          for (const note of updatedTrade.notes) {
            await new Promise((noteResolve, noteReject) => {
              db.run(
                'INSERT INTO notes (tradeId, title, text) VALUES (?, ?, ?)',
                [tradeId, note.title, note.text],
                (noteErr) => {
                  if (noteErr) noteReject(noteErr);
                  else noteResolve();
                }
              );
            });
          }
        }
        resolve(true);
      }
    );
  });
});

ipcMain.handle('delete-trade', async (event, tradeId) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM trades WHERE id = ?', [tradeId], (err) => {
      if (err) {
        console.error('Error deleting trade:', err);
        reject(err);
        return;
      }
      db.run('DELETE FROM notes WHERE tradeId = ?', [tradeId], (noteErr) => {
        if (noteErr) reject(noteErr);
        else resolve(true);
      });
    });
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
      INSERT INTO learning_notes (title, content, tradeId) 
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

ipcMain.handle('getAllNotes', async () => {
  return await notesDB.getAllNotes();
});

ipcMain.handle('app-ready', () => {
  return true;
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
        profit, realisedPL, averagePL, averageLoss,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
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
        resolve(id);
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

// Presession handlers
ipcMain.handle('save-presession', async (event, presessionData) => {
  try {
    if (presessionData.id) {
      await routinesDB.updatePreSession(presessionData);
    } else {
      // Генеруємо унікальний ID якщо він не надано
      presessionData.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      await routinesDB.addPreSession(presessionData);
    }
    return { success: true, id: presessionData.id };
  } catch (error) {
    console.error('Error saving pre-session:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-presession', async (event, id) => {
  try {
    const preSession = await routinesDB.getPreSessionById(id);
    return preSession;
  } catch (error) {
    console.error('Error getting pre-session:', error);
    return null;
  }
});

ipcMain.handle('get-all-presessions', async () => {
  try {
    const preSessions = await routinesDB.getAllPreSessions();
    return preSessions;
  } catch (error) {
    console.error('Error getting all pre-sessions:', error);
    return [];
  }
});

ipcMain.handle('delete-presession', async (event, id) => {
  try {
    await routinesDB.deletePreSession(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting pre-session:', error);
    return { success: false, error: error.message };
  }
});

// Notes handlers
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
    await notesDB.updateNotesWithTradeData(db, tradeId);
    console.log('Notes updated with trade data successfully');
  } catch (error) {
    console.error('Error updating notes with trade data:', error);
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