import React, { useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import NoteModal from '../../Notes/NoteModal.jsx';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shineEffect = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const DatePickerStyles = createGlobalStyle`
  .react-datepicker {
    background-color: #2e2e2e;
    border: 1px solid #5e2ca5;
    font-family: inherit;
  }

  .react-datepicker__header {
    background: #1a1a1a;
    border-bottom: 1px solid #5e2ca5;
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name,
  .react-datepicker__day {
    color: #fff;
  }

  .react-datepicker__day:hover {
    background: linear-gradient(45deg, #7425C9, rgb(230, 243, 255));
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range {
    background: linear-gradient(45deg, #7425C9, rgb(230, 243, 255));
    color: #fff;
  }

  .react-datepicker__day--keyboard-selected {
    background: linear-gradient(45deg, #7425C9, rgb(230, 243, 255));
    color: #fff;
  }

  .react-datepicker__navigation {
    top: 8px;
  }

  .react-datepicker__navigation-icon::before {
    border-color: rgb(230, 243, 255);
  }

  .react-datepicker__day--in-selecting-range:not(.react-datepicker__day--in-range) {
    background-color: rgba(116, 37, 201, 0.5);
  }
`;

const Container = styled.div`
 
  min-height: 100vh;
  background-color: #1a1a1a;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
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

const BackButton = styled(Link)`
  background: conic-gradient(from 45deg, #7425C9, #b886ee);
  border: none;
  padding: 0;
  width: 200px;
  height: 100%;
  border-radius: 8px;
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

const Title = styled.h1`
  margin: 0;
  font-size: 2.5em;
  color: #fff;
  text-align: center;
  z-index: 1;
`;
const Subtitle = styled.h2`
  margin: 5px auto 0;
  font-size: 1.2em;
  color: #ff8c00;
  text-align: center;
  z-index: 1;
  font-weight: normal;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
 
  margin-top: 20px
`;

const SectionContainer = styled.div`
  background-color: #2e2e2e;
  border-radius: 15px;
      box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;

  padding: 30px;
  box-sizing: border-box;
  height: fit-content;
  min-width: 0;
`;

const SectionTitle = styled.h2`
  color: rgb(230, 243, 255);
  margin: 0 0 20px;
  font-size: 1.8em;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(94, 44, 165, 0.4);
`;

const DateSelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  position: relative;
  margin-top: 12px;
`;

const DateRangeButton = styled.button`
  padding: 10px 15px;
  background-color: #1a1a1a;
  border: 2px solid #5e2ca5;
  border-radius: 8px;
  color: white;
  font-size: 1em;
  cursor: pointer;
  width: 100%;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #2e2e2e;
    box-shadow: 0 5px 15px rgba(94, 44, 165, 0.4);
  }
`;

const DateRangePopup = styled.div`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  background-color: #1a1a1a;
  border: 2px solid #5e2ca5;
  border-radius: 8px;
  padding: 15px;
  margin-top: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
`;

const StyledDatePicker = styled(DatePicker)`
  background: #2e2e2e;
  border: 1px solid #5e2ca5;
  color: #fff;
  padding: 11px;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
  font-size: 11px;

  &:focus {
    outline: none;
    border-color: #B886EE;
  }
`;

const ApplyButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(45deg, #7425C9, #b886ee);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-end;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(116, 37, 201, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const WeekInfo = styled.div`
  font-size: 1.8em;
  color: rgb(230, 243, 255);
  text-align: center;
  font-weight: bold;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const MetricCard = styled.div`
  background-color: rgb(26, 26, 26);
  padding: 20px;
  border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(116, 37, 201, 0.1), rgba(184, 134, 238, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(94, 44, 165, 0.4);
    
    &:before {
      opacity: 1;
    }
  }
`;

const MetricTitle = styled.h3`
  margin: 0;
  color: rgb(230, 243, 255);
  font-size: 1.1em;
`;

const MetricValue = styled.div`
  font-size: 1.5em;
  font-weight: bold;
  color: ${props => props.color || '#fff'};
`;

const AnalysisHistoryContainer = styled.div`
  margin-top: 40px;
`;

const HistoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const HistoryCard = styled(Link)`
  background-color: #2e2e2e;
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(94, 44, 165, 0.4);
  }
`;

const HistoryDate = styled.div`
  font-size: 1.2em;
  color: rgb(230, 243, 255);
  margin-bottom: 15px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
`;

const StatLabel = styled.span`
  color: #888;
`;

const StatValue = styled.span`
  color: ${props => props.color || '#fff'};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 40px;
  padding-bottom: 40px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: white;
  background-color: #5e2ca5;
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

  &.cancel {
    background-color: #4a4a4a;
    &:hover {
      background-color: #5a5a5a;
    }
  }

  &.save {
    background-color: #5e2ca5;
    &:hover {
      background-color: #4a1a8d;
    }
  }
`;

const TradesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const TradeCard = styled(Link)`
  background-color: rgb(26, 26, 26);
  padding: 20px;
  border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(116, 37, 201, 0.1), rgba(184, 134, 238, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(94, 44, 165, 0.4);
    
    &:before {
      opacity: 1;
    }
  }
`;

const TradeNumber = styled.div`
  font-size: 1.2em;
  color: rgb(230, 243, 255);
  margin-bottom: 15px;
`;

const TradeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
`;

const TradeLabel = styled.span`
  color: #888;
`;

const TradeValue = styled.span`
  color: ${props => {
    if (props.result === 'Win') return '#4caf50';
    if (props.result === 'Loss') return '#ff4444';
    if (props.result === 'Breakeven') return '#ffd700';
    if (props.result === 'Missed') return '#9c27b0';
    return '#fff';
  }};
`;

const PreSessionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const PreSessionCard = styled.div`
  background-color: #1a1a1a;
  padding: 20px;
  border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(116, 37, 201, 0.1), rgba(184, 134, 238, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(94, 44, 165, 0.4);
    
    &:before {
      opacity: 1;
    }
  }
`;

const DayOfWeek = styled.div`
  font-size: 1.3em;
  font-weight: bold;
  color: #fff;
  margin-bottom: 5px;
`;

const DateInfo = styled.div`
  font-size: 1em;
  color: #888;
  margin-bottom: 15px;
`;

const PlanInfo = styled.div`
  font-size: 1em;
  color: #888;
  margin-bottom: 10px;
`;

const PlanValue = styled.span`
  color: ${props => {
    if (props.plan === 'Bullish') return '#4caf50';
    if (props.plan === 'Bearish') return '#ff4444';
    return '#ff4444';
  }};
  font-weight: normal;
`;

const ExecutionInfo = styled.div`
  font-size: 1em;
  color: #888;
  margin-bottom: 10px;
`;

const ExecutionValue = styled.span`
  color: ${props => {
    switch (props.execution) {
      case 'Missed':
        return '#9c27b0';
      case 'Excellent':
        return '#4caf50';
      case 'Good':
        return '#2196f3';
      case 'Bad':
        return '#ff9800';
      case 'Terrible':
        return '#ff4444';
      default:
        return '#fff';
    }
  }};
  font-weight: normal;
`;

const OutcomeInfo = styled.div`
  font-size: 1em;
  color: #888;
  margin-bottom: 10px;
`;

const OutcomeValue = styled.span`
  color: ${props => {
    if (props.outcome === 'Bullish') return '#4caf50';
    if (props.outcome === 'Bearish') return '#ff4444';
    return '#4caf50';
  }};
  font-weight: normal;
`;

const PlanOutcomeInfo = styled.div`
  font-size: 1em;
  color: #888;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CheckIcon = styled.span`
  color: ${props => props.checked ? '#4caf50' : '#ff4444'};
  margin-left: 5px;
  font-size: 1.2em;
`;

const BlocksContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const DatePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #2e2e2e;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;

  border-radius: 15px;
  padding: 30px;
  box-sizing: border-box;
  height: fit-content;
  min-width: 0;
  min-height: 225px;
`;

const VideoAnalysisContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #2e2e2e;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
  border-radius: 15px;
  padding: 30px;
  box-sizing: border-box;
  height: fit-content;
  min-width: 0;
`;

const VideoInput = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 2px solid #5e2ca5;
  background-color: #1a1a1a;
  color: white;
  font-size: 1em;
`;

const ViewButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(45deg, #7425C9, #b886ee);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(116, 37, 201, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const EmptyMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 20px;
  color: #888;
  font-style: italic;
`;

const ActionButton = styled.button`
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
  justify-content: center;
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

const NotesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NoteCard = styled.div`
  background-color: #2e2e2e;
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(94, 44, 165, 0.4);
  }
`;

const NoteContent = styled.div`
  cursor: pointer;
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const NoteTitle = styled.h3`
  margin: 0;
  color: rgb(230, 243, 255);
  font-size: 1.1em;
`;

const TradeLink = styled.span`
  background: rgba(94, 44, 165, 0.2);
  padding: 5px 10px;
  border-radius: 8px;
  color: #b886ee;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(94, 44, 165, 0.3);
  }
`;

const NoteText = styled.div`
  color: #888;
`;

const TagBadge = styled.span`
  background-color: ${props => {
    if (props.type === 'Note') return '#7425C9';
    if (props.type === 'presession') return '#7425C9';
    if (props.type === 'trade') return '#B886EE';
    return '#5e2ca5';
  }};
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
`;

const NoNotesMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #888;
  font-style: italic;
`;

const DateRangeDisplay = styled.div`
  background: rgb(26 26 26);
  border: 2px solid #5e2ca5;
  color: #fff;
  padding: 11px;
  border-radius: 8px;
  text-align: center;
  font-size: 20px;
`;

function CreateWPA() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [weekNumber, setWeekNumber] = useState(null);
  const [metrics, setMetrics] = useState({
    totalTrades: 0,
    missedTrades: 0,
    executionCoefficient: 0,
    winRate: 0,
    followingPlan: 0,
    narrativeAccuracy: 0,
    gainedRR: 0,
    potentialRR: 0,
    averageRR: 0,
    profit: 0,
    profitFactor: 0,
    realisedPL: 0,
    averagePL: 0,
    averageLoss: 0,
    maxDrawdown: 0,
    tradeEfficiency: 0,
    breakevenTrades: 0,
    winLossRatio: 0
  });
  const [preSessions, setPreSessions] = useState([]);
  const [trades, setTrades] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      if (id) {
        try {
          const analysis = await window.electronAPI.getPerformanceAnalysis(id);
          if (analysis) {
            const start = new Date(analysis.startDate);
            const end = new Date(analysis.endDate);
            setStartDate(start);
            setEndDate(end);
            setWeekNumber(getWeekNumber(start));
            setVideoUrl(analysis.videoUrl || '');
            loadData(start, end);
          }
        } catch (error) {
          console.error('Error loading analysis:', error);
        }
      } else {
        const savedStartDate = localStorage.getItem('wpaStartDate');
        const savedEndDate = localStorage.getItem('wpaEndDate');
        
        if (savedStartDate && savedEndDate) {
          const start = new Date(savedStartDate);
          const end = new Date(savedEndDate);
          setStartDate(start);
          setEndDate(end);
          loadData(start, end);
        }
      }
    };

    loadInitialData();
  }, [id]);

  const loadData = async (start, end) => {
    try {
      const weekNum = getWeekNumber(start);
      setWeekNumber(weekNum);
      await loadMetrics(start, end);
      await loadPreSessions(start, end);
      await loadTrades(start, end);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleApplyDateRange = () => {
    if (startDate && endDate) {
      setWeekNumber(getWeekNumber(startDate));
      loadData(startDate, endDate);
      setIsDatePickerOpen(false);
    }
  };

  const getWeekNumber = (date) => {
    if (!date) return null;
    
    const target = new Date(date);
    const firstDayOfYear = new Date(target.getFullYear(), 0, 1);
    const pastDaysOfYear = (target - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  useEffect(() => {
    if (startDate) {
      setWeekNumber(getWeekNumber(startDate));
    }
  }, [startDate]);

  const loadTrades = async (start, end) => {
    try {
      const allTrades = await window.electronAPI.getTrades();
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
      
      const periodTrades = allTrades.filter(trade => {
        const tradeDate = new Date(trade.date);
        return tradeDate >= start && tradeDate <= endDate;
      });
      setTrades(periodTrades);
      return periodTrades;
    } catch (error) {
      console.error('Error loading trades:', error);
      return [];
    }
  };

  const loadPreSessions = async (start, end) => {
    try {
      console.log('Loading pre-sessions for date range:', start, end);
      const allPreSessions = await window.electronAPI.getAllPresessions();
      
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
      
      const filteredPreSessions = allPreSessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= start && sessionDate <= endDate;
      });
      
      console.log(`Found ${filteredPreSessions.length} pre-sessions in date range`);
      
      filteredPreSessions.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setPreSessions(filteredPreSessions);
    } catch (error) {
      console.error('Error loading pre-sessions:', error);
    }
  };

  const loadMetrics = async (start, end) => {
    try {
      // Спочатку завантажуємо всі пре-сесії та трейди
      const allPreSessions = await window.electronAPI.getAllPresessions();
      const allTrades = await window.electronAPI.getTrades();
      
      // Фільтруємо по даті
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
      
      const periodPresessions = allPreSessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= start && sessionDate <= endDate;
      });
      
      const periodTrades = allTrades.filter(trade => {
        const tradeDate = new Date(trade.date);
        return tradeDate >= start && tradeDate <= endDate;
      });
      
      console.log(`Фільтровані пре-сесії (${periodPresessions.length}):`, periodPresessions);
      console.log(`Фільтровані трейди (${periodTrades.length}):`, periodTrades);
      
      // Зберігаємо відфільтровані дані
      setPreSessions(periodPresessions);
      setTrades(periodTrades);
      
      // Решта коду для розрахунку метрик
      // Base metrics
      const totalTrades = periodTrades.length;
      const missedTrades = periodTrades.filter(t => t && t.result === 'Missed').length;
      const winTrades = periodTrades.filter(t => t && t.result === 'Win').length;
      const lossTrades = periodTrades.filter(t => t && t.result === 'Loss').length;
      const breakevenTrades = periodTrades.filter(t => t && t.result === 'Breakeven').length;
      const followingPlanTrades = periodTrades.filter(t => t && t.followingPlan).length;
      
      // Execution Coefficient
      const executionCoefficient = totalTrades ? ((totalTrades - missedTrades) / totalTrades) * 100 : 0;
      
      // Narrative Accuracy - абсолютно новий підхід до розрахунку
      const totalPresessions = periodPresessions.length;
      console.log('Pre-sessions for Narrative Accuracy:', periodPresessions);
      
      // Проходимо кожну пре-сесію і рахуємо її як "активну", якщо для неї встановлено будь-яке truthy значення
      let activeCount = 0;
      
      periodPresessions.forEach(session => {
        // Виводимо детальну інформацію по кожній сесії для дебагу
        console.log('Detailed session info:', {
          id: session.id,
          date: session.date,
          narrative: session.narrative,
          plan_outcome: session.plan_outcome,
          plan_outcome_type: typeof session.plan_outcome,
          plan_outcome_toString: String(session.plan_outcome)
        });
        
        // Вважаємо сесію активною, якщо plan_outcome має будь-яке з наступних значень:
        // - число 1
        // - boolean true
        // - рядок "1" або "true"
        if (
          session.plan_outcome === 1 || 
          session.plan_outcome === true || 
          session.plan_outcome === "1" || 
          session.plan_outcome === "true"
        ) {
          activeCount++;
          console.log(`Session ${session.id} is ACTIVE ✓`);
        } else {
          console.log(`Session ${session.id} is INACTIVE ✗`);
        }
      });
      
      // Розраховуємо процент активних сесій
      const narrativeAccuracy = totalPresessions > 0 ? Math.round((activeCount / totalPresessions) * 100) : 0;
      
      console.log('Final Narrative Accuracy calculation:', {
        totalPresessions,
        activeCount,
        narrativeAccuracy
      });

      // Helper function to parse points/money values
      const parseMoneyValue = (value) => {
        if (!value) return 0;
        return parseFloat(value.replace(/[^-0-9.]/g, '')) || 0;
      };

      // Gained RR
      const gainedRR = periodTrades.reduce((sum, t) => {
        if (!t) return sum;
        const rr = parseFloat(t.rr) || 0;
        if (t.result === 'Loss') {
          return sum - Math.abs(parseFloat(t.profitLoss) || 0);
        }
        return sum + rr;
      }, 0);
      
      // Potential RR
      const potentialRR = periodTrades
        .filter(t => t && t.result === 'Missed')
        .reduce((sum, t) => sum + (parseFloat(t.rr) || 0), 0);
      
      // Average RR
      const tradeCount = winTrades + lossTrades;
      const averageRR = tradeCount ? gainedRR / tradeCount : 0;
      
      // Profit
      const profit = periodTrades.reduce((sum, t) => {
        if (!t) return sum;
        return sum + (parseFloat(t.profitLoss) || 0);
      }, 0);
      
      // Realised P&L - fixed calculation
      const realisedPL = periodTrades
        .filter(t => t && (t.result === 'Win' || t.result === 'Loss'))
        .reduce((sum, t) => sum + parseMoneyValue(t.gainedPoints), 0);
      
      // Average P&L - fixed calculation
      const totalWinPoints = periodTrades
        .filter(t => t && t.result === 'Win')
        .reduce((sum, t) => sum + parseMoneyValue(t.gainedPoints), 0);
      const averagePL = winTrades ? totalWinPoints / winTrades : 0;
      
      // Average Loss - fixed calculation
      const totalLossPoints = periodTrades
        .filter(t => t && t.result === 'Loss')
        .reduce((sum, t) => sum + parseMoneyValue(t.gainedPoints), 0);
      const averageLoss = lossTrades ? Math.abs(totalLossPoints / lossTrades) : 0;
      
      // Win/Loss Ratio - fixed calculation
      const avgWin = winTrades ? Math.abs(totalWinPoints / winTrades) : 0;
      const avgLoss = lossTrades ? Math.abs(totalLossPoints / lossTrades) : 0;
      const winLossRatio = avgLoss !== 0 ? avgWin / avgLoss : 0;

      // Maximum Drawdown calculation
      let maxDrawdown = 0;
      let peak = 0;
      let currentBalance = 0;
      
      periodTrades.forEach(trade => {
        if (!trade) return;
        const pl = parseFloat(trade.profitLoss) || 0;
        currentBalance += pl;
        
        if (currentBalance > peak) {
          peak = currentBalance;
        }
        
        const drawdown = peak - currentBalance;
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown;
        }
      });
      
      setMetrics({
        totalTrades,
        missedTrades,
        executionCoefficient,
        winRate: totalTrades ? (winTrades / totalTrades) * 100 : 0,
        followingPlan: totalTrades ? (followingPlanTrades / totalTrades) * 100 : 0,
        narrativeAccuracy: Math.round(narrativeAccuracy), // округляем до целого числа
        gainedRR,
        potentialRR,
        averageRR,
        profit,
        profitFactor: Math.abs(totalLossPoints) ? Math.abs(totalWinPoints / totalLossPoints) : 0,
        realisedPL,
        averagePL,
        averageLoss,
        maxDrawdown, // Теперь maxDrawdown определен и может быть использован
        breakevenTrades,
        winLossRatio
      });
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (!startDate || !endDate) return;

      console.log('Saving analysis with metrics:', metrics);

      const analysisData = {
        id: id || uuidv4(),
        type: 'weekly',
        startDate: startDate.toISOString().split('T')[0],
        endDate: new Date(endDate.setHours(23, 59, 59, 999)).toISOString().split('T')[0],
        weekNumber: getWeekNumber(startDate),
        totalTrades: metrics.totalTrades || 0,
        missedTrades: metrics.missedTrades || 0,
        executionCoefficient: metrics.executionCoefficient || 0,
        winRate: metrics.winRate || 0,
        followingPlan: metrics.followingPlan || 0,
        narrativeAccuracy: metrics.narrativeAccuracy || 0,
        gainedRR: metrics.gainedRR || 0,
        potentialRR: metrics.potentialRR || 0,
        averageRR: metrics.averageRR || 0,
        profit: metrics.profit || 0,
        profitFactor: metrics.profitFactor || 0,
        realisedPL: metrics.realisedPL || 0,
        averagePL: metrics.averagePL || 0,
        averageLoss: metrics.averageLoss || 0,
        videoUrl: videoUrl || '',
        trades: trades.map(trade => trade.id),
        routines: preSessions.map(session => ({
          id: session.id,
          type: 'presession'
        }))
      };

      console.log('Saving analysis data:', analysisData);

      if (id) {
        console.log('Updating existing analysis with ID:', id);
        await window.electronAPI.updatePerformanceAnalysis(id, analysisData);
      } else {
        console.log('Creating new analysis');
        await window.electronAPI.savePerformanceAnalysis(analysisData);
      }

      // Очищаємо localStorage після успішного збереження
      localStorage.removeItem('wpaStartDate');
      localStorage.removeItem('wpaEndDate');

      navigate('/performance-analysis/wpa');
    } catch (error) {
      console.error('Error saving analysis:', error);
    }
  };

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };
  
  const handleViewVideo = () => {
    if (videoUrl) {
      window.open(videoUrl, '_blank', 'noopener,noreferrer');
    }
  };
  
  const handlePreSessionClick = (id) => {
    navigate(`/daily-routine/pre-session/full/${id}`);
  };

  useEffect(() => {
    const loadNotes = async () => {
      if (startDate && endDate) {
        try {
          console.log('Завантаження нотаток для періоду:', { startDate, endDate });
          const allNotes = await window.electronAPI.getAllNotes();
          console.log('Отримано нотаток з бази даних:', allNotes.length);
          
          const filteredNotes = allNotes.filter(note => {
            const noteDate = note.tradeDate ? new Date(note.tradeDate) : null;
            if (!noteDate) return false;
            
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            
            return noteDate >= start && noteDate <= end;
          });
          
          console.log('Відфільтровано нотаток в діапазоні дат:', filteredNotes.length);
          
          // Попередньо завантажимо зображення для нотаток
          for (const note of filteredNotes) {
            if (note.id) {
              try {
                const images = await window.electronAPI.getNoteImages(note.id);
                if (images && images.length > 0) {
                  console.log(`Завантажено ${images.length} зображень для нотатки ${note.id}`);
                  // Додаємо зображення до нотатки
                  note.images = images;
                }
              } catch (err) {
                console.error(`Помилка завантаження зображень для нотатки ${note.id}:`, err);
              }
            }
          }
          
          setNotes(filteredNotes);
        } catch (error) {
          console.error('Error loading notes:', error);
        }
      }
    };
    
    loadNotes();
  }, [startDate, endDate]);

  const handleNoteClick = async (note) => {
    console.log('Відкриття нотатки:', note);
    
    // Перевіримо, чи є зображення у нотатці
    if (note.id && (!note.images || note.images.length === 0)) {
      console.log('Завантаження зображень для нотатки перед відкриттям:', note.id);
      try {
        const images = await window.electronAPI.getNoteImages(note.id);
        if (images && images.length > 0) {
          console.log(`Для нотатки ${note.id} завантажено ${images.length} зображень`);
          note.images = images;
          // Окремо логуємо шляхи до зображень для діагностики
          images.forEach((img, index) => {
            console.log(`Зображення ${index+1}:`, {
              id: img.id,
              path: img.image_path,
              fullPath: img.fullImagePath || '(немає)'
            });
          });
        } else {
          console.log(`Для нотатки ${note.id} не знайдено зображень`);
          note.images = [];
        }
      } catch (err) {
        console.error(`Помилка завантаження зображень для нотатки ${note.id}:`, err);
        note.images = [];
      }
    } else if (note.images && note.images.length > 0) {
      console.log(`Нотатка ${note.id} вже має ${note.images.length} зображень`);
    }
    
    setSelectedNote({...note}); // Створюємо нову копію об'єкта, щоб уникнути проблем з реактивністю
    setIsModalOpen(true);
  };

  const handleSourceClick = async (e, sourceType, sourceId) => {
    e.stopPropagation();
    if (sourceType === 'trade') {
      navigate(`/trade/${sourceId}`);
    } else if (sourceType === 'presession') {
      navigate(`/daily-routine/pre-session/full/${sourceId}`);
    }
  };

  const renderPreSessions = () => (
    <SectionContainer>
      <SectionTitle>Analysis History</SectionTitle>
      <PreSessionsGrid>
        {preSessions.length > 0 ? (
          preSessions.map(session => (
            <PreSessionCard key={session.id} onClick={() => handlePreSessionClick(session.id)}>
              <DayOfWeek>{getDayOfWeek(session.date)}</DayOfWeek>
              <DateInfo>{new Date(session.date).toLocaleDateString()}</DateInfo>
              <PlanInfo>Plan: <PlanValue plan={session.narrative}>{session.narrative || 'No plan'}</PlanValue></PlanInfo>
              <ExecutionInfo>Execution: <ExecutionValue execution={session.execution}>{session.execution || 'No trades'}</ExecutionValue></ExecutionInfo>
              <OutcomeInfo>Outcome: <OutcomeValue outcome={session.outcome}>{session.outcome || 'No Trades'}</OutcomeValue></OutcomeInfo>
              <PlanOutcomeInfo>
                Plan = <CheckIcon checked={session.plan_outcome === 1}>{session.plan_outcome === 1 ? '✓' : '✗'}</CheckIcon>
              </PlanOutcomeInfo>
            </PreSessionCard>
          ))
        ) : (
          <EmptyMessage>No pre-sessions found for this date range</EmptyMessage>
        )}
      </PreSessionsGrid>
    </SectionContainer>
  );

  const renderDateSelection = () => (
    <BlocksContainer>
      <DatePickerContainer>
        <SectionTitle>Selected Date Range</SectionTitle>
        <DateSelectionContainer>
          <DateRangeDisplay>
            {startDate && endDate
              ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
              : 'No date range selected'}
          </DateRangeDisplay>
        </DateSelectionContainer>
      </DatePickerContainer>
      
      <VideoAnalysisContainer>
        <SectionTitle>Video Analysis</SectionTitle>
        <VideoInput 
          type="text" 
          placeholder="Enter video URL" 
          value={videoUrl} 
          onChange={(e) => setVideoUrl(e.target.value)} 
        />
        <ViewButton onClick={handleViewVideo}>View</ViewButton>
      </VideoAnalysisContainer>
    </BlocksContainer>
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDatePickerOpen && !event.target.closest('.date-picker-popup')) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDatePickerOpen]);

  const getSourceText = (note) => {
    console.log('Getting source text for note:', note);
    
    const sourceType = note.source_type || note.sourceType;
    const tradeNo = note.trade_no;
    const tradeDate = note.trade_date;
    
    if (!sourceType) {
      return 'Unknown Source';
    }
    
    switch (sourceType) {
      case 'presession':
        return `Pre-Session Analysis (${tradeDate ? new Date(tradeDate).toLocaleDateString() : 'N/A'})`;
      case 'trade':
        if (!tradeNo && !tradeDate) {
          return 'Trade not saved yet';
        }
        if (tradeNo && tradeDate) {
          return `Trade #${tradeNo} (${new Date(tradeDate).toLocaleDateString()})`;
        }
        return 'Trade was deleted';
      default:
        return `Source: ${sourceType}`;
    }
  };

  const handleSaveNote = async (noteData) => {
    try {
      console.log('Saving note:', noteData);
      
      if (noteData.id) {
        // Оновлюємо існуючу нотатку
        await window.electronAPI.updateNote({
          ...noteData,
          sourceType: noteData.sourceType || 'trade',
          sourceId: noteData.sourceId
        });
      } else {
        // Створюємо нову нотатку
        await window.electronAPI.addNote({
          ...noteData,
          sourceType: noteData.sourceType || 'trade',
          sourceId: noteData.sourceId
        });
      }

      // Оновлюємо список нотаток
      const allNotes = await window.electronAPI.getAllNotes();
      const filteredNotes = allNotes.filter(note => {
        const noteDate = note.tradeDate ? new Date(note.tradeDate) : null;
        if (!noteDate) return false;
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        return noteDate >= start && noteDate <= end;
      });
      setNotes(filteredNotes);
      
      // Закриваємо модальне вікно
      setIsModalOpen(false);
      setSelectedNote(null);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await window.electronAPI.deleteNote(noteId);
      
      // Оновлюємо список нотаток
      const allNotes = await window.electronAPI.getAllNotes();
      const filteredNotes = allNotes.filter(note => {
        const noteDate = note.tradeDate ? new Date(note.tradeDate) : null;
        if (!noteDate) return false;
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        return noteDate >= start && noteDate <= end;
      });
      setNotes(filteredNotes);
      
      setIsModalOpen(false);
      setSelectedNote(null);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleNoteImageUpload = async (file) => {
    try {
      const filePath = await window.electronAPI.saveBlobAsFile(await file.arrayBuffer());
      return filePath;
    } catch (error) {
      console.error('Error uploading note image:', error);
      return null;
    }
  };

  const handleNoteImageDelete = async (imageId) => {
    try {
      await window.electronAPI.deleteNoteImage(imageId);
    } catch (error) {
      console.error('Error deleting note image:', error);
    }
  };

  return (
    <>
      <DatePickerStyles />
      <Container>
        <Header>
          <BackButton to="/performance-analysis/wpa" />
          <Title>Weekly Performance Analysis</Title>
          <Subtitle>Let's analyze your weekly performance!</Subtitle>
        </Header>

        <Content>
          {weekNumber && (
            <WeekInfo>Week {weekNumber}</WeekInfo>
          )}
          
          {renderDateSelection()}

          <SectionContainer>
            <SectionTitle>Performance Metrics</SectionTitle>
            <MetricsGrid>
              <MetricCard>
                <MetricTitle>Total Trades</MetricTitle>
                <MetricValue>{metrics.totalTrades}</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Missed Trades</MetricTitle>
                <MetricValue type="missed">{metrics.missedTrades}</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Execution Coefficient</MetricTitle>
                <MetricValue color="#4caf50">{metrics.executionCoefficient ? metrics.executionCoefficient.toFixed(2) : '0.00'}%</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Winrate</MetricTitle>
                <MetricValue color="#4caf50">{metrics.winRate ? metrics.winRate.toFixed(2) : '0.00'}%</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Following the Plan</MetricTitle>
                <MetricValue color="#4caf50">{metrics.followingPlan ? metrics.followingPlan.toFixed(2) : '0.00'}%</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Narrative Accuracy</MetricTitle>
                <MetricValue color="#4caf50">{metrics.narrativeAccuracy}%</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Gained RR</MetricTitle>
                <MetricValue>{metrics.gainedRR ? metrics.gainedRR.toFixed(2) : '0.00'}</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Potential RR</MetricTitle>
                <MetricValue>{metrics.potentialRR ? metrics.potentialRR.toFixed(2) : '0.00'}</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Average RR</MetricTitle>
                <MetricValue>{metrics.averageRR ? metrics.averageRR.toFixed(2) : '0.00'}</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Profit</MetricTitle>
                <MetricValue color={metrics.profit >= 0 ? "#4caf50" : "#ff4444"}>
                  {metrics.profit ? `${metrics.profit.toFixed(2)}%` : '0.00%'}
                </MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Profit Factor</MetricTitle>
                <MetricValue>{metrics.profitFactor ? metrics.profitFactor.toFixed(2) : '0.00'}</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Realised P&L</MetricTitle>
                <MetricValue color={metrics.realisedPL >= 0 ? "#4caf50" : "#ff4444"}>
                  ${metrics.realisedPL ? metrics.realisedPL.toFixed(2) : '0.00'}
                </MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Average Profit</MetricTitle>
                <MetricValue color="#4caf50">${metrics.averagePL ? metrics.averagePL.toFixed(2) : '0.00'}</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Average Loss</MetricTitle>
                <MetricValue color="#ff4444">${metrics.averageLoss ? Math.abs(metrics.averageLoss).toFixed(2) : '0.00'}</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Maximum Drawdown</MetricTitle>
                <MetricValue color="#ff4444">
                  {metrics.maxDrawdown ? metrics.maxDrawdown.toFixed(2) : '0.00'}%
                </MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Breakeven Trades</MetricTitle>
                <MetricValue>{metrics.breakevenTrades}</MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>Win/Loss Ratio</MetricTitle>
                <MetricValue>
                  {metrics.winLossRatio ? metrics.winLossRatio.toFixed(2) : '0.00'}
                </MetricValue>
              </MetricCard>
            </MetricsGrid>
          </SectionContainer>

          {renderPreSessions()}

          <SectionContainer>
            <SectionTitle>Trades History</SectionTitle>
            <TradesGrid>
              {trades.length > 0 ? (
                trades.map(trade => (
                  <TradeCard key={trade.id} to={`/trade/${trade.id}`}>
                    <TradeNumber>#{trade.no}</TradeNumber>
                    <TradeInfo>
                      <TradeLabel>Date</TradeLabel>
                      <TradeValue>{new Date(trade.date).toLocaleDateString()}</TradeValue>
                    </TradeInfo>
                    <TradeInfo>
                      <TradeLabel>Pair</TradeLabel>
                      <TradeValue>{trade.pair}</TradeValue>
                    </TradeInfo>
                    <TradeInfo>
                      <TradeLabel>Session</TradeLabel>
                      <TradeValue>{trade.session}</TradeValue>
                    </TradeInfo>
                    <TradeInfo>
                      <TradeLabel>Direction</TradeLabel>
                      <TradeValue>{trade.direction}</TradeValue>
                    </TradeInfo>
                    <TradeInfo>
                      <TradeLabel>Result</TradeLabel>
                      <TradeValue result={trade.result}>{trade.result}</TradeValue>
                    </TradeInfo>
                    <TradeInfo>
                      <TradeLabel>Profit</TradeLabel>
                      <TradeValue style={{ color: parseFloat(trade.profitLoss) >= 0 ? '#4caf50' : '#ff4444' }}>
                        {trade.profitLoss ? `${parseFloat(trade.profitLoss).toFixed(2)}%` : '0.00%'}
                      </TradeValue>
                    </TradeInfo>
                  </TradeCard>
                ))
              ) : (
                <EmptyMessage>No trades found for this date range</EmptyMessage>
              )}
            </TradesGrid>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>Notes & Mistakes</SectionTitle>
            <NotesList>
              {notes.length > 0 ? (
                notes.map(note => (
                  <NoteCard key={note.id}>
                    <NoteContent onClick={() => handleNoteClick(note)}>
                      <NoteHeader>
                        <NoteTitle>{note.title}</NoteTitle>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          {note.tag_name && (
                            <TagBadge type={note.tag_name}>{note.tag_name}</TagBadge>
                          )}
                          <TradeLink onClick={(e) => handleSourceClick(e, note.source_type, note.source_id)}>
                            {getSourceText(note)}
                          </TradeLink>
                        </div>
                      </NoteHeader>
                      <NoteText>{note.content}</NoteText>
                    </NoteContent>
                  </NoteCard>
                ))
              ) : (
                <NoNotesMessage>
                  No notes available for selected date range.
                </NoNotesMessage>
              )}
            </NotesList>
          </SectionContainer>

          <ButtonContainer>
            <Button className="cancel" onClick={() => navigate('/performance-analysis/wpa')}>
              Cancel
            </Button>
            <Button className="save" onClick={handleSave}>
              Save Analysis
            </Button>
          </ButtonContainer>
        </Content>
      </Container>

      {isModalOpen && (
        <NoteModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedNote(null);
          }}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
          onImageUpload={handleNoteImageUpload}
          onImageDelete={handleNoteImageDelete}
          note={selectedNote}
          isReviewMode={true}
        />
      )}
    </>
  );
}

export default CreateWPA;