import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [trades, setTrades] = useState([]);
  const [newTrade, setNewTrade] = useState({ asset: '', entryPrice: '' });

  // Завантажуємо угоди при старті
  useEffect(() => {
    const loadTrades = async () => {
      const loadedTrades = await window.electronAPI.getTrades();
      setTrades(loadedTrades);
    };
    loadTrades();
  }, []);

  // Обробка введення в поля форми
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTrade({ ...newTrade, [name]: value });
  };

  // Додавання нової угоди
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trade = {
      id: Date.now().toString(), // Унікальний ID
      asset: newTrade.asset,
      entryPrice: parseFloat(newTrade.entryPrice),
      date: new Date().toISOString().split('T')[0], // Поточна дата
    };
    await window.electronAPI.saveTrade(trade);
    setTrades([...trades, trade]); // Оновлюємо список локально
    setNewTrade({ asset: '', entryPrice: '' }); // Очищаємо форму
  };

  return (
    <div>
      <h1>Trade Journal</h1>
      
      {/* Форма для введення угод */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="asset"
          value={newTrade.asset}
          onChange={handleChange}
          placeholder="Asset (e.g., BTC/USD)"
          required
        />
        <input
          type="number"
          name="entryPrice"
          value={newTrade.entryPrice}
          onChange={handleChange}
          placeholder="Entry Price"
          required
        />
        <button type="submit">Add Trade</button>
      </form>

      {/* Список угод */}
      <h2>Trades</h2>
      {trades.length === 0 ? (
        <p>No trades yet</p>
      ) : (
        <ul>
          {trades.map((trade) => (
            <li key={trade.id}>
              {trade.date} - {trade.asset} - ${trade.entryPrice}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;