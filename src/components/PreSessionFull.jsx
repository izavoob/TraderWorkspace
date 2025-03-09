// PreSessionFull.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import NotesList from './Notes/NotesList.jsx';
import NoteModal from './Notes/NoteModal.jsx';
import DeleteIcon from '../assets/icons/delete-icon.svg';
import EditIcon from '../assets/icons/edit-icon.svg';

// Перехоплюємо оригінальний JSON.parse
const originalJSONParse = JSON.parse;
JSON.parse = function(text) {
  if (text === undefined || text === null) {
    console.warn('Attempted to parse undefined or null JSON string');
    return {};
  }
  try {
    return originalJSONParse(text);
  } catch (e) {
    console.error('Error parsing JSON:', e, 'Text:', text);
    return {};
  }
};

// Animations
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

// Global Styles
const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    background-color: #1a1a1a;
    overflow-x: hidden;
    overflow-y: auto;
    font-family: 'Inter', sans-serif;
  }
  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #7425C9;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #5e2ca5;
  }
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

// Layout Components
const Container = styled.div`
  max-width: 1820px;
  margin: 0 auto;
  background-color: #1a1a1a;
  padding: 20px;
  position: relative;
  min-height: 100vh;
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
  height: 128px;
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
  border-radius: 0;
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  transition: all 0.3s ease;
  text-decoration: none;
  color: transparent;

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
  margin: 0 auto;
  font-size: 2.5em;
  color: #fff;
  text-align: center;
  z-index: 1;
`;

// Нова структура контенту
const Content = styled.div`
  margin-top: 148px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
`;

// Секція з двома колонками
const TwoColumnSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  margin-bottom: 40px;
  width: 100%;
`;

// Секція на всю ширину
const FullWidthSection = styled.div`
  margin-bottom: 40px;
  width: 100%;
`;

// Стилі для блоків
const SectionBlock = styled.div`
  background-color: #2e2e2e;
  border: 2px solid #5e2ca5;
  border-radius: 15px;
  padding: 30px;
  box-sizing: border-box;
  height: fit-content;
`;

const SectionTitle = styled.h3`
  color: rgb(230, 243, 255);
  margin: 0 0 20px 0;
  font-size: 1.5em;
  border-bottom: 2px solid rgba(94, 44, 165, 0.4);
  padding-bottom: 10px;
  position: relative;
  text-align: center;

  

  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 50px;
    height: 2px;
    background: linear-gradient(90deg, #B886EE, #7425C9);
  }
`;

// Стилі для форм
const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
  display: block;
`;

const Input = styled.input`
  padding: 12px;
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  color: #fff;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #B886EE;
    box-shadow: 0 0 0 2px rgba(184, 134, 238, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  color: #fff;
  width: 100%;
  min-height: 120px;
  box-sizing: border-box;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #B886EE;
    box-shadow: 0 0 0 2px rgba(184, 134, 238, 0.2);
  }
`;

const Select = styled.select`
  padding: 12px;
  background: ${props => {
    switch (props.value) {
      case 'Bullish':
        return '#1a472a';
      case 'Bearish':
        return '#5c1919';
      case 'Win':
        return '#1a472a';
      case 'Loss':
        return '#5c1919';
      case 'BE':
        return '#714a14';
      default:
        return '#3e3e3e';
    }
  }};
  color: ${props => {
    switch (props.value) {
      case 'Bullish':
        return '#4ade80';
      case 'Bearish':
        return '#f87171';
      case 'Win':
        return '#4ade80';
      case 'Loss':
        return '#f87171';
      case 'BE':
        return '#fbbf24';
      default:
        return '#fff';
    }
  }};
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #B886EE;
    box-shadow: 0 0 0 2px rgba(184, 134, 238, 0.2);
  }
  
  option {
    background: #3e3e3e;
    color: #fff;
    padding: 8px;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  padding: 12px;
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  color: #fff;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #B886EE;
    box-shadow: 0 0 0 2px rgba(184, 134, 238, 0.2);
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  appearance: none;
  border: 2px solid #5e2ca5;
  border-radius: 4px;
  background-color: #3e3e3e;
  transition: all 0.2s ease;
  position: relative;
  margin-top: 2px;

  &:checked {
    background: linear-gradient(135deg, #7425C9, #B886EE);
    border-color: transparent;

    &:after {
      content: '✓';
      position: absolute;
      color: white;
      font-size: 14px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &:hover {
    border-color: #B886EE;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #fff;
  font-size: 14px;
  margin-bottom: 10px;
  cursor: pointer;
`;

// Кнопки
const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 40px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: white;
  background: ${props => props.primary 
    ? 'linear-gradient(135deg, #7425C9, #B886EE)' 
    : 'linear-gradient(135deg, #5C9DF5, #7425C9)'};
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Компоненти для зони
const Quote = styled.div`
  background: #3e3e3e;
  padding: 15px 20px;
  border-radius: 8px;
  border: 1px solid #5e2ca5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  font-family: 'Georgia', serif;
  font-style: italic;
  letter-spacing: 0.3px;
  line-height: 1.5;
  margin-bottom: 10px;
  text-align: left;
  
  &:hover {
    border-color: #B886EE;
    transform: translateX(5px);
    background: #444444;
  }
`;

const AcceptButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background: ${props => props.accepted ? '#2ecc71' : '#3e3e3e'};
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.accepted ? '#27ae60' : '#5e2ca5'};
  
  &:hover {
    background: ${props => props.accepted ? '#27ae60' : '#4e4e4e'};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Компоненти для модальних вікон
const ImageModal = styled.div`
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
  
  img {
    max-width: 90%;
    max-height: 90vh;
    object-fit: contain;
    border: 2px solid #5e2ca5;
    border-radius: 8px;
  }
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(94, 44, 165, 0.7);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(94, 44, 165, 1);
    transform: scale(1.1);
  }
`;

// Компоненти для завантаження зображень
const DropZone = styled.div`
  border: 2px dashed ${props => props.isDragActive ? '#B886EE' : '#5e2ca5'};
  border-radius: 10px;
  padding: 40px 20px;
  text-align: center;
  color: #fff;
  background: ${props => props.isDragActive ? 'rgba(184, 134, 238, 0.1)' : '#3e3e3e'};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  
  &:hover {
    border-color: #B886EE;
    background: rgba(184, 134, 238, 0.05);
  }
`;

const ImagePreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 20px;
  
  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #5e2ca5;
  }
`;

const ImageUploadForm = styled.form`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #2e2e2e;
  padding: 30px;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
  width: 90%;
  max-width: 600px;
  z-index: 1002;
  max-height: 80vh;
  overflow-y: auto;
`;

// Компоненти для процесів
const ProcessList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

const ProcessItem = styled.div`
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 10px;
  padding: 20px;
  position: relative;
`;

const ProcessTextArea = styled.textarea`
  width: 98%;
  min-height: 100px;
  padding-top: 12px;
  padding-left: 12px;
  background: #2e2e2e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  color: #fff;
  resize: vertical;
  margin-bottom: 10px;
  
  &:focus {
    outline: none;
    border-color: #B886EE;
  }
`;

const ProcessImageContainer = styled.div`
  margin-top: 10px;
  
  img {
    max-width: 100%;
    border-radius: 8px;
    border: 1px solid #5e2ca5;
    cursor: pointer;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.02);
    }
  }
`;

const ProcessTime = styled.div`
  color: #B886EE;
  font-size: 0.9em;
  margin-bottom: 10px;
`;

const ProcessImageUpload = styled.div`
  position: relative;
  height: 520px;
  border: 2px dashed #5e2ca5;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 10px;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 6px;
    cursor: pointer;
  }

  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    color: #B886EE;
    opacity: ${props => props.hasImage ? 0 : 1};
  }

  &:hover {
    border-color: #B886EE;
    background: rgba(94, 44, 165, 0.1);
  }
  
  &:hover .remove-image {
    opacity: 1;
  }
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #7425C9, #B886EE);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:before {
    content: '+';
    font-size: 18px;
  }
`;

const DeleteProcessButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(244, 67, 54, 0.7);
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(244, 67, 54, 1);
    transform: scale(1.1);
  }
  
  &:before {
    content: '×';
    font-size: 20px;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.5em;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

// Компонент для відео URL з кнопкою перегляду
const VideoUrlContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const VideoUrlInputGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ViewButton = styled.button`
  background: linear-gradient(135deg, #5C9DF5, #7425C9);
  color: white;
  border: none;
  padding: 0 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

// Компоненти для таймфреймів
const TimeframeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
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

const ChartDropZone = styled.div`
  position: relative;
  height: 300px;
  border: 2px dashed #5e2ca5;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 6px;
    cursor: pointer;
  }

  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    color: #B886EE;
    opacity: ${props => props.hasImage ? 0 : 1};
  }

  &:hover {
    border-color: #B886EE;
    background: rgba(94, 44, 165, 0.1);
  }
  
  &:hover .remove-image {
    opacity: 1;
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 71, 87, 0.8);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 2;
  
  &:hover {
    background: rgba(255, 71, 87, 1);
  }
`;

// Компонент для таймфрейму
const TimeframeBlock = ({ timeframe, data, onNotesChange, onImagePaste, onImageRemove, onImageClick }) => {
  const [currentImage, setCurrentImage] = useState(data.charts[0] || null);

  const handlePaste = (e) => {
    e.preventDefault();
    onImagePaste(e, timeframe);
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onImageRemove(timeframe, 0);
  };

  useEffect(() => {
    setCurrentImage(data.charts[0] || null);
  }, [data.charts]);

  return (
    <div className="timeframe-block">
      <TimeframeHeader>
        <TimeframeIcon>{timeframe[0].toUpperCase()}</TimeframeIcon>
        <h4>{timeframe.toUpperCase()}</h4>
      </TimeframeHeader>
      
      <ChartDropZone 
        onPaste={handlePaste}
        tabIndex="0"
        role="button"
        hasImage={!!currentImage}
        aria-label={`Paste ${timeframe.toUpperCase()} Chart`}
        onClick={() => currentImage && onImageClick(currentImage)}
        style={{ cursor: currentImage ? 'pointer' : 'default' }}
      >
        {currentImage ? (
          <>
            <img 
              src={currentImage} 
              alt={`${timeframe} Chart`}
              onClick={(e) => {
                e.stopPropagation();
                onImageClick(currentImage);
              }}
            />
            <RemoveImageButton
              className="remove-image"
              onClick={handleRemove}
            >
              ×
            </RemoveImageButton>
          </>
        ) : (
          <div className="placeholder">
            <span>📈 Paste {timeframe.toUpperCase()} Chart</span>
            <span style={{ fontSize: '12px' }}>Press Ctrl + V to paste screenshot</span>
          </div>
        )}
      </ChartDropZone>

      <TextArea
        placeholder={`Enter ${timeframe.toUpperCase()} analysis notes...`}
        value={data.notes}
        onChange={(e) => onNotesChange(timeframe, e.target.value)}
      />
    </div>
  );
};

// Компоненти для планів
const PlanTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #2e2e2e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  position: relative;
  max-width: 800px;
  margin: 0 auto 20px;
`;

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid #5e2ca5;
  }
`;

const TableHeaderCell = styled.th`
  padding: 12px;
  background: linear-gradient(135deg, #7425C9, #B886EE);
  color: white;
  text-align: left;
  font-weight: bold;
`;

const TableCell = styled.td`
  padding: 12px;
  border-right: ${props => props.isAspect ? '1px solid #5e2ca5' : 'none'};
  color: white;
  background: ${props => props.isAspect ? '#3e3e3e' : 'transparent'};
  width: ${props => props.isAspect ? '120px' : 'auto'};
`;

const PlanInput = styled.textarea`
  width: 100%;
  min-height: 40px;
  background: #3e3e3e;
  border: 1px solid transparent;
  border-radius: 4px;
  color: white;
  padding: 8px;
  resize: vertical;
  font-family: 'Inter', sans-serif;
  
  &:focus {
    outline: none;
    border-color: #B886EE;
  }
`;

const PlansContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

// Компонент для відображення нотаток
const NotesBlock = ({ sessionId }) => {
  const [notes, setNotes] = useState([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  
  useEffect(() => {
    loadNotes();
  }, [sessionId]);
  
  const loadNotes = async () => {
    try {
      console.log('Завантаження нотаток для сесії:', sessionId);
      if (!sessionId) return;
      
      const notesData = await window.electronAPI.getNotesBySource('presession', sessionId);
      console.log('Отримані нотатки:', notesData);
      setNotes(notesData);
    } catch (error) {
      console.error('Помилка завантаження нотаток:', error);
    }
  };
  
  const handleAddNote = () => {
    console.log('Додавання нової нотатки');
    setSelectedNote(null);
    setShowNoteModal(true);
  };
  
  const handleEditNote = (note) => {
    console.log('Редагування нотатки:', note);
    setSelectedNote(note);
    setShowNoteModal(true);
  };
  
  const handleDeleteNote = async (noteId, e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm('Ви впевнені, що хочете видалити цю нотатку?')) {
      try {
        console.log('Видалення нотатки:', noteId);
        await window.electronAPI.deleteNote(noteId);
        await loadNotes();
      } catch (error) {
        console.error('Помилка видалення нотатки:', error);
      }
    }
  };
  
  const handleSaveNote = async (noteData) => {
    try {
      console.log('Збереження нотатки:', noteData);
      
      // Додаємо інформацію про джерело
      const noteWithSource = {
        ...noteData,
        sourceType: 'presession',
        sourceId: sessionId
      };
      
      if (noteData.id) {
        // Оновлюємо існуючу нотатку
        console.log('Оновлюємо існуючу нотатку:', noteWithSource);
        await window.electronAPI.updateNote(noteWithSource);
        
        // Зберігаємо нові зображення
        if (noteData.images && noteData.images.length > 0) {
          for (const image of noteData.images) {
            if (!image.id) {
              console.log('Додаємо нове зображення до існуючої нотатки:', image);
              await window.electronAPI.addNoteImage(noteData.id, image.image_path);
            }
          }
        }
      } else {
        // Створюємо нову нотатку
        console.log('Створюємо нову нотатку:', noteWithSource);
        const newNoteId = await window.electronAPI.saveNote(noteWithSource);
        
        // Зберігаємо зображення для нової нотатки
        if (noteData.images && noteData.images.length > 0) {
          for (const image of noteData.images) {
            if (!image.id) {
              console.log('Додаємо зображення до нової нотатки:', image);
              await window.electronAPI.addNoteImage(newNoteId, image.image_path);
            }
          }
        }
      }
      
      // Оновлюємо список нотаток
      await loadNotes();
      
      // Закриваємо модальне вікно
      setShowNoteModal(false);
      setSelectedNote(null);
      
      console.log('Нотатка успішно збережена');
    } catch (error) {
      console.error('Помилка збереження нотатки:', error);
    }
  };
  
  const handleCloseModal = () => {
    setShowNoteModal(false);
    setSelectedNote(null);
  };
  
  return (
    <SectionBlock>
      <SectionTitle>Notes</SectionTitle>
      <div style={{ marginBottom: '20px' }}>
        <Button onClick={handleAddNote} primary>Add Note</Button>
      </div>
      
      {notes.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {notes.map(note => (
            <div 
              key={note.id}
              style={{
                background: 'rgba(116, 37, 201, 0.1)',
                border: '2px solid #5e2ca5',
                borderRadius: '15px',
                padding: '15px',
                position: 'relative'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '10px',
                borderBottom: '1px solid rgba(94, 44, 165, 0.3)',
                paddingBottom: '10px'
              }}>
                <h3 style={{ margin: 0, color: '#fff' }}>{note.title}</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {note.tag_name && (
                    <span style={{
                      backgroundColor: '#7425C9',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8em'
                    }}>
                      {note.tag_name}
                    </span>
                  )}
                  <button 
                    onClick={() => handleEditNote(note)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#B886EE',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.9em'
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => handleDeleteNote(note.id, e)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#e53935',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.9em'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div style={{ color: '#fff', whiteSpace: 'pre-wrap' }}>
                {note.content}
              </div>
              
              {/* Відображення зображень */}
              {note.images && note.images.length > 0 && (
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '10px',
                  marginTop: '15px' 
                }}>
                  {note.images.map((image, index) => (
                    <div 
                      key={index}
                      style={{
                        width: '100px',
                        height: '100px',
                        position: 'relative'
                      }}
                    >
                      <img 
                        src={image.image_path} 
                        alt={`Note image ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #5e2ca5'
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px', 
          color: '#fff',
          background: 'rgba(116, 37, 201, 0.1)',
          borderRadius: '8px'
        }}>
          No notes yet. Click "Add Note" to create one.
        </div>
      )}
      
      {showNoteModal && (
        <NoteModal
          isOpen={showNoteModal}
          onClose={handleCloseModal}
          onSave={handleSaveNote}
          note={selectedNote}
          sourceType="presession"
          sourceId={sessionId}
        />
      )}
    </SectionBlock>
  );
};

function PreSessionFull() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [showImageForm, setShowImageForm] = useState(false);
  const [currentUploadSection, setCurrentUploadSection] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [currencyPairs, setCurrencyPairs] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [notes, setNotes] = useState([]); // Додаємо стан для нотаток
  const [showNoteModal, setShowNoteModal] = useState(false); // Додаємо стан для модального вікна нотаток
  const [noteSourceType, setNoteSourceType] = useState('presession'); // Додаємо стан для типу джерела нотатки
  const [noteSourceId, setNoteSourceId] = useState(null); // Додаємо стан для ID джерела нотатки
  const [selectedNote, setSelectedNote] = useState(null); // Додаємо стан для вибраної нотатки
  
  // Безпечний парсинг JSON
  const safeParse = (jsonString, defaultValue) => {
    if (!jsonString) return defaultValue;
    if (typeof jsonString === 'object') return jsonString;
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return defaultValue;
    }
  };
  
  // Стан для даних пресесії
  const [sessionData, setSessionData] = useState({
    id: id || crypto.randomUUID(),
    date: new Date().toISOString().split('T')[0],
    pair: '',
    narrative: '',
    execution: '',
    outcome: '',
    plan_outcome: false,
    mindset_preparation: {
      anythingCanHappen: false,
      futureKnowledge: false,
      randomDistribution: false,
      edgeDefinition: false,
      uniqueMoments: false
    },
    the_zone: [
      { id: 1, text: "I objectively identify my edges", accepted: false },
      { id: 2, text: "I act on my edges without reservation or hesitation", accepted: false },
      { id: 3, text: "I completely accept the risk or I am willing to let go of the trade", accepted: false },
      { id: 4, text: "I continually monitor my susceptibility for making errors", accepted: false },
      { id: 5, text: "I pay myself as the market makes money available to me", accepted: false },
      { id: 6, text: "I predefine the risk of every trade", accepted: false },
      { id: 7, text: "I understand the absolute necessity of these principles of consistent success and, therefore, never violate them", accepted: false }
    ],
    video_url: '',
    topDownAnalysis: [],
    forex_factory_news: [],
    plans: {
      narrative: { text: '' },
      execution: { text: '' },
      outcome: { text: '' }
    },
    chart_processes: []
  });

  // Стан для аналізу таймфреймів
  const [analysisData, setAnalysisData] = useState({
    timeframes: {
      weekly: { charts: [], notes: '' },
      daily: { charts: [], notes: '' },
      h4: { charts: [], notes: '' },
      h1: { charts: [], notes: '' }
    }
  });

  // Стан для планів
  const [plans, setPlans] = useState({
    planA: {
      bias: '',
      background: '',
      what: '',
      entry: '',
      target: '',
      invalidation: ''
    },
    planB: {
      bias: '',
      background: '',
      what: '',
      entry: '',
      target: '',
      invalidation: ''
    }
  });

  // Стан для адаптацій планів
  const [adaptations, setAdaptations] = useState([]);

  // Завантаження даних при ініціалізації
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Завантаження списку валютних пар
        const pairs = await window.electronAPI.getAllExecutionItems('pairs');
        setCurrencyPairs(pairs);

        // Якщо є id, завантажуємо дані пресесії
        if (id) {
          console.log('Loading presession with ID:', id);
          const presession = await window.electronAPI.getPresession(id);
          console.log('Loaded presession data:', presession);
          
          if (presession) {
            // Парсимо дані планів
            let plansData = safeParse(presession.plans, { planA: {}, planB: {} });
            let adaptationsData = plansData.adaptations || [];
            
            // Парсимо дані аналізу таймфреймів
            let timeframesData = {
              weekly: { charts: [], notes: '' },
              daily: { charts: [], notes: '' },
              h4: { charts: [], notes: '' },
              h1: { charts: [], notes: '' }
            };
            
            const parsedAnalysis = safeParse(presession.topDownAnalysis, []);
            if (Array.isArray(parsedAnalysis)) {
              parsedAnalysis.forEach(item => {
                if (timeframesData[item.timeframe]) {
                  timeframesData[item.timeframe] = {
                    charts: item.charts || [],
                    notes: item.notes || ''
                  };
                }
              });
            }
            
            // Оновлюємо стан
            setSessionData({
              ...presession,
              mindset_preparation: safeParse(presession.mindset_preparation, {
                anythingCanHappen: false,
                futureKnowledge: false,
                randomDistribution: false,
                edgeDefinition: false,
                uniqueMoments: false
              }),
              the_zone: safeParse(presession.the_zone, [
                { id: 1, text: "I objectively identify my edges", accepted: false },
                { id: 2, text: "I act on my edges without reservation or hesitation", accepted: false },
                { id: 3, text: "I completely accept the risk or I am willing to let go of the trade", accepted: false },
                { id: 4, text: "I continually monitor my susceptibility for making errors", accepted: false },
                { id: 5, text: "I pay myself as the market makes money available to me", accepted: false },
                { id: 6, text: "I predefine the risk of every trade", accepted: false },
                { id: 7, text: "I understand the absolute necessity of these principles of consistent success and, therefore, never violate them", accepted: false }
              ]),
              forex_factory_news: safeParse(presession.forex_factory_news, []),
              topDownAnalysis: safeParse(presession.topDownAnalysis, []),
              plans: safeParse(presession.plans, {
                narrative: { text: '' },
                execution: { text: '' },
                outcome: { text: '' }
              }),
              chart_processes: safeParse(presession.chart_processes, [])
            });
            
            setPlans(plansData);
            setAdaptations(adaptationsData);
            setAnalysisData({ timeframes: timeframesData });

            // Load notes
            console.log('Loading notes for presession ID:', id);
            const presessionNotes = await window.electronAPI.getNotesBySource('presession', id);
            console.log('Loaded notes:', presessionNotes);
            setNotes(presessionNotes || []);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleForexFactoryNewsChange = (index, field, value) => {
    const updatedForexFactoryNews = [...sessionData.forex_factory_news];
    updatedForexFactoryNews[index] = {
      ...updatedForexFactoryNews[index],
      [field]: value
    };
    setSessionData(prev => ({
      ...prev,
      forex_factory_news: updatedForexFactoryNews
    }));
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this pre-session?')) {
      try {
        await window.electronAPI.deletePresession(id);
        navigate('/pre-session-journal');
      } catch (error) {
        console.error('Error deleting pre-session:', error);
      }
    }
  };

  // Функція для обробки зміни полів вводу
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    const newSessionData = {
      ...sessionData,
      [name]: newValue
    };
    
    if (name === 'narrative' || name === 'outcome') {
      const shouldCheck = 
        newSessionData.narrative && 
        newSessionData.outcome && 
        newSessionData.narrative !== 'Neutral' && 
        newSessionData.narrative !== 'Day off' && 
        newSessionData.narrative === newSessionData.outcome;

      newSessionData.plan_outcome = shouldCheck;
    }
    
    setSessionData(newSessionData);
  };

  // Функція для обробки чекбоксів у розділі Mindset Preparation
  const handleMindsetChange = (key) => {
    const mindsetData = safeParse(sessionData.mindset_preparation, {
      anythingCanHappen: false,
      futureKnowledge: false,
      randomDistribution: false,
      edgeDefinition: false,
      uniqueMoments: false
    });
    
    mindsetData[key] = !mindsetData[key];
    
    setSessionData(prev => ({
      ...prev,
      mindset_preparation: mindsetData
    }));
  };

  // Функція для обробки прийняття цитат у розділі The Zone
  const handleAcceptQuote = (id) => {
    const zoneData = safeParse(sessionData.the_zone, [
      { id: 1, text: "I objectively identify my edges", accepted: false },
      { id: 2, text: "I act on my edges without reservation or hesitation", accepted: false },
      { id: 3, text: "I completely accept the risk or I am willing to let go of the trade", accepted: false },
      { id: 4, text: "I continually monitor my susceptibility for making errors", accepted: false },
      { id: 5, text: "I pay myself as the market makes money available to me", accepted: false },
      { id: 6, text: "I predefine the risk of every trade", accepted: false },
      { id: 7, text: "I understand the absolute necessity of these principles of consistent success and, therefore, never violate them", accepted: false }
    ]);
    
    const updatedZone = zoneData.map(quote => 
      quote.id === id ? { ...quote, accepted: !quote.accepted } : quote
    );
    
    setSessionData(prev => ({
      ...prev,
      the_zone: updatedZone
    }));
  };

  // Функція для обробки зміни планів
  const handlePlanChange = (planType, value) => {
    const plansData = safeParse(sessionData.plans, { planA: {}, planB: {} });
    plansData[planType].text = value;
    
    setSessionData(prev => ({
      ...prev,
      plans: plansData
    }));
  };

  // Функція для додавання нового процесу
  const handleAddChartProcess = () => {
    const processes = safeParse(sessionData.chart_processes, []);
    const now = new Date();
    processes.push({
      id: crypto.randomUUID(),
      text: '',
      image: null,
      timestamp: now.toISOString(),
      time: now.toLocaleTimeString()
    });
    
    setSessionData(prev => ({
      ...prev,
      chart_processes: processes
    }));
  };

  // Функція для зміни тексту процесу
  const handleChartProcessChange = (id, text) => {
    const processes = safeParse(sessionData.chart_processes, []);
    const updatedProcesses = processes.map(process => 
      process.id === id ? { ...process, text } : process
    );
    
    setSessionData(prev => ({
      ...prev,
      chart_processes: updatedProcesses
    }));
  };

  // Функція для видалення процесу
  const handleDeleteProcess = (processId) => {
    const processes = safeParse(sessionData.chart_processes, []);
    const updatedProcesses = processes.filter(process => process.id !== processId);
    
    setSessionData(prev => ({
      ...prev,
      chart_processes: updatedProcesses
    }));
  };

  // Функція для завантаження зображення процесу
  const handleProcessImageUpload = (processId) => {
    setCurrentUploadSection({ section: 'process', processId });
    setShowImageForm(true);
  };

  // Функція для видалення зображення процесу
  const handleDeleteProcessImage = (processId) => {
    const processes = safeParse(sessionData.chart_processes, []);
    const updatedProcesses = processes.map(process => 
      process.id === processId ? { ...process, image: null } : process
    );
    
    setSessionData(prev => ({
      ...prev,
      chart_processes: updatedProcesses
    }));
  };

  // Функції для роботи з формою завантаження зображень
  const handleImageFormOpen = (section, type) => {
    setCurrentUploadSection({ section, type });
    setShowImageForm(true);
    setSelectedFiles([]);
  };

  const handleImageFormClose = () => {
    setShowImageForm(false);
    setCurrentUploadSection(null);
    setSelectedFiles([]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = [...e.dataTransfer.files];
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const imagePromises = imageFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    const images = await Promise.all(imagePromises);
    setSelectedFiles(prev => [...prev, ...images]);
  };

  const handleFileSelect = (e) => {
    const files = [...e.target.files];
    handleFiles(files);
  };

  const handleImageUploadSubmit = (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      alert('Please select a file first');
      return;
    }
    
    if (currentUploadSection.section === 'timeframe') {
      const { timeframe } = currentUploadSection;
      setAnalysisData(prev => ({
        ...prev,
        timeframes: {
          ...prev.timeframes,
          [timeframe]: {
            ...prev.timeframes[timeframe],
            charts: [...prev.timeframes[timeframe].charts, selectedFiles[0]]
          }
        }
      }));
    } else if (currentUploadSection.section === 'process') {
      const { processId } = currentUploadSection;
      setSessionData(prev => ({
        ...prev,
        chart_processes: prev.chart_processes.map(process => 
          process.id === processId 
            ? { ...process, image: selectedFiles[0] } 
            : process
        )
      }));
    } else if (currentUploadSection.section === 'news') {
      setSessionData(prev => ({
        ...prev,
        forex_factory_news: selectedFiles[0]
      }));
    }
    
    setShowImageForm(false);
    setCurrentUploadSection(null);
    setSelectedFiles([]);
  };

  // Функції для роботи з нотатками
  const handleAddNote = () => {
    const scrollOffset = window.pageYOffset || document.documentElement.scrollTop;
    setScrollOffset(scrollOffset);
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollOffset}px`;
    document.body.style.width = '100%';
    setNoteSourceId(sessionData.id);
    setSelectedNote(null);
    setShowNoteModal(true);
  };

  const handleSaveNote = async (note) => {
    console.log('Збереження нотатки у PreSessionFull:', note);
    
    // Підготовка нотатки для збереження
    const noteData = {
      title: note.title,
      content: note.content,
      tagId: note.tagId,
      sourceType: 'presession',
      sourceId: sessionData.id,
      images: note.images || [] // Додаємо зображення
    };
    
    try {
      // Зберігаємо нотатку безпосередньо в базу даних
      let savedNote;
      
      if (note.id) {
        // Оновлюємо існуючу нотатку
        console.log('Оновлюємо існуючу нотатку:', noteData);
        await window.electronAPI.updateNote({
          ...noteData,
          id: note.id
        });
        savedNote = { ...note };
      } else {
        // Створюємо нову нотатку
        console.log('Створюємо нову нотатку:', noteData);
        const newNoteId = await window.electronAPI.saveNote(noteData);
        savedNote = { 
          ...noteData,
          id: newNoteId,
          tag_name: note.tagName,
          source_type: 'presession',
          source_id: sessionData.id,
          created_at: new Date().toISOString()
        };
        
        // Додаємо нотатку до відображення
        setNotes(prev => [...prev, savedNote]);
      }
      
      console.log('Нотатка успішно збережена:', savedNote);
    } catch (error) {
      console.error('Помилка збереження нотатки:', error);
    }
    
    setShowNoteModal(false);
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollOffset);
  };

  const handleCloseNoteModal = () => {
    setShowNoteModal(false);
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollOffset);
  };

  // Функція для відкриття зображення у повноекранному режимі
  const handleImageClick = (image) => {
    const scrollOffset = window.pageYOffset || document.documentElement.scrollTop;
    setSelectedImage(image);
    setScrollOffset(scrollOffset);
    document.body.style.overflow = 'hidden';
  };

  // Функція для закриття повноекранного зображення
  const handleCloseImage = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  // Функція для відкриття відео у новому вікні
  const handleViewVideo = () => {
    setShowVideoModal(true);
  };

  // Функція для повернення на сторінку журналу
  const handleBack = () => {
    navigate('/daily-routine/pre-session');
  };

  // Функція для збереження пресесії
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Підготовка даних для збереження
      const presessionData = {
        id: sessionData.id,
        date: sessionData.date,
        pair: sessionData.pair,
        narrative: sessionData.narrative,
        execution: sessionData.execution,
        outcome: sessionData.outcome,
        plan_outcome: sessionData.plan_outcome,
        forex_factory_news: sessionData.forex_factory_news,
        topDownAnalysis: Object.entries(analysisData.timeframes).map(([timeframe, data]) => ({
          timeframe,
          notes: data.notes,
          charts: data.charts
        })),
        video_url: sessionData.video_url,
        plans: {
          ...plans,
          adaptations
        },
        chart_processes: sessionData.chart_processes,
        mindset_preparation: sessionData.mindset_preparation,
        the_zone: sessionData.the_zone
      };
      
      console.log('Saving presession data:', presessionData);
      
      // Зберігаємо пресесію
      const result = await window.electronAPI.savePresession(presessionData);
      console.log('Save presession result:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save presession');
      }

      // Зберігаємо нотатки відразу після збереження пресесії
      console.log('Saving notes:', notes);
      for (const note of notes) {
        try {
          if (!note.id || typeof note.id === 'number') { // Якщо це нова нотатка або тимчасовий ID
            console.log('Saving new note:', note);
            const savedNoteId = await window.electronAPI.saveNote({
              title: note.title,
              content: note.content,
              tagId: note.tag_id,
              sourceType: 'presession',
              sourceId: presessionData.id
            });
            note.id = savedNoteId; // Оновлюємо ID нотатки
          }
        } catch (noteError) {
          console.error('Error saving note:', noteError);
          // Продовжуємо зберігати інші нотатки навіть якщо одна не збереглася
        }
      }
      
      console.log('All notes saved successfully');
      navigate('/daily-routine/pre-session');
    } catch (error) {
      console.error('Error saving presession or notes:', error);
      alert('Failed to save presession or notes');
    } finally {
      setIsLoading(false);
    }
  };

  // Функція для обробки зміни нотаток таймфрейму
  const handleNotesChange = (timeframe, value) => {
    setAnalysisData(prev => ({
      ...prev,
      timeframes: {
        ...prev.timeframes,
        [timeframe]: {
          ...prev.timeframes[timeframe],
          notes: value
        }
      }
    }));
  };

  // Функція для обробки вставки зображення з буфера обміну
  const handlePasteImage = (e, type, processId = null) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        const reader = new FileReader();
        
        reader.onload = () => {
          const imageData = reader.result;
          
          if (processId) {
            // Для Chart Process
            const processes = safeParse(sessionData.chart_processes, []);
            const updatedProcesses = processes.map(process => 
              process.id === processId ? { ...process, image: imageData } : process
            );
            
            setSessionData(prev => ({
              ...prev,
              chart_processes: updatedProcesses
            }));
          } else if (type === 'news') {
            // Для News Screenshots
            setSessionData(prev => ({
              ...prev,
              forex_factory_news: [imageData]
            }));
          } else {
            // Для таймфреймів
            setAnalysisData(prev => ({
              ...prev,
              timeframes: {
                ...prev.timeframes,
                [type]: {
                  ...prev.timeframes[type],
                  charts: [...prev.timeframes[type].charts, imageData]
                }
              }
            }));
          }
        };
        
        reader.readAsDataURL(blob);
        break;
      }
    }
  };

  // Функція для видалення зображення таймфрейму
  const handleRemoveImage = (timeframe, index) => {
    setAnalysisData(prev => ({
      ...prev,
      timeframes: {
        ...prev.timeframes,
        [timeframe]: {
          ...prev.timeframes[timeframe],
          charts: []
        }
      }
    }));
  };

  // Функція для обробки зміни планів
  const handlePlanTableChange = (planType, aspect, value) => {
    if (planType.startsWith('adaptation')) {
      const adaptationIndex = parseInt(planType.replace('adaptation', ''));
      setAdaptations(prev => {
        const newAdaptations = [...prev];
        if (!newAdaptations[adaptationIndex]) {
          newAdaptations[adaptationIndex] = {};
        }
        newAdaptations[adaptationIndex] = {
          ...newAdaptations[adaptationIndex],
          [aspect]: value
        };
        return newAdaptations;
      });
    } else {
      setPlans(prev => ({
        ...prev,
        [planType]: {
          ...prev[planType],
          [aspect]: value
        }
      }));
    }
  };

  // Функція для додавання адаптації плану
  const handleAddAdaptation = () => {
    setAdaptations(prev => [...prev, {
      bias: '',
      background: '',
      what: '',
      entry: '',
      target: '',
      invalidation: ''
    }]);
  };

  // Функція для видалення адаптації плану
  const handleRemoveAdaptation = (indexToRemove) => {
    setAdaptations(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <>
      <GlobalStyle />
      <DatePickerStyles />
      <Container>
        <Header>
          <BackButton onClick={handleBack}>← Back</BackButton>
          <Title>Pre-Session Details</Title>
        </Header>
        <Content>
          <form onSubmit={handleSubmit}>
            {/* Перша секція: Basic Information та Mindset Preparation */}
            <TwoColumnSection>
              {/* Basic Information */}
              <SectionBlock>
                <SectionTitle>Basic Information</SectionTitle>
                <FormGroup>
                  <Label>Date</Label>
                  <StyledDatePicker
                    selected={new Date(sessionData.date)}
                    onChange={(date) => handleInputChange({ target: { name: 'date', value: date.toISOString().split('T')[0] } })}
                    dateFormat="yyyy-MM-dd"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Currency Pair</Label>
                  <Select
                    name="pair"
                    value={sessionData.pair}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Pair</option>
                    {currencyPairs.map(pair => (
                      <option key={pair.id} value={pair.name}>{pair.name}</option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Narrative</Label>
                  <Select
                    name="narrative"
                    value={sessionData.narrative}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="Bullish">Bullish</option>
                    <option value="Bearish">Bearish</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Day off">Day off</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Execution</Label>
                  <Select
                    name="execution"
                    value={sessionData.execution}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="Day off">Day off</option>
                    <option value="No Trades">No Trades</option>
                    <option value="Skipped">Skipped</option>
                    <option value="Missed">Missed</option>
                    <option value="BE">BE</option>
                    <option value="Loss">Loss</option>
                    <option value="Win">Win</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Outcome</Label>
                  <Select
                    name="outcome"
                    value={sessionData.outcome}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="Bullish">Bullish</option>
                    <option value="Bearish">Bearish</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Day off">Day off</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <CheckboxLabel style={{ 
                    background: '#3e3e3e',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    border: '1px solid #5e2ca5',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}>
                    <Checkbox
                      type="checkbox"
                      name="plan_outcome"
                      checked={sessionData.plan_outcome}
                      onChange={handleInputChange}
                      disabled={true}
                    />
                    <div>
                      Plan&Outcome
                      {sessionData.plan_outcome && (
                        <span style={{ 
                          marginLeft: '10px', 
                          fontSize: '12px', 
                          color: '#2ecc71' 
                        }}>
                          
                        </span>
                      )}
                    </div>
                  </CheckboxLabel>
                </FormGroup>
              </SectionBlock>

              {/* PRE-SESSION Mindset Preparation */}
              <SectionBlock>
                <SectionTitle>PRE-SESSION Mindset Preparation</SectionTitle>
                <FormGroup style={{ textAlign: 'left' }}>
                  {sessionData.mindset_preparation.anythingCanHappen !== undefined && (
                    <CheckboxLabel>
                      <Checkbox
                        type="checkbox"
                        checked={sessionData.mindset_preparation.anythingCanHappen}
                        onChange={() => handleMindsetChange('anythingCanHappen')}
                      />
                      Anything can happen in the markets
                    </CheckboxLabel>
                  )}
                  
                  {sessionData.mindset_preparation.futureKnowledge !== undefined && (
                    <CheckboxLabel>
                      <Checkbox
                        type="checkbox"
                        checked={sessionData.mindset_preparation.futureKnowledge}
                        onChange={() => handleMindsetChange('futureKnowledge')}
                      />
                      You don't need to know what will happen next to make money
                    </CheckboxLabel>
                  )}
                  
                  {sessionData.mindset_preparation.randomDistribution !== undefined && (
                    <CheckboxLabel>
                      <Checkbox
                        type="checkbox"
                        checked={sessionData.mindset_preparation.randomDistribution}
                        onChange={() => handleMindsetChange('randomDistribution')}
                      />
                      There is a random distribution between wins and losses for any given set of variables
                    </CheckboxLabel>
                  )}
                  
                  {sessionData.mindset_preparation.edgeDefinition !== undefined && (
                    <CheckboxLabel>
                      <Checkbox
                        type="checkbox"
                        checked={sessionData.mindset_preparation.edgeDefinition}
                        onChange={() => handleMindsetChange('edgeDefinition')}
                      />
                      An edge is nothing more than an indication of a higher probability of one thing happening over another
                    </CheckboxLabel>
                  )}
                  
                  {sessionData.mindset_preparation.uniqueMoments !== undefined && (
                    <CheckboxLabel>
                      <Checkbox
                        type="checkbox"
                        checked={sessionData.mindset_preparation.uniqueMoments}
                        onChange={() => handleMindsetChange('uniqueMoments')}
                      />
                      Every moment in the market is unique
                    </CheckboxLabel>
                  )}
                </FormGroup>
              </SectionBlock>
            </TwoColumnSection>

            {/* Друга секція: The Zone та Video Analysis URL + Notes & Mistakes */}
            <TwoColumnSection>
              {/* The Zone */}
              <SectionBlock>
                <SectionTitle>The Zone</SectionTitle>
                <FormGroup>
                  {sessionData.the_zone.map(quote => (
                    <Quote key={quote.id}>
                      <div>{quote.text}</div>
                      <AcceptButton 
                        accepted={quote.accepted}
                        onClick={() => handleAcceptQuote(quote.id)}
                        type="button"
                      >
                        {quote.accepted ? 'Accepted' : 'Accept'}
                      </AcceptButton>
                    </Quote>
                  ))}
                </FormGroup>
              </SectionBlock>

              <div>
                {/* Video Analysis URL */}
                <SectionBlock>
                  <SectionTitle>Video Analysis URL</SectionTitle>
                  <VideoUrlContainer>
                    <VideoUrlInputGroup>
                      <Input
                        type="text"
                        name="video_url"
                        value={sessionData.video_url}
                        onChange={handleInputChange}
                        placeholder="Enter YouTube or other video URL"
                      />
                      <ViewButton 
                        type="button" 
                        onClick={handleViewVideo}
                        disabled={!sessionData.video_url}
                      >
                        View
                      </ViewButton>
                    </VideoUrlInputGroup>
                  </VideoUrlContainer>
                </SectionBlock>

                {/* Notes & Mistakes */}
                <SectionBlock style={{ marginTop: '40px' }}>
                  <SectionTitle>Notes & Mistakes</SectionTitle>
                  <NotesList 
                    sourceType="presession" 
                    sourceId={sessionData.id} 
                    onAddNote={handleAddNote}
                    notes={notes}
                  />
                </SectionBlock>
              </div>
            </TwoColumnSection>

            {/* Третя секція: PRE-SESSION Analysis */}
            <FullWidthSection>
              <SectionBlock>
                <SectionTitle>PRE-SESSION Analysis</SectionTitle>
                
                {/* Forex Factory News */}
                <FormGroup>
                  <Label>Forex Factory News</Label>
                  <div style={{ position: 'relative', marginBottom: '20px' }}>
                    {sessionData.forex_factory_news.length > 0 ? (
                      <div style={{ position: 'relative' }}>
                        <img 
                          src={sessionData.forex_factory_news[0]} 
                          alt="Forex Factory News" 
                          style={{ 
                            width: '100%', 
                            borderRadius: '8px', 
                            border: '1px solid #5e2ca5',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleImageClick(sessionData.forex_factory_news[0])}
                        />
                        <Button 
                          type="button" 
                          onClick={() => setSessionData(prev => ({ ...prev, forex_factory_news: [] }))}
                          style={{ 
                            position: 'absolute', 
                            top: '10px', 
                            right: '10px',
                            background: 'rgba(244, 67, 54, 0.7)',
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            padding: '0'
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ) : (
                      <ChartDropZone 
                        onPaste={(e) => handlePasteImage(e, 'news')}
                        tabIndex="0"
                        role="button"
                        hasImage={false}
                        aria-label="Paste News Screenshot"
                        style={{ height: '200px' }}
                      >
                        <div className="placeholder">
                          <span>📰 Paste News Screenshot</span>
                          <span style={{ fontSize: '12px' }}>Press Ctrl + V to paste screenshot</span>
                        </div>
                      </ChartDropZone>
                    )}
                  </div>
                </FormGroup>
                
                {/* Таймфрейми */}
                <TimeframeContainer>
                  {/* Перший рядок: Weekly та Daily */}
                  <TimeframeBlock
                    key="weekly"
                    timeframe="weekly"
                    data={analysisData.timeframes.weekly}
                    onNotesChange={handleNotesChange}
                    onImagePaste={handlePasteImage}
                    onImageRemove={handleRemoveImage}
                    onImageClick={handleImageClick}
                  />
                  <TimeframeBlock
                    key="daily"
                    timeframe="daily"
                    data={analysisData.timeframes.daily}
                    onNotesChange={handleNotesChange}
                    onImagePaste={handlePasteImage}
                    onImageRemove={handleRemoveImage}
                    onImageClick={handleImageClick}
                  />
                  {/* Другий рядок: H4 та H1 */}
                  <TimeframeBlock
                    key="h4"
                    timeframe="h4"
                    data={analysisData.timeframes.h4}
                    onNotesChange={handleNotesChange}
                    onImagePaste={handlePasteImage}
                    onImageRemove={handleRemoveImage}
                    onImageClick={handleImageClick}
                  />
                  <TimeframeBlock
                    key="h1"
                    timeframe="h1"
                    data={analysisData.timeframes.h1}
                    onNotesChange={handleNotesChange}
                    onImagePaste={handlePasteImage}
                    onImageRemove={handleRemoveImage}
                    onImageClick={handleImageClick}
                  />
                </TimeframeContainer>
              </SectionBlock>
            </FullWidthSection>

            {/* Четверта секція: Your Plans */}
            <FullWidthSection>
              <SectionBlock>
                <SectionTitle>Your Plans</SectionTitle>
                
                <PlansContainer>
                  {/* План A */}
                  <PlanTable>
                    <thead>
                      <TableRow>
                        <TableHeaderCell>ASPECT</TableHeaderCell>
                        <TableHeaderCell>Plan A</TableHeaderCell>
                      </TableRow>
                    </thead>
                    <tbody>
                      {['bias', 'background', 'what', 'entry', 'target', 'invalidation'].map((aspect) => (
                        <TableRow key={aspect}>
                          <TableCell isAspect>
                            {aspect.charAt(0).toUpperCase() + aspect.slice(1)}
                          </TableCell>
                          <TableCell>
                            <PlanInput
                              value={plans.planA[aspect]}
                              onChange={(e) => handlePlanTableChange('planA', aspect, e.target.value)}
                              placeholder={`Enter ${aspect}...`}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </PlanTable>

                  {/* План B */}
                  <PlanTable>
                    <thead>
                      <TableRow>
                        <TableHeaderCell>ASPECT</TableHeaderCell>
                        <TableHeaderCell>Plan B</TableHeaderCell>
                      </TableRow>
                    </thead>
                    <tbody>
                      {['bias', 'background', 'what', 'entry', 'target', 'invalidation'].map((aspect) => (
                        <TableRow key={aspect}>
                          <TableCell isAspect>
                            {aspect.charAt(0).toUpperCase() + aspect.slice(1)}
                          </TableCell>
                          <TableCell>
                            <PlanInput
                              value={plans.planB[aspect]}
                              onChange={(e) => handlePlanTableChange('planB', aspect, e.target.value)}
                              placeholder={`Enter ${aspect}...`}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </PlanTable>
                </PlansContainer>
    
                <Button 
                  type="button" 
                  onClick={handleAddAdaptation}
                  style={{ margin: '20px 0' }}
                >
                  Plan Adaptation
                </Button>
    
                {/* План Adaptations */}
                <PlansContainer style={{ flexDirection: 'column' }}>
                  {adaptations.map((adaptation, index) => (
                    <div key={`adaptation${index}`} style={{ position: 'relative', width: '100%' }}>
                      <Button 
                        type="button"
                        onClick={() => handleRemoveAdaptation(index)}
                        style={{ 
                          position: 'absolute', 
                          top: '12px', 
                          right: '12px',
                          zIndex: 2,
                          background: 'linear-gradient(135deg, #ff4757, #ff6b81)',
                          width: '28px',
                          height: '28px',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px'
                        }}
                      >
                        ×
                      </Button>
                      <PlanTable>
                        <thead>
                          <TableRow>
                            <TableHeaderCell>ASPECT</TableHeaderCell>
                            <TableHeaderCell>Plan Adaptation {index + 1}</TableHeaderCell>
                          </TableRow>
                        </thead>
                        <tbody>
                          {['bias', 'background', 'what', 'entry', 'target', 'invalidation'].map((aspect) => (
                            <TableRow key={aspect}>
                              <TableCell isAspect>
                                {aspect.charAt(0).toUpperCase() + aspect.slice(1)}
                              </TableCell>
                              <TableCell>
                                <PlanInput
                                  value={adaptation[aspect] || ''}
                                  onChange={(e) => handlePlanTableChange(`adaptation${index}`, aspect, e.target.value)}
                                  placeholder={`Enter ${aspect}...`}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </tbody>
                      </PlanTable>
                    </div>
                  ))}
                </PlansContainer>
              </SectionBlock>
            </FullWidthSection>

            {/* П'ята секція: DURING SESSION Process */}
            <FullWidthSection>
              <SectionBlock>
                <SectionTitle>DURING SESSION Process</SectionTitle>
                <ProcessList>
                  {sessionData.chart_processes.map(process => (
                    <ProcessItem key={process.id}>
                      <DeleteProcessButton 
                        onClick={() => handleDeleteProcess(process.id)}
                        type="button"
                      />
                      <ProcessTime>{process.time}</ProcessTime>
                      <ProcessTextArea
                        value={process.text}
                        onChange={(e) => handleChartProcessChange(process.id, e.target.value)}
                        placeholder="Describe your process..."
                      />
                      <ProcessImageUpload 
                        onPaste={(e) => handlePasteImage(e, null, process.id)}
                        tabIndex="0"
                        role="button"
                        hasImage={!!process.image}
                        aria-label="Paste chart screenshot"
                      >
                        {process.image ? (
                          <>
                            <img 
                              src={process.image} 
                              alt="Process visualization" 
                              onClick={() => handleImageClick(process.image)}
                            />
                            <RemoveImageButton
                              className="remove-image"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteProcessImage(process.id);
                              }}
                            >
                              ×
                            </RemoveImageButton>
                          </>
                        ) : (
                          <div className="placeholder">
                            <span>📈 Paste Chart Screenshot</span>
                            <span style={{ fontSize: '12px' }}>Press Ctrl + V to paste screenshot</span>
                          </div>
                        )}
                      </ProcessImageUpload>
                    </ProcessItem>
                  ))}
                </ProcessList>
                <AddButton 
                  type="button" 
                  onClick={handleAddChartProcess}
                  style={{ marginTop: '20px' }}
                >
                  Add Process
                </AddButton>
              </SectionBlock>
            </FullWidthSection>

            {/* Кнопки дій */}
            <ButtonGroup>
              <Button type="button" onClick={handleBack}>Cancel</Button>
              <Button type="submit" primary>Save</Button>
            </ButtonGroup>
          </form>
        </Content>

        {/* Модальні вікна */}
        {isLoading && (
          <LoadingOverlay>
            <div>Loading...</div>
          </LoadingOverlay>
        )}

        {selectedImage && (
          <ImageModal onClick={handleCloseImage} scrollOffset={scrollOffset}>
            <img src={selectedImage} alt="Full size" onClick={(e) => e.stopPropagation()} />
            <ModalCloseButton onClick={handleCloseImage}>×</ModalCloseButton>
          </ImageModal>
        )}

        {showImageForm && (
          <>
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                zIndex: 1001
              }}
              onClick={handleImageFormClose}
            />
            <ImageUploadForm onSubmit={handleImageUploadSubmit}>
              <SectionTitle>Upload Images</SectionTitle>
              <DropZone
                isDragActive={dragActive}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <p>Drag and drop images here or click to select</p>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </DropZone>
    
              {selectedFiles.length > 0 && (
                <ImagePreview>
                  {selectedFiles.map((file, index) => (
                    <img key={index} src={file} alt={`Preview ${index + 1}`} />
                  ))}
                </ImagePreview>
              )}
              <ButtonGroup style={{ marginTop: '20px' }}>
                <Button type="button" onClick={handleImageFormClose}>Cancel</Button>
                <Button type="submit" primary>Upload</Button>
              </ButtonGroup>
            </ImageUploadForm>
          </>
        )}

        {showNoteModal && (
          <NoteModal
            isOpen={showNoteModal}
            onClose={handleCloseNoteModal}
            onSave={handleSaveNote}
            sourceType="presession"
            sourceId={noteSourceId}
          />
        )}
      </Container>
    </>
  );
}

export default PreSessionFull; 
