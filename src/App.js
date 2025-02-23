import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import './App.css'; // Якщо додали стилі раніше

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
      id: Date.now().toString(),
      asset: newTrade.asset,
      entryPrice: parseFloat(newTrade.entryPrice),
      date: new Date().toISOString().split('T')[0],
    };
    await window.electronAPI.saveTrade(trade);
    setTrades([...trades, trade]);
    setNewTrade({ asset: '', entryPrice: '' });
  };

  // Визначення колонок для таблиці
  const columns = React.useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date', // Ключ із даних
      },
      {
        Header: 'Asset',
        accessor: 'asset',
      },
      {
        Header: 'Entry Price',
        accessor: 'entryPrice',
      },
    ],
    []
  );

  // Налаштування таблиці
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: trades });

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

      {/* Таблиця угод */}
      <h2>Trades</h2>
      {trades.length === 0 ? (
        <p>No trades yet</p>
      ) : (
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;