const fs = require('fs').promises;
const path = require('path');

const TRADES_FILE = path.join(__dirname, 'trades.json');

async function saveTrade(trade) {
  let trades = [];
  try {
    const data = await fs.readFile(TRADES_FILE, 'utf8');
    trades = JSON.parse(data);
  } catch (e) {
    // Файл ще не існує
  }
  trades.push(trade);
  await fs.writeFile(TRADES_FILE, JSON.stringify(trades, null, 2));
  return true; // Повертаємо результат
}

async function getTrades() {
  try {
    const data = await fs.readFile(TRADES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

module.exports = { saveTrade, getTrades };