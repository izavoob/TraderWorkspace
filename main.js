const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').Database;
const fs = require('fs').promises;

let db = null;
let vaultPath = null;

async function initializeDatabase() {
  if (vaultPath && db) return;

  vaultPath = path.join(app.getPath('documents'), 'TraderWorkspaceVault');
  const dbPath = path.join(vaultPath, 'trades.db');

  try {
    await fs.mkdir(vaultPath, { recursive: true });
    db = new sqlite3(dbPath, (err) => {
      if (err) throw new Error(`Database connection failed: ${err.message}`);
      console.log('SQLite database initialized at:', dbPath);
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS trades (
        id TEXT PRIMARY KEY,
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
        category TEXT
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
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');
  initializeDatabase().catch(console.error);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (db) db.close((err) => {
    if (err) console.error('Error closing database:', err);
    console.log('Database closed');
  });
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

const ensureDatabaseInitialized = async () => {
  if (!db) {
    await initializeDatabase();
  }
  if (!db) throw new Error('Database not initialized');
};

ipcMain.handle('save-trade', async (event, trade) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT OR REPLACE INTO trades (
        id, date, account, pair, direction, positionType, risk, result, rr, profitLoss,
        gainedPoints, followingPlan, bestTrade, session, pointA, trigger, volumeConfirmation,
        entryModel, entryTF, fta, slPosition, score, category
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        trade.id,
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
        trade.volumeConfirmation || '',
        trade.entryModel || '',
        trade.entryTF || '',
        trade.fta || '',
        trade.slPosition || '',
        trade.score || '',
        trade.category || '',
      ],
      (err) => {
        if (err) reject(err);
        resolve(true);
      }
    );
  });
});

ipcMain.handle('get-trades', async () => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM trades', (err, rows) => {
      if (err) reject(err);
      resolve(rows || []);
    });
  });
});

ipcMain.handle('update-trade', async (event, tradeId, updatedTrade) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE trades SET 
        date = ?, account = ?, pair = ?, direction = ?, positionType = ?, risk = ?, 
        result = ?, rr = ?, profitLoss = ?, gainedPoints = ?, followingPlan = ?, 
        bestTrade = ?, session = ?, pointA = ?, trigger = ?, volumeConfirmation = ?, 
        entryModel = ?, entryTF = ?, fta = ?, slPosition = ?, score = ?, category = ?
      WHERE id = ?
    `,
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
        updatedTrade.volumeConfirmation || '',
        updatedTrade.entryModel || '',
        updatedTrade.entryTF || '',
        updatedTrade.fta || '',
        updatedTrade.slPosition || '',
        updatedTrade.score || '',
        updatedTrade.category || '',
        tradeId,
      ],
      (err) => {
        if (err) reject(err);
        resolve(true);
      }
    );
  });
});

ipcMain.handle('delete-trade', async (event, tradeId) => {
  await ensureDatabaseInitialized();
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM trades WHERE id = ?', [tradeId], (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });
});