import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import UpdateIcon from '../assets/icons/update-icon.svg';
import SettingsIcon from '../assets/icons/settings-icon.svg';
import HideMenuIcon from '../assets/icons/hide-menu-icon.svg';
import ShowMenuIcon from '../assets/icons/show-menu-icon.svg';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const iconRotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${props => props.isCollapsed ? '0' : '300px'};
  height: 100vh;
  background-color: #1a1a1a;
  padding: ${props => props.isCollapsed ? '0' : '20px'};
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 20px;
  left: ${props => props.isCollapsed ? '20px' : '320px'};
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  border: none;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  img {
    width: 24px;
    height: 24px;
    filter: brightness(0) invert(1);
  }
`;

const MainContent = styled.div`
  margin-left: ${props => props.isCollapsed ? '50px' : '350px'};
  padding: 20px;
  background-color: #1a1a1a;
  color: #fff;
  margin-top: 35px;
  margin-right: 30px;
  margin-bottom: 30px;
  transition: margin-left 0.3s ease;
`;

const Header = styled.header`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  padding: 20px;
  border-radius: 10px;
  color: #fff;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const TopRightButtons = styled.div`
  position: fixed;
  top: 30px;
  right: 20px;
  display: flex;
  gap: 15px;
  z-index: 1001;
`;

const Greeting = styled.h1`
  margin: 0;
  font-size: 2em;
  color: #fff;
`;

const WorkPhrase = styled.p`
  color: #ff8c00;
  margin-top: 10px;
  font-size: 1em;
`;

const MenuButton = styled(Link)`
  background-color: #5e2ca5;
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.1em;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: #4a1a8d;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const StatsContent = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
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
  height: 200px;

  ${({ isAnimating }) =>
    isAnimating &&
    css`
      animation: ${fadeInScale} 0.5s ease-out;
    `}
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

  ${({ isAnimating }) =>
    isAnimating &&
    css`
      animation: ${fadeInScale} 0.5s ease-out;
    `}
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

const IconButton = styled.button`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  border: none;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;

  &:hover {
    transform: scale(1.1);
  }

  transition: transform 0.2s ease;

  img {
    width: 24px;
    height: 24px;
  }

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #2e2e2e;
    color: #fff;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 20;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &.update-button:active img {
    animation: ${iconRotate} 0.5s linear;
  }
`;
function Home() {
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  const [isChartAnimating, setIsChartAnimating] = useState(false);
  const [isStatsAnimating, setIsStatsAnimating] = useState(false);

  const navigate = useNavigate();

  const galleryItems = [
    { title: 'Trading Journal', path: '/trade-journal', description: 'Analyze your future trades in one place using our advanced tools and indicators.' },
    { title: 'Daily Routine', path: '/daily-routine', description: 'Add your daily thoughts and plans.' },
    { title: 'Performance Analysis', path: '/performance-analysis', description: 'Explore and improve your skills.' },
    { title: 'Statistics', path: '/statistics', description: 'All information about your trading.' },
    { title: 'Capital and RM', path: '/risk-management', description: 'Save your deposit.' },
    { title: 'Reporting System', path: '/reporting-system', description: 'Get detailed reports.' },
    { title: 'Learning Section', path: '/learning-section', description: 'Learn new skills.' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return 'Good Morning!';
    if (hour >= 11 && hour < 17) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  useEffect(() => {
    const fetchTradeData = async () => {
      try {
        setIsChartAnimating(true);
        setIsStatsAnimating(true);
        const trades = await window.electronAPI.getTrades();
        if (trades && trades.length > 0) {
          const stats = calculateStats(trades);
          setTradeStats(stats);
        }
        setTimeout(() => {
          setIsChartAnimating(false);
          setIsStatsAnimating(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching trade data:', error);
        setIsChartAnimating(false);
        setIsStatsAnimating(false);
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

    const validTrades = trades.filter(trade => !isNaN(parseFloat(trade.profitLoss)));
    const winningTrades = validTrades.filter(trade => parseFloat(trade.profitLoss) > 0);
    const losingTrades = validTrades.filter(trade => parseFloat(trade.profitLoss) < 0);

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

    const bestPair = Object.entries(pairStats)
      .sort(([,a], [,b]) => b.profit - a.profit)[0]?.[0] || 'N/A';

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

    const bestSession = Object.entries(sessionStats)
      .sort(([,a], [,b]) => b.profit - a.profit)[0]?.[0] || 'N/A';

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

  const handleUpdate = () => {
    const fetchTradeData = async () => {
      try {
        setIsChartAnimating(true);
        setIsStatsAnimating(true);
        const trades = await window.electronAPI.getTrades();
        if (trades && trades.length > 0) {
          const stats = calculateStats(trades);
          setTradeStats(stats);
        }
        setTimeout(() => {
          setIsChartAnimating(false);
          setIsStatsAnimating(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching trade data:', error);
        setIsChartAnimating(false);
        setIsStatsAnimating(false);
      }
    };
    fetchTradeData();
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <Sidebar isCollapsed={isCollapsed}>
        <Header>
          <Greeting>{getGreeting()}</Greeting>
          <WorkPhrase>Let's get to work!</WorkPhrase>
        </Header>
        {galleryItems.map((item) => (
          <MenuButton key={item.path} to={item.path}>
            {item.title}
          </MenuButton>
        ))}
      </Sidebar>
      <ToggleButton 
        isCollapsed={isCollapsed} 
        onClick={toggleSidebar}
      >
        <img 
          src={isCollapsed ? ShowMenuIcon : HideMenuIcon} 
          alt={isCollapsed ? "Show menu" : "Hide menu"}
        />
      </ToggleButton>
      <MainContent isCollapsed={isCollapsed}>
        <TopRightButtons>
          <IconButton className="update-button" data-tooltip="Update Statistics" onClick={handleUpdate}>
            <img src={UpdateIcon} alt="Update" />
          </IconButton>
          <IconButton data-tooltip="Open Settings" onClick={handleSettings}>
            <img src={SettingsIcon} alt="Settings" />
          </IconButton>
        </TopRightButtons>
        <StatsContent>
          <StatCard isAnimating={isStatsAnimating}>
            <StatLabel>Overall Performance</StatLabel>
            <StatValue>{tradeStats.totalTrades}</StatValue>
            <StatLabel>Total Trades</StatLabel>
            <StatValue>{tradeStats.winRate.toFixed(2)}%</StatValue>
            <StatLabel>Win Rate</StatLabel>
            <StatValue>${tradeStats.totalProfit.toFixed(2)}</StatValue>
            <StatLabel>Total Profit/Loss</StatLabel>
          </StatCard>

          <StatCard isAnimating={isStatsAnimating}>
            <StatLabel>Trade Metrics</StatLabel>
            <StatValue>${tradeStats.averageWin.toFixed(2)}</StatValue>
            <StatLabel>Average Win</StatLabel>
            <StatValue>${Math.abs(tradeStats.averageLoss).toFixed(2)}</StatValue>
            <StatLabel>Average Loss</StatLabel>
            <StatValue>{tradeStats.profitFactor.toFixed(2)}</StatValue>
            <StatLabel>Profit Factor</StatLabel>
          </StatCard>

          <StatCard isAnimating={isStatsAnimating}>
            <StatLabel>Best Performance</StatLabel>
            <StatValue>{tradeStats.bestPair}</StatValue>
            <StatLabel>Best Pair</StatLabel>
            <StatValue>{tradeStats.bestSession}</StatValue>
            <StatLabel>Best Session</StatLabel>
            <StatValue>${tradeStats.largestWin.toFixed(2)}</StatValue>
            <StatLabel>Largest Win</StatLabel>
          </StatCard>

          <ChartContainer isAnimating={isChartAnimating}>
            <Bar options={chartOptions} data={chartData} />
          </ChartContainer>
        </StatsContent>
      </MainContent>
    </>
  );
}

export default Home;
