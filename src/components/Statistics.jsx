import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

const StatisticsContainer = styled.div`
  max-width: 1820px;
  margin: 0 auto;
  height: 100vh;
  background-color: #1a1a1a;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Header = styled.header`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  padding: 20px 0;
  border-radius: 10px 10px 0 0;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 128px;
  min-height: 6.67vh;
  max-height: 128px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
`;

const BackButton = styled(Link)`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  border: none;
  padding: 0;
  width: 200px;
  height: 100%;
  border-radius: 0;
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  transition: all 0.3s ease;
  text-decoration: none;
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
  &:active {
    transform: scale(0.98);
  }
  &:before {
    content: "Back";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.2em;
    color: rgba(255, 255, 255, 0);
    transition: color 0.3s ease;
  }
  &:hover:before {
    color: #fff;
  }
`;

const PageTitle = styled.h1`  // Перейменували Title на PageTitle
  margin: 0 auto;
  font-size: 2.5em;
  color: #fff;
  text-align: center;
  z-index: 1;
`;

const StatsContent = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: 64px; // Половина від висоти хедера для кращого центрування
`;


const StatCard = styled.div`
  background: rgba(116, 37, 201, 0.1);
  border-radius: 15px;
  padding: 20px;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px; // Фіксована висота для кращого вигляду
`;

const ChartContainer = styled.div`
  background: rgba(116, 37, 201, 0.1);
  border-radius: 15px;
  padding: 20px;
  grid-column: span 3;
  height: 300px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;


const StatValue = styled.div`
  font-size: 1.5em;
  font-weight: bold;
  color: #B886EE;
  margin: 10px 0;
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 0.9em;
  color: #888;
  text-align: center;
  margin-bottom: 5px;
`;

function Statistics() {
  const [tradeStats, setTradeStats] = useState({
    totalTrades: 0,
    winRate: 0,
    profitFactor: 0,
    averageWin: 0,
    averageLoss: 0,
    largestWin: 0,
    largestLoss: 0,
    bestPair: '',
    bestSession: '',
    monthlyData: {},
    totalProfit: 0
  });

  useEffect(() => {
    const fetchTradeData = async () => {
      try {
        const trades = await window.electronAPI.getTrades();
        if (trades && trades.length > 0) {
          const stats = calculateStats(trades);
          setTradeStats(stats);
        }
      } catch (error) {
        console.error('Error fetching trade data:', error);
      }
    };

    fetchTradeData();
  }, []);

  const calculateStats = (trades) => {
    if (!trades || trades.length === 0) {
      return {
        totalTrades: 0,
        winRate: 0,
        profitFactor: 0,
        averageWin: 0,
        averageLoss: 0,
        largestWin: 0,
        largestLoss: 0,
        bestPair: 'N/A',
        bestSession: 'N/A',
        monthlyData: {},
        totalProfit: 0
      };
    }

    // Фільтруємо тільки валідні числові значення
    const validTrades = trades.filter(trade => !isNaN(parseFloat(trade.profitLoss)));
    const winningTrades = validTrades.filter(trade => parseFloat(trade.profitLoss) > 0);
    const losingTrades = validTrades.filter(trade => parseFloat(trade.profitLoss) < 0);

    // Розрахунок статистики по парах
    const pairStats = validTrades.reduce((acc, trade) => {
      if (!acc[trade.pair]) {
        acc[trade.pair] = {
          count: 0,
          profit: 0
        };
      }
      acc[trade.pair].count++;
      acc[trade.pair].profit += parseFloat(trade.profitLoss) || 0;
      return acc;
    }, {});

    // Знаходження найкращої пари
    const bestPair = Object.entries(pairStats)
      .sort(([,a], [,b]) => b.profit - a.profit)[0]?.[0] || 'N/A';

    // Статистика по сесіях
    const sessionStats = validTrades.reduce((acc, trade) => {
      if (!acc[trade.session]) {
        acc[trade.session] = {
          count: 0,
          profit: 0
        };
      }
      acc[trade.session].count++;
      acc[trade.session].profit += parseFloat(trade.profitLoss) || 0;
      return acc;
    }, {});

    // Знаходження найкращої сесії
    const bestSession = Object.entries(sessionStats)
      .sort(([,a], [,b]) => b.profit - a.profit)[0]?.[0] || 'N/A';

    // Розрахунок місячної статистики
    const monthlyData = validTrades.reduce((acc, trade) => {
      if (trade.date) {
        const date = new Date(trade.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!acc[monthKey]) {
          acc[monthKey] = 0;
        }
        acc[monthKey] += parseFloat(trade.profitLoss) || 0;
      }
      return acc;
    }, {});

    const totalProfit = validTrades.reduce((sum, trade) => 
      sum + (parseFloat(trade.profitLoss) || 0), 0);

    const averageWin = winningTrades.length > 0
      ? winningTrades.reduce((sum, trade) => sum + (parseFloat(trade.profitLoss) || 0), 0) / winningTrades.length
      : 0;

    const averageLoss = losingTrades.length > 0
      ? Math.abs(losingTrades.reduce((sum, trade) => sum + (parseFloat(trade.profitLoss) || 0), 0)) / losingTrades.length
      : 0;

    return {
      totalTrades: validTrades.length,
      winRate: validTrades.length > 0 ? (winningTrades.length / validTrades.length) * 100 : 0,
      profitFactor: averageLoss !== 0 ? (averageWin / averageLoss) : 0,
      averageWin,
      averageLoss,
      largestWin: Math.max(...validTrades.map(t => parseFloat(t.profitLoss) || 0), 0),
      largestLoss: Math.min(...validTrades.map(t => parseFloat(t.profitLoss) || 0), 0),
      bestPair,
      bestSession,
      monthlyData,
      totalProfit
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Monthly Performance',
        color: 'white',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        ticks: { 
          color: 'white',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: { 
          color: 'white',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };


  const chartData = {
    labels: Object.keys(tradeStats.monthlyData),
    datasets: [{
      label: 'Profit/Loss',
      data: Object.values(tradeStats.monthlyData),
      backgroundColor: Object.values(tradeStats.monthlyData).map(value => 
        value >= 0 ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 99, 132, 0.5)'
      ),
      borderColor: Object.values(tradeStats.monthlyData).map(value => 
        value >= 0 ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)'
      ),
      borderWidth: 1
    }]
  };

  return (
    <StatisticsContainer>
      <Header>
        <BackButton to="/" title="Back to Home" aria-label="Back to Home" />
        <PageTitle>Trading Statistics</PageTitle>  {/* Змінили Title на PageTitle */}
      </Header>
      
      <StatsContent>
        <StatCard>
          <StatLabel>Overall Performance</StatLabel>
          <StatValue>{tradeStats.totalTrades}</StatValue>
          <StatLabel>Total Trades</StatLabel>
          <StatValue>{tradeStats.winRate.toFixed(2)}%</StatValue>
          <StatLabel>Win Rate</StatLabel>
          <StatValue>${tradeStats.totalProfit.toFixed(2)}</StatValue>
          <StatLabel>Total Profit/Loss</StatLabel>
        </StatCard>

        <StatCard>
          <StatLabel>Trade Metrics</StatLabel>
          <StatValue>${tradeStats.averageWin.toFixed(2)}</StatValue>
          <StatLabel>Average Win</StatLabel>
          <StatValue>${Math.abs(tradeStats.averageLoss).toFixed(2)}</StatValue>
          <StatLabel>Average Loss</StatLabel>
          <StatValue>{tradeStats.profitFactor.toFixed(2)}</StatValue>
          <StatLabel>Profit Factor</StatLabel>
        </StatCard>

        <StatCard>
          <StatLabel>Best Performance</StatLabel>
          <StatValue>{tradeStats.bestPair}</StatValue>
          <StatLabel>Best Pair</StatLabel>
          <StatValue>{tradeStats.bestSession}</StatValue>
          <StatLabel>Best Session</StatLabel>
          <StatValue>${tradeStats.largestWin.toFixed(2)}</StatValue>
          <StatLabel>Largest Win</StatLabel>
        </StatCard>

        <ChartContainer>
          <Bar options={chartOptions} data={chartData} />
        </ChartContainer>
      </StatsContent>
    </StatisticsContainer>
  );
}

export default Statistics;