import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from 'react-datepicker';
import { enGB } from 'date-fns/locale';
import NotesList from '../Notes/NotesList.jsx';
import PreSessionLinkComponent from '../PreSessionLink/PreSessionLinkComponent.jsx';

registerLocale('en-gb', enGB);

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
  margin-bottom: 20px;
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



const BackButton = styled.button`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
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
const Subtitle = styled.p`
  color: #ff8c00;
  margin-top: 10px;
  font-size: 1.2em;
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
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
  animation: ${slideIn} 0.5s ease;
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
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  letter-spacing: 0.3px;
`;

const FormInput = styled.input`
  padding: 8px;
  background-color: #3e3e3e;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  width: 100%;
  text-align: center;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
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
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
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
  border-radius: 8px;
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
  border-radius:8px;
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
  border-radius: 8px;
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
  border-radius: 8px;

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
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
`;

const SectionTitle = styled.h2`
  color: rgb(230, 243, 255);
  font-size: 1.8rem;
  margin-bottom: 10px;
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
  width: 100%;
  border: 2px dashed #5e2ca5;
  text-align: center;
  cursor: pointer;
  margin: 10px auto;
  border-radius: 8px;
  background: rgba(94, 44, 165, 0.1);
  transition: all 0.3s ease;
  position: relative;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(94, 44, 165, 0.2);
    border-color: #7425C9;
  }

  .screenshots-container {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    width: 100%;
    flex-direction: column;
    justify-content: center;
  }

  .screenshot-item {
    position: relative;
    padding: 5px;
    border-radius: 8px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      cursor: pointer;
    }
    
    &:hover .delete-screenshot {
      opacity: 1;
    }
  }

  .add-more-photos {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(94, 44, 165, 0.1);
    border-radius: 8px;
    cursor: pointer;
    color: #B886EE;
    text-align: center;
    padding: 10px;
    
    &:hover {
      background: rgba(94, 44, 165, 0.2);
    }
  }

  span {
    color: #B886EE;
  }
`;

const ScreenshotsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  justify-content: flex-start;
`;

const ScreenshotItem = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
  }
  
  &:hover ${DeleteButton} {
    opacity: 1;
  }
`;

const AddMorePhotos = styled.div`
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(94, 44, 165, 0.1);
  border: 2px dashed #5e2ca5;
  border-radius: 8px;
  cursor: pointer;
  color: #B886EE;
  text-align: center;
  padding: 10px;
  
  &:hover {
    background: rgba(94, 44, 165, 0.2);
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
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
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


const TextArea = styled.textarea`
  width: 100%;
  background-color: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  min-height: 100px;
  text-align: justify;
  font-size: 16px;
  padding: 5px;
  font-family: 'Roboto', sans-serif;
  letter-spacing: 0.3px;
  line-height: 1.5;
  resize: none;
  overflow: hidden;
  
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
  padding-top: 68px;
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
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
  backdrop-filter: blur(5px);
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
  cursor: pointer;
  object-fit: contain;
  border: 2px solid #5e2ca5;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
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
  border-radius: 8px;
  width: 100%;
  text-align: center;
`;

const NotePopupTextArea = styled.textarea`
  padding: 8px;
  background-color: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
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
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
  color: #fff;
  padding: 8px;
  border-radius: 8px;
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

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  min-height: 300px;
  width: 100%;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(94, 44, 165, 0.3);
  border-radius: 50%;
  border-top: 4px solid #7425C9;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  color: #B886EE;
  font-size: 18px;
  margin-top: 10px;
  text-align: center;
`;

function TradeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  // Оновлюємо початковий стан з правильною структурою
  const [trade, setTrade] = useState({
    topDownAnalysis: [
      { title: 'Daily Timeframe', screenshots: [], text: '' },
      { title: '4h Timeframe', screenshots: [], text: '' },
      { title: '1h Timeframe', screenshots: [], text: '' },
      { title: '15/5m Timeframe', screenshots: [], text: '' }
    ],
    execution: { screenshots: [], text: '' },
    management: { screenshots: [], text: '' },
    conclusion: { text: '' },
    notes: []
  });
  const [accounts, setAccounts] = useState([]);
  const [executionItems, setExecutionItems] = useState({});
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [tempVolumeConfirmation, setTempVolumeConfirmation] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [linkedPresession, setLinkedPresession] = useState(null);

  // Добавляем refs для всех TextArea
  const textAreaRefs = {
    topDownAnalysis: useRef([]),
    execution: useRef(null),
    management: useRef(null),
    conclusion: useRef(null)
  };

  // Функция для автоматической высоты
  const autoResizeTextarea = (element) => {
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

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
      } catch (initError) {
        console.error('Error loading initial data:', initError);
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [id]);

  const fetchTradeDetails = async () => {
    try {
      setIsLoading(true); // Встановлюємо статус завантаження
      
      const loadedTrades = await window.electronAPI.getTrades();
      const currentTrade = loadedTrades.find(t => t.id === id);

      if (currentTrade) {
        // Підготовка даних трейду після завантаження
        // Забезпечуємо правильне представлення скріншотів
        const processTradeData = (trade) => {
          const processedTrade = {...trade};
          
          // Обробляємо топдаун аналіз
          if (processedTrade.topDownAnalysis) {
            processedTrade.topDownAnalysis = processedTrade.topDownAnalysis.map(analysis => {
              // Якщо немає screenshots, але є screenshot
              if (!analysis.screenshots && analysis.screenshot) {
                analysis.screenshots = [analysis.screenshot];
              } else if (!analysis.screenshots) {
                analysis.screenshots = [];
              }
              return analysis;
            });
          }
          
          // Обробляємо execution
          if (processedTrade.execution) {
            if (!processedTrade.execution.screenshots && processedTrade.execution.screenshot) {
              processedTrade.execution.screenshots = [processedTrade.execution.screenshot];
            } else if (!processedTrade.execution.screenshots) {
              processedTrade.execution.screenshots = [];
            }
          }
          
          // Обробляємо management
          if (processedTrade.management) {
            if (!processedTrade.management.screenshots && processedTrade.management.screenshot) {
              processedTrade.management.screenshots = [processedTrade.management.screenshot];
            } else if (!processedTrade.management.screenshots) {
              processedTrade.management.screenshots = [];
            }
          }
          
          return processedTrade;
        };

        // Обробляємо та встановлюємо дані трейду
        const processedTrade = processTradeData(currentTrade);
        
        // Видаляємо суфікси % та RR з значень
        const risk = processedTrade.risk ? processedTrade.risk.replace('%', '') : '';
        const rr = processedTrade.rr ? processedTrade.rr.replace('RR', '') : '';

        // Встановлюємо дані трейду з обробленими скріншотами
        setTrade({
          ...processedTrade,
          risk,
          rr
        });

        // Перевіряємо тип volumeConfirmation перед використанням split
        if (processedTrade.volumeConfirmation) {
          if (typeof processedTrade.volumeConfirmation === 'string') {
            setTempVolumeConfirmation(processedTrade.volumeConfirmation.split(', ').filter(Boolean));
          } else if (Array.isArray(processedTrade.volumeConfirmation)) {
            setTempVolumeConfirmation([...processedTrade.volumeConfirmation]);
          } else {
            // Якщо volumeConfirmation не є ні рядком, ні масивом, встановлюємо порожній масив
            console.warn('volumeConfirmation має невідомий тип:', typeof processedTrade.volumeConfirmation);
            setTempVolumeConfirmation([]);
          }
        }

        // Завантажуємо нотатки для трейду
        try {
          console.log('Завантаження нотаток для трейду ID:', id);
          const tradeNotes = await window.electronAPI.getNotesBySource('trade', id);
          console.log('Отримано нотаток:', tradeNotes.length);
          
          if (tradeNotes && tradeNotes.length > 0) {
            // Завантажуємо також зображення для кожної нотатки
            const notesWithImages = await Promise.all(tradeNotes.map(async note => {
              try {
                const images = await window.electronAPI.getNoteImages(note.id);
                return { ...note, images };
              } catch (noteError) {
                console.error(`Помилка отримання зображень для нотатки ${note.id}:`, noteError);
                return { ...note, images: [] };
              }
            }));
            
            console.log('Нотатки з зображеннями:', notesWithImages);
            setNotes(notesWithImages);
            
            // Оновлюємо notes в об'єкті trade
            setTrade(prev => ({
              ...prev,
              notes: notesWithImages
            }));
          } else {
            setNotes([]);
          }
        } catch (notesError) {
          console.error('Помилка завантаження нотаток:', notesError);
          setNotes([]);
        }

        // Завантажуємо дані про акаунти
        try {
          setAccounts(await window.electronAPI.getAllAccounts());
        } catch (accountError) {
          console.error('Помилка завантаження акаунтів:', accountError);
          setAccounts([]);
        }

        // Завантажуємо елементи виконання
        try {
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
        } catch (executionError) {
          console.error('Помилка завантаження елементів виконання:', executionError);
          setExecutionItems({});
        }

        // Перевіряємо чи є зв'язок з пресесією
        if (processedTrade.presession_id) {
          try {
            const presession = await window.electronAPI.getPresession(processedTrade.presession_id);
            setLinkedPresession(presession);
          } catch (presessionError) {
            console.error('Помилка завантаження пресесії:', presessionError);
            setLinkedPresession(null);
          }
        } else {
          try {
            // Перевіряємо чи є пресесія з іншого джерела
            const linkedPresession = await window.electronAPI.getLinkedPresession(id);
            if (linkedPresession) {
              setLinkedPresession(linkedPresession);
            } else {
              setLinkedPresession(null);
            }
          } catch (linkedPresessionError) {
            console.error('Помилка перевірки пресесії:', linkedPresessionError);
            setLinkedPresession(null);
          }
        }

        // Скидаємо режим редагування
        setIsEditing(false);
        setHasUnsavedChanges(false);
        setNotification(null);
        
        // Додаємо затримку, щоб дати час для рендерингу компонентів
        setTimeout(() => {
          // Автоматично змінюємо висоту всіх текстових полів після завантаження даних
          // Для топдаун аналізу
          if (textAreaRefs.topDownAnalysis.current) {
            textAreaRefs.topDownAnalysis.current.forEach(ref => {
              if (ref) autoResizeTextarea(ref);
            });
          }
          
          // Для execution
          if (textAreaRefs.execution.current) {
            autoResizeTextarea(textAreaRefs.execution.current);
          }
          
          // Для management
          if (textAreaRefs.management.current) {
            autoResizeTextarea(textAreaRefs.management.current);
          }
          
          // Для conclusion
          if (textAreaRefs.conclusion.current) {
            autoResizeTextarea(textAreaRefs.conclusion.current);
          }
        }, 100); // Невелика затримка для завершення рендерингу
      } else {
        // Якщо трейд не знайдено
        console.error('Трейд не знайдено:', id);
        setNotification({
          type: 'error',
          message: 'Трейд не знайдено!'
        });
      }
    } catch (tradeLoadError) {
      console.error('Error loading trade:', tradeLoadError);
      setNotification({
        type: 'error',
        message: `Помилка завантаження трейду: ${tradeLoadError.message}`
      });
    } finally {
      // Завжди вимикаємо індикатор завантаження
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    // Перша спроба - використати window.history.back()
    try {
      window.history.back();
    } catch (navigationError) {
      console.error("Помилка при спробі використати window.history.back():", navigationError);
      // Запасний варіант - використовуємо navigate(-1)
      navigate(-1);
    }
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
      
      // Підготовка даних трейду для збереження
      // Забезпечуємо зворотну сумісність
      const prepareTradeData = () => {
        const preparedTrade = {...trade};
        
        // Перетворюємо топдаун аналіз
        preparedTrade.topDownAnalysis = trade.topDownAnalysis.map(analysis => {
          return {
            ...analysis,
            screenshot: analysis.screenshots && analysis.screenshots.length > 0 ? analysis.screenshots[0] : analysis.screenshot || '',
            screenshots: analysis.screenshots || []
          };
        });
        
        // Перетворюємо execution
        preparedTrade.execution = {
          ...trade.execution,
          screenshot: trade.execution.screenshots && trade.execution.screenshots.length > 0 ? trade.execution.screenshots[0] : trade.execution.screenshot || '',
          screenshots: trade.execution.screenshots || []
        };
        
        // Перетворюємо management
        preparedTrade.management = {
          ...trade.management,
          screenshot: trade.management.screenshots && trade.management.screenshots.length > 0 ? trade.management.screenshots[0] : trade.management.screenshot || '',
          screenshots: trade.management.screenshots || []
        };
        
        // Конвертуємо значення для правильного збереження в SQLite
        preparedTrade.rr = parseFloat(trade.rr) || 0;
        preparedTrade.risk = parseFloat(trade.risk) || 0;
        preparedTrade.profitLoss = parseFloat(trade.profitLoss) || 0;
        
        // Видаляємо знаки валюти перед збереженням gainedPoints
        if (typeof trade.gainedPoints === 'string') {
          preparedTrade.gainedPoints = trade.gainedPoints.replace(/[^0-9.-]/g, '');
        }
        
        // SQLite зберігає boolean як 0 або 1
        preparedTrade.followingPlan = trade.followingPlan ? 1 : 0;
        preparedTrade.bestTrade = trade.bestTrade ? 1 : 0;
        
        // Конвертуємо score в число
        preparedTrade.score = parseFloat(trade.score) || 0;
        
        // Переконуємося, що ID акаунту збережено як рядок
        if (preparedTrade.account) {
          preparedTrade.account = preparedTrade.account.toString();
        }
        
        return preparedTrade;
      };
      
      // Отримуємо підготовлені дані
      const preparedTrade = prepareTradeData();
      
      // Логуємо важливі поля для перевірки
      console.log('Важливі поля для оновлення:', {
        account: preparedTrade.account,
        rr: preparedTrade.rr,
        profitLoss: preparedTrade.profitLoss,
        gainedPoints: preparedTrade.gainedPoints,
        followingPlan: preparedTrade.followingPlan,
        bestTrade: preparedTrade.bestTrade,
        score: preparedTrade.score
      });
      
      console.log('ID акаунту перед збереженням змін:', preparedTrade.account, typeof preparedTrade.account);
      
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
      console.log('Оновлення даних трейду:', preparedTrade);
      await window.electronAPI.updateTrade(trade.id, preparedTrade);
      console.log('Трейд успішно оновлено');
      
      // Оновлюємо баланс акаунту, якщо трейд має акаунт та результат
      if (preparedTrade.account && preparedTrade.result) {
        console.log('Оновлення балансу акаунту на основі трейду');
        await window.electronAPI.updateAccountWithTrade(preparedTrade.account, preparedTrade);
      }
      
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
        } catch (noteProcessError) {
          console.error(`Помилка при обробці нотатки ${note.id || 'нова'}:`, noteProcessError);
          return { success: false, error: noteProcessError };
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
    } catch (saveError) {
      console.error('Помилка при збереженні трейду:', saveError);
      setIsSaving(false);
      alert(`Помилка при збереженні трейду: ${saveError.message}`);
    }
  };

  const handleCancel = () => {
    // Скасовуємо редагування і повертаємося до останнього збереженого стану
    fetchTradeDetails();
    setIsEditing(false);
    setHasUnsavedChanges(false);
    setNotification(null);
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
    if (!trade) return;
    
    setTrade((prev) => {
      if (!prev) return prev;

      if (section === 'topDownAnalysis') {
        const updated = [...(prev.topDownAnalysis || [])];
        if (updated[index]) {
          updated[index] = { ...updated[index], [field]: value };
        }
        
        setTimeout(() => {
          if (textAreaRefs.topDownAnalysis.current?.[index]) {
            autoResizeTextarea(textAreaRefs.topDownAnalysis.current[index]);
          }
        }, 0);
        
        return { ...prev, topDownAnalysis: updated };
      } else {
        setTimeout(() => {
          if (textAreaRefs[section]?.current) {
            autoResizeTextarea(textAreaRefs[section].current);
          }
        }, 0);
        
        return { 
          ...prev, 
          [section]: { 
            ...(prev[section] || {}), 
            [field]: value 
          } 
        };
      }
    });
  };

  // Инициализируем refs для topDownAnalysis
  useEffect(() => {
    textAreaRefs.topDownAnalysis.current = textAreaRefs.topDownAnalysis.current.slice(0, trade.topDownAnalysis.length);
  }, [trade.topDownAnalysis.length]);

  const handleAddScreenshot = async (section, index, file) => {
    if (!isEditing) return; // Блокуємо якщо не в режимі редагування
    
    try {
      let buffer;
      if (file instanceof Blob) {
        buffer = await file.arrayBuffer();
      } else {
        // Якщо вже маємо шлях до файлу
        return handleAddScreenshotPath(section, index, file);
      }
      
      const filePath = await window.electronAPI.saveBlobAsFile(buffer);
      handleAddScreenshotPath(section, index, filePath);
    } catch (screenshotError) {
      console.error('Error saving screenshot:', screenshotError);
      alert('Failed to save screenshot.');
    }
  };

  const handleAddScreenshotPath = (section, index, filePath) => {
    if (!isEditing) return; // Блокуємо якщо не в режимі редагування
    
    setTrade(prev => {
      if (section === 'topDownAnalysis') {
        const updated = [...prev.topDownAnalysis];
        
        // Підтримка зворотної сумісності
        if (!updated[index].screenshots) {
          updated[index].screenshots = [];
          
          // Якщо є окреме поле screenshot, додаємо його до масиву
          if (updated[index].screenshot) {
            updated[index].screenshots.push(updated[index].screenshot);
          }
        }
        
        updated[index] = { 
          ...updated[index], 
          screenshots: [...(updated[index].screenshots || []), filePath],
          screenshot: filePath // Підтримка зворотної сумісності
        };
        return { ...prev, topDownAnalysis: updated };
      } else {
        // Підтримка зворотної сумісності
        let screenshots = [];
        if (prev[section].screenshots) {
          screenshots = [...prev[section].screenshots];
        } else if (prev[section].screenshot) {
          screenshots = [prev[section].screenshot];
        }
        
        return { 
          ...prev, 
          [section]: { 
            ...prev[section], 
            screenshots: [...screenshots, filePath],
            screenshot: filePath // Підтримка зворотної сумісності
          } 
        };
      }
    });
    
    setHasUnsavedChanges(true);
    setNotification({
      type: 'warning',
      message: 'You have unsaved changes!'
    });
  };

  const handlePaste = async (section, index, e) => {
    if (!isEditing) return; // Блокуємо якщо не в режимі редагування
    
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        try {
          await handleAddScreenshot(section, index, blob);
        } catch (pasteError) {
          console.error('Error pasting image:', pasteError);
          alert('Failed to paste screenshot.');
        }
        e.preventDefault();
        return;
      }
    }
  };

  const deleteScreenshot = (section, index, screenshotIndex) => {
    if (!isEditing) return; // Блокуємо якщо не в режимі редагування
    
    setTrade((prev) => {
      if (section === 'topDownAnalysis') {
        const updated = [...prev.topDownAnalysis];
        
        // Якщо є масив screenshots
        if (updated[index].screenshots) {
          const filteredScreenshots = updated[index].screenshots.filter(
            (_, i) => i !== screenshotIndex
          );
          
          // Оновлюємо також поле screenshot для зворотної сумісності
          const newScreenshot = filteredScreenshots.length > 0 ? filteredScreenshots[0] : '';
          
          updated[index] = { 
            ...updated[index], 
            screenshots: filteredScreenshots,
            screenshot: newScreenshot
          };
        } else {
          // Якщо є тільки одне поле screenshot
          updated[index] = { ...updated[index], screenshot: '' };
        }
        
        return { ...prev, topDownAnalysis: updated };
      } else {
        // Якщо є масив screenshots
        if (prev[section].screenshots) {
          const filteredScreenshots = prev[section].screenshots.filter(
            (_, i) => i !== screenshotIndex
          );
          
          // Оновлюємо також поле screenshot для зворотної сумісності
          const newScreenshot = filteredScreenshots.length > 0 ? filteredScreenshots[0] : '';
          
          return { 
            ...prev, 
            [section]: { 
              ...prev[section], 
              screenshots: filteredScreenshots,
              screenshot: newScreenshot
            } 
          };
        } else {
          // Якщо є тільки одне поле screenshot
          return { ...prev, [section]: { ...prev[section], screenshot: '' } };
        }
      }
    });
    
    setHasUnsavedChanges(true);
    setNotification({
      type: 'warning',
      message: 'You have unsaved changes!'
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
            
            <Title>Trade #{trade.no}</Title>
            <Subtitle>Let's explore your trade!</Subtitle>
            <PreSessionLinkComponent tradeId={id} />
        </Header>
        <TradeContent>
          {isLoading ? (
            <LoadingContainer>
              <LoadingSpinner />
              <LoadingText>Завантаження даних трейду...</LoadingText>
              <LoadingText style={{ fontSize: '14px', marginTop: '5px' }}>Будь ласка, зачекайте</LoadingText>
            </LoadingContainer>
          ) : (
            <>
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
                        locale="en-gb"
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
                            {account.name} ({formatCurrency(account.currentEquity)})
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
                      {(!analysis.screenshots || analysis.screenshots.length === 0) && !analysis.screenshot ? (
                        <span>{isEditing ? '📈 Paste Screenshot (Ctrl+V)' : 'No screenshot'}</span>
                      ) : (
                        <div className="screenshots-container">
                          {/* Підтримка зворотної сумісності - перевіряємо як масив, так і одиночне зображення */}
                          {analysis.screenshots && analysis.screenshots.length > 0 ? (
                            // Якщо є масив зображень
                            analysis.screenshots.map((screenshot, screenshotIndex) => (
                              <div key={screenshotIndex} className="screenshot-item">
                                <img
                                  src={screenshot}
                                  alt={`${analysis.title} ${screenshotIndex + 1}`}
                                  onClick={() => openFullscreen(screenshot)}
                                />
                                {isEditing && (
                                  <DeleteButton onClick={() => deleteScreenshot('topDownAnalysis', index, screenshotIndex)}>
                                    ×
                                  </DeleteButton>
                                )}
                              </div>
                            ))
                          ) : analysis.screenshot ? (
                            // Якщо є тільки одне зображення
                            <div className="screenshot-item">
                              <img
                                src={analysis.screenshot}
                                alt={analysis.title}
                                onClick={() => openFullscreen(analysis.screenshot)}
                              />
                              {isEditing && (
                                <DeleteButton onClick={() => deleteScreenshot('topDownAnalysis', index, 0)}>
                                  ×
                                </DeleteButton>
                              )}
                            </div>
                          ) : null}
                          
                          {isEditing && (
                            <div className="add-more-photos">
                              <span>📈 Paste Screenshot (Ctrl+V)</span>
                            </div>
                          )}
                        </div>
                      )}
                    </ImageUploadArea>
                    
                    <input
                      type="file"
                      id={`tda-file-${index}`}
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0] && isEditing) {
                          handleAddScreenshot('topDownAnalysis', index, e.target.files[0]);
                        }
                      }}
                    />
                    
                    <TextArea
                      value={analysis.text}
                      onChange={(e) => handleScreenshotChange('topDownAnalysis', index, 'text', e.target.value)}
                      placeholder={`Enter ${analysis.title} analysis...`}
                      ref={el => textAreaRefs.topDownAnalysis.current[index] = el}
                      readOnly={!isEditing}
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
                      {(!trade.execution.screenshots || trade.execution.screenshots.length === 0) && !trade.execution.screenshot ? (
                        <span>{isEditing ? '📈 Paste Screenshot (Ctrl+V)' : 'No screenshot'}</span>
                      ) : (
                        <div className="screenshots-container">
                          {/* Підтримка зворотної сумісності */}
                          {trade.execution.screenshots && trade.execution.screenshots.length > 0 ? (
                            // Якщо є масив зображень
                            trade.execution.screenshots.map((screenshot, screenshotIndex) => (
                              <div key={screenshotIndex} className="screenshot-item">
                                <img
                                  src={screenshot}
                                  alt={`Execution Screenshot ${screenshotIndex + 1}`}
                                  onClick={() => openFullscreen(screenshot)}
                                />
                                {isEditing && (
                                  <DeleteButton onClick={() => deleteScreenshot('execution', 0, screenshotIndex)}>
                                    ×
                                  </DeleteButton>
                                )}
                              </div>
                            ))
                          ) : trade.execution.screenshot ? (
                            // Якщо є тільки одне зображення
                            <div className="screenshot-item">
                              <img
                                src={trade.execution.screenshot}
                                alt="Execution Screenshot"
                                onClick={() => openFullscreen(trade.execution.screenshot)}
                              />
                              {isEditing && (
                                <DeleteButton onClick={() => deleteScreenshot('execution', 0, 0)}>
                                  ×
                                </DeleteButton>
                              )}
                            </div>
                          ) : null}
                          
                          {isEditing && (
                            <div className="add-more-photos">
                              <span>📈 Paste Screenshot (Ctrl+V)</span>
                            </div>
                          )}
                        </div>
                      )}
                    </ImageUploadArea>
                    
                    <input
                      type="file"
                      id="execution-file"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0] && isEditing) {
                          handleAddScreenshot('execution', 0, e.target.files[0]);
                        }
                      }}
                    />
                    
                    <TextArea
                      value={trade.execution.text}
                      onChange={(e) => handleScreenshotChange('execution', 0, 'text', e.target.value)}
                      placeholder="Enter execution analysis..."
                      ref={el => textAreaRefs.execution.current = el}
                      readOnly={!isEditing}
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
                      {(!trade.management.screenshots || trade.management.screenshots.length === 0) && !trade.management.screenshot ? (
                        <span>{isEditing ? '📈 Paste Screenshot (Ctrl+V)' : 'No screenshot'}</span>
                      ) : (
                        <div className="screenshots-container">
                          {/* Підтримка зворотної сумісності */}
                          {trade.management.screenshots && trade.management.screenshots.length > 0 ? (
                            // Якщо є масив зображень
                            trade.management.screenshots.map((screenshot, screenshotIndex) => (
                              <div key={screenshotIndex} className="screenshot-item">
                                <img
                                  src={screenshot}
                                  alt={`Management Screenshot ${screenshotIndex + 1}`}
                                  onClick={() => openFullscreen(screenshot)}
                                />
                                {isEditing && (
                                  <DeleteButton onClick={() => deleteScreenshot('management', 0, screenshotIndex)}>
                                    ×
                                  </DeleteButton>
                                )}
                              </div>
                            ))
                          ) : trade.management.screenshot ? (
                            // Якщо є тільки одне зображення
                            <div className="screenshot-item">
                              <img
                                src={trade.management.screenshot}
                                alt="Management Screenshot"
                                onClick={() => openFullscreen(trade.management.screenshot)}
                              />
                              {isEditing && (
                                <DeleteButton onClick={() => deleteScreenshot('management', 0, 0)}>
                                  ×
                                </DeleteButton>
                              )}
                            </div>
                          ) : null}
                          
                          {isEditing && (
                            <div className="add-more-photos">
                              <span>📈 Paste Screenshot (Ctrl+V)</span>
                            </div>
                          )}
                        </div>
                      )}
                    </ImageUploadArea>
                    
                    <input
                      type="file"
                      id="management-file"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0] && isEditing) {
                          handleAddScreenshot('management', 0, e.target.files[0]);
                        }
                      }}
                    />
                    
                    <TextArea
                      value={trade.management.text}
                      onChange={(e) => handleScreenshotChange('management', 0, 'text', e.target.value)}
                      placeholder="Enter management analysis..."
                      ref={el => textAreaRefs.management.current = el}
                      readOnly={!isEditing}
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
                      ref={el => textAreaRefs.conclusion.current = el}
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
                    onClick={closeFullscreen}  // Змінено для закриття при натисканні на зображення
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
