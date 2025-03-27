const electron = require('electron');
const { app, BrowserWindow, ipcMain, dialog, shell } = electron;
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const fsSync = require('fs');
const AccountsDB = require('./src/database/accountsDB');
const ExecutionDB = require('./src/database/executionDB');
const NotesDB = require('./src/database/notesDB');
const RoutinesDB = require('./src/database/routinesDB');
const PerformanceDB = require('./src/database/performanceDB');
const { migrateDatabase } = require('./migration');
const STERDB = require('./src/database/sterDB');
const DemonsDB = require('./src/database/demonsDB');
const isDev = process.env.NODE_ENV === 'development';

let db = null;
let accountsDB = null;
let executionDB = null;
let performanceDB = null;
let vaultPath = null;
let mainWindow = null;
let notesDB;
let routinesDB;
let sterDB = null;
let demonsDB = null;

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
  const sterDbPath = path.join(vaultPath, 'ster.db');
  const demonsDbPath = path.join(vaultPath, 'demons.db');
  
  console.log('Database paths:');
  console.log('- trades.db:', dbPath);
  console.log('- accounts.db:', accountsDbPath);
  console.log('- execution.db:', executionDbPath);
  console.log('- performance.db:', performanceDbPath);
  console.log('- notes.db:', notesDbPath);
  console.log('- routines.db:', routinesDbPath);
  console.log('- ster.db:', sterDbPath);
  console.log('- demons.db:', demonsDbPath);
  
  try {
    await fs.mkdir(vaultPath, { recursive: true });
    console.log('Vault directory created/verified');
    
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error connecting to trades database:', err);
      } else {
        console.log('trades.db initialized successfully');
        
        // Створюємо таблицю trades, якщо вона не існує
        db.run(`
          CREATE TABLE IF NOT EXISTS trades (
            id TEXT PRIMARY KEY,
            no INTEGER,
            date TEXT,
            pair TEXT,
            direction TEXT,
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
            presession_id TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            console.error('Error creating trades table:', err);
          } else {
            console.log('Trades table created/verified successfully');
            
            // Виконуємо міграцію для видалення непотрібних колонок
            migrateDatabase()
              .then(() => console.log('Database migration completed successfully'))
              .catch(err => console.error('Error during database migration:', err));
          }
        });
      }
    });

    // Initialize accounts database
    accountsDB = new AccountsDB(accountsDbPath);
    
    // Initialize execution database
    console.log('Initializing execution database at:', executionDbPath);
    executionDB = new ExecutionDB(executionDbPath);
    console.log('Execution database initialized successfully');

    // Initialize performance database
    performanceDB = new PerformanceDB(performanceDbPath);

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

    // Initialize STER database
    sterDB = new STERDB(sterDbPath);
    console.log('ster.db initialized at:', sterDbPath);

    // Initialize demons database
    demonsDB = new DemonsDB(demonsDbPath);
    console.log('demons.db initialized at:', demonsDbPath);

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

// Додаємо функцію для перевірки вмісту бази даних execution перед збереженням трейду
async function checkExecutionDBContent() {
  const userDataPath = app.getPath('userData');
  const executionDBPath = path.join(userDataPath, 'execution.db');
  
  if (!fsSync.existsSync(executionDBPath)) {
    console.log('Execution database does not exist, nothing to check');
    return;
  }
  
  // Переконуємося, що база даних ініціалізована
  await ensureDatabaseInitialized();
  
  console.log('Using executionDB instance from global variable for checking content');
  
  try {
    // Перевіряємо вміст таблиці pointA
    const pointAItems = await executionDB.getAllItems('pointA');
    console.log('pointA items:', JSON.stringify(pointAItems, null, 2));
    
    // Конкретно перевіряємо елемент RB
    const rbItem = await executionDB.getItemByName('pointA', 'RB');
    console.log('RB item details:', rbItem ? JSON.stringify(rbItem, null, 2) : 'Not found');
  } catch (error) {
    console.error('Error checking execution DB content:', error);
  }
}

// Додаємо перевірку перед збереженням трейду
ipcMain.handle('save-trade', async (event, trade) => {
  await ensureDatabaseInitialized();
  
  console.log('Saving trade with data:', JSON.stringify({
    id: trade.id,
    no: trade.no,
    pointA: trade.pointA,
    trigger: trade.trigger,
    result: trade.result
  }, null, 2));
  
  // Перевіряємо вміст бази даних execution перед збереженням
  await checkExecutionDBContent();
  
  // Присвоюємо номер трейду, якщо він відсутній
  if (!trade.no) {
    // Знаходимо максимальний номер трейду
    const maxTradeNoResult = await new Promise((resolve, reject) => {
      db.get('SELECT MAX(no) as maxNo FROM trades', [], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    
    // Визначаємо новий номер трейду
    const nextTradeNo = maxTradeNoResult.maxNo ? maxTradeNoResult.maxNo + 1 : 1;
    trade.no = nextTradeNo;
    console.log(`Assigned new trade number: ${trade.no}`);
  }
  
  // Генеруємо ID для трейду, якщо його немає
  if (!trade.id) {
    trade.id = `trade_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    console.log(`Generated new trade ID: ${trade.id}`);
  }
  
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO trades (
        id, no, date, pair, direction, session, positionType, risk, result,
        pointA, trigger, volumeConfirmation, entryModel, entryTF, fta, slPosition,
        topDownAnalysis, execution, management, conclusion, presession_id,
        rr, profitLoss, gainedPoints, followingPlan, bestTrade, score, parentTradeId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        trade.id,
        trade.no,
        trade.date,
        trade.pair,
        trade.direction,
        trade.session,
        trade.positionType,
        trade.risk,
        trade.result,
        trade.pointA,
        trade.trigger,
        JSON.stringify(trade.volumeConfirmation || []),
        trade.entryModel,
        trade.entryTF,
        trade.fta,
        trade.slPosition,
        JSON.stringify(trade.topDownAnalysis || []),
        JSON.stringify(trade.execution || {}),
        JSON.stringify(trade.management || {}),
        JSON.stringify(trade.conclusion || {}),
        trade.presession_id,
        trade.rr,
        trade.profitLoss,
        trade.gainedPoints,
        trade.followingPlan,
        trade.bestTrade,
        trade.score,
        trade.parentTradeId
      ],
      async function(err) {
        if (err) {
          console.error('Error saving trade:', err);
          reject(err);
        } else {
          console.log(`Trade saved successfully in database with ID: ${trade.id}`);
          
          try {
            // Головна проблема! Необхідно зачекати завершення виклику updateExecutionTradesData
            // перш ніж повертати результат
            console.log('Starting execution DB update for new trade');
            
            // КРИТИЧНА ЗМІНА #1: Переконуємося, що volumeConfirmation є масивом перед оновленням execution DB
            if (trade.volumeConfirmation && typeof trade.volumeConfirmation === 'string') {
              try {
                trade.volumeConfirmation = JSON.parse(trade.volumeConfirmation);
              } catch (e) {
                trade.volumeConfirmation = [];
              }
            }
            
            // Переконуємося, що executionDB ініціалізована
            await ensureDatabaseInitialized();
            
            if (!executionDB) {
              console.error('ERROR: executionDB is not initialized!');
              throw new Error('ExecutionDB is not initialized');
            }
            
            console.log('Using initialized global executionDB instance:', executionDB != null);
            
            // Оновлюємо трейд в базі даних execution
            await updateExecutionTradesData(trade);
            console.log('Execution DB update completed for new trade');
          } catch (error) {
            console.error('Error updating execution data:', error);
            // Навіть якщо оновлення execution failed, ми все ще хочемо повернути успішний результат
            // оскільки трейд був збережений в основній базі даних
          }
          
          resolve({
            id: trade.id,
            no: trade.no
          });
        }
      }
    );
  });
});

ipcMain.handle('update-trade', async (event, tradeId, updatedTrade) => {
  await ensureDatabaseInitialized();
  
  console.log(`Updating trade with ID: ${tradeId}, updated data:`, JSON.stringify({
    id: updatedTrade.id,
    no: updatedTrade.no,
    pointA: updatedTrade.pointA,
    trigger: updatedTrade.trigger,
    result: updatedTrade.result
  }, null, 2));
  
  // Спочатку отримуємо поточні дані трейду для порівняння
  const currentTrade = await new Promise((resolve, reject) => {
    db.get('SELECT * FROM trades WHERE id = ?', [tradeId], (err, trade) => {
      if (err) {
        reject(err);
      } else {
        if (trade && trade.volumeConfirmation) {
          try {
            trade.volumeConfirmation = JSON.parse(trade.volumeConfirmation);
          } catch (e) {
            trade.volumeConfirmation = [];
          }
        }
        resolve(trade);
      }
    });
  });
  
  if (!currentTrade) {
    throw new Error(`Trade with ID ${tradeId} not found`);
  }
  
  console.log(`Current trade data:`, JSON.stringify({
    id: currentTrade.id,
    no: currentTrade.no,
    pointA: currentTrade.pointA,
    trigger: currentTrade.trigger,
    result: currentTrade.result
  }, null, 2));
  
  // Перевіряємо volumeConfirmation у оновленому трейді
  if (updatedTrade.volumeConfirmation && typeof updatedTrade.volumeConfirmation === 'string') {
    try {
      updatedTrade.volumeConfirmation = JSON.parse(updatedTrade.volumeConfirmation);
    } catch (e) {
      updatedTrade.volumeConfirmation = [];
    }
  }
  
  // Якщо дані елементів виконання змінилися, видалимо старі записи
  if (currentTrade.pointA !== updatedTrade.pointA || 
      currentTrade.trigger !== updatedTrade.trigger ||
      currentTrade.entryModel !== updatedTrade.entryModel ||
      currentTrade.entryTF !== updatedTrade.entryTF ||
      currentTrade.fta !== updatedTrade.fta ||
      currentTrade.slPosition !== updatedTrade.slPosition ||
      currentTrade.pair !== updatedTrade.pair ||
      currentTrade.direction !== updatedTrade.direction ||
      currentTrade.session !== updatedTrade.session ||
      currentTrade.positionType !== updatedTrade.positionType ||
      JSON.stringify(currentTrade.volumeConfirmation) !== JSON.stringify(updatedTrade.volumeConfirmation)) {
    
    console.log('Execution parameters changed, removing old data');
    // Видаляємо старі дані із execution DB
    try {
      await updateExecutionTradesData({...currentTrade, id: tradeId}, true);
    } catch (error) {
      console.error('Error removing old execution data:', error);
    }
  } else {
    console.log('No execution parameters changed, skipping removal of old data');
  }
  
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE trades SET 
        no = ?, date = ?, pair = ?, direction = ?, session = ?, positionType = ?, 
        risk = ?, result = ?, pointA = ?, trigger = ?, volumeConfirmation = ?, 
        entryModel = ?, entryTF = ?, fta = ?, slPosition = ?, 
        topDownAnalysis = ?, execution = ?, management = ?, conclusion = ?, 
        presession_id = ?, rr = ?, profitLoss = ?, gainedPoints = ?, 
        followingPlan = ?, bestTrade = ?, score = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        updatedTrade.no,
        updatedTrade.date,
        updatedTrade.pair,
        updatedTrade.direction,
        updatedTrade.session,
        updatedTrade.positionType,
        updatedTrade.risk,
        updatedTrade.result,
        updatedTrade.pointA,
        updatedTrade.trigger,
        JSON.stringify(updatedTrade.volumeConfirmation || []),
        updatedTrade.entryModel,
        updatedTrade.entryTF,
        updatedTrade.fta,
        updatedTrade.slPosition,
        JSON.stringify(updatedTrade.topDownAnalysis || []),
        JSON.stringify(updatedTrade.execution || {}),
        JSON.stringify(updatedTrade.management || {}),
        JSON.stringify(updatedTrade.conclusion || {}),
        updatedTrade.presession_id,
        updatedTrade.rr,
        updatedTrade.profitLoss,
        updatedTrade.gainedPoints,
        updatedTrade.followingPlan,
        updatedTrade.bestTrade,
        updatedTrade.score,
        tradeId
      ],
      async function(err) {
        if (err) {
          console.error('Error updating trade:', err);
          reject(err);
        } else {
          console.log(`Trade updated successfully in database with ID: ${tradeId}`);
          // Оновлюємо дані в execution DB
          try {
            // Додаємо id до оновленого трейду
            updatedTrade.id = tradeId;
            console.log('Starting execution DB update for updated trade');
            
            // Ручне оновлення запису pointA якщо необхідно
            if (updatedTrade.pointA) {
              console.log(`Запускаємо ручне оновлення для pointA = "${updatedTrade.pointA}"`);
              const userDataPath = app.getPath('userData');
              const executionDBPath = path.join(userDataPath, 'execution.db');
              
              if (fsSync.existsSync(executionDBPath)) {
                const manualDb = new sqlite3.Database(executionDBPath);
                
                try {
                  // Отримуємо поточний запис
                  const row = await new Promise((resolveQuery, rejectQuery) => {
                    manualDb.get(`SELECT * FROM pointA WHERE name = ?`, [updatedTrade.pointA], (err, row) => {
                      if (err) {
                        console.error(`Помилка при запиті до pointA для "${updatedTrade.pointA}":`, err);
                        rejectQuery(err);
                      } else {
                        resolveQuery(row);
                      }
                    });
                  });
                  
                  if (row) {
                    console.log(`Знайдено запис у pointA для "${updatedTrade.pointA}":`, row);
                    
                    // Розбираємо масив trades
                    let tradesArray = [];
                    try {
                      tradesArray = JSON.parse(row.trades || '[]');
                    } catch (e) {
                      console.error('Помилка при розборі масиву trades:', e);
                      tradesArray = [];
                    }
                    
                    console.log(`Поточний масив trades:`, tradesArray);
                    
                    // Створюємо запис для трейду
                    const tradeData = {
                      id: updatedTrade.id,
                      result: updatedTrade.result
                    };
                    
                    // Перевіряємо, чи існує вже цей трейд
                    const existingIndex = tradesArray.findIndex(t => t.id === updatedTrade.id);
                    if (existingIndex !== -1) {
                      tradesArray[existingIndex] = tradeData;
                      console.log(`Трейд з id ${updatedTrade.id} оновлено у масиві`);
                    } else {
                      tradesArray.push(tradeData);
                      console.log(`Трейд з id ${updatedTrade.id} додано до масиву`);
                    }
                    
                    console.log(`Оновлений масив trades:`, tradesArray);
                    
                    // Оновлюємо запис в базі даних
                    await new Promise((resolveUpdate, rejectUpdate) => {
                      manualDb.run(
                        `UPDATE pointA SET trades = ? WHERE name = ?`,
                        [JSON.stringify(tradesArray), updatedTrade.pointA],
                        function(err) {
                          if (err) {
                            console.error(`Помилка при оновленні pointA для "${updatedTrade.pointA}":`, err);
                            rejectUpdate(err);
                          } else {
                            console.log(`Успішно оновлено pointA для "${updatedTrade.pointA}", змінено ${this.changes} рядків`);
                            resolveUpdate();
                          }
                        }
                      );
                    });
                  } else {
                    console.error(`Запис pointA для "${updatedTrade.pointA}" не знайдено!`);
                  }
                } catch (manualError) {
                  console.error('Помилка при ручному оновленні pointA:', manualError);
                } finally {
                  manualDb.close();
                }
              }
            }
            
            // Після ручного оновлення викликаємо стандартну функцію оновлення
            await updateExecutionTradesData(updatedTrade);
            console.log('Execution DB update completed for updated trade');
          } catch (error) {
            console.error('Error updating execution data:', error);
          }
          
          resolve({
            id: tradeId,
            no: updatedTrade.no
          });
        }
      }
    );
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
  
  console.log(`Deleting trade with ID: ${tradeId}`);
  
  try {
    // Отримуємо дані трейду перед видаленням
    const tradeToDelete = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM trades WHERE id = ?', [tradeId], (err, trade) => {
        if (err) {
          reject(err);
        } else {
          if (trade && trade.volumeConfirmation) {
            try {
              trade.volumeConfirmation = JSON.parse(trade.volumeConfirmation);
            } catch (e) {
              trade.volumeConfirmation = [];
            }
          }
          resolve(trade);
        }
      });
    });
    
    if (!tradeToDelete) {
      throw new Error(`Trade with ID ${tradeId} not found`);
    }
    
    console.log(`Found trade to delete:`, JSON.stringify({
      id: tradeToDelete.id,
      no: tradeToDelete.no,
      pointA: tradeToDelete.pointA,
      result: tradeToDelete.result
    }, null, 2));
    
    // Використовуємо глобальну змінну executionDB для видалення трейду з усіх таблиць
    if (executionDB) {
      console.log(`Використовуємо глобальну змінну executionDB для видалення трейду`);
      
      // Визначаємо секції
      const sections = [
        { name: 'pointA', value: tradeToDelete.pointA },
        { name: 'trigger', value: tradeToDelete.trigger },
        { name: 'pointB', value: tradeToDelete.pointB },
        { name: 'entryModel', value: tradeToDelete.entryModel },
        { name: 'entryTF', value: tradeToDelete.entryTF },
        { name: 'fta', value: tradeToDelete.fta },
        { name: 'slPosition', value: tradeToDelete.slPosition },
        { name: 'pairs', value: tradeToDelete.pair },
        { name: 'directions', value: tradeToDelete.direction },
        { name: 'sessions', value: tradeToDelete.session },
        { name: 'positionType', value: tradeToDelete.positionType }
      ];
      
      // Видаляємо трейд з усіх таблиць
      for (const section of sections) {
        if (section.value) {
          try {
            await executionDB.removeTradeFromItem(section.name, section.value, tradeId);
            console.log(`Трейд ${tradeId} видалено з елемента ${section.name}/${section.value}`);
          } catch (error) {
            console.error(`Помилка при видаленні трейду з ${section.name}/${section.value}:`, error);
          }
        }
      }
      
      // Обробка volumeConfirmation, який може бути масивом
      if (tradeToDelete.volumeConfirmation) {
        if (Array.isArray(tradeToDelete.volumeConfirmation)) {
          for (const item of tradeToDelete.volumeConfirmation) {
            if (item) {
              try {
                await executionDB.removeTradeFromItem('volumeConfirmation', item, tradeId);
                console.log(`Трейд ${tradeId} видалено з елемента volumeConfirmation/${item}`);
              } catch (error) {
                console.error(`Помилка при видаленні трейду з volumeConfirmation/${item}:`, error);
              }
            }
          }
        } else if (typeof tradeToDelete.volumeConfirmation === 'string') {
          try {
            await executionDB.removeTradeFromItem('volumeConfirmation', tradeToDelete.volumeConfirmation, tradeId);
            console.log(`Трейд ${tradeId} видалено з елемента volumeConfirmation/${tradeToDelete.volumeConfirmation}`);
          } catch (error) {
            console.error(`Помилка при видаленні трейду з volumeConfirmation/${tradeToDelete.volumeConfirmation}:`, error);
          }
        }
      }
    } else {
      // Якщо глобальна змінна не доступна, все одно спробуємо видалити за допомогою функції
      await updateExecutionTradesData({...tradeToDelete, id: tradeId}, true);
      console.log('Використано функцію updateExecutionTradesData для видалення трейду з execution DB');
    }
    
    // Видаляємо трейд з основної бази даних
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM trades WHERE id = ?', [tradeId], function(err) {
        if (err) {
          console.error('Error deleting trade:', err);
          reject(err);
        } else {
          console.log(`Successfully deleted trade with ID ${tradeId}`);
          resolve();
        }
      });
    });
    
    // Повертаємо успішний результат
    return { success: true, message: `Trade with ID ${tradeId} successfully deleted` };
  } catch (error) {
    console.error(`Error deleting trade with ID ${tradeId}:`, error);
    throw error;
  }
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
  try {
    console.log('Received note data:', note);

    // Перевірка та встановлення обов'язкових полів
    if (!note.source_type) {
      console.warn('No source_type provided, defaulting to "trade"');
      note.source_type = 'trade'; // Значення за замовчуванням
    }
    
    if (!note.source_id) {
      console.warn('No source_id provided, setting to empty string');
      note.source_id = ''; // Порожній рядок як значення за замовчуванням
    }

    // Перевірка наявності обов'язкових полів
    if (!note.title || !note.content) {
      console.error('Missing required fields:', { title: note.title, content: note.content });
      throw new Error('Title and content are required');
    }

    // Додаткова перевірка та встановлення тегу
    let tagId = note.tagId || note.tag_id;
    if (!tagId && note.tag_name) {
      // Якщо тег вказаний за назвою, але немає ID, спробуємо знайти або створити
      const existingTag = await new Promise((resolve, reject) => {
        notesDB.db.get('SELECT id FROM note_tags WHERE name = ?', [note.tag_name], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (existingTag) {
        tagId = existingTag.id;
      } else {
        // Створюємо новий тег, якщо не існує
        tagId = await notesDB.addTag(note.tag_name);
      }
    }

    // Підготовка даних для додавання
    const noteToAdd = {
      title: note.title,
      content: note.content || note.text,
      source_type: note.source_type,
      source_id: note.source_id,
      tagId: tagId,
      tradeNo: note.tradeNo || note.trade_no,
      tradeDate: note.tradeDate || note.trade_date
    };

    console.log('Note to add:', noteToAdd);

    // Додаємо нотатку
    const noteId = await notesDB.addNote(noteToAdd);

    // Зберігаємо зображення
    if (note.images && note.images.length > 0) {
      for (const image of note.images) {
        if (!image.id) {
          // Якщо це base64 або локальний шлях, зберігаємо як файл
          let imagePath = image.image_path;
          if (image.image_path.startsWith('data:') || !image.image_path.includes('screenshots')) {
            const buffer = image.image_path.startsWith('data:') 
              ? Buffer.from(image.image_path.split(',')[1], 'base64')
              : await require('fs').promises.readFile(image.image_path);
            
            imagePath = await ipcMain.invoke('save-blob-as-file', buffer);
          }
          
          await notesDB.addNoteImage(noteId, imagePath);
        }
      }
    }

    console.log('Note added successfully with ID:', noteId);
    return noteId;
  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
});

ipcMain.handle('updateNote', async (event, note) => {
  try {
    console.log('[main.js] Оновлення нотатки:', note);
    console.log('[main.js] ID нотатки:', note.id);
    
    // Базова перевірка параметрів
    if (!note || !note.id) {
      console.error('[main.js] ID нотатки відсутній');
      throw new Error('Note ID is required for update');
    }
    
    // Перевіряємо чи існує нотатка в базі даних перед оновленням
    try {
      const existingNote = await notesDB.getNoteById(note.id);
      if (!existingNote) {
        console.error(`[main.js] Нотатка з ID=${note.id} не знайдена в базі даних`);
        
        // Якщо нотатка не знайдена, але ми маємо достатньо даних, створимо нову нотатку зі збереженням ID
        if (note.title && (note.content || note.text)) {
          console.log(`[main.js] Створення нової нотатки з ID=${note.id}`);
          
          // Створюємо SQL запит для додавання нотатки із заданим ID
          const insertResult = await new Promise((resolve, reject) => {
            const sql = `
              INSERT INTO notes (
                id, title, content, tag_id, source_type, source_id, 
                trade_no, trade_date, created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `;
            
            const params = [
              note.id,
              note.title,
              note.content || note.text || '',
              note.tagId || note.tag_id || null,
              note.source_type || note.sourceType || 'trade',
              note.source_id || note.sourceId || '',
              note.trade_no || note.tradeNo || null,
              note.trade_date || note.tradeDate || null
            ];
            
            notesDB.db.run(sql, params, function(err) {
              if (err) {
                console.error('[main.js] Помилка створення нотатки зі збереженням ID:', err);
                reject(err);
              } else {
                console.log(`[main.js] Нотатка створена з ID=${note.id}`);
                resolve(true);
              }
            });
          });
          
          // Перевіряємо результат створення нотатки
          if (!insertResult) {
            throw new Error(`Failed to create note with ID=${note.id}`);
          }
          
          // Отримуємо створену нотатку
          const createdNote = await notesDB.getNoteById(note.id);
          return createdNote;
        } else {
          throw new Error(`Note with ID=${note.id} not found and cannot be created due to missing data`);
        }
      }
      
      // Якщо нотатка існує, оновлюємо її
      console.log(`[main.js] Нотатка з ID=${note.id} знайдена, оновлюємо її`);
      await notesDB.updateNote(note);
      
      // Повертаємо оновлену нотатку
      const updatedNote = await notesDB.getNoteById(note.id);
      return updatedNote;
      
    } catch (checkError) {
      console.error('[main.js] Помилка при перевірці існування нотатки:', checkError);
      throw checkError;
    }
  } catch (error) {
    console.error('[main.js] Помилка оновлення нотатки:', error);
    throw error;
  }
});

ipcMain.handle('getNoteById', async (event, id) => {
  return await notesDB.getNoteById(id);
});

ipcMain.handle('getNotesBySource', async (event, sourceType, sourceId) => {
  try {
    console.log(`[main.js] Отримую нотатки для sourceType=${sourceType}, sourceId=${sourceId}`);
    const notes = await notesDB.getNotesBySource(sourceType, sourceId);
    console.log(`[main.js] Отримано ${notes.length} нотаток`);
    
    // Додаємо зображення до кожної нотатки
    const notesWithImages = await Promise.all(notes.map(async (note) => {
      try {
        console.log(`[main.js] Завантаження зображень для нотатки ID=${note.id}`);
        
        // Якщо нотатка вже має зображення від SQL запиту, обробляємо їх
        if (note.images && note.images.length > 0) {
          console.log(`[main.js] Знайдено ${note.images.length} зображень у нотатці з SQL запиту`);
          
          // Обробляємо наявні зображення
          const processedImages = await Promise.all(note.images.map(async (image) => {
            const screenshotsPath = path.join(app.getPath('documents'), 'TraderWorkspaceVault', 'screenshots');
            
            // Якщо шлях не є абсолютним, додаємо повний шлях
            let imagePath = image.image_path;
            if (!path.isAbsolute(imagePath)) {
              imagePath = path.join(screenshotsPath, path.basename(imagePath));
            }
            
            // Перевіряємо чи файл існує
            try {
              await fs.access(imagePath);
              console.log(`[main.js] Файл існує: ${imagePath}`);
              return {
                ...image,
                image_path: imagePath
              };
            } catch (fileError) {
              // Спробуємо пошукати файл в директорії screenshots з використанням тільки базового імені
              try {
                const baseFilename = path.basename(imagePath);
                const alternativePath = path.join(screenshotsPath, baseFilename);
                await fs.access(alternativePath);
                console.log(`[main.js] Знайдено альтернативний шлях: ${alternativePath}`);
                return {
                  ...image,
                  image_path: alternativePath
                };
              } catch (altError) {
                console.warn(`[main.js] Зображення не знайдено: ${imagePath}`);
                return {
                  ...image,
                  image_path: imagePath
                };
              }
            }
          }));
          
          return {
            ...note,
            images: processedImages
          };
        } else {
          // Якщо нотатка не має зображень від SQL запиту, отримуємо їх окремо
          console.log(`[main.js] Немає зображень у SQL запиті, отримую з getNoteImages`);
          const images = await notesDB.getNoteImages(note.id);
          
          if (images && images.length > 0) {
            console.log(`[main.js] Знайдено ${images.length} зображень через getNoteImages`);
            
            // Обробляємо зображення отримані через getNoteImages
            const processedImages = await Promise.all(images.map(async (image) => {
              const screenshotsPath = path.join(app.getPath('documents'), 'TraderWorkspaceVault', 'screenshots');
              
              // Нормалізуємо шлях до зображення
              let imagePath = image.image_path;
              if (!path.isAbsolute(imagePath)) {
                imagePath = path.join(screenshotsPath, path.basename(imagePath));
              }
              
              // Перевіряємо чи файл існує
              try {
                await fs.access(imagePath);
                return {
                  ...image,
                  image_path: imagePath
                };
              } catch (fileError) {
                console.warn(`[main.js] Зображення не знайдено: ${imagePath}`);
                return {
                  ...image,
                  image_path: imagePath
                };
              }
            }));
            
            return {
              ...note,
              images: processedImages
            };
          }
        }
        
        return note;
      } catch (imageError) {
        console.error(`[main.js] Помилка при обробці зображень для нотатки ${note.id}:`, imageError);
        return note;
      }
    }));
    
    return notesWithImages;
  } catch (error) {
    console.error('[main.js] Помилка отримання нотаток за джерелом:', error);
    throw error;
  }
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

ipcMain.handle('addNoteImage', async (event, noteId, imagePath, comment) => {
  try {
    console.log('Додавання зображення до нотатки ID:', noteId);
    console.log('Шлях до зображення:', imagePath);
    console.log('Коментар до зображення:', comment);
    
    // Перевіряємо, чи існує нотатка
    const note = await notesDB.getNoteById(noteId);
    if (!note) {
      throw new Error(`Нотатка з ID=${noteId} не знайдена`);
    }
    
    // Додаємо зображення до нотатки
    const imageId = await notesDB.addNoteImage(noteId, imagePath, comment);
    console.log('Зображення додано з ID:', imageId);
    return imageId;
  } catch (error) {
    console.error('Помилка додавання зображення:', error);
    throw error;
  }
});

ipcMain.handle('getNoteImages', async (event, noteId) => {
  try {
    console.log('Отримання зображень для нотатки ID:', noteId);
    
    // Перевіряємо, чи існує нотатка
    const note = await notesDB.getNoteById(noteId);
    if (!note) {
      console.warn(`Нотатка з ID=${noteId} не знайдена`);
      return [];
    }
    
    // Отримуємо зображення для нотатки
    const images = await notesDB.getNoteImages(noteId);
    console.log(`Знайдено ${images.length} зображень для нотатки ID=${noteId}`);
    
    // Перетворюємо відносні шляхи на абсолютні
    const screenshotsPath = path.join(app.getPath('documents'), 'TraderWorkspaceVault', 'screenshots');
    
    const processedImages = images.map(img => {
      // Якщо шлях вже містить повний шлях або це base64, залишаємо як є
      if (img.image_path.startsWith('data:') || 
          img.image_path.includes('://') || 
          path.isAbsolute(img.image_path)) {
        return {
          ...img,
          fullImagePath: img.image_path
        };
      }
      
      // Інакше додаємо шлях до папки screenshots
      return {
        ...img,
        fullImagePath: path.join(screenshotsPath, img.image_path)
      };
    });
    
    return processedImages;
  } catch (error) {
    console.error('Помилка отримання зображень нотатки:', error);
    throw error;
  }
});

ipcMain.handle('deleteNoteImage', async (event, imageId) => {
  try {
    console.log('Видалення зображення з ID:', imageId);
    await notesDB.deleteNoteImage(imageId);
    return true;
  } catch (error) {
    console.error('Помилка видалення зображення:', error);
    throw error;
  }
});

ipcMain.handle('updateNoteImageComment', async (event, imageId, comment) => {
  try {
    console.log('Оновлення коментаря для зображення з ID:', imageId, comment);
    await notesDB.updateNoteImageComment(imageId, comment);
    return true;
  } catch (error) {
    console.error('Помилка оновлення коментаря до зображення:', error);
    throw error;
  }
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
  try {
    console.log('Saving performance analysis:', analysis);
    const result = await performanceDB.savePerformanceAnalysis(analysis);
    
    // Якщо є трейди, додаємо їх до аналізу
    if (analysis.trades && analysis.trades.length > 0) {
      for (const tradeId of analysis.trades) {
        await performanceDB.addTradeToPerformance(analysis.id, tradeId);
      }
    }
    
    // Якщо є пресесії, додаємо їх до аналізу
    if (analysis.routines && analysis.routines.length > 0) {
      for (const routine of analysis.routines) {
        await performanceDB.addRoutineToPerformance(analysis.id, routine.id, routine.type);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error saving performance analysis:', error);
    throw error;
  }
});

ipcMain.handle('getPerformanceAnalyses', async (event, type) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Getting performance analyses of type:', type);
    const analyses = await performanceDB.getPerformanceAnalyses(type);
    return analyses;
  } catch (error) {
    console.error('Error getting performance analyses:', error);
    throw error;
  }
});

ipcMain.handle('getPerformanceAnalysis', async (event, id) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Getting performance analysis by ID:', id);
    const analysis = await performanceDB.getPerformanceAnalysis(id);
    
    // Отримуємо пов'язані трейди
    const tradeIds = await performanceDB.getTradesForPerformance(id);
    analysis.trades = [];
    
    if (tradeIds && tradeIds.length > 0) {
      for (const tradeId of tradeIds) {
        const trade = await new Promise((resolve, reject) => {
          db.get('SELECT * FROM trades WHERE id = ?', [tradeId], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });
        if (trade) analysis.trades.push(trade);
      }
    }
    
    // Отримуємо пов'язані пресесії
    const routines = await performanceDB.getRoutinesForPerformance(id);
    analysis.routines = [];
    
    if (routines && routines.length > 0) {
      for (const routine of routines) {
        if (routine.routine_type === 'presession') {
          const presession = await routinesDB.getPreSessionById(routine.routine_id);
          if (presession) analysis.routines.push({...presession, type: 'presession'});
        }
      }
    }
    
    return analysis;
  } catch (error) {
    console.error('Error getting performance analysis:', error);
    throw error;
  }
});

ipcMain.handle('updatePerformanceAnalysis', async (event, id, analysis) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Updating performance analysis:', id, analysis);
    const result = await performanceDB.updatePerformanceAnalysis(id, analysis);
    return result;
  } catch (error) {
    console.error('Error updating performance analysis:', error);
    throw error;
  }
});

ipcMain.handle('deletePerformanceAnalysis', async (event, id) => {
  await ensureDatabaseInitialized();
  try {
    console.log('Deleting performance analysis:', id);
    const result = await performanceDB.deletePerformanceAnalysis(id);
    return result;
  } catch (error) {
    console.error('Error deleting performance analysis:', error);
    throw error;
  }
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

// STER Assessment handlers
ipcMain.handle('getSTERAssessments', async () => {
  await ensureDatabaseInitialized();
  return sterDB.getAllAssessments();
});

ipcMain.handle('addSTERAssessment', async (event, assessment) => {
  await ensureDatabaseInitialized();
  return sterDB.addAssessment(assessment);
});

ipcMain.handle('updateSTERAssessment', async (event, id, assessment) => {
  await ensureDatabaseInitialized();
  return sterDB.updateAssessment(id, assessment);
});

ipcMain.handle('deleteSTERAssessment', async (event, id) => {
  await ensureDatabaseInitialized();
  return sterDB.deleteAssessment(id);
});

// Trading Demons handlers
ipcMain.handle('getAllDemons', async () => {
  await ensureDatabaseInitialized();
  return demonsDB.getAllDemons();
});

ipcMain.handle('getDemonsByCategory', async (event, category) => {
  await ensureDatabaseInitialized();
  return demonsDB.getDemonsByCategory(category);
});

ipcMain.handle('getDemonById', async (event, id) => {
  await ensureDatabaseInitialized();
  return demonsDB.getDemonById(id);
});

ipcMain.handle('addDemon', async (event, demon) => {
  await ensureDatabaseInitialized();
  return demonsDB.addDemon(demon);
});

ipcMain.handle('updateDemon', async (event, id, demon) => {
  await ensureDatabaseInitialized();
  return demonsDB.updateDemon(id, demon);
});

ipcMain.handle('deleteDemon', async (event, id) => {
  await ensureDatabaseInitialized();
  return demonsDB.deleteDemon(id);
});

ipcMain.handle('get-all-post-sessions', async () => {
  return await routinesDB.getAllPostSessions();
});

ipcMain.handle('get-post-session-by-id', async (event, id) => {
  return await routinesDB.getPostSessionById(id);
});

ipcMain.handle('update-post-session', async (event, postSession) => {
  if (postSession.id) {
    return await routinesDB.updatePostSession(postSession);
  } else {
    return await routinesDB.addPostSession(postSession);
  }
});

ipcMain.handle('delete-post-session', async (event, id) => {
  try {
    return await routinesDB.deletePostSession(id);
  } catch (error) {
    console.error('Error deleting post session:', error);
    throw error;
  }
});

// Trade-Presession linking methods
ipcMain.handle('linkTradeToPresession', async (event, tradeId, presessionId) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    console.log('Linking trade', tradeId, 'to presession', presessionId);
    
    db.run('UPDATE trades SET presession_id = ? WHERE id = ?', [presessionId, tradeId], (err) => {
      if (err) {
        console.error('Error linking trade to presession:', err);
        reject(err);
        return;
      }
      
      console.log('Trade linked to presession successfully');
      resolve(true);
    });
  });
});

ipcMain.handle('unlinkTradeFromPresession', async (event, tradeId) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    console.log('Unlinking trade', tradeId, 'from presession');
    
    db.run('UPDATE trades SET presession_id = NULL WHERE id = ?', [tradeId], (err) => {
      if (err) {
        console.error('Error unlinking trade from presession:', err);
        reject(err);
        return;
      }
      
      console.log('Trade unlinked from presession successfully');
      resolve(true);
    });
  });
});

ipcMain.handle('getLinkedPresession', async (event, tradeId) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    console.log('Getting linked presession for trade', tradeId);
    
    db.get('SELECT presession_id FROM trades WHERE id = ?', [tradeId], async (err, row) => {
      if (err) {
        console.error('Error getting linked presession ID:', err);
        reject(err);
        return;
      }
      
      if (!row || !row.presession_id) {
        console.log('No linked presession found for trade', tradeId);
        resolve(null);
        return;
      }
      
      console.log('Found linked presession ID:', row.presession_id);
      try {
        const presession = await routinesDB.getPreSessionById(row.presession_id);
        resolve(presession);
      } catch (error) {
        console.error('Error getting presession details:', error);
        reject(error);
      }
    });
  });
});

ipcMain.handle('getLinkedTrades', async (event, presessionId) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    console.log('Getting linked trades for presession', presessionId);
    
    db.all('SELECT * FROM trades WHERE presession_id = ?', [presessionId], (err, trades) => {
      if (err) {
        console.error('Error getting linked trades:', err);
        reject(err);
        return;
      }
      
      console.log(`Found ${trades.length} linked trades`);
      resolve(trades);
    });
  });
});

// Функція для оновлення даних trades у базі даних execution
async function updateExecutionTradesData(trade, isDelete = false) {
  // Перевіряємо, чи ініціалізована executionDB
  if (!executionDB) {
    console.error('ERROR: executionDB is not initialized!');
    await ensureDatabaseInitialized();
    if (!executionDB) {
      console.error('Critical error: executionDB still not initialized after ensureDatabaseInitialized()');
      return;
    }
  }
  
  console.log(`Updating execution data for trade: ${trade.id}, pointA: ${trade.pointA}, isDelete: ${isDelete}`);

  try {
    // Якщо pointA існує у трейді
    if (trade.pointA) {
      console.log(`Оновлюємо pointA = "${trade.pointA}" через глобальний executionDB`);
      
      try {
        // Отримуємо дані для елемента
        const item = await executionDB.getItemByName('pointA', trade.pointA);
        
        if (!item && !isDelete) {
          console.log(`УВАГА: Елемент pointA "${trade.pointA}" не знайдено у базі даних. Створюємо новий.`);
          await executionDB.addItem('pointA', trade.pointA);
          console.log(`Елемент pointA "${trade.pointA}" успішно створено`);
        } else if (item) {
          console.log(`Знайдено елемент pointA "${trade.pointA}" у базі даних`);
        }
        
        // Тепер оновлюємо дані трейду
        const tradeData = {
          id: trade.id,
          result: trade.result
        };
        
        if (isDelete) {
          if (item) {
            await executionDB.removeTradeFromItem('pointA', trade.pointA, trade.id);
            console.log(`Трейд ${trade.id} видалено з елемента pointA "${trade.pointA}"`);
          } else {
            console.log(`Елемент pointA "${trade.pointA}" не знайдено, пропускаємо видалення`);
          }
        } else {
          await executionDB.updateItemTrades('pointA', trade.pointA, tradeData);
          console.log(`Трейд ${trade.id} додано/оновлено для елемента pointA "${trade.pointA}"`);
          
          // Перевіримо, чи дані були успішно оновлені
          const updatedItem = await executionDB.getItemByName('pointA', trade.pointA);
          console.log(`Оновлені дані для pointA "${trade.pointA}":`, JSON.stringify(updatedItem?.trades || [], null, 2));
        }
      } catch (error) {
        console.error(`Помилка при оновленні pointA "${trade.pointA}":`, error);
      }
    }

    // Визначаємо секції та відповідні значення в трейді
    const sections = {
      trigger: trade.trigger,
      entryModel: trade.entryModel,
      entryTF: trade.entryTF,
      fta: trade.fta,
      slPosition: trade.slPosition,
      pairs: trade.pair,
      directions: trade.direction,
      sessions: trade.session,
      positionType: trade.positionType
    };

    console.log('Sections to update:', JSON.stringify(sections, null, 2));

    // Обробка для volumeConfirmation, який може бути масивом
    if (trade.volumeConfirmation) {
      if (Array.isArray(trade.volumeConfirmation)) {
        for (const item of trade.volumeConfirmation) {
          if (isDelete) {
            try {
              // Перевіряємо, чи існує елемент перед видаленням
              const volumeItem = await executionDB.getItemByName('volumeConfirmation', item);
              if (volumeItem) {
                await executionDB.removeTradeFromItem('volumeConfirmation', item, trade.id);
                console.log(`Трейд ${trade.id} видалено з елемента volumeConfirmation "${item}"`);
              } else {
                console.log(`Елемент volumeConfirmation "${item}" не знайдено, пропускаємо видалення`);
              }
            } catch (error) {
              console.error(`Помилка при видаленні трейду з volumeConfirmation "${item}":`, error);
            }
          } else {
            try {
              await executionDB.updateItemTrades('volumeConfirmation', item, {
                id: trade.id,
                result: trade.result
              });
              console.log(`Трейд ${trade.id} додано/оновлено для елемента volumeConfirmation "${item}"`);
            } catch (error) {
              console.error(`Помилка при оновленні tradeData для volumeConfirmation "${item}":`, error);
            }
          }
        }
      } else if (typeof trade.volumeConfirmation === 'string') {
        if (isDelete) {
          try {
            // Перевіряємо, чи існує елемент перед видаленням
            const volumeItem = await executionDB.getItemByName('volumeConfirmation', trade.volumeConfirmation);
            if (volumeItem) {
              await executionDB.removeTradeFromItem('volumeConfirmation', trade.volumeConfirmation, trade.id);
              console.log(`Трейд ${trade.id} видалено з елемента volumeConfirmation "${trade.volumeConfirmation}"`);
            } else {
              console.log(`Елемент volumeConfirmation "${trade.volumeConfirmation}" не знайдено, пропускаємо видалення`);
            }
          } catch (error) {
            console.error(`Помилка при видаленні трейду з volumeConfirmation "${trade.volumeConfirmation}":`, error);
          }
        } else {
          try {
            await executionDB.updateItemTrades('volumeConfirmation', trade.volumeConfirmation, {
              id: trade.id,
              result: trade.result
            });
            console.log(`Трейд ${trade.id} додано/оновлено для елемента volumeConfirmation "${trade.volumeConfirmation}"`);
          } catch (error) {
            console.error(`Помилка при оновленні tradeData для volumeConfirmation "${trade.volumeConfirmation}":`, error);
          }
        }
      }
    }

    // Оновлюємо кожну секцію
    for (const [section, value] of Object.entries(sections)) {
      if (value) { // Перевіряємо, що значення існує
        try {
          console.log(`Updating section ${section} with value ${value} for trade ${trade.id}`);
          if (isDelete) {
            try {
              // Перевіряємо наявність елемента перед видаленням
              const sectionItem = await executionDB.getItemByName(section, value);
              if (sectionItem) {
                await executionDB.removeTradeFromItem(section, value, trade.id);
                console.log(`Трейд ${trade.id} видалено з елемента ${section}/${value}`);
              } else {
                console.log(`Елемент ${section}/${value} не знайдено, пропускаємо видалення`);
              }
            } catch (error) {
              console.error(`Помилка при видаленні трейду з ${section}/${value}:`, error);
            }
          } else {
            const tradeData = {
              id: trade.id,
              result: trade.result
            };
            console.log(`Adding trade data to ${section}/${value}:`, JSON.stringify(tradeData, null, 2));
            await executionDB.updateItemTrades(section, value, tradeData);
            console.log(`Successfully updated ${section}/${value}`);
          }
        } catch (error) {
          console.error(`Error updating ${section} with value ${value}:`, error);
        }
      } else {
        console.log(`Skipping section ${section} because value is empty`);
      }
    }
  } catch (error) {
    console.error('Помилка при оновленні даних execution:', error);
  }
}

// Функція для аналізу трейдів та генерації рекомендацій
async function analyzeTradesAndGenerateRecommendations() {
  // Спробуємо використати глобальну змінну executionDB
  if (!executionDB) {
    console.error('ERROR: executionDB is not initialized!');
    await ensureDatabaseInitialized();
    if (!executionDB) {
      console.error('Critical error: executionDB still not initialized after ensureDatabaseInitialized()');
      return [];
    }
  }

  console.log('Starting to generate trade recommendations...');
  
  // Секції та їх читабельні назви для рекомендацій
  const sections = {
    pointA: 'Point A',
    trigger: 'Trigger',
    pointB: 'Point B',
    entryModel: 'Entry Model',
    entryTF: 'Entry Timeframe',
    fta: 'FTA',
    slPosition: 'Stop-Loss Position',
    volumeConfirmation: 'Volume Confirmation'
  };

  // Мінімальна кількість трейдів для аналізу
  const MIN_TRADES_COUNT = 5;
  // Поріг вінрейту, нижче якого генеруються рекомендації
  const WINRATE_THRESHOLD = 30; // 30%
  const HIGH_WINRATE_THRESHOLD = 70; // 70%

  const recommendations = [];

  // Отримуємо всі трейди для перевірки
  const trades = await new Promise((resolve, reject) => {
    db.all('SELECT * FROM trades', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        // Парсимо JSON поля
        rows.forEach(row => {
          if (row.volumeConfirmation) {
            try {
              row.volumeConfirmation = JSON.parse(row.volumeConfirmation);
            } catch (e) {
              row.volumeConfirmation = [];
            }
          }
        });
        resolve(rows);
      }
    });
  });
  
  console.log(`Loaded ${trades.length} trades for analysis`);

  // Аналіз окремих параметрів
  for (const [sectionKey, sectionName] of Object.entries(sections)) {
    try {
      console.log(`Analyzing section: ${sectionKey}`);
      let items = await executionDB.getAllItems(sectionKey);
      
      // Перевіряємо, чи є в базі даних елементи, що є у трейдах, але відсутні в результаті getAllItems
      const valueSet = new Set();
      items.forEach(item => valueSet.add(item.name));
      
      // Збираємо унікальні значення з трейдів
      const uniqueValues = new Set();
      trades.forEach(trade => {
        if (sectionKey === 'volumeConfirmation' && Array.isArray(trade.volumeConfirmation)) {
          trade.volumeConfirmation.forEach(val => {
            if (val) uniqueValues.add(val);
          });
        } else if (trade[sectionKey]) {
          uniqueValues.add(trade[sectionKey]);
        }
      });
      
      // Додаємо відсутні елементи до масиву items
      for (const value of uniqueValues) {
        if (!valueSet.has(value)) {
          console.log(`Found value "${value}" in trades but not in ${sectionKey} table. Adding manually.`);
          
          // Лічимо трейди з цим значенням
          const relevantTrades = trades.filter(trade => {
            if (sectionKey === 'volumeConfirmation') {
              return Array.isArray(trade.volumeConfirmation) && trade.volumeConfirmation.includes(value);
            } else {
              return trade[sectionKey] === value;
            }
          });
          
          // Додаємо відсутній елемент до масиву items
          items.push({
            id: 0, // Ідентифікатор не важливий, оскільки шукаємо за name
            name: value,
            trades: relevantTrades.map(trade => ({
              id: trade.id,
              result: trade.result
            }))
          });
        }
      }
      
      console.log(`Found ${items.length} items in ${sectionKey}`);
      
      for (const item of items) {
        console.log(`Analyzing item ${sectionKey}: ${item.name}, with ${item.trades ? item.trades.length : 0} trades`);
        
        if (!item.trades) {
          console.log(`Item ${item.name} has no trades array, skipping`);
          continue;
        }
        
        // Додаткова перевірка, якщо кількість трейдів у елементі не співпадає з очікуваною
        if (sectionKey !== 'volumeConfirmation') {
          const countInTrades = trades.filter(trade => trade[sectionKey] === item.name).length;
          
          if (countInTrades !== item.trades.length) {
            console.log(`Discrepancy in trade count for ${sectionKey}: ${item.name}. Expected ${countInTrades}, found ${item.trades.length}`);
            
            // Оновлюємо список трейдів для аналізу
            const relevantTrades = trades.filter(trade => trade[sectionKey] === item.name);
            item.trades = relevantTrades.map(trade => ({
              id: trade.id,
              result: trade.result
            }));
            
            console.log(`Updated trades array with ${item.trades.length} trades`);
          }
        }
        
        if (item.trades && item.trades.length >= MIN_TRADES_COUNT) {
          const totalTrades = item.trades.length;
          const winTrades = item.trades.filter(t => t.result === 'Win').length;
          const lossTrades = item.trades.filter(t => t.result === 'Loss').length;
          const breakevenTrades = item.trades.filter(t => t.result === 'Breakeven').length;
          
          // Розраховуємо вінрейт тільки по Win і Loss трейдах
          const winLossTrades = winTrades + lossTrades;
          const winrate = winLossTrades > 0 
            ? Math.round((winTrades / winLossTrades) * 100)
            : 0;
          
          console.log(`${sectionName} "${item.name}": ${winTrades}/${winLossTrades} trades (${winTrades}W, ${lossTrades}L, ${breakevenTrades}BE), ${winrate}% winrate`);
          
          // Якщо вінрейт нижче порогу, створюємо рекомендацію
          if (winrate < WINRATE_THRESHOLD && winLossTrades >= MIN_TRADES_COUNT) {
            console.log(`Adding recommendation for ${sectionName} "${item.name}" due to low winrate (${winrate}%)`);
            recommendations.push({
              title: `Low Winrate for ${sectionName}: ${item.name}`,
              description: `Your winrate for ${sectionName} "${item.name}" is only ${winrate}%. We recommend reviewing how you use this element in your trades or pay more attention to analyzing situations when you use it.`,
              totalTrades,
              winTrades,
              lossTrades,
              breakevenTrades,
              winrate,
              relatedTrades: item.trades.map(t => t.id)
            });
          } else if (winrate >= HIGH_WINRATE_THRESHOLD && winLossTrades >= MIN_TRADES_COUNT) {
            console.log(`Adding recommendation for ${sectionName} "${item.name}" due to high winrate (${winrate}%)`);
            recommendations.push({
              title: `High Winrate for ${sectionName}: ${item.name}`,
              description: `Your winrate for ${sectionName} "${item.name}" is ${winrate}%. This shows excellent results for your trades. We recommend focusing on trading in these conditions.`,
              totalTrades,
              winTrades,
              lossTrades,
              breakevenTrades,
              winrate,
              relatedTrades: item.trades.map(t => t.id)
            });
          }
        } else {
          console.log(`Skipping ${sectionName} "${item.name}" - not enough trades (${item.trades ? item.trades.length : 0}/${MIN_TRADES_COUNT})`);
        }
      }
    } catch (error) {
      console.error(`Error analyzing ${sectionKey}:`, error);
    }
  }

  // Аналіз комбінацій параметрів
  // Отримуємо всі трейди
  console.log('Getting all trades for combination analysis');
  console.log(`Found ${trades.length} trades for analysis`);

  // Аналізуємо різні комбінації параметрів
  // Комбінації, які ми будемо аналізувати:
  const combinations = [
    { key1: 'pointA', key2: 'trigger', name1: 'Point A', name2: 'Trigger' },
    { key1: 'pointA', key2: 'entryModel', name1: 'Point A', name2: 'Entry Model' },
    { key1: 'trigger', key2: 'entryModel', name1: 'Trigger', name2: 'Entry Model' },
    { key1: 'entryModel', key2: 'entryTF', name1: 'Entry Model', name2: 'Entry Timeframe' },
    { key1: 'slPosition', key2: 'pointA', name1: 'Stop-Loss Position', name2: 'Point A' }
  ];

  for (const combo of combinations) {
    console.log(`Analyzing combination: ${combo.name1} + ${combo.name2}`);
    // Створюємо мапу для зберігання комбінацій
    const combosMap = new Map();
    
    // Аналізуємо кожен трейд
    for (const trade of trades) {
      const value1 = trade[combo.key1];
      let value2 = trade[combo.key2];
      
      // Якщо обидва значення є в трейді
      if (value1 && value2) {
        // Для масивів volumeConfirmation аналізуємо кожен елемент окремо
        if (Array.isArray(value2)) {
          for (const v2 of value2) {
            const comboKey = `${value1}__${v2}`;
            if (!combosMap.has(comboKey)) {
              combosMap.set(comboKey, { 
                value1, 
                value2: v2, 
                trades: [] 
              });
            }
            
            combosMap.get(comboKey).trades.push({
              id: trade.id,
              result: trade.result
            });
          }
        } else {
          const comboKey = `${value1}__${value2}`;
          if (!combosMap.has(comboKey)) {
            combosMap.set(comboKey, { 
              value1, 
              value2, 
              trades: [] 
            });
          }
          
          combosMap.get(comboKey).trades.push({
            id: trade.id,
            result: trade.result
          });
        }
      }
    }
    
    console.log(`Found ${combosMap.size} unique combinations for ${combo.name1} + ${combo.name2}`);
    
    // Аналізуємо кожну комбінацію
    for (const [comboKey, comboData] of combosMap.entries()) {
      if (comboData.trades.length >= MIN_TRADES_COUNT) {
        const totalTrades = comboData.trades.length;
        const winTrades = comboData.trades.filter(t => t.result === 'Win').length;
        const lossTrades = comboData.trades.filter(t => t.result === 'Loss').length;
        const breakevenTrades = comboData.trades.filter(t => t.result === 'Breakeven').length;
        
        // Розраховуємо вінрейт тільки по Win і Loss трейдах
        const winLossTrades = winTrades + lossTrades;
        const winrate = winLossTrades > 0 
          ? Math.round((winTrades / winLossTrades) * 100)
          : 0;
        
        console.log(`Combination "${comboData.value1} + ${comboData.value2}": ${winTrades}/${winLossTrades} trades (${winTrades}W, ${lossTrades}L, ${breakevenTrades}BE), ${winrate}% winrate`);
        
        // Якщо вінрейт нижче порогу, створюємо рекомендацію
        if (winrate < WINRATE_THRESHOLD && winLossTrades >= MIN_TRADES_COUNT) {
          console.log(`Adding recommendation for combination "${comboData.value1} + ${comboData.value2}" due to low winrate (${winrate}%)`);
          recommendations.push({
            title: `Problematic Combination: ${comboData.value1} (${combo.name1}) + ${comboData.value2} (${combo.name2})`,
            description: `The combination of ${combo.name1} "${comboData.value1}" and ${combo.name2} "${comboData.value2}" shows a low winrate of ${winrate}%. We recommend avoiding this combination in future trades or reviewing your strategy for using it.`,
            totalTrades,
            winTrades,
            lossTrades,
            breakevenTrades,
            winrate,
            relatedTrades: comboData.trades.map(t => t.id)
          });
        }
      } else {
        console.log(`Skipping combination "${comboData.value1} + ${comboData.value2}" - not enough trades (${comboData.trades.length}/${MIN_TRADES_COUNT})`);
      }
    }
  }

  // Перевіряємо конкретно slPosition = 'LTF Manipulation'
  const ltfManipulationTrades = trades.filter(t => t.slPosition === 'LTF Manipulation');
  if (ltfManipulationTrades.length >= MIN_TRADES_COUNT) {
    const totalTrades = ltfManipulationTrades.length;
    const winTrades = ltfManipulationTrades.filter(t => t.result === 'Win').length;
    const lossTrades = ltfManipulationTrades.filter(t => t.result === 'Loss').length;
    const breakevenTrades = ltfManipulationTrades.filter(t => t.result === 'Breakeven').length;
    
    // Розраховуємо вінрейт тільки по Win і Loss трейдах
    const winLossTrades = winTrades + lossTrades;
    const winrate = winLossTrades > 0 
      ? Math.round((winTrades / winLossTrades) * 100)
      : 0;
    
    console.log(`Special check for SL Position "LTF Manipulation": ${winTrades}/${winLossTrades} trades (${winTrades}W, ${lossTrades}L, ${breakevenTrades}BE), ${winrate}% winrate`);
    
    // Якщо вінрейт нижче порогу, створюємо рекомендацію
    if (winrate < WINRATE_THRESHOLD && winLossTrades >= MIN_TRADES_COUNT) {
      const recommendation = {
        title: `Low Winrate for Stop-Loss Position: LTF Manipulation`,
        description: `Your winrate for Stop-Loss Position "LTF Manipulation" is only ${winrate}%. We recommend reviewing how you use this element in your trades or pay more attention to analyzing situations when you use it.`,
        totalTrades,
        winTrades,
        lossTrades,
        breakevenTrades,
        winrate,
        relatedTrades: ltfManipulationTrades.map(t => t.id)
      };
      
      // Перевіряємо чи вже є така рекомендація
      const exists = recommendations.some(r => 
        r.title === recommendation.title && 
        r.winrate === recommendation.winrate
      );
      
      if (!exists) {
        console.log(`Adding special recommendation for Stop-Loss Position "LTF Manipulation" with winrate ${winrate}%`);
        recommendations.push(recommendation);
      } else {
        console.log(`Recommendation for Stop-Loss Position "LTF Manipulation" already exists`);
      }
    }
  }

  // Сортуємо рекомендації за вінрейтом (від найнижчого до найвищого)
  recommendations.sort((a, b) => a.winrate - b.winrate);
  
  console.log(`Generated ${recommendations.length} recommendations`);
  return recommendations;
}

// Функція для аналізу сесій та генерації рекомендацій
async function analyzeTradingSessionsAndGenerateRecommendations() {
  // Перевіряємо чи ініціалізована база даних
  if (!executionDB) {
    console.error('ERROR: executionDB is not initialized!');
    await ensureDatabaseInitialized();
    if (!executionDB) {
      console.error('Critical error: executionDB still not initialized after ensureDatabaseInitialized()');
      return [];
    }
  }

  console.log('Starting to generate trading session recommendations...');
  
  // Мінімальна кількість трейдів для аналізу
  const MIN_TRADES_COUNT = 5;
  // Поріг вінрейту, нижче якого генеруються рекомендації
  const WINRATE_THRESHOLD = 30; // 30%
  const HIGH_WINRATE_THRESHOLD = 70; // 70%

  const recommendations = [];

  // Отримуємо всі трейди
  await ensureDatabaseInitialized();
  console.log('Getting all trades for session analysis');
  const trades = await new Promise((resolve, reject) => {
    db.all('SELECT * FROM trades', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
  console.log(`Found ${trades.length} trades for session analysis`);

  // Групуємо трейди за сесіями
  const sessionMap = new Map();
  for (const trade of trades) {
    const session = trade.session;
    if (session) {
      if (!sessionMap.has(session)) {
        sessionMap.set(session, []);
      }
      sessionMap.get(session).push(trade);
    }
  }

  // Аналізуємо кожну сесію
  for (const [session, sessionTrades] of sessionMap.entries()) {
    if (sessionTrades.length >= MIN_TRADES_COUNT) {
      const totalTrades = sessionTrades.length;
      const winTrades = sessionTrades.filter(t => t.result === 'Win').length;
      const lossTrades = sessionTrades.filter(t => t.result === 'Loss').length;
      const breakevenTrades = sessionTrades.filter(t => t.result === 'Breakeven').length;
      const missedTrades = sessionTrades.filter(t => t.result === 'Missed').length;
      
      // Розраховуємо вінрейт тільки по Win і Loss трейдах
      const winLossTrades = winTrades + lossTrades;
      const winrate = winLossTrades > 0 
        ? Math.round((winTrades / winLossTrades) * 100)
        : 0;
      
      console.log(`Session "${session}": ${winTrades}/${winLossTrades} trades (${winTrades}W, ${lossTrades}L, ${breakevenTrades}BE, ${missedTrades}M), ${winrate}% winrate`);
      
      // Якщо вінрейт нижче порогу, створюємо рекомендацію
      if (winrate < WINRATE_THRESHOLD && winLossTrades >= MIN_TRADES_COUNT) {
        console.log(`Adding recommendation for session "${session}" due to low winrate (${winrate}%)`);
        recommendations.push({
          title: `Low Winrate for Session: ${session}`,
          description: `Your winrate for session "${session}" is only ${winrate}%. We recommend reviewing your trading approach during this session or consider skipping it.`,
          totalTrades,
          winTrades,
          lossTrades,
          breakevenTrades,
          missedTrades,
          winrate,
          relatedTrades: sessionTrades.map(t => t.id)
        });
      } else if (winrate >= HIGH_WINRATE_THRESHOLD && winLossTrades >= MIN_TRADES_COUNT) {
        console.log(`Adding recommendation for session "${session}" due to high winrate (${winrate}%)`);
        recommendations.push({
          title: `High Winrate for Session: ${session}`,
          description: `Your winrate for session "${session}" is ${winrate}%. This shows excellent results. We recommend focusing on trading during this session.`,
          totalTrades,
          winTrades,
          lossTrades,
          breakevenTrades,
          missedTrades,
          winrate,
          relatedTrades: sessionTrades.map(t => t.id)
        });
      }
    } else {
      console.log(`Skipping session "${session}" - not enough trades (${sessionTrades.length}/${MIN_TRADES_COUNT})`);
    }
  }

  // Сортуємо рекомендації за вінрейтом (від найнижчого до найвищого)
  recommendations.sort((a, b) => a.winrate - b.winrate);
  console.log(`Generated ${recommendations.length} session recommendations`);
  return recommendations;
}

// Функція для аналізу валютних пар та генерації рекомендацій
async function analyzePairsAndGenerateRecommendations() {
  // Перевіряємо чи ініціалізована база даних
  if (!executionDB) {
    console.error('ERROR: executionDB is not initialized!');
    await ensureDatabaseInitialized();
    if (!executionDB) {
      console.error('Critical error: executionDB still not initialized after ensureDatabaseInitialized()');
      return [];
    }
  }

  console.log('Starting to generate currency pair recommendations...');
  
  // Мінімальна кількість трейдів для аналізу
  const MIN_TRADES_COUNT = 5;
  // Поріг вінрейту, нижче якого генеруються рекомендації
  const WINRATE_THRESHOLD = 30; // 30%
  const HIGH_WINRATE_THRESHOLD = 70; // 70%

  const recommendations = [];

  // Отримуємо всі трейди
  await ensureDatabaseInitialized();
  console.log('Getting all trades for pair analysis');
  const trades = await new Promise((resolve, reject) => {
    db.all('SELECT * FROM trades', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
  console.log(`Found ${trades.length} trades for pair analysis`);

  // Групуємо трейди за валютними парами
  const pairMap = new Map();
  for (const trade of trades) {
    const pair = trade.pair;
    if (pair) {
      if (!pairMap.has(pair)) {
        pairMap.set(pair, []);
      }
      pairMap.get(pair).push(trade);
    }
  }

  // Аналізуємо кожну валютну пару
  for (const [pair, pairTrades] of pairMap.entries()) {
    if (pairTrades.length >= MIN_TRADES_COUNT) {
      const totalTrades = pairTrades.length;
      const winTrades = pairTrades.filter(t => t.result === 'Win').length;
      const lossTrades = pairTrades.filter(t => t.result === 'Loss').length;
      const breakevenTrades = pairTrades.filter(t => t.result === 'Breakeven').length;
      const missedTrades = pairTrades.filter(t => t.result === 'Missed').length;
      
      // Розраховуємо вінрейт тільки по Win і Loss трейдах
      const winLossTrades = winTrades + lossTrades;
      const winrate = winLossTrades > 0 
        ? Math.round((winTrades / winLossTrades) * 100)
        : 0;
      
      // Розраховуємо загальний RR для пари
      const totalRR = pairTrades
        .filter(t => t.result === 'Win')
        .reduce((sum, trade) => sum + (parseFloat(trade.rr) || 0), 0);
      
      console.log(`Pair "${pair}": ${winTrades}/${winLossTrades} trades (${winTrades}W, ${lossTrades}L, ${breakevenTrades}BE, ${missedTrades}M), ${winrate}% winrate, Total RR: ${totalRR.toFixed(2)}`);
      
      // Якщо вінрейт нижче порогу, створюємо рекомендацію
      if (winrate < WINRATE_THRESHOLD && winLossTrades >= MIN_TRADES_COUNT) {
        console.log(`Adding recommendation for pair "${pair}" due to low winrate (${winrate}%)`);
        recommendations.push({
          title: `Low Winrate for Pair: ${pair}`,
          description: `Your winrate for pair "${pair}" is only ${winrate}%. We recommend reviewing your trading approach with this pair or consider avoiding it.`,
          totalTrades,
          winTrades,
          lossTrades,
          breakevenTrades,
          missedTrades,
          winrate,
          totalRR,
          relatedTrades: pairTrades.map(t => t.id)
        });
      } else if (winrate >= HIGH_WINRATE_THRESHOLD && winLossTrades >= MIN_TRADES_COUNT) {
        console.log(`Adding recommendation for pair "${pair}" due to high winrate (${winrate}%)`);
        recommendations.push({
          title: `High Winrate for Pair: ${pair}`,
          description: `Your winrate for pair "${pair}" is ${winrate}%. This shows excellent results. We recommend focusing on trading this pair.`,
          totalTrades,
          winTrades,
          lossTrades,
          breakevenTrades,
          missedTrades,
          winrate,
          totalRR,
          relatedTrades: pairTrades.map(t => t.id)
        });
      }
    } else {
      console.log(`Skipping pair "${pair}" - not enough trades (${pairTrades.length}/${MIN_TRADES_COUNT})`);
    }
  }

  // Сортуємо рекомендації за вінрейтом (від найнижчого до найвищого)
  recommendations.sort((a, b) => a.winrate - b.winrate);
  console.log(`Generated ${recommendations.length} pair recommendations`);
  return recommendations;
}

// Функція для аналізу діапазонів ризику/винагороди та генерації рекомендацій
async function analyzeRiskRewardAndGenerateRecommendations() {
  // Перевіряємо чи ініціалізована база даних
  if (!executionDB) {
    console.error('ERROR: executionDB is not initialized!');
    await ensureDatabaseInitialized();
    if (!executionDB) {
      console.error('Critical error: executionDB still not initialized after ensureDatabaseInitialized()');
      return [];
    }
  }

  console.log('Starting to generate risk/reward recommendations...');
  
  // Мінімальна кількість трейдів для аналізу
  const MIN_TRADES_COUNT = 5;
  // Поріг вінрейту, нижче якого генеруються рекомендації
  const WINRATE_THRESHOLD = 30; // 30%
  const HIGH_WINRATE_THRESHOLD = 70; // 70%

  const recommendations = [];

  // Отримуємо всі трейди
  await ensureDatabaseInitialized();
  console.log('Getting all trades for risk/reward analysis');
  const trades = await new Promise((resolve, reject) => {
    db.all('SELECT * FROM trades', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
  console.log(`Found ${trades.length} trades for risk/reward analysis`);

  // Визначаємо діапазони ризику/винагороди
  const rrRanges = [
    { min: 0, max: 1, name: "0-1 RR" },
    { min: 1, max: 2, name: "1-2 RR" },
    { min: 2, max: 3, name: "2-3 RR" },
    { min: 3, max: 4, name: "3-4 RR" },
    { min: 4, max: 999, name: "4+ RR" }
  ];

  // Групуємо трейди за діапазонами RR
  const rrMap = new Map();
  for (const range of rrRanges) {
    rrMap.set(range.name, []);
  }
  
  for (const trade of trades) {
    if (trade.rr) {
      const rr = parseFloat(trade.rr);
      if (!isNaN(rr)) {
        for (const range of rrRanges) {
          if (rr >= range.min && rr < range.max) {
            rrMap.get(range.name).push(trade);
            break;
          }
        }
      }
    }
  }

  // Аналізуємо кожний діапазон RR
  for (const [rangeName, rangeTrades] of rrMap.entries()) {
    if (rangeTrades.length >= MIN_TRADES_COUNT) {
      const totalTrades = rangeTrades.length;
      const winTrades = rangeTrades.filter(t => t.result === 'Win').length;
      const lossTrades = rangeTrades.filter(t => t.result === 'Loss').length;
      const breakevenTrades = rangeTrades.filter(t => t.result === 'Breakeven').length;
      const missedTrades = rangeTrades.filter(t => t.result === 'Missed').length;
      
      // Розраховуємо вінрейт тільки по Win і Loss трейдах
      const winLossTrades = winTrades + lossTrades;
      const winrate = winLossTrades > 0 
        ? Math.round((winTrades / winLossTrades) * 100)
        : 0;
      
      console.log(`Risk/Reward Range "${rangeName}": ${winTrades}/${winLossTrades} trades (${winTrades}W, ${lossTrades}L, ${breakevenTrades}BE, ${missedTrades}M), ${winrate}% winrate`);
      
      // Якщо вінрейт нижче порогу, створюємо рекомендацію
      if (winrate < WINRATE_THRESHOLD && winLossTrades >= MIN_TRADES_COUNT) {
        console.log(`Adding recommendation for Risk/Reward Range "${rangeName}" due to low winrate (${winrate}%)`);
        recommendations.push({
          title: `Low Winrate for Risk/Reward Range: ${rangeName}`,
          description: `Your winrate for Risk/Reward Range "${rangeName}" is only ${winrate}%. We recommend reviewing your trading approach with this Risk/Reward range or consider adjusting your targets.`,
          totalTrades,
          winTrades,
          lossTrades,
          breakevenTrades,
          missedTrades,
          winrate,
          relatedTrades: rangeTrades.map(t => t.id)
        });
      } else if (winrate >= HIGH_WINRATE_THRESHOLD && winLossTrades >= MIN_TRADES_COUNT) {
        console.log(`Adding recommendation for Risk/Reward Range "${rangeName}" due to high winrate (${winrate}%)`);
        recommendations.push({
          title: `High Winrate for Risk/Reward Range: ${rangeName}`,
          description: `Your winrate for Risk/Reward Range "${rangeName}" is ${winrate}%. This shows excellent results. We recommend focusing on trades with similar Risk/Reward ratios.`,
          totalTrades,
          winTrades,
          lossTrades,
          breakevenTrades,
          missedTrades,
          winrate,
          relatedTrades: rangeTrades.map(t => t.id)
        });
      }
    } else {
      console.log(`Skipping Risk/Reward Range "${rangeName}" - not enough trades (${rangeTrades.length}/${MIN_TRADES_COUNT})`);
    }
  }

  // Сортуємо рекомендації за вінрейтом (від найнижчого до найвищого)
  recommendations.sort((a, b) => a.winrate - b.winrate);
  console.log(`Generated ${recommendations.length} risk/reward recommendations`);
  return recommendations;
}

// Оновлена функція для отримання всіх рекомендацій
ipcMain.handle('getTradeRecommendations', async (event) => {
  try {
    const baseRecommendations = await analyzeTradesAndGenerateRecommendations();
    const sessionRecommendations = await analyzeTradingSessionsAndGenerateRecommendations();
    const pairRecommendations = await analyzePairsAndGenerateRecommendations();
    const rrRecommendations = await analyzeRiskRewardAndGenerateRecommendations();
    
    // Об'єднуємо всі рекомендації
    const allRecommendations = [
      ...baseRecommendations, 
      ...sessionRecommendations,
      ...pairRecommendations,
      ...rrRecommendations
    ];
    
    // Сортуємо за вінрейтом (від найнижчого до найвищого)
    allRecommendations.sort((a, b) => a.winrate - b.winrate);
    
    // Перевіряємо, які рекомендації вже у архіві
    const archivedRecommendations = await getArchivedRecommendations();
    const archivedKeys = archivedRecommendations.map(r => r.recommendationKey);
    
    // Додаємо поле isNew до кожної рекомендації
    for (const rec of allRecommendations) {
      // Створюємо унікальний ключ для рекомендації
      const recommendationKey = createRecommendationKey(rec);
      rec.recommendationKey = recommendationKey;
      rec.isNew = !archivedKeys.includes(recommendationKey);
      rec.isArchived = archivedKeys.includes(recommendationKey);
    }
    
    console.log(`Generated total of ${allRecommendations.length} recommendations`);
    return allRecommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];
  }
});

// Функція для створення унікального ключа для рекомендації
function createRecommendationKey(recommendation) {
  const { title, description, winrate, totalTrades } = recommendation;
  // Створюємо унікальний ключ за допомогою хешування важливих полів
  return `${title}_${winrate}_${totalTrades}`.replace(/[^a-zA-Z0-9_]/g, '_');
}

// Функція для отримання архівованих рекомендацій
async function getArchivedRecommendations() {
  try {
    // Перевіряємо чи існує таблиця recommendation_archive
    await ensureRecommendationArchiveTable();
    
    return new Promise((resolve, reject) => {
      executionDB.db.all('SELECT * FROM recommendation_archive', [], (err, rows) => {
        if (err) {
          console.error('Error getting archived recommendations:', err);
          reject(err);
        } else {
          // Перетворюємо дані для сумісності з активними рекомендаціями
          const formattedRows = rows.map(row => {
            // Перетворюємо поле related_trades в масив ID
            let relatedTradesArray = [];
            try {
              relatedTradesArray = JSON.parse(row.related_trades || '[]');
            } catch (e) {
              console.error(`Error parsing related_trades for recommendation ${row.recommendation_key}:`, e);
              relatedTradesArray = [];
            }
            
            // Перетворюємо деталі в об'єкт
            let detailsObject = {};
            try {
              detailsObject = JSON.parse(row.details || '{}');
            } catch (e) {
              console.error(`Error parsing details for recommendation ${row.recommendation_key}:`, e);
            }
            
            // Формуємо об'єкт з правильними назвами полів для сумісності
            return {
              ...detailsObject,
              id: row.id,
              recommendation_key: row.recommendation_key,
              recommendationKey: row.recommendation_key,
              title: row.title,
              description: row.description,
              winrate: row.winrate,
              totalTrades: row.total_trades,
              total_trades: row.total_trades,
              winTrades: row.win_trades,
              win_trades: row.win_trades,
              lossTrades: row.loss_trades,
              loss_trades: row.loss_trades,
              breakevenTrades: row.breakeven_trades,
              breakeven_trades: row.breakeven_trades,
              missedTrades: row.missed_trades,
              missed_trades: row.missed_trades,
              relatedTrades: relatedTradesArray,
              related_trades: relatedTradesArray,
              archivedAt: row.archived_at,
              isArchived: true
            };
          });
          
          resolve(formattedRows);
        }
      });
    });
  } catch (error) {
    console.error('Error in getArchivedRecommendations:', error);
    return [];
  }
}

// Функція для додавання рекомендації до архіву
async function archiveRecommendation(recommendation) {
  try {
    // Перевіряємо чи існує таблиця recommendation_archive
    await ensureRecommendationArchiveTable();
    
    const {
      recommendationKey,
      title,
      description,
      winrate,
      totalTrades,
      winTrades,
      lossTrades,
      breakevenTrades,
      missedTrades,
      relatedTrades = []
    } = recommendation;
    
    console.log(`Архівування рекомендації: ${title} з ключем ${recommendationKey}`);
    console.log(`Пов'язані трейди: ${relatedTrades.length}`, relatedTrades);
    
    // Завантажуємо повні дані про всі пов'язані трейди для збереження
    const relatedTradesDetails = {};
    for (const tradeId of relatedTrades) {
      try {
        const tradeData = await new Promise((resolve, reject) => {
          db.get('SELECT * FROM trades WHERE id = ?', [tradeId], (err, row) => {
            if (err) {
              console.error(`Помилка при отриманні даних для трейду ${tradeId}:`, err);
              reject(err);
            } else {
              if (row && row.volumeConfirmation) {
                try {
                  row.volumeConfirmation = JSON.parse(row.volumeConfirmation);
                } catch (e) {
                  row.volumeConfirmation = [];
                }
              }
              resolve(row || null);
            }
          });
        });
        
        if (tradeData) {
          relatedTradesDetails[tradeId] = tradeData;
          console.log(`Завантажено дані для трейду ${tradeId}`);
        } else {
          console.warn(`Трейд ${tradeId} не знайдено в базі даних!`);
        }
      } catch (error) {
        console.error(`Помилка при завантаженні даних трейду ${tradeId}:`, error);
      }
    }
    
    // Створюємо об'єкт для додаткових деталей
    const details = { 
      ...recommendation,
      relatedTradesDetails // Додаємо повні дані про трейди
    };
    delete details.recommendationKey;
    delete details.title;
    delete details.description;
    delete details.winrate;
    delete details.totalTrades;
    delete details.winTrades;
    delete details.lossTrades;
    delete details.breakevenTrades;
    delete details.missedTrades;
    delete details.relatedTrades;
    
    return new Promise((resolve, reject) => {
      // Перевіряємо чи вже існує рекомендація з таким ключем
      executionDB.db.get('SELECT * FROM recommendation_archive WHERE recommendation_key = ?', [recommendationKey], (err, row) => {
        if (err) {
          console.error('Error checking if recommendation exists:', err);
          reject(err);
        } else if (row) {
          // Рекомендація вже в архіві
          console.log(`Recommendation with key ${recommendationKey} already archived`);
          resolve(false);
        } else {
          // Додаємо рекомендацію до архіву
          executionDB.db.run(
            `INSERT INTO recommendation_archive 
            (recommendation_key, title, description, winrate, total_trades, win_trades, loss_trades, breakeven_trades, missed_trades, related_trades, details, archived_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              recommendationKey,
              title,
              description,
              winrate,
              totalTrades,
              winTrades,
              lossTrades,
              breakevenTrades,
              missedTrades,
              JSON.stringify(relatedTrades),
              JSON.stringify(details),
              new Date().toISOString()
            ],
            function(err) {
              if (err) {
                console.error('Error archiving recommendation:', err);
                reject(err);
              } else {
                console.log(`Recommendation archived with ID: ${this.lastID}`);
                resolve(true);
              }
            }
          );
        }
      });
    });
  } catch (error) {
    console.error('Error in archiveRecommendation:', error);
    return false;
  }
}

// Функція для видалення рекомендації з архіву
async function deleteArchivedRecommendation(recommendationKey) {
  try {
    return new Promise((resolve, reject) => {
      executionDB.db.run('DELETE FROM recommendation_archive WHERE recommendation_key = ?', [recommendationKey], function(err) {
        if (err) {
          console.error('Error deleting archived recommendation:', err);
          reject(err);
        } else {
          console.log(`Recommendation deleted from archive: ${recommendationKey}`);
          resolve(this.changes > 0);
        }
      });
    });
  } catch (error) {
    console.error('Error in deleteArchivedRecommendation:', error);
    return false;
  }
}

// Перевіряємо наявність таблиці recommendation_archive
async function ensureRecommendationArchiveTable() {
  return new Promise((resolve, reject) => {
    executionDB.db.run(`
      CREATE TABLE IF NOT EXISTS recommendation_archive (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recommendation_key TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        winrate REAL,
        total_trades INTEGER,
        win_trades INTEGER,
        loss_trades INTEGER,
        breakeven_trades INTEGER,
        missed_trades INTEGER,
        related_trades TEXT,
        details TEXT,
        archived_at TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating recommendation_archive table:', err);
        reject(err);
      } else {
        console.log('recommendation_archive table created or already exists');
        resolve();
      }
    });
  });
}

// API для роботи з архівом рекомендацій
ipcMain.handle('getArchivedRecommendations', async (event) => {
  try {
    return await getArchivedRecommendations();
  } catch (error) {
    console.error('Error getting archived recommendations:', error);
    return [];
  }
});

ipcMain.handle('archiveRecommendation', async (event, recommendation) => {
  try {
    return await archiveRecommendation(recommendation);
  } catch (error) {
    console.error('Error archiving recommendation:', error);
    return false;
  }
});

ipcMain.handle('deleteArchivedRecommendation', async (event, recommendationKey) => {
  try {
    return await deleteArchivedRecommendation(recommendationKey);
  } catch (error) {
    console.error('Error deleting archived recommendation:', error);
    return false;
  }
});