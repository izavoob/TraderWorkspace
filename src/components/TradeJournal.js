import React, { useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table'; // Додаємо usePagination для пагінації
import { Link, useNavigate } from 'react-router-dom'; // Для переходу на сторінку трейду

function TradeJournal() {
  const [trades, setTrades] = useState([]);
  const [filter, setFilter] = useState('week'); // За замовчуванням — трейди цього тижня
  const navigate = useNavigate();

  useEffect(() => {
    const loadTrades = async () => {
      const loadedTrades = await window.electronAPI.getTrades();
      setTrades(loadedTrades);
    };
    loadTrades();
  }, []);

  // Фільтрація трейдів
  const filteredTrades = React.useMemo(() => {
    const now = new Date();
    return trades.filter((trade) => {
      const tradeDate = new Date(trade.date);
      if (filter === 'week') {
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        return tradeDate >= weekStart && tradeDate <= now;
      } else if (filter === 'month') {
        return tradeDate.getMonth() === now.getMonth() && tradeDate.getFullYear() === now.getFullYear();
      } else if (filter === 'all') {
        return true;
      }
      return false;
    });
  }, [trades, filter]);

  // Колонки для таблиці
  const columns = React.useMemo(
    () => [
      { Header: 'No.', accessor: (row, i) => i + 1 }, // Замінюємо № на No.
      { Header: 'Date', accessor: 'date' },
      { Header: 'Asset', accessor: 'asset' },
      { Header: 'Account', accessor: 'account' },
      { Header: 'Pair', accessor: 'pair' },
      { Header: 'Session', accessor: 'session' },
      { Header: 'Direction', accessor: 'direction' },
      { Header: 'Result', accessor: 'result' },
      { Header: 'Position Size', accessor: 'positionSize' },
      { Header: 'Gained Points', accessor: 'gainedPoints' },
      { Header: 'Trade Class', accessor: 'tradeClass' },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: filteredTrades }, usePagination);

  // Обробка кліку на номер трейду для переходу на сторінку
  const handleTradeClick = (tradeId) => {
    navigate(`/trade/${tradeId}`); // Перехід на сторінку трейду
  };

  // Перехід на сторінку створення трейду
  const handleAddTrade = () => {
    navigate('/create-trade'); // Перехід на сторінку створення трейду
  };

  return (
    <div className="trade-journal">
      <div className="journal-header">
        <div className="filter-buttons">
          <button onClick={() => setFilter('week')} className={filter === 'week' ? 'active' : ''}>
            This Week
          </button>
          <button onClick={() => setFilter('month')} className={filter === 'month' ? 'active' : ''}>
            This Month
          </button>
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
            All Trades
          </button>
        </div>
        <button onClick={handleAddTrade} className="add-trade-button">
          Add Trade
        </button>
      </div>
      <table {...getTableProps()} className="trade-table">
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
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                No trades yet
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    if (cell.column.Header === 'No.') {
                      return (
                        <td {...cell.getCellProps()}>
                          <Link to={`/trade/${row.original.id}`} style={{ color: '#fff', textDecoration: 'none' }}>
                            {cell.render('Cell')}
                          </Link>
                        </td>
                      );
                    }
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TradeJournal;