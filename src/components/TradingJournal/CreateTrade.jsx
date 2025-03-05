import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import DeleteIcon from '../../assets/icons/delete-icon.svg';;
import EditIcon from '../../assets/icons/edit-icon.svg';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const calculateProfitInDollars = (account, result, risk, rr) => {
  console.log('Calculate Profit Params:', { account, result, risk, rr });
  
  if (!account || !account.currentEquity) {
    console.log('No account or currentEquity');
    return 0;
  }

  // Видаляємо всі не числові символи (крім крапки) та конвертуємо в число
  const currentEquity = Number(account.currentEquity.toString().replace(/[^0-9.]/g, ''));
  const riskValue = Number(risk);
  const rrValue = Number(rr);

  console.log('Converted values:', {
    currentEquity,
    riskValue,
    rrValue,
    result
  });

  if (isNaN(currentEquity)) {
    console.log('Invalid currentEquity');
    return 0;
  }

  if (result === 'Win' && !isNaN(riskValue) && !isNaN(rrValue)) {
    const profit = (currentEquity * riskValue * rrValue) / 100;
    console.log('Win profit calculation:', profit);
    return profit;
  } 
  
  if (result === 'Loss' && !isNaN(riskValue)) {
    const loss = -(currentEquity * riskValue) / 100;
    console.log('Loss calculation:', loss);
    return loss;
  }

  return 0;
};

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const CreateTradeContainer = styled.div`
  max-width: 1820px;
  margin: 20px auto;
  min-height: 100vh;
  background-color: #1a1a1a;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden; // Прибираємо горизонтальний скрол
`;

const Header = styled.header`
  background: conic-gradient(from 45deg, #7425c9, #b886ee);
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

const BackButton = styled.button`
  background: conic-gradient(from 45deg, #7425c9, #b886ee);
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

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.98);
  }

  &:before {
    content: 'Back';
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
  margin: 0 auto;
  font-size: 2.5em;
  color: #fff;
  text-align: center;
  z-index: 1;
`;

const TradeNumber = styled.p`
  color: #fff;
  font-size: 1.2em;
  margin: 10px 0;
  text-align: center;
`;

const TradeContent = styled.div`
  margin-top: 20px; // Змінено з 148px на 20px
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const TablesContainer = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
`;

const TradeTable = styled.div`
  flex: 1;
  background-color: #2e2e2e;
  padding: 20px;
  border-radius: 5px;
  border: 2px solid #5e2ca5;
  animation: ${slideIn} 0.5s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(116, 37, 201, 0.2);
    transform: translateY(-2px);
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
  justify-content: center;
  align-items: center;
`;

const FormField = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormLabel = styled.label`
  color: #fff; // Змінено з rgb(92, 157, 245) на #fff
  margin-bottom: 5px;
  display: block;
  text-align: center;
  font-size: 1em;
  width: 100%;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  letter-spacing: 0.3px;
`;

const FormInput = styled.input`
  padding: 8px;
  background-color: #3e3e3e;
  color: ${props => {
    if (props.name === 'gainedPoints') {
      const value = parseFloat(props.value);
      if (isNaN(value)) return '#fff';
      return value < 0 ? '#ff4d4d' : value > 0 ? '#4dff4d' : '#fff';
    }
    return '#fff';
  }};
  border: 1px solid #5e2ca5;
  border-radius: 5px;
  width: 100%;
  text-align: center;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.3px;
  
  &:focus {
    outline: none;
    border-color: #B886EE;
    box-shadow: 0 0 0 2px rgba(184, 134, 238, 0.2);
  }
`;

const FormSelect = styled.select`
  padding: 8px;
  background-color: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 5px;
  width: 100%;
  text-align: center;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%235e2ca5" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 8px center;
  box-sizing: border-box;
`;

const FormCheckbox = styled.input`
  margin-right: 10px;
  align-self: center;
  width: auto;
`;

const FormCheckboxLabel = styled.label`
  color: #fff; // Змінено з rgb(92, 157, 245) на #fff
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  font-size: 1em;
  text-align: center;
`;

const FormButton = styled.button`
  background: conic-gradient(from 45deg, #7425c9, #b886ee);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 15px;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  min-width: 120px;

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
  width: 100%;
`;

const VolumeConfirmationContainer = styled.div`
  position: relative;
  width: 100%;
`;

const VolumeConfirmationButton = styled.button`
  padding: 8px;
  background-color: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 5px;
  width: 100%;
  text-align: center;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%235e2ca5" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 8px center;
  box-sizing: border-box;
  cursor: pointer;
`;

const VolumeConfirmationPopup = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 5px;
  padding: 10px;
  z-index: 1000;
  width: 100%;
`;

const VolumeOption = styled.div`
  padding: 8px;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? 'rgba(94, 44, 165, 0.4)' : 'transparent')};
  color: #fff;
  text-align: center;
  border-radius: 4px;

  &:hover {
    background-color: #5e2ca5;
  }
`;

const ConfirmButton = styled.button`
  margin-top: 10px;
  background: conic-gradient(from 45deg, #7425c9, #b886ee);
  color: #fff;
  border: none;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
`;

const SectionTitle = styled.h2`
  color: #5e2ca5;
  margin: 20px 0 10px;
  font-size: 2em;
  text-align: center;
`;

const ScreenshotContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  justify-content: center;
`;

const ScreenshotField = styled.div`
  flex: 1 1 45%;
  background-color: #2e2e2e;
  padding: 15px;
  border-radius: 5px;
  border: 2px solid #5e2ca5;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.5s ease;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(116, 37, 201, 0.2);
    transform: translateY(-2px);
  }

  &:hover .delete-screenshot {
    opacity: 1;
  }
`;

const ScreenshotTitle = styled.h3`
  color: #fff;
  margin-bottom: 10px;
  font-size: 1em;
  text-align: center;
`;

const ScreenshotInput = styled.input`
  width: 100%;
  padding: 8px;
  background-color: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 5px;
  margin-bottom: 10px;
  text-align: center;
`;

const ScreenshotPreview = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 10px;
  cursor: pointer;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  background-color: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 5px;
  min-height: 100px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.3px;
  line-height: 1.5;
  
  &:focus {
    outline: none;
    border-color: #B886EE;
    box-shadow: 0 0 0 2px rgba(184, 134, 238, 0.2);
  }
`;

const Row = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  justify-content: center;
`;

const NoteContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NoteItem = styled.div`
  background-color: #2e2e2e;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #5e2ca5;
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const NoteText = styled.p`
  margin: 0;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
`;

const IconButton = styled.button`
  background: conic-gradient(from 45deg, #7425c9, #b886ee);
  border: none;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 10px;

  &:hover {
    filter: brightness(1.5);
  }

  img {
    width: 16px;
    height: 16px;
  }

  &.edit {
    right: 40px;
  }

  &.delete {
    right: 10px;
  }
`;

const DeleteScreenshotButton = styled.button`
  background: conic-gradient(from 45deg, #7425c9, #b886ee);
  border: none;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 10px;
  right: 10px;
  opacity: 0;
  transition: opacity 0.2s ease;

  &:hover {
    filter: brightness(1.5);
  }

  img {
    width: 16px;
    height: 16px;
  }
`;

const FullscreenModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const FullscreenImage = styled.img`
  max-width: 90%;
  max-height: 90%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: conic-gradient(from 45deg, #7425c9, #b886ee);
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  color: #fff;
  font-size: 1.2em;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
  z-index: 1001;
  overflow-y: auto;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const NotePopup = styled.div`
  width: calc(100% - 60px);
  max-height: 80vh;
  background-color: #2e2e2e;
  padding: 20px;
  border-radius: 10px 10px 0 0;
  border: 2px solid #5e2ca5;
  border-bottom: none;
  color: #fff;
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.3);
  margin: 0 100px 100px 100px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease;
  align-items: center;
`;

const NotePopupTitle = styled.h3`
  color: #fff;
  margin: 0 0 10px;
  text-align: center;
`;

const NotePopupInput = styled.input`
  padding: 8px;
  background-color: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 5px;
  width: 100%;
  text-align: center;
`;

const NotePopupTextArea = styled.textarea`
  padding: 8px;
  background-color: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 5px;
  width: 100%;
  flex-grow: 1;
  text-align: center;
`;

const NotePopupButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  width: 100%;
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
    background: linear-gradient(45deg, #7425C9, #B886EE);
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background: conic-gradient(from 45deg, #7425C9, #B886EE);
    color: #fff;
  }

  .react-datepicker__navigation {
    top: 8px;
  }

  .react-datepicker__navigation-icon::before {
    border-color: #B886EE;
  }

  .react-datepicker__time-container {
    background-color: #2e2e2e;
    border-left: 1px solid #5e2ca5;
  }

  .react-datepicker__time-box {
    background-color: #2e2e2e;
  }

  .react-datepicker__time-list-item {
    color: #fff;
    background-color: #2e2e2e;
  }

  .react-datepicker__time-list-item:hover {
    background: linear-gradient(45deg, #7425C9, #B886EE);
  }

  .react-datepicker__time-list-item--selected {
    background: conic-gradient(from 45deg, #7425C9, #B886EE) !important;
  }
`;

// Оновлюємо стиль для самого інпута DatePicker
const StyledDatePicker = styled(DatePicker)`
  background: #2e2e2e;
  border: 1px solid #5e2ca5;
  color: #fff;
  padding: 8px;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #B886EE;
  }
`;

function CreateTrade() {
  const navigate = useNavigate();
  const [tradeCount, setTradeCount] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [executionItems, setExecutionItems] = useState({
    pointA: [],
    trigger: [],
    pointB: [],
    entryModel: [],
    entryTF: [],
    fta: [],
    slPosition: [],
    volumeConfirmation: [],
    pairs: [],
    directions: [],
    sessions: [],
    positionType: []
  });
  const [trade, setTrade] = useState({
    date: new Date().toISOString().split('T')[0],
    account: '',
    pair: '',
    direction: '',
    positionType: '',
    risk: '',
    result: '',
    rr: '',
    profitLoss: '',
    gainedPoints: '$0.00',
    followingPlan: false,
    bestTrade: false,
    session: '',
    pointA: '',
    trigger: '',
    volumeConfirmation: [],
    entryModel: '',
    entryTF: '',
    fta: '',
    slPosition: '',
    score: '',
    category: '',
    topDownAnalysis: [
      { title: 'Daily Timeframe', screenshot: '', text: '' },
      { title: '4h Timeframe', screenshot: '', text: '' },
      { title: '1h Timeframe', screenshot: '', text: '' },
      { title: '15/5m Timeframe', screenshot: '', text: '' },
    ],
    execution: { screenshot: '', text: '' },
    management: { screenshot: '', text: '' },
    conclusion: { videoLink: '', text: '' },
    notes: [],
  });
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [tempVolumeConfirmation, setTempVolumeConfirmation] = useState([]);
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [editNoteIndex, setEditNoteIndex] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Завантажуємо кількість трейдів
        const trades = await window.electronAPI.getTrades();
        setTradeCount(trades.length + 1);

        // Завантажуємо список акаунтів
        const accountsData = await window.electronAPI.getAllAccounts();
        console.log('Loaded accounts:', accountsData);
        setAccounts(accountsData);

        // Завантажуємо елементи виконання
        const sections = [
          'pointA', 'trigger', 'pointB', 'entryModel', 'entryTF', 
          'fta', 'slPosition', 'volumeConfirmation',
          'pairs', 'directions', 'sessions', 'positionType'
        ];
        const executionData = {};
        
        for (const section of sections) {
          const items = await window.electronAPI.getAllExecutionItems(section);
          executionData[section] = items;
        }
        
        setExecutionItems(executionData);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setTradeCount(1);
      }
    };
    loadInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTrade((prev) => {
      const newTrade = { ...prev, [name]: type === 'checkbox' ? checked : value };
      
      if (name === 'rr' || name === 'risk' || name === 'result' || name === 'account') {
        console.log('Change event:', { name, value });
        console.log('All accounts:', accounts);
        
        // Конвертуємо ID в число для порівняння
        const selectedAccount = accounts.find(acc => acc.id === Number(newTrade.account));
        console.log('Selected account:', selectedAccount);
        
        const risk = Number(newTrade.risk);
        const rr = Number(newTrade.rr);
        
        console.log('Risk and RR:', { risk, rr });

        // Розрахунок відсотка прибутку/збитку
        if (newTrade.result === 'Win' && !isNaN(risk) && !isNaN(rr)) {
          newTrade.profitLoss = (risk * rr).toFixed(2);
        } else if (newTrade.result === 'Loss' && !isNaN(risk)) {
          newTrade.profitLoss = (-risk).toFixed(2);
        } else if (newTrade.result === 'Breakeven' || newTrade.result === 'Missed') {
          newTrade.profitLoss = '0.00';
        } else {
          newTrade.profitLoss = '0.00';
        }

        // Розрахунок прибутку в доларах тільки якщо є вибраний акаунт
        if (selectedAccount) {
          const profitInDollars = calculateProfitInDollars(
            selectedAccount,
            newTrade.result,
            risk,
            rr
          );
          
          console.log('Final profit in dollars:', profitInDollars);
          newTrade.gainedPoints = formatCurrency(profitInDollars);
        } else {
          console.log('No account selected');
          newTrade.gainedPoints = '$0.00';
        }
      }
      
      return newTrade;
    });
  };

  const handleVolumeOptionClick = (option) => {
    setTempVolumeConfirmation(prev => {
      if (prev.includes(option)) {
        return prev.filter(item => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleVolumeConfirm = () => {
    console.log('Volume Confirmation - Початкові значення:', tempVolumeConfirmation);
    setTrade(prevTrade => {
      console.log('Volume Confirmation - Попередній стан:', prevTrade.volumeConfirmation);
      const updatedTrade = {
        ...prevTrade,
        volumeConfirmation: [...tempVolumeConfirmation]
      };
      console.log('Volume Confirmation - Оновлений стан:', updatedTrade.volumeConfirmation);
      return updatedTrade;
    });
    setShowVolumePopup(false);
  };

  // При відкритті попапу встановлюємо початкові значення
  useEffect(() => {
    if (showVolumePopup) {
      console.log('Current trade.volumeConfirmation:', trade.volumeConfirmation);
      setTempVolumeConfirmation(
        Array.isArray(trade.volumeConfirmation) 
          ? [...trade.volumeConfirmation]
          : []
      );
    }
  }, [showVolumePopup]);

  const handleScreenshotChange = (section, index, field, value) => {
    setTrade((prev) => {
      if (section === 'topDownAnalysis') {
        const updated = [...prev.topDownAnalysis];
        updated[index] = { ...updated[index], [field]: value };
        return { ...prev, topDownAnalysis: updated };
      } else {
        return { ...prev, [section]: { ...prev[section], [field]: value } };
      }
    });
  };

  const handlePaste = async (section, index, e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        try {
          const buffer = await blob.arrayBuffer();
          const filePath = await window.electronAPI.saveBlobAsFile(buffer);
          handleScreenshotChange(section, index, 'screenshot', filePath);
        } catch (error) {
          console.error('Error saving blob as file:', error);
          alert('Failed to save screenshot.');
        }
        e.preventDefault();
        return;
      }
    }
  };

  const deleteScreenshot = (section, index) => {
    setTrade((prev) => {
      if (section === 'topDownAnalysis') {
        const updated = [...prev.topDownAnalysis];
        updated[index] = { ...updated[index], screenshot: '' };
        return { ...prev, topDownAnalysis: updated };
      } else {
        return { ...prev, [section]: { ...prev[section], screenshot: '' } };
      }
    });
  };

  const openFullscreen = (src) => {
    setFullscreenImage(src);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  const openNotePopup = (index = null, event) => {
    if (!event || !event.currentTarget) return;
  
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const scrollY = window.scrollY;
    
    // Розраховуємо позицію для popup
    let popupTop = scrollY + rect.bottom + 10;
    
    // Перевіряємо, чи не виходить popup за межі екрану знизу
    const viewportHeight = window.innerHeight;
    const popupHeight = 400; // Приблизна висота popup
    
    if (rect.bottom + popupHeight > viewportHeight) {
      // Якщо popup виходить за межі екрану знизу, показуємо його вище кнопки
      popupTop = scrollY + rect.top - popupHeight - 10;
    }
  
    if (index !== null) {
      setNoteTitle(trade.notes[index].title);
      setNoteText(trade.notes[index].text);
      setEditNoteIndex(index);
    } else {
      setNoteTitle('');
      setNoteText('');
      setEditNoteIndex(null);
    }
  
    setScrollPosition(popupTop);
    setShowNotePopup(true);
    document.body.style.overflow = 'hidden';
  };

  const closeNotePopup = () => {
    setShowNotePopup(false);
    setNoteTitle('');
    setNoteText('');
    setEditNoteIndex(null);
    document.body.style.overflow = 'auto';
  };

  const saveNote = async () => {
    if (noteTitle && noteText) {
      const note = {
        title: noteTitle,
        text: noteText,
        // tradeId буде додано після створення трейду
      };

      try {
        setTrade((prev) => {
          if (editNoteIndex !== null) {
            const updatedNotes = [...prev.notes];
            updatedNotes[editNoteIndex] = note;
            return { ...prev, notes: updatedNotes };
          } else {
            return { ...prev, notes: [...prev.notes, note] };
          }
        });

        setShowNotePopup(false);
        setNoteTitle('');
        setNoteText('');
        setEditNoteIndex(null);
        
      } catch (error) {
        console.error('Error saving note:', error);
        alert('Failed to save note');
      }
    }
  };

  const deleteNote = (index) => {
    setTrade((prev) => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index),
    }));
    setShowNotePopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Початок збереження трейду');
      console.log('volumeConfirmation перед підготовкою:', trade.volumeConfirmation);
      
      const tradeData = {
        ...trade,
        volumeConfirmation: Array.isArray(trade.volumeConfirmation) ? trade.volumeConfirmation : []
      };
      
      console.log('volumeConfirmation після підготовки:', tradeData.volumeConfirmation);
      console.log('Повні дані трейду:', tradeData);
      
      const tradeDataWithId = {
        ...tradeData,
        id: crypto.randomUUID(),
        notes: tradeData.notes
      };
      
      console.log('Дані трейду перед відправкою в API:', tradeDataWithId);
      console.log('volumeConfirmation перед відправкою:', tradeDataWithId.volumeConfirmation);

      await window.electronAPI.saveTrade(tradeDataWithId);
      console.log('Трейд успішно збережено');
      
      if (trade.account && trade.result && trade.profitLoss) {
        await window.electronAPI.updateAccountBalance(trade.account, parseFloat(trade.profitLoss));
      }

      navigate('/trade-journal');
    } catch (error) {
      console.error('Error saving trade:', error);
    }
  };

  const handleBack = () => {
    navigate(-1); // Повернення назад по історії
  };

  return (
    <CreateTradeContainer>
      <DatePickerStyles />
      <Header>
        <BackButton onClick={handleBack} />
        <Title>New Trade</Title>
      </Header>
      <TradeContent>
        <TradeNumber>Trade number: {tradeCount}</TradeNumber>
        <TablesContainer>
          <TradeTable>
            <FormRow>
              <FormField>
                <FormLabel>Date</FormLabel>
                <StyledDatePicker
                  selected={trade.date ? new Date(trade.date) : new Date()}
                  onChange={(date) => {
                    const formattedDate = date.toISOString().split('T')[0];
                    setTrade(prev => ({
                      ...prev,
                      date: formattedDate
                    }));
                  }}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select date"
                />
              </FormField>
              <FormField>
                <FormLabel>Account</FormLabel>
                <FormSelect 
                  name="account" 
                  value={trade.account} 
                  onChange={handleChange}
                >
                  <option value="">Select Account</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {`${account.name} (${formatCurrency(account.balance)})`}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel>Pair</FormLabel>
                <FormSelect name="pair" value={trade.pair} onChange={handleChange}>
                  <option value="">Select Pair</option>
                  {executionItems.pairs.map(item => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </FormSelect>
              </FormField>
            </FormRow>  
            <FormRow>
              <FormField>
                <FormLabel>Direction</FormLabel>
                <FormSelect name="direction" value={trade.direction} onChange={handleChange}>
                  <option value="">Select Direction</option>
                  {executionItems.directions.map(item => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel>Position Type</FormLabel>
                <FormSelect name="positionType" value={trade.positionType} onChange={handleChange}>
                  <option value="">Select Position Type</option>
                  {executionItems.positionType.map(item => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel>Risk, %</FormLabel>
                <FormInput
                  type="number"
                  name="risk"
                  value={trade.risk}
                  onChange={handleChange}
                  placeholder="Enter risk"
                  step="0.01"
                />
              </FormField>
            </FormRow>
            <FormRow>
              <FormField>
                <FormLabel>Result</FormLabel>
                <FormSelect name="result" value={trade.result} onChange={handleChange}>
                  <option value="">Select Result</option>
                  <option value="Win" style={{ color: '#00ff00' }}>Win</option>
                  <option value="Loss" style={{ color: '#ff0000' }}>Loss</option>
                  <option value="Breakeven" style={{ color: '#ffd700' }}>Breakeven</option>
                  <option value="Missed" style={{ color: '#9c27b0' }}>Missed</option>
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel>RR</FormLabel>
                <FormInput
                  type="number"
                  name="rr"
                  value={trade.rr}
                  onChange={handleChange}
                  placeholder="Enter RR"
                  step="0.01"
                />
              </FormField>
              <FormField>
                <FormLabel>Profit (%)</FormLabel>
                <FormInput
                  type="text"
                  name="profitLoss"
                  value={trade.profitLoss}
                  readOnly
                />
              </FormField>
            </FormRow>
            <FormRow>
              <FormField>
                <FormLabel>Profit ($)</FormLabel>
                <FormInput
                  type="text"
                  name="gainedPoints"
                  value={trade.gainedPoints}
                  readOnly
                />
              </FormField>
              <FormField>
                <FormCheckboxLabel>
                  <FormCheckbox
                    type="checkbox"
                    name="followingPlan"
                    checked={trade.followingPlan}
                    onChange={handleChange}
                  />
                  Following the Plan?
                </FormCheckboxLabel>
              </FormField>
              <FormField>
                <FormCheckboxLabel>
                  <FormCheckbox
                    type="checkbox"
                    name="bestTrade"
                    checked={trade.bestTrade}
                    onChange={handleChange}
                  />
                  Best Trade?
                </FormCheckboxLabel>
              </FormField>
            </FormRow>
          </TradeTable>
          <TradeTable>
            <FormRow>
              <FormField>
                <FormLabel>Session</FormLabel>
                <FormSelect name="session" value={trade.session} onChange={handleChange}>
                  <option value="">Select Session</option>
                  {executionItems.sessions.map(item => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel>Point A</FormLabel>
                <FormSelect name="pointA" value={trade.pointA} onChange={handleChange}>
                  <option value="">Select Point A</option>
                  {executionItems.pointA.map(item => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel>Trigger</FormLabel>
                <FormSelect name="trigger" value={trade.trigger} onChange={handleChange}>
                  <option value="">Select Trigger</option>
                  {executionItems.trigger.map(item => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </FormSelect>
              </FormField>
            </FormRow>
            <FormRow>
              <FormField>
                <FormLabel>Volume Confirmation</FormLabel>
                <VolumeConfirmationContainer>
                  <VolumeConfirmationButton onClick={() => setShowVolumePopup(true)}>
                    {Array.isArray(trade.volumeConfirmation) && trade.volumeConfirmation.length > 0
                      ? trade.volumeConfirmation.join(', ') 
                      : 'Select Volume Confirmation'}
                  </VolumeConfirmationButton>
                  {showVolumePopup && (
                    <VolumeConfirmationPopup>
                      {executionItems.volumeConfirmation.map((item) => (
                        <VolumeOption
                          key={item.id}
                          selected={tempVolumeConfirmation.includes(item.name)}
                          onClick={() => handleVolumeOptionClick(item.name)}
                        >
                          {item.name}
                        </VolumeOption>
                      ))}
                      <ConfirmButton onClick={handleVolumeConfirm}>Confirm</ConfirmButton>
                    </VolumeConfirmationPopup>
                  )}
                </VolumeConfirmationContainer>
              </FormField>
              <FormField>
                <FormLabel>Entry Model</FormLabel>
                <FormSelect name="entryModel" value={trade.entryModel} onChange={handleChange}>
                  <option value="">Select Entry Model</option>
                  {executionItems.entryModel.map(item => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel>Entry TF</FormLabel>
                <FormSelect name="entryTF" value={trade.entryTF} onChange={handleChange}>
                  <option value="">Select Entry TF</option>
                  {executionItems.entryTF.map(item => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </FormSelect>
              </FormField>
            </FormRow>
            <FormRow>
              <FormField>
                <FormLabel>FTA</FormLabel>
                <FormSelect name="fta" value={trade.fta} onChange={handleChange}>
                  <option value="">Select FTA</option>
                  {executionItems.fta.map(item => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel>SL Position</FormLabel>
                <FormSelect name="slPosition" value={trade.slPosition} onChange={handleChange}>
                  <option value="">Select SL Position</option>
                  {executionItems.slPosition.map(item => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel>Score</FormLabel>
                <FormInput
                  type="number"
                  name="score"
                  value={trade.score}
                  onChange={handleChange}
                  placeholder="Enter score"
                />
              </FormField>
            </FormRow>
            <FormRow>
              <FormField>
                <FormLabel>Category</FormLabel>
                <FormInput
                  type="text"
                  name="category"
                  value={trade.category || 'Coming soon'}
                  readOnly
                />
              </FormField>
            </FormRow>
          </TradeTable>
        </TablesContainer>

        <SectionTitle>Top Down Analysis</SectionTitle>
        <ScreenshotContainer>
          {trade.topDownAnalysis.map((item, index) => (
            <ScreenshotField key={index}>
              <ScreenshotTitle>{item.title}</ScreenshotTitle>
              {!item.screenshot && (
                <ScreenshotInput
                  type="text"
                  placeholder="Paste screenshot here (Ctrl+V)"
                  onPaste={(e) => handlePaste('topDownAnalysis', index, e)}
                />
              )}
              {item.screenshot && (
                <ScreenshotPreview
                  src={item.screenshot}
                  alt="Screenshot"
                  onClick={() => openFullscreen(item.screenshot)}
                />
              )}
              <TextArea
                value={item.text}
                onChange={(e) => handleScreenshotChange('topDownAnalysis', index, 'text', e.target.value)}
              />
              {item.screenshot && (
                <DeleteScreenshotButton className="delete-screenshot" onClick={() => deleteScreenshot('topDownAnalysis', index)}>
                  <img src={DeleteIcon} alt="Delete" />
                </DeleteScreenshotButton>
              )}
            </ScreenshotField>
          ))}
        </ScreenshotContainer>

        <Row>
          <div style={{ flex: 1 }}>
            <SectionTitle>Execution</SectionTitle>
            <ScreenshotField>
              <ScreenshotTitle>Exit Moment</ScreenshotTitle>
              {!trade.execution.screenshot && (
                <ScreenshotInput
                  type="text"
                  placeholder="Paste screenshot here (Ctrl+V)"
                  onPaste={(e) => handlePaste('execution', 0, e)}
                />
              )}
              {trade.execution.screenshot && (
                <ScreenshotPreview
                  src={trade.execution.screenshot}
                  alt="Screenshot"
                  onClick={() => openFullscreen(trade.execution.screenshot)}
                />
              )}
              <TextArea
                value={trade.execution.text}
                onChange={(e) => handleScreenshotChange('execution', 0, 'text', e.target.value)}
              />
              {trade.execution.screenshot && (
                <DeleteScreenshotButton className="delete-screenshot" onClick={() => deleteScreenshot('execution', 0)}>
                  <img src={DeleteIcon} alt="Delete" />
                </DeleteScreenshotButton>
              )}
            </ScreenshotField>
          </div>
          <div style={{ flex: 1 }}>
            <SectionTitle>Management</SectionTitle>
            <ScreenshotField>
              <ScreenshotTitle>First Trouble Area</ScreenshotTitle>
              {!trade.management.screenshot && (
                <ScreenshotInput
                  type="text"
                  placeholder="Paste screenshot here (Ctrl+V)"
                  onPaste={(e) => handlePaste('management', 0, e)}
                />
              )}
              {trade.management.screenshot && (
                <ScreenshotPreview
                  src={trade.management.screenshot}
                  alt="Screenshot"
                  onClick={() => openFullscreen(trade.management.screenshot)}
                />
              )}
              <TextArea
                value={trade.management.text}
                onChange={(e) => handleScreenshotChange('management', 0, 'text', e.target.value)}
              />
              {trade.management.screenshot && (
                <DeleteScreenshotButton className="delete-screenshot" onClick={() => deleteScreenshot('management', 0)}>
                  <img src={DeleteIcon} alt="Delete" />
                </DeleteScreenshotButton>
              )}
            </ScreenshotField>
          </div>
        </Row>

        <Row>
          <div style={{ flex: 1 }}>
            <SectionTitle>Conclusion</SectionTitle>
            <ScreenshotField>
              <ScreenshotTitle>Daily Performance Analysis</ScreenshotTitle>
              <ScreenshotInput
                type="text"
                placeholder="YouTube video link"
                value={trade.conclusion.videoLink}
                onChange={(e) => handleScreenshotChange('conclusion', 0, 'videoLink', e.target.value)}
              />
              <TextArea
                value={trade.conclusion.text}
                onChange={(e) => handleScreenshotChange('conclusion', 0, 'text', e.target.value)}
              />
            </ScreenshotField>
          </div>
          <div style={{ flex: 1 }}>
            <SectionTitle>Notes & Mistakes</SectionTitle>
            <NoteContainer>
              {trade.notes.map((note, index) => (
                <NoteItem key={index} onClick={(e) => openNotePopup(index, e)}>
                  <NoteText>{note.title}</NoteText>
                  <IconButton className="edit" onClick={(e) => { 
                    e.stopPropagation(); 
                    openNotePopup(index, e); 
                  }}>
                    <img src={EditIcon} alt="Edit" /> 
                  </IconButton>
                  <IconButton className="delete" onClick={(e) => { 
                    e.stopPropagation(); 
                    deleteNote(index); 
                  }}>
                    <img src={DeleteIcon} alt="Delete" />
                  </IconButton>
                </NoteItem>
              ))}
              <FormButton onClick={(e) => openNotePopup(null, e)}>Add Note or Mistake</FormButton>
            </NoteContainer>
          </div>
        </Row>

        {showNotePopup && (
          <ModalOverlay onClick={closeNotePopup}>
            <NotePopup onClick={e => e.stopPropagation()} top={scrollPosition}>
              <NotePopupTitle>Adding Notes & Mistakes</NotePopupTitle>
              <NotePopupInput
                type="text"
                placeholder="Enter note title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
              />
              <NotePopupTextArea
                placeholder="Enter note text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <NotePopupButtons>
                <FormButton onClick={saveNote}>Save</FormButton>
                <FormButton onClick={closeNotePopup}>Cancel</FormButton>
                {editNoteIndex !== null && (
                  <FormButton onClick={() => deleteNote(editNoteIndex)}>Delete</FormButton>
                )}
              </NotePopupButtons>
            </NotePopup>
          </ModalOverlay>
        )}

        {fullscreenImage && (
          <FullscreenModal onClick={closeFullscreen}>
            <FullscreenImage src={fullscreenImage} alt="Fullscreen Screenshot" />
            <CloseButton>X</CloseButton>
          </FullscreenModal>
        )}

        <ButtonGroup>
          <FormButton type="submit" onClick={handleSubmit}>Save Trade</FormButton>
          <FormButton type="button" onClick={handleBack}>Cancel</FormButton>
        </ButtonGroup>
      </TradeContent>
    </CreateTradeContainer>
  );
}

export default CreateTrade;