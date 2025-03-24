import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip, Legend, ArcElement, RadialLinearScale, PolarAreaController } from 'chart.js';
import { Bar, Doughnut, PolarArea } from 'react-chartjs-2';
import MenuOpenTwoToneIcon from '@mui/icons-material/MenuOpenTwoTone';
import CachedTwoToneIcon from '@mui/icons-material/CachedTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend, ArcElement, RadialLinearScale, PolarAreaController);

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

const shineEffect = keyframes`
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 0%;
  }
`;

const glowEffect = keyframes`
  0% { box-shadow: 0 0 5px rgba(116, 37, 201, 0.3); }
  50% { box-shadow: 0 0 20px rgba(116, 37, 201, 0.6); }
  100% { box-shadow: 0 0 5px rgba(116, 37, 201, 0.3); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: 999;
`;

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  left: ${props => props.isCollapsed ? '-350px' : '0'};
  width: 300px;
  height: 100vh;
  background-color: rgb(26 26 26 / 20%);
  padding: 20px;
  padding-top: 70px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: left 0.3s ease;
  overflow-y: auto;
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 25px;
  left: ${props => props.isCollapsed ? '25px' : '320px'};
  background: rgb(26, 26, 46);
  border: none;
  cursor: pointer;
  width: 36px;
  height: ${props => (props.isCollapsed ? '116px' : '36px')};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  transition: all 0.3s ease;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgb(94, 44, 165);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background-color: #4a1a8d;
    transform: scale(1.05);
    
    &::before {
      opacity: 1;
      animation: ${shineEffect} 1.5s linear infinite;
    }
  }

  svg {
    width: 24px;
    height: 24px;
    color: #fff;
    transform: ${props => props.isCollapsed ? 'scaleX(-1)' : 'scaleX(1)'};
    transition: transform 0.3s ease;
    z-index: 1;
  }
`;

const MainContent = styled.div`
  padding: 20px;
  background-color:rgb(46, 46, 46);
  color: #fff;
  height: calc(100vh - 40px);
  gap: 10px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: linear-gradient(45deg, #7425C9, #B886EE, #7425C9);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  padding: 20px;
  border-radius: 10px;
  color: #fff;
  
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 15px rgba(116, 37, 201, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const TopRightButtons = styled.div`
  position: fixed;
  flex-direction: column-reverse;
  top: 40px;
  right: 25px;
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
  transition: all 0.3s ease;
  position: relative;
  isolation: isolate;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    background-size: 200% 100%;
    border-radius: 8px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background-color: #4a1a8d;
    transform: scale(1.05);
    
    &::before {
      opacity: 1;
      animation: ${shineEffect} 1.5s linear infinite;
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const StatsContent = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  gap: 10px;
  overflow: hidden;
  padding: 15px;
  
  
`;

const ChartContent = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 15px;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  
  overflow: hidden;
`;

const ChartContainer = styled.div`
  background: linear-gradient(-90deg, rgb(39, 18, 61), rgb(92, 43, 144), rgb(28, 9, 49));
  background-size: 200% 200%;
  animation: ${gradientAnimation} 10s ease infinite;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  height: 100%;
  max-height: 300px;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0 6px 20px rgba(116, 37, 201, 0.3);
  }

  & > canvas {
    max-width: 100% !important;
    max-height: 100% !important;
    width: auto !important;
    height: auto !important;
    position: absolute !important;
    padding: 5px;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
  }
`;

const MetricsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const StatCard = styled.div`
  background: linear-gradient(90deg, rgb(39, 18, 61), rgb(92, 43, 144), rgb(28, 9, 49));
  background-size: 200% 200%;
  animation: ${gradientAnimation} 10s ease infinite;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(116, 37, 201, 0.5);
    animation: ${pulseAnimation} 2s ease-in-out infinite;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 8px;
    padding: 1px;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
`;


const GainedRRContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
`;

const RRValue = styled.div`
  font-size: 1em;
  font-weight: bold;
  color: ${props => props.type === 'gained' ? '#4bc0c0' : '#000000'};
`;

const RRSeparator = styled.span`
  color: #666;
  font-weight: bold;
`;

const StatValue = styled.div`
  font-size: 1em;
  font-weight: bold;
  color:rgb(255, 255, 255);
  margin: 10px 0;
  text-align: center;
`;

const RevenueValue = styled(StatValue)`
  color: ${props => {
    if (props.value > 0) return 'rgb(0, 209, 178)';
    if (props.value < 0) return 'rgb(255, 82, 82)';
    return 'rgb(255, 255, 255)';
  }};
`;

const StatLabel = styled.div`
  font-size: 0.9em;
  color:rgb(255, 255, 255);
  text-align: center;
  margin-bottom: 5px;
`;

const IconButton = styled.button`
  background: rgb(26, 26, 46);
  border: none;
  cursor: pointer;
  width: 116px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgb(94, 44, 165);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background-color: #4a1a8d;
    transform: scale(1.05);
    
    &::before {
      opacity: 1;
      animation: ${shineEffect} 1.5s linear infinite;
    }
  }

  svg {
    width: 24px;
    height: 24px;
    color: #fff;
    z-index: 1;
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

  &.update-button:active svg {
    animation: ${iconRotate} 0.5s linear;
  }
`;

const SlideContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Slide = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0; // Ensure slide takes full width
  bottom: 0; // Ensure slide takes full height
  padding: 20px;
  box-sizing: border-box;
  opacity: ${props => props.active ? 1 : 0};
  visibility: ${props => props.active ? 'visible' : 'hidden'};
  transform: translateX(${props => props.active ? '0' : props.direction === 'next' ? '100%' : '-100%'});
  transition: all 0.5s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden; // Prevent overflow
`;

const SlideNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-top: auto;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  
  overflow: hidden;
`;

const NavigationArrow = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: linear-gradient(45deg, #7425C9, #B886EE);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(116, 37, 201, 0.3);
  transition: all 0.3s ease;
  
  img {
    width: 24px;
    height: 24px;
    filter: brightness(0) invert(1);
  }
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(116, 37, 201, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const SlideIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? 
    'linear-gradient(45deg, #7425C9, #B886EE)' : 
    'rgba(68, 68, 68, 0.5)'};
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? 
    '0 0 10px rgba(116, 37, 201, 0.5)' : 
    '0 2px 4px rgba(0, 0, 0, 0.2)'};
  cursor: pointer;

  &:hover {
    transform: scale(1.3);
  }
`;

function Home() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [chartKey, setChartKey] = useState(0);
  const [tradeStats, setTradeStats] = useState({
    totalTrades: 0,
    winningRatio: 0,
    longWinrate: 0,
    shortWinrate: 0,
    averageRR: 0,
    bestSession: '',
    bestWeekday: '',
    bestPair: '',
    gainedRR: 0,
    potentialRR: 0,
    weekdayStats: {},
    pairStats: {},
    followingPlanPercentage: 0,
    executionCoefficient: 100,
    totalRoutines: 0,
    totalRevenue: 0,
    narrativeAccuracy: 0
  });
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

  useEffect(() => {
    fetchTradeData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return 'Good Morning!';
    if (hour >= 11 && hour < 17) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  const fetchTradeData = async () => {
    try {
      setIsStatsAnimating(true);
      const trades = await window.electronAPI.getTrades();
      const presessions = await window.electronAPI.getAllPresessions();
      
      if (trades && trades.length > 0) {
        const stats = calculateStats(trades, presessions);
        setTradeStats(stats);
      } else {
        // Установите значения по умолчанию, если нет трейдов
        setTradeStats({
          totalTrades: 0,
          winningRatio: 0,
          missedRatio: 0,
          breakevenRatio: 0,
          losingRatio: 0,
          longWinrate: 0,
          shortWinrate: 0,
          averageRR: 0,
          bestSession: 'N/A',
          bestWeekday: 'N/A',
          bestPair: 'N/A',
          gainedRR: 0,
          potentialRR: 0,
          weekdayStats: {},
          pairStats: {},
          followingPlanPercentage: 0,
          executionCoefficient: 100,
          totalRoutines: presessions?.length || 0,
          totalRevenue: 0,
          narrativeAccuracy: 0
        });
      }
      setTimeout(() => {
        setIsStatsAnimating(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsStatsAnimating(false);
    }
  };

  const calculateStats = (trades, presessions) => {
    if (!trades || trades.length === 0) {
      return {
        totalTrades: 0,
        winningRatio: 0,
        longWinrate: 0,
        shortWinrate: 0,
        averageRR: 0,
        bestSession: 'N/A',
        bestWeekday: 'N/A',
        bestPair: 'N/A',
        gainedRR: 0,
        potentialRR: 0,
        weekdayStats: {},
        pairStats: {},
        followingPlanPercentage: 0,
        executionCoefficient: 100,
        totalRoutines: presessions?.length || 0,
        totalRevenue: 0,
        narrativeAccuracy: 0
      };
    }

    const validTrades = trades.filter(trade => trade.result);
    const winningTrades = validTrades.filter(trade => trade.result === 'Win');
    const missedTrades = validTrades.filter(trade => trade.result === 'Missed');
    const breakevenTrades = validTrades.filter(trade => trade.result === 'Breakeven');
    const losingTrades = validTrades.filter(trade => !['Win', 'Missed', 'Breakeven'].includes(trade.result));
    const longTrades = validTrades.filter(trade => trade.direction === 'Long');
    const shortTrades = validTrades.filter(trade => trade.direction === 'Short');
    const longWins = longTrades.filter(trade => trade.result === 'Win');
    const shortWins = shortTrades.filter(trade => trade.result === 'Win');

    // Рахуємо RR метрики
    const gainedRR = validTrades
      .filter(trade => trade.result === 'Win')
      .reduce((sum, trade) => sum + (parseFloat(trade.rr) || 0), 0);

    const missedRR = validTrades
      .filter(trade => trade.result === 'Missed')
      .reduce((sum, trade) => sum + (parseFloat(trade.rr) || 0), 0);

    const potentialRR = gainedRR + missedRR;

    // Рахуємо загальний прибуток/збиток
    const totalRevenue = validTrades.reduce((sum, trade) => {
      const profitLoss = parseFloat(trade.profitLoss) || 0;
      return sum + profitLoss;
    }, 0);

    // Рахуємо Narrative Accuracy
    let narrativeAccuracy = 0;
    if (presessions && presessions.length > 0) {
      const presessionsWithOutcome = presessions.filter(session => 
        session.outcome && session.outcome.toString().trim() !== '');
      
      const correctNarratives = presessionsWithOutcome.filter(session => 
        session.outcome === session.narrative);
        
      narrativeAccuracy = presessionsWithOutcome.length > 0 
        ? (correctNarratives.length / presessionsWithOutcome.length) * 100 
        : 0;
    }

    // Рахуємо статистику по парах
    const pairStats = validTrades.reduce((acc, trade) => {
      const pair = trade.pair || 'Unknown';
      if (!acc[pair]) {
        acc[pair] = { wins: 0, total: 0, winRate: 0, gainedRR: 0 };
      }
      acc[pair].total++;
      if (trade.result === 'Win') {
        acc[pair].wins++;
        acc[pair].gainedRR += parseFloat(trade.rr) || 0;
      }
      acc[pair].winRate = (acc[pair].wins / acc[pair].total) * 100;
      return acc;
    }, {});

    // Знаходимо найкращу пару
    const bestPair = Object.entries(pairStats)
      .filter(([pair, stats]) => stats.total >= 3)
      .sort(([,a], [,b]) => b.gainedRR - a.gainedRR)[0]?.[0] || 'N/A';

    // Рахуємо статистику по сесіях
    const sessionStats = validTrades.reduce((acc, trade) => {
      const session = trade.session || 'Unknown';
      if (!acc[session]) {
        acc[session] = { wins: 0, total: 0, winRate: 0 };
      }
      acc[session].total++;
      if (trade.result === 'Win') {
        acc[session].wins++;
      }
      acc[session].winRate = (acc[session].wins / acc[session].total) * 100;
      return acc;
    }, {});

    // Знаходимо найкращу сесію
    const bestSession = Object.entries(sessionStats)
      .filter(([session, stats]) => stats.total >= 3) // Мінімум 3 трейди для статистичної значущості
      .sort(([,a], [,b]) => b.winRate - a.winRate)[0]?.[0] || 'N/A';

    // Рахуємо статистику по днях тижня
    const weekdayStats = validTrades.reduce((acc, trade) => {
      if (!trade.date) return acc;
      
      const date = new Date(trade.date);
      const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      if (!acc[weekday]) {
        acc[weekday] = { wins: 0, total: 0, winRate: 0 };
      }
      acc[weekday].total++;
      if (trade.result === 'Win') {
        acc[weekday].wins++;
      }
      acc[weekday].winRate = (acc[weekday].wins / acc[weekday].total) * 100;
      return acc;
    }, {});

    // Знаходимо найкращий день тижня
    const bestWeekday = Object.entries(weekdayStats)
      .filter(([day, stats]) => stats.total >= 3) // Мінімум 3 трейди для статистичної значущості
      .sort(([,a], [,b]) => b.winRate - a.winRate)[0]?.[0] || 'N/A';

    // Рахуємо середній RR для виграшних трейдів
    const totalRR = winningTrades.reduce((sum, trade) => sum + (parseFloat(trade.rr) || 0), 0);
    const averageRR = winningTrades.length > 0 ? totalRR / winningTrades.length : 0;

    // Розрахунок Following the Plan
    const followingPlanTrades = validTrades.filter(trade => trade.followingPlan);
    const followingPlanPercentage = (followingPlanTrades.length / validTrades.length) * 100;

    // Розрахунок Coefficient Execution
    const missedPercentage = (missedTrades.length / validTrades.length) * 100;
    const executionCoefficient = 100 - missedPercentage;

    return {
      totalTrades: validTrades.length,
      winningRatio: validTrades.length > 0 ? (winningTrades.length / validTrades.length) * 100 : 0,
      missedRatio: validTrades.length > 0 ? (missedTrades.length / validTrades.length) * 100 : 0,
      breakevenRatio: validTrades.length > 0 ? (breakevenTrades.length / validTrades.length) * 100 : 0,
      losingRatio: validTrades.length > 0 ? (losingTrades.length / validTrades.length) * 100 : 0,
      longWinrate: longTrades.length > 0 ? (longWins.length / longTrades.length) * 100 : 0,
      shortWinrate: shortTrades.length > 0 ? (shortWins.length / shortTrades.length) * 100 : 0,
      averageRR,
      bestSession,
      bestWeekday,
      bestPair,
      gainedRR,
      potentialRR,
      weekdayStats,
      pairStats,
      followingPlanPercentage,
      executionCoefficient,
      totalRoutines: presessions?.length || 0,
      totalRevenue,
      narrativeAccuracy
    };
  };

  const handleUpdate = () => {
    setChartKey(prevKey => prevKey + 1);
    fetchTradeData();
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true,
      easing: 'easeOutQuart',
      mode: 'show',
      duration: 1000
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          font: { size: 12 }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { 
          color: 'white',
          font: { size: 12 }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: { 
          color: 'white',
          font: { size: 12 }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  const weekdayChartData = {
    labels: ['Win', 'Missed', 'Breakeven', 'Loss'],
    datasets: [{
      data: [
        tradeStats.winningRatio,
        tradeStats.missedRatio || 0,
        tradeStats.breakevenRatio || 0,
        tradeStats.losingRatio || 0
      ],
      backgroundColor: [
        'rgba(0, 209, 178, 0.8)',  // Win - зелений (00D1B2)
        'rgba(147, 112, 219, 0.8)', // Missed - фіолетовий (9370db)
        'rgba(255, 147, 0, 0.8)',   // Breakeven - оранжевий (ff9300)
        'rgba(255, 82, 82, 0.8)'    // Loss - червоний (ff5252)
      ],
      borderColor: [
        'rgb(0, 209, 178)',
        'rgb(147, 112, 219)',
        'rgb(255, 147, 0)',
        'rgb(255, 82, 82)'
      ],
      borderWidth: 1
    }]
  };

  const weekdayOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Overall Winrate',
        color: 'white',
        font: { size: 14 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.raw.toFixed(2)}%`;
          }
        }
      },
      legend: {
        position: 'right',
        labels: {
          color: 'white',
          font: { size: 10 }
        }
      }
    },
    scales: {
      r: {
        ticks: {
          backdropColor: 'transparent',
          color: 'rgba(255, 255, 255, 0.7)',
          font: { size: 10 }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        pointLabels: {
          color: 'white',
          font: { size: 12 }
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      easing: 'easeOutBounce',
      duration: 1000
    }
  };

  const directionWinrateData = {
    labels: ['Long', 'Short'],
    datasets: [{
      label: 'Win Rate %',
      data: [tradeStats.longWinrate, tradeStats.shortWinrate],
      backgroundColor: [
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 99, 132, 0.8)'
      ],
      borderColor: [
        'rgb(75, 192, 192)',
        'rgb(255, 99, 132)'
      ],
      borderWidth: 1
    }]
  };

  // Дані для нових графіків
  const followingPlanData = {
    labels: ['Following Plan', 'Not Following'],
    datasets: [{
      data: [
        tradeStats.followingPlanPercentage,
        100 - tradeStats.followingPlanPercentage
      ],
      backgroundColor: [
        'rgba(0, 209, 178, 0.8)',  // Зелений (00D1B2)
        'rgba(255, 82, 82, 0.8)'   // Червоний (ff5252)
      ],
      borderColor: [
        'rgb(0, 209, 178)',
        'rgb(255, 82, 82)'
      ],
      borderWidth: 1
    }]
  };

  const narrativeAccuracyData = {
    labels: ['Correct Narratives', 'Incorrect Narratives'],
    datasets: [{
      data: [
        tradeStats.narrativeAccuracy,
        100 - tradeStats.narrativeAccuracy
      ],
      backgroundColor: [
        'rgba(0, 209, 178, 0.8)',  // Зелений (00D1B2)
        'rgba(255, 82, 82, 0.8)'   // Червоний (ff5252)
      ],
      borderColor: [
        'rgb(0, 209, 178)',
        'rgb(255, 82, 82)'
      ],
      borderWidth: 1
    }]
  };

  const executionData = {
    labels: ['Executed', 'Not Executed'],
    datasets: [{
      label: 'Percentage',
      data: [
        tradeStats.executionCoefficient, 
        100 - tradeStats.executionCoefficient
      ],
      backgroundColor: [
        'rgba(0, 209, 178, 0.8)',  // Зелений (00D1B2)
        'rgba(255, 82, 82, 0.8)'   // Червоний (ff5252)
      ],
      borderColor: [
        'rgb(0, 209, 178)',
        'rgb(255, 82, 82)'
      ],
      borderWidth: 1
    }]
  };

  const executionOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Execution Coefficient',
        color: 'white',
        font: { size: 14 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.raw.toFixed(2)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { 
          color: 'white',
          font: { size: 12 },
          callback: value => `${value}%`
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: { 
          color: 'white',
          font: { size: 12 }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    animation: {
      y: {
        easing: 'easeOutBounce',
        duration: 1000,
        from: 1000
      }
    }
  };

  const narrativeAccuracyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true,
      easing: 'easeOutBounce',
      duration: 1000
    },
    plugins: {
      title: {
        display: true,
        text: 'Narrative Accuracy',
        color: 'white',
        font: { size: 14 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.raw.toFixed(2)}%`;
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true,
      easing: 'easeOutBounce',
      duration: 1000
    },
    plugins: {
      title: {
        display: true,
        text: 'Following The Plan',
        color: 'white',
        font: { size: 14 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.raw.toFixed(2)}%`;
          }
        }
      },
      legend: {
        display: true,
        labels: {
          color: 'white',
          font: { size: 12 }
        }
      }
    }
  };

  return (
    <>
      <Overlay isVisible={!isCollapsed} onClick={() => setIsCollapsed(true)} />
      <Sidebar isCollapsed={isCollapsed}>
        {galleryItems.map((item) => (
          <MenuButton key={item.path} to={item.path}>
            {item.title}
          </MenuButton>
        ))}
      </Sidebar>
      <ToggleButton isCollapsed={isCollapsed} onClick={() => setIsCollapsed(!isCollapsed)}>
        <MenuOpenTwoToneIcon />
      </ToggleButton>
      <MainContent>
        <Header>
          <Greeting>{getGreeting()}</Greeting>
          <WorkPhrase>Let's get to work!</WorkPhrase>
        </Header>
        <TopRightButtons>
          <IconButton className="update-button" data-tooltip="Update Statistics" onClick={handleUpdate}>
            <CachedTwoToneIcon />
          </IconButton>
          <IconButton data-tooltip="Open Settings" onClick={handleSettings}>
            <SettingsTwoToneIcon />
          </IconButton>
        </TopRightButtons>
        
        <ContentWrapper>
          <StatsContent>
            <StatCard isAnimating={isStatsAnimating}>
              <StatLabel>Total Trades</StatLabel>
              <StatValue>{tradeStats.totalTrades}</StatValue>
            </StatCard>

            <StatCard isAnimating={isStatsAnimating}>
              <StatLabel>Total Routines</StatLabel>
              <StatValue>{tradeStats.totalRoutines}</StatValue>
            </StatCard>

            <StatCard isAnimating={isStatsAnimating}>
              <StatLabel>Average RR</StatLabel>
              <StatValue>{tradeStats.averageRR.toFixed(2)}R</StatValue>
            </StatCard>

            <StatCard isAnimating={isStatsAnimating}>
              <StatLabel>Gained & Potential RR</StatLabel>
              <GainedRRContainer>
                <RRValue type="gained">{tradeStats.gainedRR.toFixed(2)}R</RRValue>
                <RRSeparator>—</RRSeparator>
                <RRValue type="potential">{tradeStats.potentialRR.toFixed(2)}R</RRValue>
              </GainedRRContainer>
            </StatCard>

            <StatCard isAnimating={isStatsAnimating}>
              <StatLabel>Revenue</StatLabel>
              <RevenueValue value={tradeStats.totalRevenue}>
                {tradeStats.totalRevenue.toFixed(2)}%
              </RevenueValue>
            </StatCard>

            <StatCard isAnimating={isStatsAnimating}>
              <StatLabel>Best Weekday</StatLabel>
              <StatValue>{tradeStats.bestWeekday}</StatValue>
            </StatCard>

            <StatCard isAnimating={isStatsAnimating}>
              <StatLabel>Best Pair</StatLabel>
              <StatValue>{tradeStats.bestPair}</StatValue>
            </StatCard>

            <StatCard isAnimating={isStatsAnimating}>
              <StatLabel>Best Session</StatLabel>
              <StatValue>{tradeStats.bestSession}</StatValue>
            </StatCard>
          </StatsContent>

          <ChartContent>
            <ChartContainer>
              <PolarArea 
                key={chartKey}
                data={weekdayChartData} 
                options={weekdayOptions}
              />
            </ChartContainer>
            <ChartContainer>
              <Doughnut 
                key={chartKey}
                data={narrativeAccuracyData} 
                options={narrativeAccuracyOptions}
              />
            </ChartContainer>
            <ChartContainer>
              <Doughnut key={chartKey} data={followingPlanData} options={doughnutOptions} />
            </ChartContainer>
            <ChartContainer>
              <Bar key={chartKey} data={executionData} options={executionOptions} />
            </ChartContainer>
          </ChartContent>
        </ContentWrapper>
      </MainContent>
    </>
  );
}

export default Home;
