import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import DeleteIcon from '../assets/icons/delete-icon.svg';
import EditIcon from '../assets/icons/edit-icon.svg';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import NotesList from './Notes/NotesList.jsx';

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

const Content = styled.div`
  margin-top: 28px;
  padding-top: 20px;
  position: relative;
  min-height: calc(100vh - 168px);
  width: 100%;
  overflow-y: visible;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  animation: ${fadeIn} 0.5s ease;
`;

const ThreeColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  margin-bottom: 20px;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const AnalyticsLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-bottom: 20px;
`;
const Section = styled.section`
  background: #2e2e2e;
  border-radius: 15px;
  padding: 25px;
  border: 2px solid #5e2ca5;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  animation: ${slideIn} 0.5s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(116, 37, 201, 0.2);
    transform: translateY(-2px);
  }
`;

const BasicInfoSection = styled(Section)`
  height: fit-content;
`;

const MindsetSection = styled(Section)`
  height: fit-content;
`;

const ZoneSection = styled(Section)`
  grid-column: 1 / -1;
  margin-top: 20px;
`;

const MainAnalysisSection = styled(Section)`
  margin-top: 20px;
`;

const VideoSection = styled(Section)`
  margin-top: 20px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NotesSection = styled(Section)`
  grid-column: 2;
  margin-top: 20px;
`;

const NewsSection = ({ data, onImagePaste, onImageRemove, onImageClick }) => {
  const [currentImage, setCurrentImage] = useState(data.newsScreenshots[0] || null);

  const handlePaste = (e) => {
    e.preventDefault();
    onImagePaste(e, 'news');
  };

  useEffect(() => {
    setCurrentImage(data.newsScreenshots[0] || null);
  }, [data.newsScreenshots]);

  return (
    <div>
      <h4>Forex Factory News</h4>
      <ChartDropZone 
        onPaste={handlePaste}
        tabIndex="0"
        role="button"
        hasImage={!!currentImage}
        aria-label="Paste News Screenshot"
        onClick={() => currentImage && onImageClick(currentImage)}
        style={{ cursor: currentImage ? 'pointer' : 'default' }}
      >
        {currentImage ? (
          <>
            <img 
              src={currentImage} 
              alt="News Screenshot"
              onClick={(e) => {
                e.stopPropagation();
                onImageClick(currentImage);
              }}
            />
            <RemoveImageButton
              className="remove-image"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onImageRemove('news', 'news', 0);
              }}
            >
              ×
            </RemoveImageButton>
          </>
        ) : (
          <div className="placeholder">
            <span>📰 Paste News Screenshot</span>
            <span style={{ fontSize: '12px' }}>Press Ctrl + V to paste screenshot</span>
          </div>
        )}
      </ChartDropZone>
    </div>
  );
};

const TimeframeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin: 15px 0;
  width: 100%;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #5e2ca5;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(0, 0, 0, 0.7);
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    z-index: 2;

    &:hover {
      background: rgba(255, 0, 0, 0.7);
    }
  }
`;

const ImageUploadArea = styled.div`
  border: 2px dashed #5e2ca5;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 15px;

  &:hover {
    border-color: #B886EE;
    background: rgba(94, 44, 165, 0.1);
  }
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
`;

const QuotesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

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

const Label = styled.label`
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
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
  cursor: pointer;
  transition: all 0.2s ease;

  option {
    background: #3e3e3e;
    color: #fff;
    padding: 8px;
  }

  &:focus {
    outline: none;
    border-color: #B886EE;
    box-shadow: 0 0 0 2px rgba(184, 134, 238, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: calc(100% - 40px); // Отступы по бокам
  min-height: 100px;
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  color: white;
  padding: 1px;
  resize: vertical;
  margin: 15px auto 0; // Центрируем с помощью auto по горизонтали
  display: block; // Важно для margin auto
  font-family: 'Inter', sans-serif;
  
  &:focus {
    outline: none;
    border-color: #B886EE;
  }
`;
const MindsetCheckbox = styled.div`
  background: #3e3e3e;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 1px solid #5e2ca5;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  &:hover {
    border-color: #B886EE;
    transform: translateX(5px);
    background: #444444;
  }

  label {
    flex: 1;
    line-height: 1.4;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
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

const SectionTitle = styled.h3`
  color: #fff;
  margin: 0 0 20px 0;
  font-size: 1.5em;
  border-bottom: 2px solid #5e2ca5;
  padding-bottom: 10px;
  position: relative;

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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 20px;
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

const LoadingSpinner = styled.div`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  width: 50px;
  height: 50px;
  border: 5px solid #5e2ca5;
  border-top: 5px solid #B886EE;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 15px;
`;

const VideoUrlContainer = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  align-items: center;
`;

const VideoContainer = styled.div`
  width: 100%;
  margin-top: 15px;
  aspect-ratio: 16/9;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #5e2ca5;
  background: #1a1a1a;
`;

const EmbedButton = styled(Button)`
  padding: 11px 20px;
  margin-top: 0;
  white-space: nowrap;
  min-width: 120px;
`;

// Добавляем новые styled-components для модального окна
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

  img {
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
    border-radius: 4px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  }
`;

const NoteModal = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  box-sizing: border-box;
  transform: translateY(${props => props.scrollOffset}px);
`;

const NoteModalContent = styled.div`
  background: #2e2e2e;
  padding: 30px;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
  width: 90%;
  max-width: 600px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${fadeIn} 0.3s ease;
`;

const ModalCloseButton = styled.button`
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

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

// Добавляем новые styled-components
const PlanSection = styled(Section)`
  margin-top: 20px;
  grid-column: 1 / -1;
`;

const PlansContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const PlanTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #2e2e2e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  position: relative; // Добавляем для позиционирования кнопки удаления
  max-width: 800px; // Добавляем максимальную ширину
  margin: 0 auto 20px; // Центрируем таблицу
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

const AddPlanButton = styled(Button)`
  margin: 20px 0;
`;

// Обновляем стиль кнопки удаления
const DeletePlanButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #ff4757, #ff6b81);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, #ff6b81, #ff4757);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Добавляем новые styled-components
const DuringSessionSection = styled(Section)`
  margin-top: 20px;
  grid-column: 1 / -1;
`;

const DuringSessionLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
`;

// Обновляем компоненты для DURING SESSION Process
const ProcessColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: fit-content;
`;

const ColumnTitle = styled.h4`
  color: #fff;
  margin: 0 0 15px 0;
  font-size: 1.2em;
  padding-bottom: 10px;
  border-bottom: 1px solid #5e2ca5;
`;

const ProcessButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: white;
  background: linear-gradient(135deg, #7425C9, #B886EE);
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: fit-content;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Обновляем стиль ProcessCard - удаляем эффект hover и боковой скролл
const ProcessCardContainer = styled.div`
  background: #3e3e3e;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #5e2ca5;
  margin-bottom: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

// Оставляем только одно определение ProcessImageUpload
const ProcessImageUpload = styled(ImageUploadArea)`
  margin-top: 8px;
  height: 120px;
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s ease;
  
  img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
  }

  &:hover {
    transform: ${props => props.hasImage ? 'scale(1.02)' : 'none'};
  }
`;

const ProcessTextArea = styled(TextArea)`
  width: 90%;
  min-height: 60px;
  margin: 8px 0;
  resize: vertical;
`;

// Возвращаем DeleteButton к прежнему виду
const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #ff4757, #ff6b81);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;

  &:hover {
    background: linear-gradient(135deg, #ff6b81, #ff4757);
  }
`;

// Обновляем стиль ProcessList - удаляем правый padding
const ProcessList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
`;

// Создаем отдельную кнопку для процессов, которая не будет вызывать submit формы
const ButtonGroupProcess = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
`;

const ProcessTime = styled.div`
  color: #B886EE;
  font-size: 0.9em;
  margin-top: 10px;
`;

const ImageUploadForm = styled.form`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #2e2e2e;
  padding: 40px;
  border-radius: 20px;
  border: 2px solid #5e2ca5;
  color: #fff;
  z-index: 1002;
  width: 80%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const DropZone = styled.div`
  border: 2px dashed #5e2ca5;
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isDragActive ? 'rgba(94, 44, 165, 0.1)' : 'transparent'};

  &:hover {
    border-color: #B886EE;
    background: rgba(94, 44, 165, 0.1);
  }
`;

const ImagePreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;

  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #5e2ca5;
  }
`;

// Обновляем стили для области вставки изображений
const ChartDropZone = styled(ImageUploadArea)`
  position: relative;
  height: 300px;
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
    cursor: pointer; // Добавляем курсор pointer для изображений
  }

  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    color: #B886EE;
    opacity: ${props => props.hasImage ? 0 : 1};
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

// Обновляем TimeframeBlock компонент
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

// Обновляем функцию handlePaste
const handlePaste = (e, type, processId = null) => {
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
          setChartProcesses(prev => prev.map(process => 
            process.id === processId ? { ...process, image: imageData } : process
          ));
        } else if (type === 'news') {
          // Для News Screenshots
          setAnalysisData(prev => ({
            ...prev,
            newsScreenshots: [imageData] // Храним только одно изображение
          }));
        } else {
          // Для таймфреймов
          setAnalysisData(prev => ({
            ...prev,
            timeframes: {
              ...prev.timeframes,
              [type]: {
                ...prev.timeframes[type],
                charts: [imageData] // Храним только одно изображение
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

// Обновляем ProcessImageUpload компонент
const ProcessCard = ({ process, onTextChange, onImagePaste, onDelete, onImageDelete, onImageClick }) => {
  const handlePaste = (e) => {
    e.preventDefault();
    onImagePaste(e, null, process.id);
  };

  return (
    <ProcessCardContainer>
      <DeleteButton onClick={() => onDelete(process.id)} title="Delete process">
        ×
      </DeleteButton>
      <ProcessTime>{process.time}</ProcessTime>
      <ProcessTextArea
        value={process.text}
        onChange={(e) => onTextChange(process.id, e.target.value)}
        placeholder="Enter your process notes..."
      />
      <ChartDropZone 
        onPaste={handlePaste}
        hasImage={!!process.image}
        tabIndex="0"
        role="button"
        aria-label="Paste chart screenshot"
        style={{ width: '90%', cursor: process.image ? 'pointer' : 'default' }}
        onClick={() => process.image && onImageClick(process.image)}
      >
        {process.image ? (
          <>
            <img 
              src={process.image} 
              alt="Process Screenshot"
              onClick={(e) => {
                e.stopPropagation();
                onImageClick(process.image);
              }}
            />
            <RemoveImageButton
              className="remove-image"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onImageDelete(process.id);
              }}
            >
              ×
            </RemoveImageButton>
          </>
        ) : (
          <div className="placeholder">
            <span>📈 Paste Chart Screenshot (Ctrl + V)</span>
            <span style={{ fontSize: '12px' }}>Press Ctrl + V to paste screenshot</span>
          </div>
        )}
      </ChartDropZone>
    </ProcessCardContainer>
  );
};

// Обновляем секцию с таймфреймами в основном компоненте
function PreSessionFull() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [embedVideo, setEmbedVideo] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  
  // Состояния для основных секций
  const [mindsetChecks, setMindsetChecks] = useState({
    anythingCanHappen: false,
    futureKnowledge: false,
    randomDistribution: false,
    edgeDefinition: false,
    uniqueMoments: false
  });

  const [planOutcomeMatch, setPlanOutcomeMatch] = useState({
    checked: false,
    timestamp: null
  });

  const [zoneQuotes, setZoneQuotes] = useState([
    { id: 1, text: "I objectively identify my edges", accepted: false },
    { id: 2, text: "I act on my edges without reservation or hesitation", accepted: false },
    { id: 3, text: "I completely accept the risk or I am willing to let go of the trade", accepted: false },
    { id: 4, text: "I continually monitor my susceptibility for making errors", accepted: false },
    { id: 5, text: "I pay myself as the market makes money available to me", accepted: false },
    { id: 6, text: "I predefine the risk of every trade", accepted: false },
    { id: 7, text: "I understand the absolute necessity of these principles of consistent success and, therefore, never violate them", accepted: false }
  ]);

  // Состояние для секций анализа
  const [analysisData, setAnalysisData] = useState({
    newsScreenshots: [],
    timeframes: {
      weekly: { charts: [], notes: '' },
      daily: { charts: [], notes: '' },
      h4: { charts: [], notes: '' },
      h1: { charts: [], notes: '' }
    },
    videoUrl: '',
    overallThoughts: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);

  // Добавляем состояние для планов
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

  const [adaptations, setAdaptations] = useState([]);

  const [chartProcesses, setChartProcesses] = useState([]);

  const [showImageForm, setShowImageForm] = useState(false);
  const [currentUploadSection, setCurrentUploadSection] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const [notes, setNotes] = useState([]);
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [editNoteIndex, setEditNoteIndex] = useState(null);

  const [currencyPairs, setCurrencyPairs] = useState([]);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  useEffect(() => {
    const loadCurrencyPairs = async () => {
      try {
        const pairs = await window.electronAPI.getAllExecutionItems('pairs');
        setCurrencyPairs(pairs);
      } catch (error) {
        console.error('Error loading currency pairs:', error);
      }
    };
    loadCurrencyPairs();
  }, []);

  const openNotePopup = (note = null) => {
    setSelectedNote(note);
    setIsNoteModalOpen(true);
  };

  const closeNotePopup = () => {
    setSelectedNote(null);
    setIsNoteModalOpen(false);
  };

  const saveNote = async (noteData) => {
    try {
      if (noteData.id) {
        await window.electronAPI.updateNote(noteData);
      } else {
        await window.electronAPI.addNote({
          ...noteData,
          sourceType: 'presession',
          sourceId: id  // Використовуємо ID поточної pre-session
        });
      }
      // Оновлення списку нотаток або інші дії
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  useEffect(() => {
    const loadSessionData = async () => {
      setIsLoading(true);
      try {
        if (location.state?.sessionData) {
          setSessionData(location.state.sessionData);
          // Ініціалізуємо початкові стани для нового запису
          setAnalysisData({
            newsScreenshots: [],
            timeframes: {
              weekly: { charts: [], notes: '' },
              daily: { charts: [], notes: '' },
              h4: { charts: [], notes: '' },
              h1: { charts: [], notes: '' }
            },
            videoUrl: ''
          });
          setPlans({
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
          setChartProcesses([]);
          setMindsetChecks({
            anythingCanHappen: false,
            futureKnowledge: false,
            randomDistribution: false,
            edgeDefinition: false,
            uniqueMoments: false
          });
          setZoneQuotes([
            { id: 1, text: "I objectively identify my edges", accepted: false },
            { id: 2, text: "I act on my edges without reservation or hesitation", accepted: false },
            { id: 3, text: "I completely accept the risk or I am willing to let go of the trade", accepted: false },
            { id: 4, text: "I continually monitor my susceptibility for making errors", accepted: false },
            { id: 5, text: "I pay myself as the market makes money available to me", accepted: false },
            { id: 6, text: "I predefine the risk of every trade", accepted: false },
            { id: 7, text: "I understand the absolute necessity of these principles of consistent success and, therefore, never violate them", accepted: false }
          ]);
        } else if (id) {
          const presession = await window.electronAPI.getPresession(id);
          if (presession) {
            setSessionData({
              id: presession.id,
              date: presession.date,
              pair: presession.pair,
              narrative: presession.narrative,
              execution: presession.execution,
              outcome: presession.outcome,
              planOutcome: presession.plan_outcome
            });

            // Встановлюємо дані аналізу
            const timeframes = {
              weekly: { notes: '', charts: [] },
              daily: { notes: '', charts: [] },
              h4: { notes: '', charts: [] },
              h1: { notes: '', charts: [] }
            };

            // Заповнюємо дані з topDownAnalysis
            presession.topDownAnalysis.forEach(analysis => {
              if (timeframes[analysis.timeframe]) {
                timeframes[analysis.timeframe].notes = analysis.notes;
                timeframes[analysis.timeframe].charts = analysis.charts;
              }
            });

            setAnalysisData({
              newsScreenshots: presession.forex_factory_news || [],
              timeframes,
              videoUrl: presession.video_url || ''
            });

            // Встановлюємо інші дані
            setPlans(presession.plans || []);
            setChartProcesses(presession.chart_processes || []);
            setMindsetChecks(presession.mindset_preparation || {});
            setZoneQuotes(presession.the_zone || []);
            setPlanOutcomeMatch({
              checked: presession.plan_outcome,
              timestamp: presession.updated_at
            });
          }
        }
      } catch (error) {
        console.error('Error loading session data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionData();
  }, [id, location.state]);

    // Обработчики для изображений
    const handleImageUpload = (section, type) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;
  
      input.onchange = async (e) => {
        const files = Array.from(e.target.files);
        const newImages = await Promise.all(
          files.map(async (file) => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(file);
            });
          })
        );
  
        setAnalysisData(prev => {
          if (type === 'news') {
            return {
              ...prev,
              newsScreenshots: [...prev.newsScreenshots, ...newImages]
            };
          } else {
            return {
              ...prev,
              timeframes: {
                ...prev.timeframes,
                [type]: {
                  ...prev.timeframes[type],
                  charts: [...prev.timeframes[type].charts, ...newImages]
                }
              }
            };
          }
        });
      };
  
      input.click();
    };
  
    const handleRemoveImage = (section, type, index) => {
      // Предотвращаем всплытие события
      setAnalysisData(prev => {
        if (type === 'news') {
          return {
            ...prev,
            newsScreenshots: []
          };
        } else {
          return {
            ...prev,
            timeframes: {
              ...prev.timeframes,
              [type]: {
                ...prev.timeframes[type],
                charts: []
              }
            }
          };
        }
      });
    };
  
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
  
    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      const newSessionData = {
        ...sessionData,
        [name]: type === 'checkbox' ? checked : value
      };
      
      if (name === 'narrative' || name === 'outcome') {
        const shouldCheck = 
          newSessionData.narrative && 
          newSessionData.outcome && 
          newSessionData.narrative !== 'Neutral' && 
          newSessionData.narrative !== 'Day off' && 
          newSessionData.narrative === newSessionData.outcome;
  
        newSessionData.planOutcome = shouldCheck;
        setPlanOutcomeMatch({
          checked: shouldCheck,
          timestamp: shouldCheck ? new Date().toISOString() : null
        });
      }
  
      setSessionData(newSessionData);
    };
  
    const handleAcceptQuote = (id) => {
      setZoneQuotes(prev => prev.map(quote => 
        quote.id === id ? { ...quote, accepted: !quote.accepted } : quote
      ));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const presessionData = {
          id: id || String(Date.now()),
          date: sessionData.date,
          pair: sessionData.pair,
          narrative: sessionData.narrative,
          execution: sessionData.execution,
          outcome: sessionData.outcome,
          plan_outcome: planOutcomeMatch.checked,
          forex_factory_news: analysisData.newsScreenshots,
          topDownAnalysis: [
            {
              timeframe: 'weekly',
              notes: analysisData.timeframes.weekly.notes,
              charts: analysisData.timeframes.weekly.charts
            },
            {
              timeframe: 'daily',
              notes: analysisData.timeframes.daily.notes,
              charts: analysisData.timeframes.daily.charts
            },
            {
              timeframe: 'h4',
              notes: analysisData.timeframes.h4.notes,
              charts: analysisData.timeframes.h4.charts
            },
            {
              timeframe: 'h1',
              notes: analysisData.timeframes.h1.notes,
              charts: analysisData.timeframes.h1.charts
            }
          ],
          video_url: analysisData.videoUrl,
          plans: plans,
          chart_processes: chartProcesses,
          mindset_preparation: mindsetChecks,
          the_zone: zoneQuotes
        };

        await window.electronAPI.savePresession(presessionData);
        navigate('/daily-routine/pre-session');
      } catch (error) {
        console.error('Error saving presession data:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleBack = () => {
      navigate('/daily-routine/pre-session');
    };

    const getYouTubeVideoId = (url) => {
      if (!url) return null;
      
      // Поддержка разных форматов URL YouTube
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^#\&\?]*).*/,
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]?.length === 11) return match[1];
      }
      
      return null;
    };

    const handleVideoOpen = () => {
      if (analysisData.videoUrl) {
        window.open(analysisData.videoUrl, '_blank');
      }
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
      document.body.style.overflow = 'hidden';
    };
  
    const handleCloseModal = () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      setSelectedImage(null);
    };

    const handlePlanChange = (planType, aspect, value) => {
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

    const handleRemoveAdaptation = (indexToRemove) => {
      setAdaptations(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleAddChartProcess = () => {
      const newProcess = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        text: '',
        image: null
      };
      setChartProcesses(prev => [...prev, newProcess]);
    };
  
    const handleChartProcessChange = (id, text) => {
      setChartProcesses(prev => 
        prev.map(process => 
          process.id === id ? { ...process, text } : process
        )
      );
    };

    const handleProcessImageUpload = (processId) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
  
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setChartProcesses(prev => prev.map(process => 
              process.id === processId ? { ...process, image: reader.result } : process
            ));
          };
          reader.readAsDataURL(file);
        }
      };
  
      input.click();
    };

    // Добавляем функцию удаления процесса
    const handleDeleteProcess = (processId) => {
      setChartProcesses(prev => prev.filter(process => process.id !== processId));
    };

    // Добавляем функцию удаления скриншота
    const handleDeleteProcessImage = (processId) => {
      setChartProcesses(prev => prev.map(process => 
        process.id === processId ? { ...process, image: null } : process
      ));
    };

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
      if (!currentUploadSection) return;
  
      const { section, type } = currentUploadSection;
      
      setAnalysisData(prev => {
        if (type === 'news') {
          return {
            ...prev,
            newsScreenshots: [...prev.newsScreenshots, ...selectedFiles]
          };
        } else {
          return {
            ...prev,
            timeframes: {
              ...prev.timeframes,
              [type]: {
                ...prev.timeframes[type],
                charts: [...prev.timeframes[type].charts, ...selectedFiles]
              }
            }
          };
        }
      });
  
      handleImageFormClose();
    };

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
              setChartProcesses(prev => prev.map(process => 
                process.id === processId ? { ...process, image: imageData } : process
              ));
            } else if (type === 'news') {
              // Для News Screenshots
              setAnalysisData(prev => ({
                ...prev,
                newsScreenshots: [imageData] // Храним только одно изображение
              }));
            } else {
              // Для таймфреймов
              setAnalysisData(prev => ({
                ...prev,
                timeframes: {
                  ...prev.timeframes,
                  [type]: {
                    ...prev.timeframes[type],
                    charts: [imageData] // Храним только одно изображение
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

    const handleCloseImage = () => {
      setSelectedImage(null);
      document.body.style.overflow = 'auto';
    };

    const handleCloseNote = () => {
      setSelectedNote(null);
      window.scrollTo(0, scrollOffset);
    };

    if (isLoading) {
      return (
        <LoadingOverlay>
          <LoadingSpinner />
          <span>Loading...</span>
        </LoadingOverlay>
      );
    }
  
    if (!sessionData) {
      return (
        <LoadingOverlay>
          <span>No data found</span>
        </LoadingOverlay>
      );
    }
  
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
            <Form onSubmit={handleSubmit}>
              <ThreeColumnLayout>
                <BasicInfoSection>
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
                    <MindsetCheckbox>
                      <Checkbox
                        type="checkbox"
                        checked={sessionData.planOutcome}
                        disabled={true}
                        onChange={() => {}}
                      />
                      <label>
                        Plan&Outcome
                        {planOutcomeMatch.timestamp && (
                          <span style={{ 
                            marginLeft: '10px', 
                            fontSize: '12px', 
                            color: '#2ecc71' 
                          }}>
                            ✓ {new Date(planOutcomeMatch.timestamp).toLocaleTimeString()}
                          </span>
                        )}
                      </label>
                    </MindsetCheckbox>
  
                    <MindsetCheckbox>
                      <Checkbox
                        type="checkbox"
                        name="addPair"
                        checked={sessionData.addPair}
                        onChange={handleInputChange}
                      />
                      <label>Additional Pair</label>
                    </MindsetCheckbox>
                  </FormGroup>
                </BasicInfoSection>
  
                <MindsetSection>
                  <SectionTitle>PRE-SESSION Mindset Preparation</SectionTitle>
                  <MindsetCheckbox>
                    <Checkbox
                      type="checkbox"
                      checked={mindsetChecks.anythingCanHappen}
                      onChange={(e) => setMindsetChecks(prev => ({
                        ...prev,
                        anythingCanHappen: e.target.checked
                      }))}
                    />
                    <label>Все может случиться</label>
                  </MindsetCheckbox>
  
                  <MindsetCheckbox>
                    <Checkbox
                      type="checkbox"
                      checked={mindsetChecks.futureKnowledge}
                      onChange={(e) => setMindsetChecks(prev => ({
                        ...prev,
                        futureKnowledge: e.target.checked
                      }))}
                    />
                    <label>Вам не нужно знать, что будет дальше, чтобы заработать деньги</label>
                  </MindsetCheckbox>
  
                  <MindsetCheckbox>
                    <Checkbox
                      type="checkbox"
                      checked={mindsetChecks.randomDistribution}
                      onChange={(e) => setMindsetChecks(prev => ({
                        ...prev,
                        randomDistribution: e.target.checked
                      }))}
                    />
                    <label>Существует случайное распределение между выигрышами и проигрышами для любого заданного набора переменных, которые определяют преимущество</label>
                  </MindsetCheckbox>
  
                  <MindsetCheckbox>
                    <Checkbox
                      type="checkbox"
                      checked={mindsetChecks.edgeDefinition}
                      onChange={(e) => setMindsetChecks(prev => ({
                        ...prev,
                        edgeDefinition: e.target.checked
                      }))}
                    />
                    <label>Преимущество — это не что иное, как указание на более высокую вероятность того, что одно событие произойдет, а не другое</label>
                  </MindsetCheckbox>
  
                  <MindsetCheckbox>
                    <Checkbox
                      type="checkbox"
                      checked={mindsetChecks.uniqueMoments}
                      onChange={(e) => setMindsetChecks(prev => ({
                        ...prev,
                        uniqueMoments: e.target.checked
                      }))}
                    />
                    <label>Каждый момент на рынке уникален</label>
                  </MindsetCheckbox>
                </MindsetSection>
  
                <ZoneSection>
                  <SectionTitle>The Zone</SectionTitle>
                  <QuotesList>
                    {zoneQuotes.map(quote => (
                      <Quote key={quote.id}>
                        <span>{quote.text}</span>
                        <AcceptButton
                          accepted={quote.accepted}
                          onClick={() => handleAcceptQuote(quote.id)}
                          type="button"
                        >
                          {quote.accepted ? 'Accepted ✓' : 'Accept'}
                        </AcceptButton>
                      </Quote>
                    ))}
                  </QuotesList>
                </ZoneSection>
              </ThreeColumnLayout>

              <AnalyticsLayout>
                <MainAnalysisSection>
                  <SectionTitle>PRE-SESSION Analysis</SectionTitle>
                  
                  <NewsSection
                    data={analysisData}
                    onImagePaste={handlePasteImage}
                    onImageRemove={handleRemoveImage}
                    onImageClick={handleImageClick}
                  />
  
                  <TimeframeContainer>
                    {Object.entries(analysisData.timeframes).map(([timeframe, data]) => (
                      <TimeframeBlock
                        key={timeframe}
                        timeframe={timeframe}
                        data={data}
                        onNotesChange={handleNotesChange}
                        onImagePaste={handlePasteImage}
                        onImageRemove={(timeframe, index) => handleRemoveImage(timeframe, timeframe, index)}
                        onImageClick={handleImageClick}
                      />
                    ))}
                  </TimeframeContainer>
                </MainAnalysisSection>
  
                <div>
                  <VideoSection>
                    <SectionTitle>Video Analysis URL (Optional)</SectionTitle>
                    <Input
                      type="text"
                      name="videoUrl"
                      value={analysisData.videoUrl}
                      onChange={(e) => handleVideoUrlChange(e.target.value)}
                      placeholder="Enter video URL"
                    />
                  </VideoSection>
  
                </div>
              </AnalyticsLayout>

              <PlanSection>
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
                              onChange={(e) => handlePlanChange('planA', aspect, e.target.value)}
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
                              onChange={(e) => handlePlanChange('planB', aspect, e.target.value)}
                              placeholder={`Enter ${aspect}...`}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </PlanTable>
                </PlansContainer>
    
                <AddPlanButton type="button" onClick={handleAddAdaptation}>
                  Plan Adaptation
                </AddPlanButton>
    
                {/* План Adaptations */}
                <PlansContainer>
                  {adaptations.map((adaptation, index) => (
                    <PlanTable key={`adaptation${index}`}>
                      <DeletePlanButton 
                        onClick={() => handleRemoveAdaptation(index)}
                        title="Delete adaptation plan"
                      >
                        ×
                      </DeletePlanButton>
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
                                onChange={(e) => handlePlanChange(`adaptation${index}`, aspect, e.target.value)}
                                placeholder={`Enter ${aspect}...`}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </tbody>
                    </PlanTable>
                  ))}
                </PlansContainer>
              </PlanSection>

              <DuringSessionSection>
                <SectionTitle>DURING SESSION Process</SectionTitle>
                <DuringSessionLayout>
                  {/* Левая колонка */}
                  <ProcessColumn>
                    <ColumnTitle>Chart Process</ColumnTitle>
                    <ProcessButton 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddChartProcess();
                      }}
                    >
                      Add Chart Process
                    </ProcessButton>
                    <ProcessList>
                      {chartProcesses.map(process => (
                        <ProcessCard
                          key={process.id}
                          process={process}
                          onTextChange={handleChartProcessChange}
                          onImagePaste={handlePasteImage}
                          onDelete={handleDeleteProcess}
                          onImageDelete={handleDeleteProcessImage}
                          onImageClick={handleImageClick}
                        />
                      ))}
                    </ProcessList>
                  </ProcessColumn>

                  {/* Правая колонка */}
                  <ProcessColumn>
                    <ColumnTitle>Thought Process</ColumnTitle>
                    <ButtonGroupProcess>
                      <ProcessButton type="button">Add Thought</ProcessButton>
                      <ProcessButton type="button">STER Analysis</ProcessButton>
                    </ButtonGroupProcess>
                  </ProcessColumn>
                </DuringSessionLayout>
              </DuringSessionSection>

              <ButtonGroup>
                <Button type="button" onClick={handleBack}>Cancel</Button>
                <Button type="submit" primary>Save</Button>
              </ButtonGroup>
            </Form>
          </Content>
        </Container>
        {/* Добавляем модальное окно */}
        {selectedImage && (
          <ImageModal onClick={handleCloseImage}>
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
            </ImageUploadForm>
          </>
        )}
        {selectedNote && (
          <NoteModal scrollOffset={scrollOffset} onClick={handleCloseNote}>
            <NoteModalContent onClick={(e) => e.stopPropagation()}>
              {/* ... existing note modal content ... */}
              <ModalCloseButton onClick={handleCloseNote}>×</ModalCloseButton>
            </NoteModalContent>
          </NoteModal>
        )}
        <NotesList 
          sourceType="presession" 
          sourceId={id}
          onAddNote={() => openNotePopup()}
        />
        {isNoteModalOpen && (
          <NoteModal
            isOpen={isNoteModalOpen}
            onClose={closeNotePopup}
            onSave={saveNote}
            note={selectedNote}
            sourceType="presession"
            sourceId={id}
          />
        )}
      </>
    );
    
  }
  
  export default PreSessionFull;

// Добавляем styled-components для Notes (такие же как в CreateTrade)
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

const PreSessionCardContainer = styled.div`
  background: #2e2e2e;
  border: 2px solid #5e2ca5;
  border-radius: 15px;
  padding: 0;
  margin-bottom: 20px;
  width: 100%;
  position: relative;
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

// Створюємо стилі для контейнера кнопок
const BottomButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(to top, rgba(26, 26, 26, 1), rgba(26, 26, 26, 0.8));
  z-index: 1000;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
`;

const BottomButton = styled.button`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }

  &:active {
    transform: translateY(0);
  }
`;