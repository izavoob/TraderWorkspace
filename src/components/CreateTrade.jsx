import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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
`;

const TradeContent = styled.div`
  margin-top: 148px;
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
`;

const FormRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
`;

const FormField = styled.div`
  flex: 1;
`;

const FormLabel = styled.label`
  color: #fff;
  margin-bottom: 5px;
  display: block;
`;

const FormInput = styled.input`
  padding: 8px;
  background-color: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 5px;
  width: 100%;
`;

const FormSelect = styled.select`
  padding: 8px;
  background-color: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 5px;
  width: 100%;
`;

const FormCheckbox = styled.input`
  margin-right: 10px;
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
`;

const VolumeConfirmationButton = styled.button`
  padding: 8px;
  background-color: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 5px;
  width: 100%;
  text-align: left;
`;

const VolumeConfirmationPopup = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #3e3e3e;
  border: 1px solid #5e2ca5;
  border-radius: 5px;
  padding: 10px;
  z-index: 1000;
`;

const VolumeOption = styled.div`
  padding: 5px;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? 'rgba(0, 0, 255, 0.5)' : 'transparent')};
  color: #fff;

  &:hover {
    background-color: #5e2ca5;
  }
`;

const ConfirmButton = styled.button`
  margin-top: 10px;
  background: conic-gradient(from 45deg, #7425c9, #b886ee);
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const SectionTitle = styled.h2`
  color: #5e2ca5;
  margin: 20px 0 10px;
  font-size: 2em;
`;

const ScreenshotContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
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

  &:hover .delete-screenshot {
    opacity: 1;
  }
`;

const ScreenshotTitle = styled.h3`
  color: #fff;
  margin-bottom: 10px;
  font-size: 1em;
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
`;

const Row = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
`;

const NoteContainer = styled.div`
  width: 100%;
`;

const NoteItem = styled.div`
  background-color: #2e2e2e;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #5e2ca5;
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
`;

const NoteText = styled.p`
  margin: 0;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

const NotePopup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100vw / 2);
  height: calc(100vh / 2);
  background-color: #2e2e2e;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #5e2ca5;
  color: #fff;
  z-index: 1001;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NotePopupTitle = styled.h3`
  color: #fff;
  margin: 0 0 10px;
`;

const NotePopupInput = styled.input`
  padding: 8px;
  background-color: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 5px;
  width: 100%;
`;

const NotePopupTextArea = styled.textarea`
  padding: 8px;
  background-color: #3e3e3e;
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 5px;
  width: 100%;
  flex-grow: 1;
`;

const NotePopupButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

function CreateTrade() {
  const navigate = useNavigate();
  const [tradeCount, setTradeCount] = useState(0);
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

  useEffect(() => {
    window.electronAPI.getTrades().then((trades) => {
      setTradeCount(trades.length + 1);
    }).catch((error) => {
      console.error('Error fetching trade count:', error);
      setTradeCount(1);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTrade((prev) => {
      const newTrade = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'rr' || name === 'risk' || name === 'result') {
        const risk = parseFloat(newTrade.risk) || 0;
        const rr = parseFloat(newTrade.rr) || 0;
        newTrade.profitLoss =
          newTrade.result === 'Win' ? risk * rr : newTrade.result === 'Loss' ? -risk : '';
        newTrade.gainedPoints = 'Coming soon';
      }
      return newTrade;
    });
  };

  const handleVolumeOptionClick = (option) => {
    setTempVolumeConfirmation((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const handleVolumeConfirm = () => {
    setTrade((prev) => ({ ...prev, volumeConfirmation: tempVolumeConfirmation }));
    setShowVolumePopup(false);
  };

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

  const openNotePopup = (index = null) => {
    if (index !== null) {
      setNoteTitle(trade.notes[index].title);
      setNoteText(trade.notes[index].text);
      setEditNoteIndex(index);
    } else {
      setNoteTitle('');
      setNoteText('');
      setEditNoteIndex(null);
    }
    setShowNotePopup(true);
  };

  const saveNote = () => {
    if (noteTitle && noteText) {
      const note = { title: noteTitle, text: noteText };
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
    }
  };

  const deleteNote = (index) => {
    setTrade((prev) => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index),
    }));
    setShowNotePopup(false);
  };

  const cancelNote = () => {
    setShowNotePopup(false);
    setNoteTitle('');
    setNoteText('');
    setEditNoteIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tradeData = {
        id: Date.now().toString(),
        ...trade,
        risk: trade.risk ? `${trade.risk}%` : '',
        rr: trade.rr ? `${trade.rr}RR` : '',
        volumeConfirmation: trade.volumeConfirmation.join(', '),
      };
      await window.electronAPI.saveTrade(tradeData);
      navigate('/trade-journal');
    } catch (error) {
      console.error('Error saving trade:', error);
      alert('Failed to save trade. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/trade-journal', { replace: true });
  };

  return (
    <CreateTradeContainer>
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
                <FormInput
                  type="date"
                  name="date"
                  value={trade.date}
                  onChange={handleChange}
                />
              </FormField>
              <FormField>
                <FormLabel>Account</FormLabel>
                <FormSelect name="account" value={trade.account} onChange={handleChange} disabled>
                  <option value="">Coming soon</option>
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel>Pair</FormLabel>
                <FormSelect name="pair" value={trade.pair} onChange={handleChange}>
                  <option value="">Select Pair</option>
                  <option value="EURUSD">EURUSD</option>
                  <option value="GBPUSD">GBPUSD</option>
                  <option value="USDJPY">USDJPY</option>
                  <option value="GER40">GER40</option>
                  <option value="XAUUSD">XAUUSD</option>
                  <option value="XAGUSD">XAGUSD</option>
                </FormSelect>
              </FormField>
            </FormRow>
            <FormRow>
              <FormField>
                <FormLabel>Direction</FormLabel>
                <FormSelect name="direction" value={trade.direction} onChange={handleChange}>
                  <option value="">Select Direction</option>
                  <option value="Long" style={{ backgroundColor: '#00ff00', color: '#000' }}>Long</option>
                  <option value="Short" style={{ backgroundColor: '#ff0000', color: '#fff' }}>Short</option>
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel>Position Type</FormLabel>
                <FormSelect name="positionType" value={trade.positionType} onChange={handleChange}>
                  <option value="">Select Position Type</option>
                  <option value="Intraday">Intraday</option>
                  <option value="Swing">Swing</option>
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
                  <option value="Win" style={{ backgroundColor: '#00ff00', color: '#000' }}>Win</option>
                  <option value="Loss" style={{ backgroundColor: '#ff0000', color: '#fff' }}>Loss</option>
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
                  value={trade.gainedPoints || 'Coming soon'}
                  readOnly
                />
              </FormField>
              <FormField>
                <FormLabel>
                  <FormCheckbox
                    type="checkbox"
                    name="followingPlan"
                    checked={trade.followingPlan}
                    onChange={handleChange}
                  />
                  Following the Plan?
                </FormLabel>
              </FormField>
              <FormField>
                <FormLabel>
                  <FormCheckbox
                    type="checkbox"
                    name="bestTrade"
                    checked={trade.bestTrade}
                    onChange={handleChange}
                  />
                  Best Trade?
                </FormLabel>
              </FormField>
            </FormRow>
          </TradeTable>
          <TradeTable>
            <FormRow>
              <FormField>
                <FormLabel>Session</FormLabel>
                <FormSelect name="session" value={trade.session} onChange={handleChange}>
                  <option value="">Select Session</option>
                  <option value="Asia" style={{ backgroundColor: '#0000ff', color: '#fff' }}>Asia</option>
                  <option value="Frankfurt" style={{ backgroundColor: '#ff69b4', color: '#fff' }}>Frankfurt</option>
                  <option value="London" style={{ backgroundColor: '#00ff00', color: '#000' }}>London</option>
                  <option value="New York" style={{ backgroundColor: '#ffa500', color: '#fff' }}>New York</option>
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel>Point A</FormLabel>
                <FormSelect name="pointA" value={trade.pointA} onChange={handleChange}>
                  <option value="">Select Point A</option>
                  <option value="Fractal Raid">Fractal Raid</option>
                  <option value="FVG">FVG</option>
                  <option value="SNR">SNR</option>
                  <option value="RB">RB</option>
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel>Trigger</FormLabel>
                <FormSelect name="trigger" value={trade.trigger} onChange={handleChange}>
                  <option value="">Select Trigger</option>
                  <option value="Fractal Swing">Fractal Swing</option>
                  <option value="FVG">FVG</option>
                  <option value="Fractal Swing + FVG">Fractal Swing + FVG</option>
                </FormSelect>
              </FormField>
            </FormRow>
            <FormRow>
              <FormField>
                <FormLabel>Volume Confirmation</FormLabel>
                <VolumeConfirmationContainer>
                  <VolumeConfirmationButton onClick={() => setShowVolumePopup(true)}>
                    {trade.volumeConfirmation.length > 0 ? trade.volumeConfirmation.join(', ') : 'Select'}
                  </VolumeConfirmationButton>
                  {showVolumePopup && (
                    <VolumeConfirmationPopup>
                      {['Inversion', 'FVG', 'SNR'].map((option) => (
                        <VolumeOption
                          key={option}
                          selected={tempVolumeConfirmation.includes(option)}
                          onClick={() => handleVolumeOptionClick(option)}
                        >
                          {option}
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
                  <option value="Inversion">Inversion</option>
                  <option value="Displacement">Displacement</option>
                  <option value="SNR">SNR</option>
                  <option value="IDM">IDM</option>
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel>Entry TF</FormLabel>
                <FormSelect name="entryTF" value={trade.entryTF} onChange={handleChange}>
                  <option value="">Select Entry TF</option>
                  <option value="3m">3m</option>
                  <option value="5m">5m</option>
                  <option value="15m">15m</option>
                  <option value="1h/30m">1h/30m</option>
                  <option value="4h">4h</option>
                </FormSelect>
              </FormField>
            </FormRow>
            <FormRow>
              <FormField>
                <FormLabel>FTA</FormLabel>
                <FormSelect name="fta" value={trade.fta} onChange={handleChange}>
                  <option value="">Select FTA</option>
                  <option value="Fractal Swing">Fractal Swing</option>
                  <option value="FVG">FVG</option>
                  <option value="SNR">SNR</option>
                  <option value="RB">RB</option>
                </FormSelect>
              </FormField>
              <FormField>
                <FormLabel>SL Position</FormLabel>
                <FormSelect name="slPosition" value={trade.slPosition} onChange={handleChange}>
                  <option value="">Select SL Position</option>
                  <option value="LTF/Lunch Manipulation">LTF/Lunch Manipulation</option>
                  <option value="30m Raid">30m Raid</option>
                  <option value="1h Raid">1h Raid</option>
                  <option value="4h Raid">4h Raid</option>
                  <option value="1D Raid">1D Raid</option>
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
                  <img src="/assets/delete-icon.svg" alt="Delete" />
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
                  <img src="/assets/delete-icon.svg" alt="Delete" />
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
                  <img src="/assets/delete-icon.svg" alt="Delete" />
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
                <NoteItem key={index} onClick={() => openNotePopup(index)}>
                  <NoteText>{note.title}</NoteText>
                  <IconButton className="edit" onClick={(e) => { e.stopPropagation(); openNotePopup(index); }}>
                    <img src="/assets/edit-icon.svg" alt="Edit" />
                  </IconButton>
                  <IconButton className="delete" onClick={(e) => { e.stopPropagation(); deleteNote(index); }}>
                    <img src="/assets/delete-icon.svg" alt="Delete" />
                  </IconButton>
                </NoteItem>
              ))}
              <FormButton onClick={() => openNotePopup()}>Add Note or Mistake</FormButton>
            </NoteContainer>
          </div>
        </Row>

        {showNotePopup && (
          <NotePopup>
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
              <FormButton onClick={cancelNote}>Cancel</FormButton>
              {editNoteIndex !== null && (
                <FormButton onClick={() => deleteNote(editNoteIndex)}>Delete</FormButton>
              )}
            </NotePopupButtons>
          </NotePopup>
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