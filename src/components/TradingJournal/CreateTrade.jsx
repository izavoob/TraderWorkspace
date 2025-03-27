import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from 'react-datepicker';
import { enGB } from 'date-fns/locale';
import NotesList from '../Notes/NotesList.jsx';
import NoteModal from '../Notes/NoteModal.jsx';
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
  overflow-x: hidden; // Прибираємо горизонтальний скрол
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
  margin-bottom: 20px;
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
  animation: ${slideIn} 0.5s ease;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
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
  color: ${props => {
    if (props.name === 'gainedPoints') {
      const value = parseFloat(props.value);
      if (isNaN(value)) return '#fff';
      return value < 0 ? '#ff4d4d' : value > 0 ? '#4dff4d' : '#fff';
    }
    return '#fff';
  }};
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
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
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
  border-radius: 8px;
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
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
  border-radius: 8px;
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
  border-radius: 8px;
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
  padding-top: 65px;
`;

const NoteItem = styled.div`
  background-color: #2e2e2e;
  padding: 10px;
  border-radius: 8px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 10;

  ${ImageUploadArea}:hover & {
    opacity: 1;
  }

  &:hover {
    transform: scale(1.1);
    background: #ff6b81;
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
  transform: translateY(${props => props.scrollOffset}px); // Додаємо трансформацію
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
  position: fixed;
  top: 20px;
  right: 20px;
  background: conic-gradient(from 45deg, #7425c9, #b886ee);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  color: #fff;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  z-index: 2001;
  opacity: 0;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ModalOverlay = styled.div`
 position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
  z-index: 2000;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  transform: translateY(${props => props.scrollOffset}px); // Додаємо трансформацію
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
  box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
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

function CreateTrade() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tradeCount, setTradeCount] = useState(0);
  const [accounts, setAccounts] = useState([]);
  
  console.log('CreateTrade component mounting...');
  console.log('Location state:', location.state);
  
  // Отримуємо інформацію про новий трейд з різних джерел
  const [tradeInfo] = useState(() => {
    console.log('Initializing tradeInfo...');
    console.log('Location state:', location.state);
    
    // Спочатку перевіряємо state з навігації
    if (location.state?.presessionData) {
      console.log('Found presession data in navigation state:', location.state.presessionData);
      
      // Очищаємо localStorage, оскільки дані є в state
      localStorage.removeItem('newTradeInfo');
      localStorage.removeItem('currentPresessionId');
      
      return location.state.presessionData;
    }

    // Потім перевіряємо localStorage
    const info = localStorage.getItem('newTradeInfo');
    const currentPresessionId = localStorage.getItem('currentPresessionId');
    
    console.log('localStorage data:', { newTradeInfo: info, currentPresessionId });

    if (info) {
      try {
        const parsed = JSON.parse(info);
        console.log('Successfully parsed newTradeInfo:', parsed);
        
        // Очищаємо localStorage після успішного парсингу
        localStorage.removeItem('newTradeInfo');
        localStorage.removeItem('currentPresessionId');
        
        return parsed;
      } catch (e) {
        console.error('Error parsing newTradeInfo:', e);
      }
    }

    // Якщо є тільки ID пресесії, спробуємо завантажити її
    if (currentPresessionId) {
      console.log('Found currentPresessionId:', currentPresessionId);
      return { presessionId: currentPresessionId };
    }

    console.log('No trade info found in any source');
    return null;
  });

  // Використовуємо ID з tradeInfo або генеруємо новий
  const [tradeId] = useState(() => {
    const id = tradeInfo?.tradeId || crypto.randomUUID();
    console.log('Using trade ID:', id);
    return id;
  });
  
  // Використовуємо presessionId та інформацію про пресесію з tradeInfo
  const [presessionId, setPresessionId] = useState(() => {
    const id = tradeInfo?.presession?.id || tradeInfo?.presessionId || null;
    console.log('Initial presessionId:', id);
    return id;
  });

  const [selectedPresession, setSelectedPresession] = useState(() => {
    const presession = tradeInfo?.presession || null;
    console.log('Initial selectedPresession:', presession);
    return presession;
  });

  // Ефект для завантаження даних пресесії, якщо є тільки ID
  useEffect(() => {
    const loadPresessionData = async () => {
      if (presessionId && !selectedPresession) {
        console.log('Loading presession data for ID:', presessionId);
        try {
          const presession = await window.electronAPI.getPresession(presessionId);
          console.log('Loaded presession data:', presession);
          if (presession) {
            setSelectedPresession(presession);
          }
        } catch (error) {
          console.error('Error loading presession data:', error);
        }
      }
    };
    loadPresessionData();
  }, [presessionId, selectedPresession]);

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
    id: tradeId,
    date: new Date().toISOString().split('T')[0],
    account: '',
    pair: tradeInfo?.presession?.pair || '',
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
    presession_id: presessionId,
    topDownAnalysis: [
      { title: 'Daily Timeframe', screenshots: [], text: '' },
      { title: '4h Timeframe', screenshots: [], text: '' },
      { title: '1h Timeframe', screenshots: [], text: '' },
      { title: '15/5m Timeframe', screenshots: [], text: '' },
    ],
    execution: { screenshots: [], text: '' },
    management: { screenshots: [], text: '' },
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
  const [notesToSave, setNotesToSave] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Додаємо refs для всіх TextArea
  const textAreaRefs = {
    topDownAnalysis: useRef([]),
    execution: useRef(null),
    management: useRef(null),
    conclusion: useRef(null)
  };

  // Функція для автоматичної зміни висоти
  const autoResizeTextarea = (element) => {
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    const loadInitialData = async () => {
      console.log('Loading initial data...');
      try {
        // Завантажуємо трейди і визначаємо наступний номер
        const trades = await window.electronAPI.getTrades();
        // Знаходимо максимальний номер трейду
        const maxTradeNo = trades.reduce((max, trade) => {
          const tradeNo = parseInt(trade.no) || 0;
          return tradeNo > max ? tradeNo : max;
        }, 0);
        // Встановлюємо наступний номер (+1 до максимального)
        setTradeCount(maxTradeNo + 1);

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

        // Завантажуємо нотатки, якщо вони вже є
        const notes = await window.electronAPI.getNotesBySource('trade', tradeId);
        if (notes && notes.length > 0) {
          setTrade(prev => ({
            ...prev,
            notes: notes.map(note => ({
              title: note.title,
              text: note.content,
              id: note.id,
              tagId: note.tag_id,
              tagName: note.tag_name
            }))
          }));
        }

        console.log('Initial data loading completed');
      } catch (error) {
        console.error('Error loading initial data:', error);
        setTradeCount(1);
      }
    };
    loadInitialData();
  }, [tradeId]);

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
        
        // Автоматично змінюємо висоту після оновлення значення
        setTimeout(() => {
          if (textAreaRefs.topDownAnalysis.current[index]) {
            autoResizeTextarea(textAreaRefs.topDownAnalysis.current[index]);
          }
        }, 0);
        
        return { ...prev, topDownAnalysis: updated };
      } else {
        // Автоматично змінюємо висоту після оновлення значення
        setTimeout(() => {
          if (textAreaRefs[section].current) {
            autoResizeTextarea(textAreaRefs[section].current);
          }
        }, 0);
        
        return { ...prev, [section]: { ...prev[section], [field]: value } };
      }
    });
  };

  // Ініціалізуємо refs для topDownAnalysis при першому рендері
  useEffect(() => {
    textAreaRefs.topDownAnalysis.current = textAreaRefs.topDownAnalysis.current.slice(0, trade.topDownAnalysis.length);
  }, [trade.topDownAnalysis.length]);

  const handleAddScreenshot = async (section, index, file) => {
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
    } catch (error) {
      console.error('Error saving screenshot:', error);
      alert('Failed to save screenshot.');
    }
  };

  const handleAddScreenshotPath = (section, index, filePath) => {
    setTrade(prev => {
      if (section === 'topDownAnalysis') {
        const updated = [...prev.topDownAnalysis];
        updated[index] = { 
          ...updated[index], 
          screenshots: [...(updated[index].screenshots || []), filePath] 
        };
        return { ...prev, topDownAnalysis: updated };
      } else {
        return { 
          ...prev, 
          [section]: { 
            ...prev[section], 
            screenshots: [...(prev[section].screenshots || []), filePath] 
          } 
        };
      }
    });
  };

  const handlePaste = async (section, index, e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        try {
          await handleAddScreenshot(section, index, blob);
        } catch (error) {
          console.error('Error pasting image:', error);
          alert('Failed to paste screenshot.');
        }
        e.preventDefault();
        return;
      }
    }
  };

  const deleteScreenshot = (section, index, screenshotIndex) => {
    setTrade((prev) => {
      if (section === 'topDownAnalysis') {
        const updated = [...prev.topDownAnalysis];
        const filteredScreenshots = updated[index].screenshots.filter(
          (_, i) => i !== screenshotIndex
        );
        updated[index] = { ...updated[index], screenshots: filteredScreenshots };
        return { ...prev, topDownAnalysis: updated };
      } else {
        const filteredScreenshots = prev[section].screenshots.filter(
          (_, i) => i !== screenshotIndex
        );
        return { 
          ...prev, 
          [section]: { ...prev[section], screenshots: filteredScreenshots } 
        };
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

  const openNotePopup = (index = null, event) => {
    if (!event || !event.currentTarget) return;
  
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const scrollY = window.scrollY;
    
    let popupTop = scrollY + rect.bottom + 10;
    
    const viewportHeight = window.innerHeight;
    const popupHeight = 400;
    
    if (rect.bottom + popupHeight > viewportHeight) {
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
  };

  const closeNotePopup = () => {
    setShowNotePopup(false);
    setNoteTitle('');
    setNoteText('');
    setEditNoteIndex(null);
  };

  const handleNoteSave = async (note) => {
    try {
      // Зберігаємо нотатку з тимчасовими даними
      const savedNote = await window.electronAPI.saveNote({
        ...note,
        sourceType: 'trade',
        sourceId: tradeId,
        tradeNo: null, // Буде оновлено після збереження трейду
        tradeDate: null, // Буде оновлено після збереження трейду
        tagId: note.tag_id || note.tagId || null,
        tagName: note.tag_name || note.tagName || null
      });
      
      // Отримуємо повну інформацію про збережену нотатку
      const fullNote = await window.electronAPI.getNoteById(savedNote.id);
      
      // Оновлюємо стан trade з новою нотаткою
      setTrade(prev => ({
        ...prev,
        notes: [...(prev.notes || []), {
          id: fullNote.id,
          title: fullNote.title,
          text: fullNote.content,
          source_type: fullNote.source_type,
          source_id: fullNote.source_id,
          tag_id: fullNote.tag_id,
          tag_name: fullNote.tag_name,
          images: fullNote.images || []
        }]
      }));

      setShowNotePopup(false);
      setNoteTitle('');
      setNoteText('');
      setEditNoteIndex(null);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      console.log('Початок збереження трейду');
      
      // Отримуємо поточну кількість трейдів для номера
      const trades = await window.electronAPI.getTrades();
      const tradeNo = trades.length + 1;
      
      // Перевіряємо чи є зв'язок з пресесією перед збереженням трейду
      let linkedPresession = null;
      try {
        linkedPresession = await window.electronAPI.getLinkedPresession(tradeId);
        console.log("Перевірка зв'язку з пресесією:", linkedPresession);
      } catch (presessionError) {
        console.error("Помилка при перевірці зв'язку з пресесією:", presessionError);
      }
      
      // Використовуємо presession_id зі стану trade, якщо він є
      const presessionId = trade.presession_id || (linkedPresession && linkedPresession.id) || null;
      console.log("Використовуємо presession_id:", presessionId);
      
      // Підготовка даних трейду для збереження
      const prepareTradeData = () => {
        const preparedTrade = {...trade};
        
        // Перетворюємо топдаун аналіз
        preparedTrade.topDownAnalysis = trade.topDownAnalysis.map(analysis => {
          return {
            ...analysis,
            screenshot: analysis.screenshots && analysis.screenshots.length > 0 ? analysis.screenshots[0] : '',
            screenshots: analysis.screenshots || []
          };
        });
        
        // Перетворюємо execution
        preparedTrade.execution = {
          ...trade.execution,
          screenshot: trade.execution.screenshots && trade.execution.screenshots.length > 0 ? trade.execution.screenshots[0] : '',
          screenshots: trade.execution.screenshots || []
        };
        
        // Перетворюємо management
        preparedTrade.management = {
          ...trade.management,
          screenshot: trade.management.screenshots && trade.management.screenshots.length > 0 ? trade.management.screenshots[0] : '',
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
        
        return preparedTrade;
      };
      
      const tradeData = {
        ...prepareTradeData(),
        no: tradeNo,
        volumeConfirmation: Array.isArray(trade.volumeConfirmation) ? trade.volumeConfirmation : [],
        presession_id: presessionId
      };
      
      // Логуємо важливі поля для перевірки
      console.log('Важливі поля для збереження:', {
        rr: tradeData.rr,
        profitLoss: tradeData.profitLoss,
        gainedPoints: tradeData.gainedPoints,
        followingPlan: tradeData.followingPlan,
        bestTrade: tradeData.bestTrade,
        score: tradeData.score
      });

      console.log('Зберігаємо трейд з даними:', tradeData);
      
      // Зберігаємо трейд
      await window.electronAPI.saveTrade(tradeData);
      console.log('Трейд успішно збережено');

      // Якщо є presessionId, оновлюємо linked_trades в пресесії
      if (presessionId) {
        try {
          // Отримуємо поточну пресесію
          const presession = await window.electronAPI.getPresession(presessionId);
          if (presession) {
            // Парсимо поточні linked_trades
            let linkedTrades = [];
            try {
              linkedTrades = JSON.parse(presession.linked_trades || '[]');
            } catch (e) {
              console.error('Error parsing linked_trades:', e);
            }

            // Додаємо новий tradeId, якщо його ще немає
            if (!linkedTrades.includes(tradeData.id)) {
              linkedTrades.push(tradeData.id);
            }

            // Оновлюємо пресесію з новим списком трейдів
            await window.electronAPI.updatePresession({
              ...presession,
              linked_trades: linkedTrades
            });
            console.log('Пресесію оновлено з новим трейдом');
          }
        } catch (presessionError) {
          console.error("Помилка при оновленні пресесії:", presessionError);
        }
      }

      // Додатково гарантуємо зв'язок з пресесією, якщо він є
      if (presessionId) {
        try {
          console.log("Підтверджуємо зв'язок з пресесією:", presessionId);
          // Переприв'язуємо пресесію до трейду щоб гарантувати збереження зв'язку
          await window.electronAPI.linkTradeToPresession(tradeData.id, presessionId);
          console.log("Зв'язок з пресесією збережено");
        } catch (presessionError) {
          console.error("Помилка при збереженні зв'язку з пресесією:", presessionError);
        }
      } else {
        console.log("Немає зв'язку з пресесією для збереження");
      }

      // Отримуємо всі нотатки для цього трейду з бази даних
      const notes = await window.electronAPI.getNotesBySource('trade', tradeData.id);
      console.log('Отримані нотатки з бази даних:', notes);

      // Оновлюємо нотатки з правильним номером трейду та датою
      if (notes && notes.length > 0) {
        console.log('Оновлюємо нотатки з даними трейду:', notes.length);
        console.log('ID трейду для оновлення нотаток:', tradeData.id);
        
        try {
          // Використовуємо спеціальну функцію для оновлення нотаток з даними трейду
          await window.electronAPI.updateNotesWithTradeData(tradeData.id);
          console.log('Всі нотатки успішно оновлено через updateNotesWithTradeData');
        } catch (error) {
          console.error('Помилка при оновленні нотаток:', error);
          throw error;
        }
      } else {
        console.log('Немає нотаток для оновлення');
      }

      // Оновлюємо баланс акаунту
      if (trade.account && trade.result && trade.profitLoss) {
        await window.electronAPI.updateAccountBalance(trade.account, parseFloat(trade.profitLoss));
      }

      // Якщо є presessionId, повертаємося на сторінку пресесії
      if (presessionId) {
        navigate(`/daily-routine/pre-session/full/${presessionId}`);
      } else {
        // Якщо немає пресесії, повертаємося на сторінку журналу
        navigate('/trade-journal');
      }
    } catch (error) {
      console.error('Error saving trade:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    // Використовуємо history.back() замість navigate
    window.history.back();
  };

  useEffect(() => {
    console.log('CreateTrade: presessionId changed:', presessionId);
    console.log('CreateTrade: selectedPresession:', selectedPresession);
  }, [presessionId, selectedPresession]);

  return (
    <CreateTradeContainer>
      <DatePickerStyles />
      <Header>
        <BackButton onClick={handleBack} />
        <Title>New Trade #{tradeCount}</Title>
        <Subtitle>Let's add a new trade!</Subtitle>
        <PreSessionLinkComponent 
          tradeId={tradeId} 
          presessionId={presessionId}
          selectedPresession={selectedPresession}
          onPresessionChange={(presession) => {
            console.log("PreSession changed:", presession);
            if (presession) {
              setTrade(prev => ({
                ...prev,
                presession_id: presession.id,
                pair: presession.pair || prev.pair
              }));
              setPresessionId(presession.id);
              setSelectedPresession(presession);
            }
          }}
        />
      </Header>
      <TradeContent>
        <TablesContainer>
          <TradeTable>
            <FormRow>
              <FormField>
                <FormLabel>Date</FormLabel>
                <StyledDatePicker
                  selected={trade.date ? new Date(trade.date) : new Date()}
                  onChange={(date) => handleChange({ target: { name: 'date', value: date.toISOString().split('T')[0] } })}
                  dateFormat="yyyy-MM-dd"
                  locale="en-gb"
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
              >
                {analysis.screenshots && analysis.screenshots.length > 0 ? (
                  <div className="screenshots-container">
                    {analysis.screenshots.map((screenshot, screenshotIndex) => (
                      <div key={screenshotIndex} className="screenshot-item">
                        <img
                          src={screenshot}
                          alt={`${analysis.title} ${screenshotIndex + 1}`}
                          onClick={() => openFullscreen(screenshot)}
                        />
                        <DeleteButton onClick={() => deleteScreenshot('topDownAnalysis', index, screenshotIndex)}>
                          ×
                        </DeleteButton>
                      </div>
                    ))}
                    <div className="add-more-photos">
                      <span>📈 Paste Screenshot (Ctrl+V)</span>
                    </div>
                  </div>
                ) : (
                  <span>📈 Paste Screenshot (Ctrl+V)</span>
                )}
              </ImageUploadArea>
              
              <input
                type="file"
                id={`tda-file-${index}`}
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleAddScreenshot('topDownAnalysis', index, e.target.files[0]);
                  }
                }}
              />
              
              <TextArea
                value={analysis.text}
                onChange={(e) => handleScreenshotChange('topDownAnalysis', index, 'text', e.target.value)}
                placeholder={`Enter ${analysis.title} analysis...`}
                ref={el => textAreaRefs.topDownAnalysis.current[index] = el}
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
              >
                {trade.execution.screenshots && trade.execution.screenshots.length > 0 ? (
                  <div className="screenshots-container">
                    {trade.execution.screenshots.map((screenshot, screenshotIndex) => (
                      <div key={screenshotIndex} className="screenshot-item">
                        <img
                          src={screenshot}
                          alt={`Execution Screenshot ${screenshotIndex + 1}`}
                          onClick={() => openFullscreen(screenshot)}
                        />
                        <DeleteButton onClick={() => deleteScreenshot('execution', 0, screenshotIndex)}>
                          ×
                        </DeleteButton>
                      </div>
                    ))}
                    <div className="add-more-photos">
                      <span>📈 Paste Screenshot (Ctrl+V)</span>
                    </div>
                  </div>
                ) : (
                  <span>📈 Paste Screenshot (Ctrl+V)</span>
                )}
              </ImageUploadArea>
              
              <input
                type="file"
                id="execution-file"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleAddScreenshot('execution', 0, e.target.files[0]);
                  }
                }}
              />
              
              <TextArea
                value={trade.execution.text}
                onChange={(e) => handleScreenshotChange('execution', 0, 'text', e.target.value)}
                placeholder="Enter execution analysis..."
                ref={textAreaRefs.execution}
              />
            </ScreenshotField>
          </div>
          <div style={{ flex: 1 }}>
            <SectionTitle>Management</SectionTitle>
            <ScreenshotField>
              <ImageUploadArea
                onPaste={(e) => handlePaste('management', 0, e)}
              >
                {trade.management.screenshots && trade.management.screenshots.length > 0 ? (
                  <div className="screenshots-container">
                    {trade.management.screenshots.map((screenshot, screenshotIndex) => (
                      <div key={screenshotIndex} className="screenshot-item">
                        <img
                          src={screenshot}
                          alt={`Management Screenshot ${screenshotIndex + 1}`}
                          onClick={() => openFullscreen(screenshot)}
                        />
                        <DeleteButton onClick={() => deleteScreenshot('management', 0, screenshotIndex)}>
                          ×
                        </DeleteButton>
                      </div>
                    ))}
                    <div className="add-more-photos">
                      <span>📈 Paste Screenshot (Ctrl+V)</span>
                    </div>
                  </div>
                ) : (
                  <span>📈 Paste Screenshot (Ctrl+V)</span>
                )}
              </ImageUploadArea>
              
              <input
                type="file"
                id="management-file"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleAddScreenshot('management', 0, e.target.files[0]);
                  }
                }}
              />
              
              <TextArea
                value={trade.management.text}
                onChange={(e) => handleScreenshotChange('management', 0, 'text', e.target.value)}
                placeholder="Enter management analysis..."
                ref={textAreaRefs.management}
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
                ref={textAreaRefs.conclusion}
              />
            </ScreenshotField>
          </div>
          <div style={{ flex: 1 }}>
            <NoteContainer>
              <NotesList 
                sourceType="trade" 
                sourceId={trade.id} 
                onAddNote={(e) => openNotePopup(null, e)}
              />
            </NoteContainer>
          </div>
        </Row>

        {showNotePopup && (
          <ModalOverlay onClick={closeNotePopup}>
            <NoteModal
              isOpen={showNotePopup}
              onClose={closeNotePopup}
              onSave={handleNoteSave}
              note={editNoteIndex !== null ? trade.notes[editNoteIndex] : null}
              sourceType="trade"
              sourceId={trade.id}
            />
          </ModalOverlay>
        )}

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

        <ButtonGroup>
          <ActionButton onClick={handleBack}>Cancel</ActionButton>
          <ActionButton onClick={handleSubmit} disabled={isSubmitting}>Save Trade</ActionButton>
        </ButtonGroup>
      </TradeContent>
    </CreateTradeContainer>
  );
}

export default CreateTrade;