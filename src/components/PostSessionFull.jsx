import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import NotesList from './Notes/NotesList.jsx';
import NoteModal from './Notes/NoteModal.jsx';
import STERModal from './LearningSection/TradingPsychology/STER/STERModal.jsx';

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
  margin: 0 auto;
  font-size: 2.5em;
  color: #fff;
  text-align: center;
  z-index: 1;
`;

const Content = styled.div`
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  margin-top: 120px;
`;

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 40px;
`;

const SectionBlock = styled.div`
  background-color: #2e2e2e;
  border: 2px solid #5e2ca5;
  border-radius: 15px;
  padding: 30px;
  box-sizing: border-box;
  height: fit-content;
  margin-bottom: 40px;
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

const FormGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
`;

const Label = styled.label`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Poppins', 'Inter', sans-serif;
  margin-bottom: 8px;
  display: block;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  opacity: 0.9;

  &:hover {
    opacity: 1;
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
      case 'Missed':
        return '#8000FF';
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

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 28px;
  height: 28px;
  cursor: pointer;
  appearance: none;
  border: 2px solid #5e2ca5;
  border-radius: 6px;
  background-color: #2e2e2e;
  transition: all 0.2s ease;
  position: relative;
  margin: 0;

  &:checked {
    background: #2e2e2e;
    border-color: #5e2ca5;

    &:after {
      content: '✓';
      position: absolute;
      color: #5e2ca5;
      font-size: 18px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &:hover {
    border-color: #B886EE;
    box-shadow: 0 0 0 2px rgba(184, 134, 238, 0.2);
  }

  &:focus {
    outline: none;
    border-color: #B886EE;
    box-shadow: 0 0 0 2px rgba(184, 134, 238, 0.2);
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 15px;
  color: #fff;
  font-size: 16px;
  margin-bottom: 15px;
  cursor: pointer;
  background-color: #2e2e2e;
  border: 2px solid #5e2ca5;
  border-radius: 6px;
  padding: 15px;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:hover {
    border-color: #B886EE;
    background: rgba(94, 44, 165, 0.1);
  }
`;

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

// Add ImageModal component
const ImageModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
`;

const ModalImage = styled.img`
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
  z-index: 1101;

  &:hover {
    color: #B886EE;
  }
`;

// Компоненты для таймфреймів
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

// Добавляем новые стили для Plan Analysis
const PlanAnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

const QuestionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const QuestionLabel = styled.label`
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;

  &:before {
    content: '✎';
    font-size: 20px;
    color: #B886EE;
  }
`;

// Добавляем новые стили для Performance Analysis
const PerformanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

const AdaptationBlock = styled.div`
  grid-column: 1 / 3;
  margin-bottom: 20px;
`;

const ImprovementBlock = styled.div`
  grid-column: 3 / 4;
`;

const VideoSection = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #2e2e2e;
  border: 2px solid #5e2ca5;
  border-radius: 15px;
`;

const VideoInput = styled.input`
  width: 100%;
  padding: 12px;
  background: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 8px;
  color: #fff;
  margin-top: 10px;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #B886EE;
    box-shadow: 0 0 0 2px rgba(184, 134, 238, 0.2);
  }
`;

const VideoButton = styled.button`
  margin-top: 10px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #7425C9, #B886EE);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Добавляем новые стили для секции STER
const STERSection = styled.div`
  background: #2a2a2a;
  border-radius: 15px;
  padding: 25px;
  margin-top: 30px;
  border: 1px solid #5e2ca5;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const STERSectionTitle = styled.h3`
  color: #5e2ca5;
  margin-bottom: 20px;
  font-size: 1.4em;
  text-align: center;
  border-bottom: 2px solid #5e2ca5;
  padding-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const AddSTERButton = styled.button`
  background: rgba(94, 44, 165, 0.1);
  border: 2px dashed #5e2ca5;
  border-radius: 15px;
  padding: 27px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  transition: all 0.3s ease;
  margin-bottom: 20px;

  &:hover {
    background: rgba(94, 44, 165, 0.2);
    transform: translateY(-2px);
  }
`;

const AddSTERIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: conic-gradient(from 45deg, #7425c9, #b886ee);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  margin-right: 10px;
`;

const AddSTERText = styled.span`
  color: #fff;
  font-size: 1.2em;
`;

const AssessmentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const AssessmentCard = styled.div`
  background: rgba(94, 44, 165, 0.1);
  border: 1px solid #5e2ca5;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(94, 44, 165, 0.2);
  }
`;

const AssessmentDate = styled.div`
  color: #5e2ca5;
  font-size: 0.9em;
  margin-bottom: 10px;
`;

const AssessmentRatings = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 15px;
`;

const RatingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  background: rgba(94, 44, 165, 0.05);
  border-radius: 5px;
`;

const RatingLabel = styled.span`
  color: #ccc;
  font-size: 0.9em;
`;

const RatingValue = styled.span`
  color: ${props => {
    const value = parseInt(props.value) || 0;
    if (value >= 4) return '#4caf50';
    if (value >= 3) return '#ff9800';
    return '#f44336';
  }};
  font-weight: bold;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(244, 67, 54, 0.5);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 5;

  &:hover {
    background: rgba(244, 67, 54, 0.8);
    transform: scale(1.1);
  }

  ${AssessmentCard}:hover & {
    opacity: 1;
  }
`;

// Добавьте эти импорты и стили в начало файла
// import React, { useState, useEffect, useRef } from 'react';
// import styled, { createGlobalStyle, keyframes } from 'styled-components';

// Добавьте новый стилизованный компонент для оболочки модального окна
const STERModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

// Определяем отсутствующий компонент TimeframeBlock
const TimeframeBlock = ({ timeframe, data, onNotesChange, onImagePaste, onImageRemove, onImageClick }) => {
  const handlePaste = (e) => {
    onImagePaste(e, timeframe);
  };

  const handleRemove = (index) => {
    onImageRemove(timeframe, index);
  };

  const getTimeframeIcon = (timeframe) => {
    switch(timeframe.toLowerCase()) {
      case 'daily':
        return 'D';
      case 'h4':
      case '4h':
        return '4H';
      case 'h1':
      case '1h':
        return '1H';
      case '30m/15m':
        return 'M';
      default:
        return timeframe.toUpperCase().substring(0, 1);
    }
  };

  const getDisplayName = (tf) => {
    switch(tf.toLowerCase()) {
      case 'daily':
        return 'Daily';
      case 'h4':
        return '4h';
      case 'h1':
        return '1h';
      case '30m15m':
        return '30m/15m';
      default:
        return tf;
    }
  };

  return (
    <div>
      <TimeframeHeader>
        <TimeframeIcon>{getTimeframeIcon(timeframe)}</TimeframeIcon>
        <h4>{getDisplayName(timeframe)} Timeframe</h4>
      </TimeframeHeader>
      
      <ChartDropZone 
        hasImage={data.images && data.images.length > 0}
        onPaste={handlePaste}
      >
        {data.images && data.images.length > 0 ? (
          <>
            <img 
              src={data.images[0]} 
              alt={`${timeframe} chart`} 
              onClick={() => onImageClick(data.images[0])}
            />
            <RemoveImageButton
              className="remove-image"
              onClick={() => handleRemove(0)}
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
      </ChartDropZone>
      
      <TextArea
        value={data.notes || ''}
        onChange={(e) => onNotesChange(timeframe, e.target.value)}
        placeholder={`Enter ${getDisplayName(timeframe)} timeframe analysis...`}
        onPaste={handlePaste}
      />
    </div>
  );
};

function PostSessionFull() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const sessionData = location.state?.sessionData;

  const [formData, setFormData] = useState({
    id: '',
    date: new Date(),
    pair: '',
    dayNarrative: '',
    realization: '',
    routineExecution: false,
    planOutcome: false,
    videoUrl: ''
  });

  const [pairOptions, setPairOptions] = useState([]);

  const [timeframeData, setTimeframeData] = useState({
    daily: { notes: '', images: [] },
    h4: { notes: '', images: [] },
    h1: { notes: '', images: [] },
    '30m15m': { notes: '', images: [] }
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const [planAnalysis, setPlanAnalysis] = useState({
    planWorked: '',
    followedPlan: ''
  });

  const [performanceAnalysis, setPerformanceAnalysis] = useState({
    mentalMistakes: '',
    technicalMistakes: '',
    correctActions: '',
    adaptation: '',
    improvement: ''
  });

  const [selectedNote, setSelectedNote] = useState(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  const [isSaved, setIsSaved] = useState(false);

  const [sterAssessments, setSTERAssessments] = useState([]);
  const [isSTERModalOpen, setIsSTERModalOpen] = useState(false);
  const [selectedSTERAssessment, setSelectedSTERAssessment] = useState(null);

  const [creatingNew, setCreatingNew] = useState(false);

  // Добавьте новое состояние
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    loadPairOptions();
    // Если есть id, но нет sessionData, загружаем данные по ID
    if (id && !sessionData) {
      const loadSessionById = async () => {
        try {
          const loadedSession = await window.electronAPI.getPostSessionById(id);
          if (loadedSession) {
            // Устанавливаем данные в состояния компонента
            setFormData({
              id: loadedSession.id,
              date: loadedSession.date ? new Date(loadedSession.date) : new Date(),
              pair: loadedSession.pair || '',
              dayNarrative: loadedSession.narrative || '',
              realization: loadedSession.execution || '',
              outcome: loadedSession.outcome || '',
              routineExecution: !!loadedSession.routineExecution,
              planOutcome: !!loadedSession.planOutcome,
              videoUrl: loadedSession.videoUrl || ''
            });
            
            // Устанавливаем анализ таймфреймов
            if (loadedSession.timeframeAnalysis) {
              setTimeframeData(loadedSession.timeframeAnalysis);
            }
            
            // Устанавливаем анализ плана
            if (loadedSession.planAnalysis) {
              setPlanAnalysis(loadedSession.planAnalysis);
            }
            
            // Устанавливаем анализ производительности
            if (loadedSession.performanceAnalysis) {
              setPerformanceAnalysis(loadedSession.performanceAnalysis);
            }

            // Загружаем STER ассессменты для этой постсессии
            if (loadedSession.id) {
              loadSTERAssessments(loadedSession.id);
            }
          }
        } catch (error) {
          console.error('Error loading session by ID:', error);
        }
      };
      
      loadSessionById();
    } 
    // Если есть sessionData, инициализируем с её помощью
    else if (sessionData) {
      setFormData({
        id: sessionData.id,
        date: sessionData.date ? new Date(sessionData.date) : new Date(),
        pair: sessionData.pair || '',
        dayNarrative: sessionData.narrative || '',
        realization: sessionData.execution || '',
        outcome: sessionData.outcome || '',
        routineExecution: !!sessionData.routineExecution,
        planOutcome: !!sessionData.planOutcome,
        videoUrl: sessionData.videoUrl || ''
      });
      
      // Инициализация timeframeData
      if (sessionData.timeframeAnalysis) {
        setTimeframeData(sessionData.timeframeAnalysis);
      }
      
      // Инициализация planAnalysis
      if (sessionData.planAnalysis) {
        setPlanAnalysis(sessionData.planAnalysis);
      }
      
      // Инициализация performanceAnalysis
      if (sessionData.performanceAnalysis) {
        setPerformanceAnalysis(sessionData.performanceAnalysis);
      }

      // Загружаем STER ассессменты для этой постсессии
      if (sessionData.id) {
        loadSTERAssessments(sessionData.id);
      }
    }
  }, [id, sessionData]);

  useEffect(() => {
    if (formData.date) {
      setCurrentDate(formData.date.toISOString().split('T')[0]);
    }
  }, [formData.date]);

  const loadPairOptions = async () => {
    try {
      const pairs = await window.electronAPI.getAllExecutionItems('pairs');
      setPairOptions(pairs);
    } catch (error) {
      console.error('Error loading pair options:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date
    }));
  };

  const handleTimeframeNotesChange = (timeframe, value) => {
    const timeframeKey = getTimeframeKey(timeframe);
    setTimeframeData(prev => ({
      ...prev,
      [timeframeKey]: {
        ...prev[timeframeKey],
        notes: value
      }
    }));
  };

  const getTimeframeKey = (timeframe) => {
    switch(timeframe.toLowerCase()) {
      case 'daily':
        return 'daily';
      case '4h':
        return 'h4';
      case '1h':
        return 'h1';
      case '30m/15m':
        return '30m15m';
      default:
        return timeframe.toLowerCase();
    }
  };

  const handleImagePaste = async (e, timeframe) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        try {
          const buffer = await file.arrayBuffer();
          const savedPath = await window.electronAPI.saveBlobAsFile(buffer);
          
          const timeframeKey = getTimeframeKey(timeframe);
          setTimeframeData(prev => ({
            ...prev,
            [timeframeKey]: {
              ...prev[timeframeKey],
              images: [savedPath]
            }
          }));
        } catch (error) {
          console.error('Error saving pasted image:', error);
        }
        break;
      }
    }
  };

  const handleImageRemove = (timeframe, index) => {
    const timeframeKey = getTimeframeKey(timeframe);
    setTimeframeData(prev => ({
      ...prev,
      [timeframeKey]: {
        ...prev[timeframeKey],
        images: prev[timeframeKey].images.filter((_, i) => i !== index)
      }
    }));
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  const handlePlanAnalysisChange = (field, value) => {
    setPlanAnalysis(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePerformanceChange = (field, value) => {
    setPerformanceAnalysis(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      // Проверка наличия необходимых данных
      if (!formData.date) {
        console.error('Date is required');
        return;
      }
      
      // Подготовка данных для сохранения из всех состояний компонента
      const sessionToSave = {
        id: formData.id,
        date: formData.date instanceof Date ? formData.date.toISOString().split('T')[0] : formData.date,
        pair: formData.pair,
        narrative: formData.dayNarrative,
        execution: formData.realization,
        outcome: formData.outcome || 0,
        routineExecution: !!formData.routineExecution,
        planOutcome: !!formData.planOutcome,
        videoUrl: formData.videoUrl || '',
        timeframeAnalysis: timeframeData,
        planAnalysis: planAnalysis,
        performanceAnalysis: performanceAnalysis
      };
      
      console.log('Saving post session data:', sessionToSave);
      
      // Здесь используем updatePostSession вместо saveDailyRoutine
      const result = await window.electronAPI.updatePostSession(sessionToSave);
      
      console.log('Save result:', result);
      
      if (result) {
        setIsSaved(true);
        // Редирект после успешного сохранения
        setTimeout(() => {
          navigate('/daily-routine/post-session');
        }, 500);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleBack = () => {
    navigate('/daily-routine/post-session');
  };

  // Добавляем обработчик для NotesList
  const handleNoteAdd = async (note) => {
    try {
      const noteData = {
        ...note,
        sourceType: 'postsession',
        sourceId: id || '',
        tradeDate: formData.date.toISOString().split('T')[0]
      };
      
      await window.electronAPI.addNote(noteData);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleNoteClick = async (noteId) => {
    try {
      const note = await window.electronAPI.getNoteById(noteId);
      setSelectedNote(note);
      setIsNoteModalOpen(true);
    } catch (error) {
      console.error('Error fetching note:', error);
    }
  };

  const handleCloseNoteModal = () => {
    setSelectedNote(null);
    setIsNoteModalOpen(false);
  };

  const handleViewVideo = () => {
    if (formData.videoUrl) {
      window.open(formData.videoUrl, '_blank');
    }
  };

  // Добавляем функцию для загрузки STER ассессментов
  const loadSTERAssessments = async (sessionId) => {
    try {
      console.log('Loading STER assessments for session ID:', sessionId);
      
      if (!sessionId) {
        console.log('No session ID provided, skipping STER assessment loading');
        setSTERAssessments([]);
        return;
      }
      
      const assessments = await window.electronAPI.getSTERAssessmentsByPostSessionId(sessionId);
      console.log('Loaded STER assessments:', assessments);
      setSTERAssessments(assessments || []);
    } catch (error) {
      console.error('Error loading STER assessments:', error);
      setSTERAssessments([]); // Устанавливаем пустой массив в случае ошибки
    }
  };

  // Обновленные обработчики для STER Assessment
  const handleAddSTERAssessment = (e) => {
    if (e) e.preventDefault();
    setSelectedSTERAssessment(null);
    setIsSTERModalOpen(true);
  };

  const handleEditSTERAssessment = (assessment, e) => {
    if (e) e.preventDefault();
    setSelectedSTERAssessment(assessment);
    setIsSTERModalOpen(true);
  };
  
  const handleCloseSTERModal = () => {
    setIsSTERModalOpen(false);
    setSelectedSTERAssessment(null);
  };
  
  const handleSaveSTERAssessment = async (assessmentData) => {
    try {
      console.log('Saving STER assessment:', assessmentData);
      
      if (selectedSTERAssessment) {
        await window.electronAPI.updateSTERAssessment(selectedSTERAssessment.id, {
          ...assessmentData,
          postSessionId: formData.id || id
        });
      } else {
        await window.electronAPI.addSTERAssessment({
          ...assessmentData,
          postSessionId: formData.id || id
        });
      }
      
      await loadSTERAssessments(formData.id || id);
      handleCloseSTERModal();
    } catch (error) {
      console.error('Error saving STER assessment:', error);
    }
  };
  
  const handleDeleteSTERAssessment = async (assessmentId, e) => {
    if (e) e.preventDefault();
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      try {
        await window.electronAPI.deleteSTERAssessment(assessmentId);
        await loadSTERAssessments(formData.id || id);
      } catch (error) {
        console.error('Error deleting STER assessment:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <GlobalStyle />
      <DatePickerStyles />
      <Container>
        <Header>
          <BackButton onClick={handleBack}>Back</BackButton>
          <Title>{id ? 'Post-Session Details' : 'New Post-Session'}</Title>
        </Header>

        <Content>
          <form onSubmit={handleSubmit}>
            <TopSection>
              <SectionBlock>
                <SectionTitle>Basic Information</SectionTitle>
                <FormGroup>
                  <Label>Date</Label>
                  <StyledDatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Pair</Label>
                  <Select
                    name="pair"
                    value={formData.pair}
                    onChange={handleInputChange}
                  >
                    <option value="">Select pair</option>
                    {pairOptions.map(pair => (
                      <option key={pair.id} value={pair.name}>{pair.name}</option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Day Narrative</Label>
                  <Select
                    name="dayNarrative"
                    value={formData.dayNarrative}
                    onChange={handleInputChange}
                  >
                    <option value="">Select narrative</option>
                    <option value="Bullish">Bullish</option>
                    <option value="Bearish">Bearish</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Day off">Day off</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Realization</Label>
                  <Select
                    name="realization"
                    value={formData.realization}
                    onChange={handleInputChange}
                  >
                    <option value="">Select realization</option>
                    <option value="Good">Good</option>
                    <option value="Bad">Bad</option>
                    <option value="Acceptable">Acceptable</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <CheckboxLabel>
                    <Checkbox
                      name="routineExecution"
                      checked={formData.routineExecution}
                      onChange={handleInputChange}
                    />
                    Routine Execution
                  </CheckboxLabel>
                </FormGroup>

                <FormGroup>
                  <CheckboxLabel>
                    <Checkbox
                      name="planOutcome"
                      checked={formData.planOutcome}
                      onChange={handleInputChange}
                    />
                    Plan & Outcome
                  </CheckboxLabel>
                </FormGroup>
              </SectionBlock>

              <div>
                <SectionBlock>
                  <SectionTitle>Notes & Mistakes</SectionTitle>
                  <NotesList 
                    sourceType="postsession" 
                    sourceId={id || ''}
                    onNoteAdd={handleNoteAdd}
                    onNoteClick={handleNoteClick}
                  />
                </SectionBlock>

                {/* Перемещаем секцию STER Assessment сюда - под Notes & Mistakes */}
                <SectionBlock>
                  <SectionTitle>STER Assessment</SectionTitle>
                  <AddSTERButton onClick={handleAddSTERAssessment}>
                    <AddSTERIcon>+</AddSTERIcon>
                    <AddSTERText>Add STER Assessment</AddSTERText>
                  </AddSTERButton>
                  
                  {sterAssessments.length > 0 && (
                    <AssessmentsGrid>
                      {sterAssessments.map((assessment) => (
                        <AssessmentCard 
                          key={assessment.id}
                          onClick={(e) => handleEditSTERAssessment(assessment, e)}
                        >
                          <DeleteButton
                            onClick={(e) => handleDeleteSTERAssessment(assessment.id, e)}
                          >
                            ×
                          </DeleteButton>
                          <AssessmentDate>{formatDate(assessment.date)}</AssessmentDate>
                          <AssessmentRatings>
                            <RatingItem>
                              <RatingLabel>Situation</RatingLabel>
                              <RatingValue value={assessment.situationRating}>
                                {assessment.situationRating}/5
                              </RatingValue>
                            </RatingItem>
                            <RatingItem>
                              <RatingLabel>Thoughts</RatingLabel>
                              <RatingValue value={assessment.thoughtsRating}>
                                {assessment.thoughtsRating}/5
                              </RatingValue>
                            </RatingItem>
                            <RatingItem>
                              <RatingLabel>Emotions</RatingLabel>
                              <RatingValue value={assessment.emotionsRating}>
                                {assessment.emotionsRating}/5
                              </RatingValue>
                            </RatingItem>
                            <RatingItem>
                              <RatingLabel>Reaction</RatingLabel>
                              <RatingValue value={assessment.reactionRating}>
                                {assessment.reactionRating}/5
                              </RatingValue>
                            </RatingItem>
                          </AssessmentRatings>
                        </AssessmentCard>
                      ))}
                    </AssessmentsGrid>
                  )}
                </SectionBlock>

                <VideoSection>
                  <SectionTitle>Post-Session Video Analysis URL</SectionTitle>
                  <VideoInput
                    type="text"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    placeholder="Enter video URL..."
                  />
                  {formData.videoUrl && (
                    <VideoButton type="button" onClick={handleViewVideo}>
                      View Video
                    </VideoButton>
                  )}
                </VideoSection>
              </div>
            </TopSection>

            <SectionBlock>
              <SectionTitle>Post-Session Analysis</SectionTitle>
              <TimeframeContainer>
                <TimeframeBlock
                  timeframe="daily"
                  data={timeframeData.daily}
                  onNotesChange={handleTimeframeNotesChange}
                  onImagePaste={handleImagePaste}
                  onImageRemove={handleImageRemove}
                  onImageClick={handleImageClick}
                />
                <TimeframeBlock
                  timeframe="h4"
                  data={timeframeData.h4}
                  onNotesChange={handleTimeframeNotesChange}
                  onImagePaste={handleImagePaste}
                  onImageRemove={handleImageRemove}
                  onImageClick={handleImageClick}
                />
                <TimeframeBlock
                  timeframe="h1"
                  data={timeframeData.h1}
                  onNotesChange={handleTimeframeNotesChange}
                  onImagePaste={handleImagePaste}
                  onImageRemove={handleImageRemove}
                  onImageClick={handleImageClick}
                />
                <TimeframeBlock
                  timeframe="30m/15m"
                  data={timeframeData['30m15m']}
                  onNotesChange={handleTimeframeNotesChange}
                  onImagePaste={handleImagePaste}
                  onImageRemove={handleImageRemove}
                  onImageClick={handleImageClick}
                />
              </TimeframeContainer>
            </SectionBlock>

            <SectionBlock>
              <SectionTitle>Plan Analysis</SectionTitle>
              <PlanAnalysisGrid>
                <QuestionBlock>
                  <QuestionLabel>Did the trading plan work? For what reason?</QuestionLabel>
                  <TextArea
                    value={planAnalysis.planWorked}
                    onChange={(e) => handlePlanAnalysisChange('planWorked', e.target.value)}
                    placeholder="Enter your analysis..."
                  />
                </QuestionBlock>
                <QuestionBlock>
                  <QuestionLabel>Did I follow my plan? For what reason?</QuestionLabel>
                  <TextArea
                    value={planAnalysis.followedPlan}
                    onChange={(e) => handlePlanAnalysisChange('followedPlan', e.target.value)}
                    placeholder="Enter your analysis..."
                  />
                </QuestionBlock>
              </PlanAnalysisGrid>
            </SectionBlock>

            <SectionBlock>
              <SectionTitle>Performance Analysis</SectionTitle>
              <PerformanceGrid>
                <QuestionBlock>
                  <QuestionLabel>Were mental mistakes made? For what reason?</QuestionLabel>
                  <TextArea
                    value={performanceAnalysis.mentalMistakes}
                    onChange={(e) => handlePerformanceChange('mentalMistakes', e.target.value)}
                    placeholder="Enter your analysis..."
                  />
                </QuestionBlock>
                <QuestionBlock>
                  <QuestionLabel>Were there any technical mistakes? For what reason?</QuestionLabel>
                  <TextArea
                    value={performanceAnalysis.technicalMistakes}
                    onChange={(e) => handlePerformanceChange('technicalMistakes', e.target.value)}
                    placeholder="Enter your analysis..."
                  />
                </QuestionBlock>
                <QuestionBlock>
                  <QuestionLabel>What technical/psychological correct actions were performed today?</QuestionLabel>
                  <TextArea
                    value={performanceAnalysis.correctActions}
                    onChange={(e) => handlePerformanceChange('correctActions', e.target.value)}
                    placeholder="Enter your analysis..."
                  />
                </QuestionBlock>
              </PerformanceGrid>

              <BottomGrid>
                <QuestionBlock>
                  <QuestionLabel>Did you have to adapt during the trading day? Has adaptation occurred? What would the lack of adaptation lead to and what result would they get with adaptation?</QuestionLabel>
                  <TextArea
                    value={performanceAnalysis.adaptation}
                    onChange={(e) => handlePerformanceChange('adaptation', e.target.value)}
                    placeholder="Enter your analysis..."
                  />
                </QuestionBlock>
                <QuestionBlock>
                  <QuestionLabel>Could something be improved within Performance? How?</QuestionLabel>
                  <TextArea
                    value={performanceAnalysis.improvement}
                    onChange={(e) => handlePerformanceChange('improvement', e.target.value)}
                    placeholder="Enter your analysis..."
                  />
                </QuestionBlock>
              </BottomGrid>
            </SectionBlock>

            <ButtonGroup>
              <Button type="button" onClick={handleBack}>Cancel</Button>
              <Button type="submit" primary>
                {id ? 'Save Changes' : 'Create Post-Session'}
              </Button>
            </ButtonGroup>
          </form>
        </Content>

        {isNoteModalOpen && selectedNote && (
          <NoteModal
            note={selectedNote}
            onClose={handleCloseNoteModal}
          />
        )}

        {selectedImage && (
          <ImageModal onClick={handleCloseImage}>
            <CloseButton onClick={handleCloseImage}>&times;</CloseButton>
            <ModalImage src={selectedImage} alt="Preview" onClick={e => e.stopPropagation()} />
          </ImageModal>
        )}

        {isSTERModalOpen && (
          <STERModalWrapper scrollY={scrollY}>
            <STERModal
              isOpen={isSTERModalOpen}
              onClose={handleCloseSTERModal}
              onSave={handleSaveSTERAssessment}
              assessment={selectedSTERAssessment}
              postSessionId={formData.id || id}
              postSessionInfo={{
                date: formData.date ? new Date(formData.date).toLocaleDateString() : '',
                pair: formData.pair || ''
              }}
            />
          </STERModalWrapper>
        )}
      </Container>
    </>
  );
}

export default PostSessionFull;