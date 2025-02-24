const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').Database;
const fs = require('fs').promises;

let db = null; // SQLite база даних
let vaultPath = null; // Шлях до папки, де зберігається база

// Ініціалізація бази даних
async function initializeDatabase() {
  if (vaultPath && db) return; // Якщо вже ініціалізовано, не повторюємо

  vaultPath = path.join(app.getPath('documents'), 'TraderWorkspaceVault');
  const dbPath = path.join(vaultPath, 'trades.db');

  try {
    await fs.mkdir(vaultPath, { recursive: true });
    db = new sqlite3(dbPath, (err) => {
      if (err) throw new Error(`Database connection failed: ${err.message}`);
      console.log('SQLite database initialized at:', dbPath);
    });

    // Створюємо таблицю для трейдів, якщо її немає
    db.run(`
      CREATE TABLE IF NOT EXISTS trades (
        id TEXT PRIMARY KEY,
        date TEXT,
        asset TEXT,
        entryPrice REAL,
        exitPrice REAL,
        profitLoss REAL,
        notes TEXT,
        tradeName TEXT,
        account TEXT,
        pair TEXT,
        session TEXT,
        direction TEXT,
        result TEXT,
        positionSize TEXT,
        gainedPoints TEXT,
        tradeClass TEXT
      )
    `, (err) => {
      if (err) throw new Error(`Table creation failed: ${err.message}`);
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    throw new Error('Database initialization failed');
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1920, // Встановлено ширину 1920 для 1920x1080
    height: 1080, // Встановлено висоту 1080 для 1920x1080
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');

  // Ініціалізуємо базу даних асинхронно
  initializeDatabase().catch(console.error);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (db) db.close((err) => {
    if (err) console.error('Error closing database:', err);
    console.log('Database closed');
  }); // Закриваємо базу даних при закритті додатку
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Перевірка ініціалізації бази перед обробкою запитів
const ensureDatabaseInitialized = async () => {
  if (!db) {
    await initializeDatabase();
  }
  if (!db) throw new Error('Database not initialized');
};

// IPC для збереження трейду
ipcMain.handle('save-trade', async (event, trade) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    db.run(`
      INSERT OR REPLACE INTO trades (id, date, asset, entryPrice, exitPrice, profitLoss, notes, tradeName, account, pair, session, direction, result, positionSize, gainedPoints, tradeClass)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      trade.id,
      trade.date,
      trade.asset,
      trade.entryPrice || 0,
      trade.exitPrice || 0,
      trade.profitLoss || 0,
      trade.notes || '',
      trade.tradeName || '',
      trade.account || '',
      trade.pair || '',
      trade.session || '',
      trade.direction || '',
      trade.result || '',
      trade.positionSize || '',
      trade.gainedPoints || '',
      trade.tradeClass || ''
    ], (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });
});

// IPC для отримання всіх трейдів
ipcMain.handle('get-trades', async () => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM trades', (err, rows) => {
      if (err) reject(err);
      resolve(rows || []);
    });
  });
});

// IPC для оновлення трейду
ipcMain.handle('update-trade', async (event, tradeId, updatedTrade) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    db.run(`
      UPDATE trades SET 
        date = ?, asset = ?, entryPrice = ?, exitPrice = ?, profitLoss = ?, notes = ?, 
        tradeName = ?, account = ?, pair = ?, session = ?, direction = ?, result = ?, 
        positionSize = ?, gainedPoints = ?, tradeClass = ?
      WHERE id = ?
    `, [
      updatedTrade.date || new Date().toISOString().split('T')[0],
      updatedTrade.asset || '',
      updatedTrade.entryPrice || 0,
      updatedTrade.exitPrice || 0,
      updatedTrade.profitLoss || 0,
      updatedTrade.notes || '',
      updatedTrade.tradeName || '',
      updatedTrade.account || '',
      updatedTrade.pair || '',
      updatedTrade.session || '',
      updatedTrade.direction || '',
      updatedTrade.result || '',
      updatedTrade.positionSize || '',
      updatedTrade.gainedPoints || '',
      updatedTrade.tradeClass || '',
      tradeId
    ], (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });
});

// IPC для видалення трейду
ipcMain.handle('delete-trade', async (event, tradeId) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM trades WHERE id = ?', [tradeId], (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });
});