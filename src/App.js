import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    const testTrade = async () => {
      const result = await window.electronAPI.saveTrade({
        id: '1',
        asset: 'BTC/USD',
        entryPrice: 65000,
      });
      console.log('Trade saved:', result);
      const trades = await window.electronAPI.getTrades();
      console.log('Trades:', trades);
    };
    testTrade();
  }, []);

  return <h1>Trader Workspace with React</h1>;
}

export default App;