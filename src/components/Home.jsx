import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import UpdateIcon from '../assets/icons/update-icon.svg';
import SettingsIcon from '../assets/icons/settings-icon.svg';
import HideMenuIcon from '../assets/icons/hide-menu-icon.svg';
import ShowMenuIcon from '../assets/icons/show-menu-icon.svg';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';
import ArrowRightIcon from '../assets/icons/arrow-right-icon.svg';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend, ArcElement);

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
  margin-left: ${props => props.isCollapsed ? '42px' : '297px'};
  padding: 20px;
  background-color: #1a1a1a;
  color: #fff;
  margin-top: 30px;
  margin-right: 25px;
  margin-bottom: 25px;
  transition: margin-left 0.3s ease;
  height: calc(100vh - 85px);
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
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 15px rgba(116, 37, 201, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 85%;
  max-width: ${props => props.isCollapsed ? '1600px' : '1400px'};
  margin: 0 auto;
  padding: 15px;
  overflow: hidden;
  transition: max-width 0.3s ease;
  grid-auto-rows: minmax(min-content, 180px); // Фіксуємо висоту рядків
`;

const ChartContent = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); // Змінюємо на 2 колонки
  grid-template-rows: repeat(2, 1fr); // 2 ряди
  gap: 20px;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  max-width: 1400px; // Збільшуємо максимальну ширину
  margin: 0 auto;
  overflow: hidden;
`;

const ChartContainer = styled.div`
  background: rgba(116, 37, 201, 0.1);
  border-radius: 13px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(116, 37, 201, 0.2);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0 6px 20px rgba(116, 37, 201, 0.3);
  }

  ${({ isAnimating }) =>
    isAnimating &&
    css`
      animation: ${fadeInScale} 0.5s ease-out;
    `}

  & > canvas {
    max-width: 100% !important;
    max-height: 100% !important;
  }
`;

const MetricsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const StatCard = styled.div`
  background: rgba(116, 37, 201, 0.1);
  border-radius: 13px;
  padding: 30px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1.2;
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid rgba(116, 37, 201, 0.2);
  backdrop-filter: blur(5px);

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(116, 37, 201, 0.5);
    animation: ${glowEffect} 2s infinite;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 13px;
    padding: 1px;
    background: linear-gradient(
      45deg, 
      rgba(116, 37, 201, 0.5),
      rgba(184, 134, 238, 0.5)
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  ${({ isAnimating }) =>
    isAnimating &&
    css`
      animation: ${fadeInScale} 0.5s ease-out, ${pulseAnimation} 2s ease-in-out infinite;
    `}
`;

const WinrateContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0;
`;

const WinrateBox = styled.div`
  padding: 8px 16px;
  border-radius: 8px;
  background-color: ${props => props.type === 'long' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)'};
  color: ${props => props.type === 'long' ? '#4bc0c0' : '#ff6384'};
  font-weight: bold;
`;

const GainedRRContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
`;

const RRValue = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  color: ${props => props.type === 'gained' ? '#4bc0c0' : '#B886EE'};
`;

const RRSeparator = styled.span`
  color: #666;
  font-weight: bold;
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
  padding: 20px 0;
  height: 80px; // Фіксована висота для навігації
  margin-top: auto;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 20px;
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
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
      if (trades && trades.length > 0) {
        const stats = calculateStats(trades);
        setTradeStats(stats);
      }
      setTimeout(() => {
        setIsStatsAnimating(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching trade data:', error);
      setIsStatsAnimating(false);
    }
  };

  const calculateStats = (trades) => {
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
      };
    }

    const validTrades = trades.filter(trade => trade.result);
    const winningTrades = validTrades.filter(trade => trade.result === 'Win');
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
    const missedTrades = validTrades.filter(trade => trade.result === 'Missed');
    const missedPercentage = (missedTrades.length / validTrades.length) * 100;
    const executionCoefficient = 100 - missedPercentage;

    return {
      totalTrades: validTrades.length,
      winningRatio: validTrades.length > 0 ? (winningTrades.length / validTrades.length) * 100 : 0,
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
    };
  };

  const handleUpdate = () => {
    fetchTradeData();
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
    labels: ['Win', 'Loss'],
    datasets: [{
      data: [
        tradeStats.winningRatio, // Відсоток виграшних трейдів
        100 - tradeStats.winningRatio // Відсоток програшних трейдів
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.8)', // Зелений для Win
        'rgba(255, 99, 132, 0.8)'  // Червоний для Loss
      ],
      borderColor: [
        'rgb(75, 192, 192)',
        'rgb(255, 99, 132)'
      ],
      borderWidth: 1
    }]
  };

  const weekdayOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white',
          font: { size: 12 }
        }
      },
      title: {
        display: true,
        text: 'Overall Winrate',
        color: 'white',
        font: { size: 14 }
      }
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
        'rgba(116, 37, 201, 0.8)',
        'rgba(255, 99, 132, 0.8)'
      ],
      borderColor: [
        'rgb(116, 37, 201)',
        'rgb(255, 99, 132)'
      ],
      borderWidth: 1
    }]
  };

  const executionData = {
    labels: ['Execution Coefficient'],
    datasets: [{
      label: 'Execution %',
      data: [tradeStats.executionCoefficient],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1,
      barThickness: 50
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
        }
      },
      x: {
        ticks: { color: 'white', font: { size: 12 } }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white',
          font: { size: 12 }
        }
      },
      title: {
        display: true,
        text: 'Following The Plan',
        color: 'white',
        font: { size: 14 }
      }
    }
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
      <ToggleButton isCollapsed={isCollapsed} onClick={toggleSidebar}>
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
        
        <SlideContainer>
          <Slide active={activeSlide === 0} direction="prev">
            <ContentWrapper>
              <StatsContent isCollapsed={isCollapsed}>
                <StatCard isAnimating={isStatsAnimating}>
                  <StatLabel>Total Trades</StatLabel>
                  <StatValue>{tradeStats.totalTrades}</StatValue>
                </StatCard>

                <StatCard isAnimating={isStatsAnimating}>
                  <StatLabel>Best Pair</StatLabel>
                  <StatValue>{tradeStats.bestPair}</StatValue>
                </StatCard>

                <StatCard isAnimating={isStatsAnimating}>
                  <StatLabel>Average RR</StatLabel>
                  <StatValue>{tradeStats.averageRR.toFixed(2)}R</StatValue>
                </StatCard>

                <StatCard isAnimating={isStatsAnimating}>
                  <StatLabel>Best Session</StatLabel>
                  <StatValue>{tradeStats.bestSession}</StatValue>
                </StatCard>

                <StatCard isAnimating={isStatsAnimating}>
                  <StatLabel>Best Weekday</StatLabel>
                  <StatValue>{tradeStats.bestWeekday}</StatValue>
                </StatCard>

                <StatCard isAnimating={isStatsAnimating}>
                  <StatLabel>Gained & Potential RR</StatLabel>
                  <GainedRRContainer>
                    <RRValue type="gained">{tradeStats.gainedRR.toFixed(2)}R</RRValue>
                    <RRSeparator>—</RRSeparator>
                    <RRValue type="potential">{tradeStats.potentialRR.toFixed(2)}R</RRValue>
                  </GainedRRContainer>
                </StatCard>
              </StatsContent>
            </ContentWrapper>
            <SlideNavigation>
              <NavigationArrow onClick={() => setActiveSlide(0)}>
                <img src={ArrowLeftIcon} alt="Previous" />
              </NavigationArrow>
              <SlideIndicator active={activeSlide === 0} />
              <SlideIndicator active={activeSlide === 1} />
              <NavigationArrow onClick={() => setActiveSlide(1)}>
                <img src={ArrowRightIcon} alt="Next" />
              </NavigationArrow>
            </SlideNavigation>
          </Slide>

          <Slide active={activeSlide === 1} direction="next">
            <ContentWrapper>
              <ChartContent>
                <ChartContainer isAnimating={isStatsAnimating}>
                  <Doughnut 
                    data={weekdayChartData} 
                    options={weekdayOptions}
                  />
                </ChartContainer>
                <ChartContainer isAnimating={isStatsAnimating}>
                  <Bar 
                    data={directionWinrateData} 
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        title: {
                          display: true,
                          text: 'Long/Short Win Rate',
                          color: 'white',
                          font: { size: 14 }
                        }
                      }
                    }}
                  />
                </ChartContainer>
                <ChartContainer isAnimating={isStatsAnimating}>
                  <Doughnut data={followingPlanData} options={doughnutOptions} />
                </ChartContainer>
                <ChartContainer isAnimating={isStatsAnimating}>
                  <Bar data={executionData} options={executionOptions} />
                </ChartContainer>
              </ChartContent>
            </ContentWrapper>
            <SlideNavigation>
              <NavigationArrow onClick={() => setActiveSlide(0)}>
                <img src={ArrowLeftIcon} alt="Previous" />
              </NavigationArrow>
              <SlideIndicator active={activeSlide === 0} />
              <SlideIndicator active={activeSlide === 1} />
              <NavigationArrow onClick={() => setActiveSlide(1)}>
                <img src={ArrowRightIcon} alt="Next" />
              </NavigationArrow>
            </SlideNavigation>
          </Slide>
        </SlideContainer>
      </MainContent>
    </>
  );
}

export default Home;
