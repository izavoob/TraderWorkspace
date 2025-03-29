import React, { useState, useEffect, useRef } from 'react';
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
  z-index: 1001;
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
  height: ${props => (props.isCollapsed ? '110px' : '36px')};
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
  background-color:rgb(26, 26, 26);
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
  padding: 20px 0;
  border-radius: 8px;
  color: #fff;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 80px;
  min-height: 6.67vh;
  max-height: 128px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TopRightButtons = styled.div`
  position: fixed;
  flex-direction: column-reverse;
  top: 36px;
  right: 25px;
  display: flex;
  gap: 15px;
  z-index: 1001;
`;

const Greeting = styled.h1`
  margin: 0;
  font-size: 2.5em;
  color: #fff;
`;

const WorkPhrase = styled.p`
  color: #ff8c00;
  margin-top: 10px;
  font-size: 1.2em;
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
  cursor: pointer; /* Добавляем курсор pointer, чтобы показать, что элемент кликабельный */

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
  width: 110px;
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

// Добавляем стили для TradeCalendar из TradeJournal.jsx
const TradeCalendarContainer = styled.div`
  display: flex;
  gap: 5px;
  width: 100%;
  margin-top: 5px;
`;

const CalendarDay = styled.div`
  flex: 1;
  background-color: #252525;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  height: 125px;
  position: relative;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  opacity: 0.6;
  transition: opacity 0.3s ease;
  box-sizing: border-box;

  ${props => props.hasData && `
    opacity: 1;
  `}

  ${props => props.isToday && `
    &::after {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 10px;
      background: linear-gradient(45deg, #7425c9, #b886ee);
      -webkit-mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
      mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
  `}

  ${props => {
    if (!props.hasData || !props.dayResults) return '';
    
    const { totalProfitLoss, results } = props.dayResults;
    
    if (totalProfitLoss > 0) {
      return `
        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0, 230, 118, 0.3), transparent);
          border-radius: 8px;
        }
      `;
    } else if (totalProfitLoss < 0) {
      return `
        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(255, 82, 82, 0.3), transparent);
          border-radius: 8px;
        }
      `;
    } else if (results && results.includes('Breakeven')) {
      return `
        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(255, 147, 0, 0.3), transparent);
          border-radius: 8px;
        }
      `;
    } else if (results && results.includes('Missed')) {
      return `
        &::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(147, 112, 219, 0.3), transparent);
          border-radius: 8px;
        }
      `;
    }
    return '';
  }}
`;

const CalendarDayHeader = styled.div`
  font-size: 1.2em;
  color: rgb(230, 243, 255);
  font-weight: bold;
  margin-bottom: 8px;
`;

const CalendarDayMetrics = styled.div`
  font-size: 1em;
  position: relative;
  z-index: 1;
  color: #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const slideAnim = keyframes`
  0% { opacity: 0; transform: translateX(-15px) scale(0.95); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
`;

const PairContainer = styled.div`
  height: 20px;
  position: relative;
  overflow: hidden;
  width: 100%;
`;

const PairText = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  animation: ${slideAnim} 0.5s ease forwards;
  white-space: nowrap;
  font-weight: 700;
  letter-spacing: 0.5px;
  background: linear-gradient(45deg, #b886ee, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const MetricsValue = styled.span`
  ${props => {
    const numericValue = props.type === 'profit' || props.type === 'loss' 
      ? parseFloat(props.value) || 0 
      : 0;

    if (numericValue === 0) return 'color: #fff;';
    
    if (numericValue > 0) return 'color: #00e676;';
    if (numericValue < 0) return 'color: #ff5252;';
    
    if (props.type === 'breakeven') return 'color: #ff9300;';
    if (props.type === 'missed') return 'color: #9370db;';
    return 'color: #fff;';
  }}
  font-weight: bold;
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
  const [trades, setTrades] = useState([]); // Добавляем стейт для трейдов
  const [activePairIndex, setActivePairIndex] = useState({}); // Для анимации пар
  const navigate = useNavigate();
  const executionChartRef = useRef(null);

  const galleryItems = [
    { title: 'Trading Journal', path: '/trade-journal', description: 'Analyze your future trades in one place using our advanced tools and indicators.' },
    { title: 'Daily Routine', path: '/daily-routine', description: 'Add your daily thoughts and plans.' },
    { title: 'Performance Analysis', path: '/performance-analysis', description: 'Explore and improve your skills.' },
    { title: 'Statistics', path: '/statistics', description: 'All information about your trading.' },
    { title: 'Capital and RM', path: '/risk-management', description: 'Save your deposit.' },
    { title: 'Reporting System', path: '/reporting-system', description: 'Get detailed reports.' },
    { title: 'Learning Section', path: '/learning-section', description: 'Learn new skills.' },
  ];

  // Функция для загрузки трейдов
  const loadTrades = async () => {
    try {
      const loadedTrades = await window.electronAPI.getTrades();
      setTrades(loadedTrades || []);
    } catch (error) {
      console.error('Error loading trades:', error);
      setTrades([]);
    }
  };

  // Функции для календаря - вынесены ПЕРЕД эффектами, чтобы избежать ошибок ReferenceError
  const getCurrentWeekDates = () => {
    const curr = new Date();
    const week = [];
    
    // Меняем логику, чтобы воскресенье принадлежало текущей неделе
    curr.setDate(curr.getDate() - ((curr.getDay() + 6) % 7));
    
    for (let i = 0; i < 7; i++) {
      week.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }
    
    return week;
  };

  const getTradesForDate = (date) => {
    return trades.filter(trade => {
      if (!trade.date) return false;
      const tradeDate = new Date(trade.date);
      return tradeDate.toDateString() === date.toDateString();
    });
  };

  const calculateDayResult = (dayTrades) => {
    if (!dayTrades || dayTrades.length === 0) {
      return {
        totalProfitLoss: 0,
        totalGainedPoints: 0,
        pairs: [],
        results: [],
        hasData: false
      };
    }

    let totalProfitLoss = 0;
    let totalGainedPoints = 0;
    const results = [];
    const pairs = [];

    dayTrades.forEach(trade => {
      const profitValue = trade.profitLoss ? 
        parseFloat(trade.profitLoss.replace ? trade.profitLoss.replace(/[^-\d.]/g, '') : trade.profitLoss) || 0 : 0;
      totalProfitLoss += profitValue;

      const gainedValue = trade.gainedPoints ? 
        parseFloat(trade.gainedPoints.replace ? trade.gainedPoints.replace(/[^-\d.]/g, '') : trade.gainedPoints) || 0 : 0;
      totalGainedPoints += gainedValue;

      results.push(trade.result);
      if (trade.pair && !pairs.includes(trade.pair)) {
        pairs.push(trade.pair);
      }
    });

    return {
      totalProfitLoss: parseFloat(totalProfitLoss.toFixed(2)),
      totalGainedPoints: parseFloat(totalGainedPoints.toFixed(2)),
      pairs,
      results,
      hasData: true
    };
  };

  const formatDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  useEffect(() => {
    fetchTradeData();
    loadTrades(); // Загружаем трейды при монтировании
  }, []);

  // Эффект для анимации пар
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePairIndex(prev => {
        const newState = { ...prev };
        getCurrentWeekDates().forEach((date, idx) => {
          const dayTrades = getTradesForDate(date);
          const dayResults = calculateDayResult(dayTrades);
          if (dayResults.pairs && dayResults.pairs.length > 1) {
            const currentIndex = prev[idx] !== undefined ? prev[idx] : 0;
            newState[idx] = (currentIndex + 1) % dayResults.pairs.length;
          }
        });
        return newState;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [trades]);

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
    const shortWins = shortTrades.filter(trade => trade.result === 'Short');
    
    // Трейди тільки з результатами Win та Loss
    const winLossTrades = winningTrades.length + losingTrades.length;

    // Метрики для Trades Distribution (% від загальної кількості трейдів)
    const winDistribution = validTrades.length > 0 ? (winningTrades.length / validTrades.length) * 100 : 0;
    const missedDistribution = validTrades.length > 0 ? (missedTrades.length / validTrades.length) * 100 : 0;
    const breakevenDistribution = validTrades.length > 0 ? (breakevenTrades.length / validTrades.length) * 100 : 0;
    const lossDistribution = validTrades.length > 0 ? (losingTrades.length / validTrades.length) * 100 : 0;

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
      winningRatio: winLossTrades > 0 ? (winningTrades.length / winLossTrades) * 100 : 0, // Winrate тільки Win/Loss
      // Новые метрики для Trades Distribution
      winDistribution: winDistribution,
      missedDistribution: missedDistribution,
      breakevenDistribution: breakevenDistribution,
      lossDistribution: lossDistribution,
      // Старые метрики для обратной совместимости
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
  
  const navigateTo = (path) => {
    navigate(path);
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
        tradeStats.winDistribution || 0,
        tradeStats.missedDistribution || 0,
        tradeStats.breakevenDistribution || 0,
        tradeStats.lossDistribution || 0
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
        text: 'Trades distribution',
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
        display: false, // Убираем легенду
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
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true,
      easing: 'easeOutElastic',
      duration: 1000
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
        
        <TradeCalendarContainer>
          {getCurrentWeekDates().map((date, index) => {
            const dayTrades = getTradesForDate(date);
            const dayResults = calculateDayResult(dayTrades);
            const isToday = date.toDateString() === new Date().toDateString();
            
            const currentPairIndex = activePairIndex[index] || 0;
            const currentPair = dayResults.pairs[currentPairIndex];

            return (
              <CalendarDay 
                key={index}
                hasData={dayResults.hasData}
                isToday={isToday}
                dayResults={dayResults}
              >
                <CalendarDayHeader>{formatDate(date)}</CalendarDayHeader>
                {dayResults.hasData && (
                  <CalendarDayMetrics>
                    <PairContainer>
                      {currentPair && (
                        <PairText key={`${index}-${currentPairIndex}`}>
                          {currentPair}
                        </PairText>
                      )}
                    </PairContainer>
                    <MetricsValue 
                      type={dayResults.totalProfitLoss > 0 ? 'profit' : 'loss'}
                      value={dayResults.totalProfitLoss}
                    >
                      {dayResults.totalProfitLoss === 0 ? '0%' :
                       dayResults.totalProfitLoss > 0 ? `+${dayResults.totalProfitLoss}%` :
                       `${dayResults.totalProfitLoss}%`}
                    </MetricsValue>
                    <MetricsValue 
                      type={dayResults.totalGainedPoints > 0 ? 'profit' : 'loss'}
                      value={dayResults.totalGainedPoints}
                    >
                      {dayResults.totalGainedPoints === 0 ? '$0.00' :
                       dayResults.totalGainedPoints > 0 ? `+$${dayResults.totalGainedPoints.toFixed(2)}` :
                       `$${dayResults.totalGainedPoints.toFixed(2)}`}
                    </MetricsValue>
                  </CalendarDayMetrics>
                )}
              </CalendarDay>
            );
          })}
        </TradeCalendarContainer>
        
        <ContentWrapper>
          <StatsContent>
            <StatCard isAnimating={isStatsAnimating} onClick={() => navigateTo('/trade-journal')}>
              <StatLabel>Total Trades</StatLabel>
              <StatValue>{tradeStats.totalTrades}</StatValue>
            </StatCard>

            <StatCard isAnimating={isStatsAnimating} onClick={() => navigateTo('/daily-routine/pre-session')}>
              <StatLabel>Total Routines</StatLabel>
              <StatValue>{tradeStats.totalRoutines}</StatValue>
            </StatCard>

            <StatCard isAnimating={isStatsAnimating}>
              <StatLabel>Average RR</StatLabel>
              <StatValue>{tradeStats.averageRR.toFixed(2)}R</StatValue>
              <StatLabel>Gained & Potential RR</StatLabel>
              <GainedRRContainer>
                <RRValue type="gained">{tradeStats.gainedRR.toFixed(2)}R</RRValue>
                <RRSeparator>—</RRSeparator>
                <RRValue type="potential">{tradeStats.potentialRR.toFixed(2)}R</RRValue>
              </GainedRRContainer>
            </StatCard>

            <StatCard isAnimating={isStatsAnimating}>
              <StatLabel>Winrate</StatLabel>
              <StatValue>{tradeStats.winningRatio.toFixed(2)}%</StatValue>
            </StatCard>

            <StatCard isAnimating={isStatsAnimating} onClick={() => navigateTo('/risk-management')}>
              <StatLabel>Revenue</StatLabel>
              <RevenueValue value={tradeStats.totalRevenue}>
                {tradeStats.totalRevenue.toFixed(2)}%
              </RevenueValue>
            </StatCard>

            <StatCard isAnimating={isStatsAnimating}>
              <StatLabel>Best Weekday</StatLabel>
              <StatValue>{tradeStats.bestWeekday}</StatValue>
            </StatCard>

            <StatCard isAnimating={isStatsAnimating} onClick={() => navigateTo('/statistics/analytics')}>
              <StatLabel>Best Pair</StatLabel>
              <StatValue>{tradeStats.bestPair}</StatValue>
            </StatCard>

            <StatCard isAnimating={isStatsAnimating} onClick={() => navigateTo('/statistics/analytics')}>
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
              <Bar 
                key={chartKey} 
                data={executionData} 
                options={executionOptions}
                ref={executionChartRef}
              />
            </ChartContainer>
          </ChartContent>
        </ContentWrapper>
      </MainContent>
    </>
  );
}

export default Home;
