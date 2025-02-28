export function calculateTradeStats(trades) {
    if (!trades || trades.length === 0) return null;
  
    const winningTrades = trades.filter(trade => trade.profit > 0);
    const losingTrades = trades.filter(trade => trade.profit < 0);
  
    const totalProfit = trades.reduce((sum, trade) => sum + trade.profit, 0);
    const totalWins = winningTrades.length;
    const totalLosses = losingTrades.length;
  
    const winRate = (totalWins / trades.length) * 100;
    const averageWin = winningTrades.length > 0
      ? winningTrades.reduce((sum, trade) => sum + trade.profit, 0) / totalWins
      : 0;
    const averageLoss = losingTrades.length > 0
      ? Math.abs(losingTrades.reduce((sum, trade) => sum + trade.profit, 0)) / totalLosses
      : 0;
  
    const profitFactor = averageLoss !== 0
      ? (totalWins * averageWin) / (totalLosses * Math.abs(averageLoss))
      : 0;
  
    return {
      totalTrades: trades.length,
      winRate,
      profitFactor,
      averageWin,
      averageLoss,
      totalProfit,
      largestWin: Math.max(...trades.map(t => t.profit)),
      largestLoss: Math.min(...trades.map(t => t.profit)),
      profitByMonth: calculateMonthlyProfits(trades)
    };
  }
  
  function calculateMonthlyProfits(trades) {
    const monthlyProfits = {};
  
    trades.forEach(trade => {
      const date = new Date(trade.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyProfits[monthKey]) {
        monthlyProfits[monthKey] = 0;
      }
      monthlyProfits[monthKey] += trade.profit;
    });
  
    return monthlyProfits;
  }