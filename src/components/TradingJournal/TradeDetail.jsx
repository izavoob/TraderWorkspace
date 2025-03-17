import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import DeleteIcon from '../../assets/icons/delete-icon.svg';
import EditIcon from '../../assets/icons/edit-icon.svg';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from 'react-datepicker';
import uk from 'date-fns/locale/uk';
import NotesList from '../Notes/NotesList.jsx';

registerLocale('uk', uk);

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

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shineEffect = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const CreateTradeContainer = styled.div`
  max-width: 1820px;
  margin: 20px auto;
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
  border-radius: 10px 10px 0 0;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: auto;
  min-height: 6.67vh;
  max-height: 100px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BackButton = styled.button`
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
const TradeNumber = styled.p`
  color: #fff;
  font-size: 1.2em;
  margin: 10px 0;
  text-align: center;
`;

const TradeContent = styled.div`
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
  color: #fff;
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
  align-items: center;
  margin-top: 20px;
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
  color: rgb(92, 157, 245);
  margin: 20px 0 10px;
  font-size: 2em;
  text-align: center;
`;

const TimeframeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`;

const TimeframeIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #7425C9, #B886EE);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
`;

const ImageUploadArea = styled.div`
  width: 94%;
  border: 2px dashed ${props => props.disabled ? '#666' : '#5e2ca5'};
  padding: 20px;
  text-align: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin: 10px auto;
  border-radius: 8px;
  background: ${props => props.disabled ? 'rgba(102, 102, 102, 0.1)' : 'rgba(94, 44, 165, 0.1)'};
  transition: all 0.3s ease;
  position: relative;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.disabled ? 0.7 : 1};

  &:hover {
    background: ${props => props.disabled ? 'rgba(102, 102, 102, 0.1)' : 'rgba(94, 44, 165, 0.2)'};
    border-color: ${props => props.disabled ? '#666' : '#7425C9'};
  }

  img {
    max-width: 100%;
    max-height: 400px;
    border-radius: 4px;
  }

  span {
    color: ${props => props.disabled ? '#666' : '#B886EE'};
  }
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
  align-items: stretch;
  padding-top: 65px;
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

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  background: #ff4757;
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 18px;
  display: ${props => props.disabled ? 'none' : 'flex'};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 10;

  ${ImageUploadArea}:hover & {
    opacity: ${props => props.disabled ? 0 : 1};
  }

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'scale(1.1)'};
    background: ${props => props.disabled ? '#ff4757' : '#ff6b81'};
  }
`;

const FullscreenModal = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  box-sizing: border-box;
  transform: translateY(${props => props.scrollOffset}px);
`;

const FullscreenImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  border: 2px solid #5e2ca5;
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
  opacity: 0;
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
  margin: 0 30px 30px 30px;
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
  .react-datepicker__day,
  .react-datepicker__time-name {
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
    
    &:hover {
      background: linear-gradient(45deg, #7425C9, #B886EE);
    }
  }

  .react-datepicker__time-list-item--selected {
    background: conic-gradient(from 45deg, #7425C9, #B886EE) !important;
    color: #fff;
  }

  .react-datepicker__navigation {
    top: 8px;
  }

  .react-datepicker__navigation-icon::before {
    border-color: #B886EE;
  }
`;

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

const NotificationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: auto;
`;

const NotificationMessage = styled.div`
  padding: 15px 25px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  animation: ${fadeIn} 0.3s ease;
  background: ${props => props.type === 'success' ? '#4caf50' : props.type === 'warning' ? '#ff9800' : '#f44336'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  pointer-events: auto;
  max-width: 300px;
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

function TradeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [trades, setTrades] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [trade, setTrade] = useState({
    no: '',
    date: '',
    account: '',
    pair: '',
    direction: '',
    positionType: '',
    risk: '',
    result: '',
    rr: '',
    profitLoss: '',
    gainedPoints: '',
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
  const [notification, setNotification] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Завантаження аккаунтів
        const accountsData = await window.electronAPI.getAllAccounts();
        setAccounts(accountsData);
        
        // Завантаження елементів execution
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
        
        // Завантаження деталей трейду
        await fetchTradeDetails();
      } catch (error) {
        console.error('Error loading initial data:', error);
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [id]);

  const fetchTradeDetails = async () => {
      try {
      console.log('Завантаження деталей трейду ID:', id);
        const tradeData = await window.electronAPI.getTrade(id);
      
      if (!tradeData) {
        console.error('Трейд не знайдено');
        navigate('/trades');
        return;
      }
      
      console.log('Отримані дані трейду:', tradeData);
      setTrade(tradeData);
      
      // Заповнюємо форму даними трейду
      const formDataFromTrade = { ...tradeData };
      
      // Конвертуємо рядки JSON у об'єкти, якщо потрібно
      if (typeof formDataFromTrade.volumeConfirmation === 'string') {
        try {
          formDataFromTrade.volumeConfirmation = JSON.parse(formDataFromTrade.volumeConfirmation);
        } catch (e) {
          console.warn('Помилка парсингу volumeConfirmation:', e);
          formDataFromTrade.volumeConfirmation = [];
        }
      }
      
      // Завантажуємо нотатки для трейду
      console.log('Завантаження нотаток для трейду ID:', id);
      const tradeNotes = await window.electronAPI.getNotesBySource('trade', id);
      console.log('Отримані нотатки для трейду:', tradeNotes);
      
      // Важливо: зберігаємо ID нотаток
      const notesWithImages = await Promise.all(tradeNotes.map(async (note) => {
        console.log(`Обробка нотатки ID=${note.id}`);
        
        // Перевіряємо чи є зображення в нотатці
        if (!note.images || note.images.length === 0) {
          console.log(`Завантаження зображень для нотатки ID=${note.id}`);
          const images = await window.electronAPI.getNoteImages(note.id);
          console.log(`Отримано ${images.length} зображень для нотатки ID=${note.id}`);
          
          // Повертаємо нотатку з завантаженими зображеннями, зберігаючи ID
          return {
            ...note,
            images: images || []
          };
        }
        
        // Повертаємо нотатку з існуючими зображеннями, зберігаючи ID
        return note;
      }));
      
      console.log('Нотатки з зображеннями:', notesWithImages);
      setTrade(prev => ({ ...prev, notes: notesWithImages }));
      // Також оновлюємо окремий стан notes
      setNotes(notesWithImages);
      
      setIsLoading(false);
      } catch (error) {
      console.error('Помилка завантаження деталей трейду:', error);
      setIsLoading(false);
      navigate('/trades');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

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
    setHasUnsavedChanges(true);
    setNotification({
      type: 'warning',
      message: 'You have unsaved changes!'
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      console.log('Починаю збереження трейду');
      setIsSaving(true);
      
      // Спочатку отримуємо актуальні нотатки з бази даних для порівняння
      console.log('Отримання поточних нотаток для трейду ID:', trade.id);
      const existingNotes = await window.electronAPI.getNotesBySource('trade', trade.id);
      console.log('Отримані поточні нотатки з бази даних:', existingNotes);
      
      // Порівнюємо існуючі нотатки з тими, що в state
      // Створюємо мапу існуючих нотаток за ID для швидкого пошуку
      const existingNotesMap = existingNotes.reduce((map, note) => {
        map[note.id] = note;
        return map;
      }, {});
      
      // Фільтруємо нотатки в state, щоб уникнути дублювання
      const notesToUpdate = trade.notes.filter(note => {
        // Залишаємо нотатки, які або:
        // 1. Не мають ID (нові нотатки)
        // 2. Мають ID, який існує в базі даних
        return !note.id || existingNotesMap[note.id];
      });
      
      console.log('Нотатки для оновлення після фільтрації:', notesToUpdate);
      
      // Зберігаємо трейд перед збереженням нотаток
      console.log('Оновлення даних трейду:', trade);
      await window.electronAPI.updateTrade(trade.id, trade);
      console.log('Трейд успішно оновлено');
      
      // Оновлюємо нотатки із збереженням їх ID
      console.log('Оновлення нотаток для трейду, filtered notes:', notesToUpdate);
      
      const notePromises = notesToUpdate.map(async (note) => {
        try {
          // Зберігаємо оригінальні зображення нотатки перед будь-якими змінами
          const originalImages = note.images || [];
          const oldNoteId = note.id; // Зберігаємо старий ID нотатки
          
          // Важливо: Перевіряємо, чи існує нотатка в базі даних
          if (note.id) {
            console.log(`Перевірка існування нотатки з ID=${note.id}`);
            const existingNote = await window.electronAPI.getNoteById(note.id);
            
            if (existingNote) {
              console.log(`Нотатка з ID=${note.id} знайдена, оновлюємо`);
              // Оновлюємо існучу нотатку з ID та збереженням зв'язку з трейдом
              const updatedNote = {
                ...note,
                id: note.id, // Явно зберігаємо ID
                source_type: 'trade',
                source_id: trade.id,
                trade_no: trade.no,
                trade_date: trade.date
              };
              
              console.log('Дані для оновлення нотатки:', updatedNote);
              await window.electronAPI.updateNote(updatedNote);
              console.log(`Нотатка з ID=${note.id} успішно оновлена`);
              
              // Оновлюємо зображення для нотатки
              if (originalImages && originalImages.length > 0) {
                console.log(`Перевірка ${originalImages.length} зображень для нотатки ID=${note.id}`);
                for (const image of originalImages) {
                  if (!image.id) {
                    console.log('Додавання нового зображення до нотатки:', image.image_path);
                    await window.electronAPI.addNoteImage(note.id, image.image_path);
                  }
                }
              }
              
              return { success: true, note: updatedNote, oldId: oldNoteId };
            } else {
              console.warn(`Нотатка з ID=${note.id} не знайдена в базі даних. Можливо, вона була видалена. Зберігаємо поточну.`);
              // Замість створення нової нотатки, повертаємо існуючу з тим самим ID
              return { success: true, note: note, oldId: oldNoteId };
            }
          } else {
            // Це нова нотатка, створюємо її
            console.log('Створення нової нотатки для трейду');
            const newNoteToSave = {
              title: note.title,
              content: note.content || note.text, // Підтримка обох форматів
              tag_id: note.tag_id,
              source_type: 'trade',
              source_id: trade.id,
              trade_no: trade.no,
              trade_date: trade.date
            };
            
            const newNoteId = await window.electronAPI.addNote(newNoteToSave);
            console.log(`Нова нотатка створена з ID=${newNoteId}`);
            
            // Зберігаємо зображення для нової нотатки
            if (originalImages && originalImages.length > 0) {
              console.log(`Додавання ${originalImages.length} зображень до нової нотатки ID=${newNoteId}`);
              
              for (const image of originalImages) {
                console.log(`Додавання зображення ${image.image_path} до нової нотатки ID=${newNoteId}`);
                await window.electronAPI.addNoteImage(newNoteId, image.image_path);
              }
            }
            
            // Отримуємо оновлену нотатку з бази даних
            const newNote = await window.electronAPI.getNoteById(newNoteId);
            console.log('Отримана створена нотатка:', newNote);
            
            // Додаємо зображення до об'єкту нотатки
            const images = await window.electronAPI.getNoteImages(newNoteId);
            newNote.images = images;
            
            return { success: true, note: newNote, oldId: oldNoteId };
          }
        } catch (error) {
          console.error(`Помилка при обробці нотатки ${note.id || 'нова'}:`, error);
          return { success: false, error };
        }
      });
      
      const results = await Promise.all(notePromises);
      console.log('Результати обробки нотаток:', results);
      
      // Перевіряємо результати
      const errors = results.filter(result => !result.success);
      if (errors.length > 0) {
        console.warn(`${errors.length} нотаток не вдалося зберегти`);
      }
      
      // Оновлюємо стан notes, зберігаючи ID нотаток
      const updatedNotes = results
        .filter(result => result.success)
        .map(result => result.note);
      
      // Актуалізуємо стан трейду з оновленими нотатками
      setTrade(prev => ({ ...prev, notes: updatedNotes }));
      setNotes(updatedNotes); // Оновлюємо також основний стан нотаток
      
      console.log('Трейд та нотатки збережені успішно');
      setIsSaving(false);
      setIsEditing(false);
      setHasUnsavedChanges(false);
      
      // Відображаємо повідомлення про успіх
      setNotification({
        type: 'success',
        message: 'Trade saved successfully!'
      });
      
      // Прибираємо повідомлення через 3 секунди
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      
      // НЕ оновлюємо дані на сторінці, щоб уникнути дублювання
      // await fetchTradeDetails();
    } catch (error) {
      console.error('Помилка при збереженні трейду:', error);
      setIsSaving(false);
      alert(`Помилка при збереженні трейду: ${error.message}`);
    }
  };

  const handleCancel = () => {
    const loadTrade = async () => {
      try {
        const loadedTrades = await window.electronAPI.getTrades();
        const currentTrade = loadedTrades.find(t => t.id === id);
        if (currentTrade) {
          // Видаляємо суфікси % та RR з значень
          const risk = currentTrade.risk ? currentTrade.risk.replace('%', '') : '';
          const rr = currentTrade.rr ? currentTrade.rr.replace('RR', '') : '';

          setTrade({
            ...currentTrade,
            risk,
            rr
          });
          // Перевіряємо тип volumeConfirmation перед використанням split
          if (currentTrade.volumeConfirmation) {
            if (typeof currentTrade.volumeConfirmation === 'string') {
              setTempVolumeConfirmation(currentTrade.volumeConfirmation.split(', ').filter(Boolean));
            } else if (Array.isArray(currentTrade.volumeConfirmation)) {
              setTempVolumeConfirmation([...currentTrade.volumeConfirmation]);
            } else {
              // Якщо volumeConfirmation не є ні рядком, ні масивом, встановлюємо порожній масив
              console.warn('volumeConfirmation має невідомий тип:', typeof currentTrade.volumeConfirmation);
              setTempVolumeConfirmation([]);
            }
          }
        }
      } catch (error) {
        console.error('Error loading trade:', error);
      }
    };
    loadTrade();
    setIsEditing(false);
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
    if (!isEditing) return; // Блокуємо якщо не в режимі редагування
    
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
    if (!isEditing) return; // Блокуємо якщо не в режимі редагування
    
    setTrade((prev) => {
      if (section === 'topDownAnalysis') {
        const updated = [...prev.topDownAnalysis];
        updated[index] = { ...updated[index], screenshot: '' };
        return { ...prev, topDownAnalysis: updated };
      } else {
        return { ...prev, [section]: { ...prev[section], [field]: '' } };
      }
    });
  };

  const openFullscreen = (src) => {
    const scrollOffset = window.pageYOffset || document.documentElement.scrollTop;
    setFullscreenImage({ src, scrollOffset });
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
    document.body.style.overflow = 'auto';
  };

  const openNotePopup = async (note = null) => {
    if (note) {
      const noteImages = await window.electronAPI.getNoteImages(note.id);
      setSelectedNote({
        ...note,
        images: noteImages
      });
    } else {
      setSelectedNote(null);
    }
    setShowNotePopup(true);
  };

  const saveNote = async () => {
    try {
      if (!noteTitle || !noteText) {
        console.error('Відсутній заголовок або вміст нотатки');
        alert('Title and content are required');
        return;
      }
      
      console.log('Збереження нотатки:', { title: noteTitle, content: noteText });
      
      // Підготовка об'єкту нотатки для збереження
      const noteToSave = {
            title: noteTitle,
            content: noteText,
            source_type: 'trade',
            source_id: trade.id,
            trade_no: trade.no,
            trade_date: trade.date
      };
      
      console.log('Підготовлена нотатка для збереження:', noteToSave);
      
      let savedNoteId;
      let originalImages = [];
      
      // Зберігаємо посилання на оригінальні зображення
      if (selectedNote && selectedNote.images) {
        originalImages = [...selectedNote.images];
      }
      
      // Перевіряємо, чи це оновлення існуючої нотатки
      if (selectedNote && selectedNote.id) {
        console.log(`Оновлення існуючої нотатки ID=${selectedNote.id}`);
        
        try {
          // Перевіряємо чи існує нотатка
          const existingNote = await window.electronAPI.getNoteById(selectedNote.id);
          console.log('Існуюча нотатка:', existingNote);
          
          if (existingNote) {
            // Оновлюємо існуючу нотатку
            noteToSave.id = selectedNote.id; // Важливо: встановлюємо ID
            await window.electronAPI.updateNote({
              ...noteToSave,
              id: selectedNote.id // Дублюємо ID для впевненості
            });
            console.log(`Нотатка з ID=${selectedNote.id} успішно оновлена`);
            savedNoteId = selectedNote.id;
          } else {
            console.warn(`Нотатка з ID=${selectedNote.id} не знайдена, створюємо нову`);
            savedNoteId = await window.electronAPI.addNote(noteToSave);
            console.log(`Нова нотатка створена з ID=${savedNoteId}`);
          }
        } catch (checkError) {
          console.error('Помилка перевірки існування нотатки:', checkError);
          savedNoteId = await window.electronAPI.addNote(noteToSave);
          console.log(`Нова нотатка створена з ID=${savedNoteId} (після помилки)`);
        }
      } else {
        // Створення нової нотатки
        console.log('Створення нової нотатки');
        savedNoteId = await window.electronAPI.addNote(noteToSave);
        console.log(`Нова нотатка створена з ID=${savedNoteId}`);
      }
      
      // Зберігаємо зображення для нотатки
      if (originalImages && originalImages.length > 0) {
        console.log(`Обробка ${originalImages.length} зображень для нотатки ID=${savedNoteId}`);
        
        for (const image of originalImages) {
          // Зберігаємо тільки нові зображення без ID або копіюємо існуючі
          console.log('Копіювання зображення до нотатки:', image.image_path);
          try {
            await window.electronAPI.addNoteImage(savedNoteId, image.image_path);
            console.log('Зображення успішно додано/скопійовано');
          } catch (imageError) {
            console.error('Помилка додавання/копіювання зображення:', imageError);
          }
        }
      }
      
      // Отримуємо оновлену нотатку з бази даних з усіма зображеннями
      const savedNote = await window.electronAPI.getNoteById(savedNoteId);
      console.log('Отримана збережена нотатка:', savedNote);
      
      // Завантажуємо зображення для нотатки
      const images = await window.electronAPI.getNoteImages(savedNoteId);
      console.log(`Отримано ${images.length} зображень для нотатки ID=${savedNoteId}`);
      
      // Створюємо повний об'єкт нотатки з зображеннями
      const completeNote = {
        ...savedNote,
        images: images
      };
      
      console.log('Повна нотатка з зображеннями:', completeNote);
      
      // Оновлюємо локальний масив нотаток
      setNotes(prev => {
        if (selectedNote && selectedNote.id) {
          // Оновлюємо існуючу нотатку
          return prev.map(note => 
            note.id === selectedNote.id ? completeNote : note
          );
        } else {
          // Додаємо нову нотатку
          return [...prev, completeNote];
        }
      });
      
      // Оновлюємо також notes у trade
      setTrade(prev => {
        if (selectedNote && selectedNote.id) {
          // Оновлюємо існуючу нотатку
          const updatedNotes = prev.notes.map(note => 
            note.id === selectedNote.id ? completeNote : note
          );
          return { ...prev, notes: updatedNotes };
        } else {
          // Додаємо нову нотатку
          return { ...prev, notes: [...prev.notes, completeNote] };
        }
      });
      
      // Скидаємо стан редагування
      setShowNotePopup(false);
      setNoteTitle('');
      setNoteText('');
      setSelectedNote(null);
      
      console.log('Нотатка успішно збережена');
    } catch (error) {
      console.error('Помилка збереження нотатки:', error);
      alert(`Error saving note: ${error.message}`);
    }
  };

  const deleteNote = (index) => {
    setNotes(prev => prev.filter((_, i) => i !== index));
    setShowNotePopup(false);
    document.body.style.overflow = 'auto';
  };

  const cancelNote = () => {
    setShowNotePopup(false);
    setNoteTitle('');
    setNoteText('');
    setSelectedNote(null);
    document.body.style.overflow = 'auto';
  };

  const handleNoteUpdate = async () => {
    try {
      console.log('Оновлення нотаток для трейду ID:', trade.id);
      
      // Отримуємо актуальні нотатки з бази даних
      const currentNotes = await window.electronAPI.getNotesBySource('trade', trade.id);
      console.log('Отримані нотатки з бази даних:', currentNotes);
      
      // Завантажуємо зображення для кожної нотатки
      const notesWithImages = await Promise.all(currentNotes.map(async (note) => {
        try {
          console.log(`Завантаження зображень для нотатки ID=${note.id}`);
          const images = await window.electronAPI.getNoteImages(note.id);
          console.log(`Отримано ${images.length} зображень для нотатки ID=${note.id}`);
          
          return {
            ...note,
            text: note.content, // Перетворюємо content на text для сумісності
            images: images || []
          };
        } catch (imageError) {
          console.error(`Помилка завантаження зображень для нотатки ID=${note.id}:`, imageError);
          return {
            ...note,
            text: note.content,
            images: []
          };
        }
      }));
      
      console.log('Нотатки з зображеннями для оновлення стану:', notesWithImages);
      
      // Оновлюємо обидва стани нотаток
      setNotes(notesWithImages);
      setTrade(prev => ({ ...prev, notes: notesWithImages }));
    } catch (error) {
      console.error('Error updating notes:', error);
      alert(`Помилка оновлення нотаток: ${error.message}`);
    }
  };

  return (
    <>
      <CreateTradeContainer>
        <DatePickerStyles />
        <Header>
          <BackButton onClick={handleBack} />
          <Title>Trade Details</Title>
          <Subtitle>Let's explore your trade!</Subtitle>
        </Header>
        <TradeContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              <TradeNumber>
                Trade number: {trade.no || 'N/A'}
              </TradeNumber>
              <TablesContainer>
                <TradeTable>
                  <FormRow>
                    <FormField>
                      <FormLabel>Date</FormLabel>
                      <StyledDatePicker
                        selected={new Date(trade.date)}
                        onChange={(date) => handleChange({ target: { name: 'date', value: date.toISOString().split('T')[0] } })}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                        locale="uk"
                      />
                    </FormField>
                    <FormField>
                      <FormLabel>Account</FormLabel>
                      <FormSelect 
                        name="account" 
                        value={trade.account} 
                        onChange={handleChange}
                        disabled={!isEditing}
                      >
                        <option value="">Select Account</option>
                        {accounts.map(account => (
                          <option key={account.id} value={account.id}>
                            {account.name} ({formatCurrency(account.balance)})
                          </option>
                        ))}
                      </FormSelect>
                    </FormField>
                    <FormField>
                      <FormLabel>Pair</FormLabel>
                      <FormSelect 
                        name="pair" 
                        value={trade.pair} 
                        onChange={handleChange}
                        disabled={!isEditing}
                      >
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
                      <FormSelect 
                        name="direction" 
                        value={trade.direction} 
                        onChange={handleChange}
                        disabled={!isEditing}
                      >
                        <option value="">Select Direction</option>
                        {executionItems.directions.map(item => (
                          <option key={item.id} value={item.name}>{item.name}</option>
                        ))}
                      </FormSelect>
                    </FormField>
                    <FormField>
                      <FormLabel>Position Type</FormLabel>
                      <FormSelect 
                        name="positionType" 
                        value={trade.positionType} 
                        onChange={handleChange}
                        disabled={!isEditing}
                      >
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
                        readOnly={!isEditing}
                      />
                    </FormField>
                  </FormRow>
                  <FormRow>
                    <FormField>
                      <FormLabel>Result</FormLabel>
                      <FormSelect 
                        name="result" 
                        value={trade.result} 
                        onChange={handleChange}
                        disabled={!isEditing}
                      >
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
                        readOnly={!isEditing}
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
                        value={trade.gainedPoints || 'Coming soon'}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                      <FormSelect 
                        name="session" 
                        value={trade.session} 
                        onChange={handleChange}
                        disabled={!isEditing}
                      >
                        <option value="">Select Session</option>
                        {executionItems.sessions.map(item => (
                          <option key={item.id} value={item.name}>{item.name}</option>
                        ))}
                      </FormSelect>
                    </FormField>
                    <FormField>
                      <FormLabel>Point A</FormLabel>
                      <FormSelect 
                        name="pointA" 
                        value={trade.pointA} 
                        onChange={handleChange}
                        disabled={!isEditing}
                      >
                        <option value="">Select Point A</option>
                        {executionItems.pointA.map(item => (
                          <option key={item.id} value={item.name}>{item.name}</option>
                        ))}
                      </FormSelect>
                    </FormField>
                    <FormField>
                      <FormLabel>Trigger</FormLabel>
                      <FormSelect 
                        name="trigger" 
                        value={trade.trigger} 
                        onChange={handleChange}
                        disabled={!isEditing}
                      >
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
                        <VolumeConfirmationButton 
                          onClick={() => isEditing && setShowVolumePopup(true)}
                          disabled={!isEditing}
                        >
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
                      <FormSelect 
                        name="entryModel" 
                        value={trade.entryModel} 
                        onChange={handleChange}
                        disabled={!isEditing}
                      >
                        <option value="">Select Entry Model</option>
                        {executionItems.entryModel.map(item => (
                          <option key={item.id} value={item.name}>{item.name}</option>
                        ))}
                      </FormSelect>
                    </FormField>
                    <FormField>
                      <FormLabel>Entry TF</FormLabel>
                      <FormSelect 
                        name="entryTF" 
                        value={trade.entryTF} 
                        onChange={handleChange}
                        disabled={!isEditing}
                      >
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
                      <FormSelect 
                        name="fta" 
                        value={trade.fta} 
                        onChange={handleChange}
                        disabled={!isEditing}
                      >
                        <option value="">Select FTA</option>
                        {executionItems.fta.map(item => (
                          <option key={item.id} value={item.name}>{item.name}</option>
                        ))}
                      </FormSelect>
                    </FormField>
                    <FormField>
                      <FormLabel>SL Position</FormLabel>
                      <FormSelect 
                        name="slPosition" 
                        value={trade.slPosition} 
                        onChange={handleChange}
                        disabled={!isEditing}
                      >
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
                        readOnly={!isEditing}
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
                {trade.topDownAnalysis.map((analysis, index) => (
                  <ScreenshotField key={index}>
                    <TimeframeHeader>
                      <TimeframeIcon>
                        {index === 0 ? 'D' : index === 1 ? 'H' : index === 2 ? 'H' : 'M'}
                      </TimeframeIcon>
                      <ScreenshotTitle>{analysis.title}</ScreenshotTitle>
                    </TimeframeHeader>
                    
                    <ImageUploadArea
                      onPaste={(e) => handlePaste('topDownAnalysis', index, e)}
                      disabled={!isEditing}
                    >
                      {analysis.screenshot ? (
                        <>
                          <img
                            src={analysis.screenshot}
                            alt={analysis.title}
                            onClick={() => openFullscreen(analysis.screenshot)}
                          />
                          <DeleteButton 
                            onClick={() => deleteScreenshot('topDownAnalysis', index)}
                            disabled={!isEditing}
                          >
                            ×
                          </DeleteButton>
                        </>
                      ) : (
                        <span>{isEditing ? '📈 Paste Screenshot (Ctrl+V)' : 'No screenshot'}</span>
                      )}
                    </ImageUploadArea>
                    
                    <input
                      type="file"
                      id={`tda-file-${index}`}
                      style={{ display: 'none' }}
                      onChange={(e) => handleScreenshotChange('topDownAnalysis', index, 'screenshot', e.target.files[0])}
                    />
                    
                    <TextArea
                      value={analysis.text}
                      onChange={(e) => handleScreenshotChange('topDownAnalysis', index, 'text', e.target.value)}
                      placeholder={`Enter ${analysis.title} analysis...`}
                    />
                  </ScreenshotField>
                ))}
              </ScreenshotContainer>

              <Row>
                <div style={{ flex: 1 }}>
                  <SectionTitle>Execution</SectionTitle>
                  <ScreenshotField>
                    <ImageUploadArea
                      onPaste={(e) => handlePaste('execution', 0, e)}
                      disabled={!isEditing}
                    >
                      {trade.execution.screenshot ? (
                        <>
                          <img
                            src={trade.execution.screenshot}
                            alt="Execution Screenshot"
                            onClick={() => openFullscreen(trade.execution.screenshot)}
                          />
                          <DeleteButton 
                            onClick={() => deleteScreenshot('execution', 0)}
                            disabled={!isEditing}
                          >
                            ×
                          </DeleteButton>
                        </>
                      ) : (
                        <span>{isEditing ? '📈 Paste Screenshot (Ctrl+V)' : 'No screenshot'}</span>
                      )}
                    </ImageUploadArea>
                    
                    <input
                      type="file"
                      id="execution-file"
                      style={{ display: 'none' }}
                      onChange={(e) => handleScreenshotChange('execution', 0, 'screenshot', e.target.files[0])}
                    />
                    
                    <TextArea
                      value={trade.execution.text}
                      onChange={(e) => handleScreenshotChange('execution', 0, 'text', e.target.value)}
                      placeholder="Enter execution analysis..."
                    />
                  </ScreenshotField>
                </div>
                <div style={{ flex: 1 }}>
                  <SectionTitle>Management</SectionTitle>
                  <ScreenshotField>
                    <ImageUploadArea
                      onPaste={(e) => handlePaste('management', 0, e)}
                      disabled={!isEditing}
                    >
                      {trade.management.screenshot ? (
                        <>
                          <img
                            src={trade.management.screenshot}
                            alt="Management Screenshot"
                            onClick={() => openFullscreen(trade.management.screenshot)}
                          />
                          <DeleteButton 
                            onClick={() => deleteScreenshot('management', 0)}
                            disabled={!isEditing}
                          >
                            ×
                          </DeleteButton>
                        </>
                      ) : (
                        <span>{isEditing ? '📈 Paste Screenshot (Ctrl+V)' : 'No screenshot'}</span>
                      )}
                    </ImageUploadArea>
                    
                    <input
                      type="file"
                      id="management-file"
                      style={{ display: 'none' }}
                      onChange={(e) => handleScreenshotChange('management', 0, 'screenshot', e.target.files[0])}
                    />
                    
                    <TextArea
                      value={trade.management.text}
                      onChange={(e) => handleScreenshotChange('management', 0, 'text', e.target.value)}
                      placeholder="Enter management analysis..."
                    />
                  </ScreenshotField>
                </div>
              </Row>

              <Row>
                <div style={{ flex: 1 }}>
                  <SectionTitle>Conclusion</SectionTitle>
                  <ScreenshotField>
                    <TextArea
                      value={trade.conclusion.text}
                      onChange={(e) => handleScreenshotChange('conclusion', 0, 'text', e.target.value)}
                      placeholder="Enter your conclusion..."
                    />
                  </ScreenshotField>
                </div>
                <div style={{ flex: 1 }}>
                  <NoteContainer>
                    <NotesList 
                      sourceType="trade" 
                      sourceId={trade.id} 
                      isEditing={isEditing}
                      onNoteUpdate={handleNoteUpdate}
                    />
                  </NoteContainer>
                </div>
              </Row>

              {fullscreenImage && (
                <FullscreenModal 
                  onClick={closeFullscreen} 
                  role="dialog"
                  scrollOffset={fullscreenImage.scrollOffset}
                >
                  <FullscreenImage 
                    src={fullscreenImage.src} 
                    alt="Fullscreen view" 
                    onClick={(e) => e.stopPropagation()}
                  />
                  <CloseButton onClick={closeFullscreen}>×</CloseButton>
                </FullscreenModal>
              )}

              {showNotePopup && (
                <ModalOverlay onClick={() => {
                  setShowNotePopup(false);
                  setNoteTitle('');
                  setNoteText('');
                  setSelectedNote(null);
                }}>
                  <NotePopup onClick={(e) => e.stopPropagation()}>
                    <NotePopupTitle>{editNoteIndex !== null ? 'Edit Note' : 'Add Note'}</NotePopupTitle>
                    <NotePopupInput
                      type="text"
                      placeholder="Note Title"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                    />
                    <NotePopupTextArea
                      placeholder="Note Text"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                    />
                    <NotePopupButtons>
                      <FormButton onClick={() => {
                        saveNote();
                        setShowNotePopup(false);
                      }}>Save</FormButton>
                      <FormButton onClick={() => {
                        setShowNotePopup(false);
                        setNoteTitle('');
                        setNoteText('');
                        setSelectedNote(null);
                      }}>Cancel</FormButton>
                      {editNoteIndex !== null && (
                        <FormButton onClick={() => {
                          deleteNote(editNoteIndex);
                          setShowNotePopup(false);
                        }}>Delete</FormButton>
                      )}
                    </NotePopupButtons>
                  </NotePopup>
                </ModalOverlay>
              )}

              <ButtonGroup>
                {!isEditing ? (
                  <>
                    <ActionButton onClick={handleEdit}>Edit Trade</ActionButton>
                    <ActionButton onClick={handleBack}>Back</ActionButton>
                  </>
                ) : (
                  <>
                    <ActionButton onClick={handleSave}>Save Changes</ActionButton>
                    <ActionButton onClick={handleCancel}>Cancel</ActionButton>
                  </>
                )}
              </ButtonGroup>
            </>
          )}
        </TradeContent>
      </CreateTradeContainer>
      <div className="notifications-layer">
        {notification && (
          <NotificationsContainer>
            <NotificationMessage type={notification.type}>
              {notification.message}
            </NotificationMessage>
          </NotificationsContainer>
        )}
      </div>
    </>
  );
}

export default TradeDetail;
