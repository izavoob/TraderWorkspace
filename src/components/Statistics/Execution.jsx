import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import deleteIcon from '../../assets/icons/delete-icon.svg';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ExecutionContainer = styled.div`
 
  min-height: 100vh;
  background-color: #1a1a1a;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
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

const BackButton = styled(Link)`
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

const PageTitle = styled.h1`
  margin: 0 auto;
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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
 
  margin-left: auto;
  margin-right: auto;
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
  color: #fff;
  margin: 0 0 20px;
  font-size: 1.8em;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(94, 44, 165, 0.4);
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
  width: 100%;
`;

const ItemCard = styled.div`
  background-color: #1a1a1a;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 2px 10px;
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
  transition: all 0.3s ease;
  position: relative;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(94, 44, 165, 0.4);
  }
`;

const ItemName = styled.h3`
  color: #fff;
  margin: 0;
  font-size: 1.1em;
  text-align: center;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 25px;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.3;
  max-height: 2.6em;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(244, 67, 54, 0.5);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;

  ${ItemCard}:hover & {
    opacity: 1;
  }

  &:hover {
    background: rgba(244, 67, 54, 0.75);
    transform: scale(1.1);
  }

  &::before {
    content: '';
    width: 15px;
    height: 15px;
    background: url(${deleteIcon}) no-repeat center;
    background-size: contain;
  }
`;

const AddItemCard = styled(ItemCard)`
  background-color: rgba(94, 44, 165, 0.1);
  border: 2px dashed #5e2ca5;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: rgba(94, 44, 165, 0.2);
  }
`;

const AddIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: conic-gradient(from 45deg, #7425c9, #b886ee);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
`;

const Modal = styled.div`
 position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  box-sizing: border-box;
  transform: translateY(${props => props.scrollY}px);
  overflow: hidden;
`;

const ModalContent = styled.div`
  background-color: #2e2e2e;
  padding: 30px;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
  max-width: 100%;
  width: 800px;
  animation: ${fadeIn} 0.3s ease;
  position: relative;
  overflow-y: auto;
    overflow-x: hidden;
  max-height: 90vh;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 2px solid #5e2ca5;
  border-radius: 8px;
  background-color: #1a1a1a;
  color: white;
  font-size: 1em;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #b886ee;
  }
`;

const FormButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #7425C9 0%, #B886EE 100%);
  color: white;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.3s ease;

  &.cancel {
    background-color: #4a4a4a;
    color: white;
  }

  &.save {
    background: linear-gradient(135deg, #7425C9 0%, #B886EE 100%);
    color: white;
  }

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ItemStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  font-size: 12px;
  color: #fff;
`;

const StatDivider = styled.span`
  width: 1px;
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
`;

const StatNumber = styled.span`
  color: ${props => {
    switch (props.type) {
      case 'win':
        return '#4caf50';
      case 'loss':
        return '#f44336';
      case 'breakeven':
        return '#ffd700';
      case 'missed':
        return '#9c27b0';
      default:
        return '#fff';
    }
  }};
  font-weight: 500;
`;

const WinrateBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-top: 4px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.winrate}%;
    background: linear-gradient(to right, #4CAF50, #8BC34A);
    border-radius: 2px;
  }
`;

const WinrateText = styled.div`
  font-size: 11px;
  color: #888;
  text-align: center;
  margin-top: 4px;
`;


const ModalItemCard = styled.div`
  background-color: #1a1a1a;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid #5e2ca5;
  margin-bottom: 20px;
`;

const TradesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const TradesListTitle = styled.h3`
  color: #fff;
  margin: 20px 0 10px;
  font-size: 1.2em;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
`;

const TradeItem = styled(Link)`
  background-color: #1a1a1a;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #5e2ca5;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(5px);
    background-color: #2a2a2a;
    border-color: #7425c9;
  }
`;

const TradeInfo = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const TradeNumber = styled.span`
  font-weight: bold;
  color: #b886ee;
`;

const TradeDate = styled.span`
  color: #888;
`;

const TradeResult = styled.span`
  padding: 5px 10px;
  border-radius: 5px;
  background-color: ${props => {
    switch(props.result) {
      case 'Win': return 'rgba(76, 175, 80, 0.2)';
      case 'Loss': return 'rgba(244, 67, 54, 0.2)';
      case 'Breakeven': return 'rgba(255, 215, 0, 0.2)';
      case 'Missed': return 'rgba(156, 39, 176, 0.2)';
      default: return 'rgba(128, 128, 128, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.result) {
      case 'Win': return '#4caf50';
      case 'Loss': return '#f44336';
      case 'Breakeven': return '#ffd700';
      case 'Missed': return '#9c27b0';
      default: return '#808080';
    }
  }};
`;

const ModalTitle = styled.h2`
  color: #fff;
  margin: 0;
  text-align: center;
  font-size: 1.5em;
`;

const NoTradesMessage = styled.p`
  color: #888;
  text-align: center;
  margin: 20px 0;
`;

function Execution() {
  const [sections, setSections] = useState({
    pointA: [],
    trigger: [],
    pointB: [],
    entryModel: [],
    entryTF: [],
    fta: [],
    slPosition: [],
    volumeConfirmation: []
  });
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showTradesModal, setShowTradesModal] = useState(false);
  const [relatedTrades, setRelatedTrades] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  const sectionTitles = {
    pointA: 'Point A',
    trigger: 'Trigger',
    pointB: 'Point B',
    entryModel: 'Entry Model',
    entryTF: 'Entry TF',
    fta: 'FTA',
    slPosition: 'SL Position',
    volumeConfirmation: 'Volume Confirmation'
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const sectionsData = {};
        for (const section of Object.keys(sections)) {
          const items = await window.electronAPI.getAllExecutionItems(section);
          sectionsData[section] = items;
        }
        setSections(sectionsData);

        // Завантажуємо всі трейди для статистики
        const tradesData = await window.electronAPI.getTrades();
        setTrades(tradesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Добавляем эффект для управления overflow при открытии/закрытии модалей
  useEffect(() => {
    if (isModalOpen || showTradesModal) {
      // Запоминаем текущую позицию прокрутки
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);
      // Блокируем прокрутку
      document.body.style.overflow = 'hidden';
    } else {
      // Разблокируем прокрутку при закрытии
      document.body.style.overflow = '';
    }

    return () => {
      // Разблокируем прокрутку при размонтировании компонента
      document.body.style.overflow = '';
    };
  }, [isModalOpen, showTradesModal]);

  const calculateStats = (itemName, section) => {
    const relevantTrades = trades.filter(trade => {
      switch(section) {
        case 'pointA':
          return trade.pointA === itemName;
        case 'trigger':
          return trade.trigger === itemName;
        case 'volumeConfirmation':
          console.log('Перевірка volumeConfirmation для трейду:', trade.id);
          console.log('volumeConfirmation:', trade.volumeConfirmation);
          console.log('itemName:', itemName);
          console.log('Результат перевірки:', Array.isArray(trade.volumeConfirmation) && trade.volumeConfirmation.includes(itemName));
          return Array.isArray(trade.volumeConfirmation) && trade.volumeConfirmation.includes(itemName);
        case 'entryModel':
          return trade.entryModel === itemName;
        case 'entryTF':
          return trade.entryTF === itemName;
        case 'fta':
          return trade.fta === itemName;
        case 'slPosition':
          return trade.slPosition === itemName;
        default:
          return false;
      }
    });

    const totalTrades = relevantTrades.length;
    const winTrades = relevantTrades.filter(trade => trade.result === 'Win').length;
    const lossTrades = relevantTrades.filter(trade => trade.result === 'Loss').length;
    const breakevenTrades = relevantTrades.filter(trade => trade.result === 'Breakeven').length;
    const missedTrades = relevantTrades.filter(trade => trade.result === 'Missed').length;
    
    // Розраховуємо вінрейт лише на основі Win та Loss трейдів
    const totalWinLossTrades = winTrades + lossTrades;
    const winrate = totalWinLossTrades > 0 ? (winTrades / totalWinLossTrades) * 100 : 0;

    return {
      totalTrades,
      winTrades,
      lossTrades,
      breakevenTrades,
      missedTrades,
      winrate: Math.round(winrate)
    };
  };

  const handleAddItem = (section) => {
    setCurrentSection(section);
    setNewItemName('');
    setIsModalOpen(true);
  };

  const handleSaveItem = async () => {
    if (!newItemName.trim()) return;

    try {
      await window.electronAPI.addExecutionItem(currentSection, newItemName.trim());
      await loadAllSections();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleDeleteItem = async (section, id, event) => {
    event.stopPropagation();
    if (window.confirm('Ви впевнені, що хочете видалити цей елемент?')) {
      try {
        await window.electronAPI.deleteExecutionItem(section, id);
        await loadAllSections();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleItemClick = async (itemName, section) => {
    try {
      const allTrades = await window.electronAPI.getTrades();
      const filteredTrades = allTrades.filter(trade => {
        switch(section) {
          case 'pointA':
            return trade.pointA === itemName;
          case 'trigger':
            return trade.trigger === itemName;
          case 'volumeConfirmation':
            return trade.volumeConfirmation && trade.volumeConfirmation.includes(itemName);
          case 'entryModel':
            return trade.entryModel === itemName;
          case 'entryTF':
            return trade.entryTF === itemName;
          case 'fta':
            return trade.fta === itemName;
          case 'slPosition':
            return trade.slPosition === itemName;
          default:
            return false;
        }
      });

      const stats = calculateStats(itemName, section);
      setSelectedItem({ name: itemName, section, stats });
      setRelatedTrades(filteredTrades);
      setShowTradesModal(true);

      
      // Новий підхід до скролу
      setTimeout(() => {
        const modalElement = document.querySelector('.modal-content');
        if (modalElement) {
          modalElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error loading related trades:', error);
    }
  };

  const renderSections = () => {
    const leftSections = [];
    const rightSections = [];
    let entryTFSection = null;

    const leftSideNames = ['pointA', 'entryModel', 'slPosition', 'fta'];

    Object.entries(sections).forEach(([sectionName, items]) => {
      const sectionContent = (
        <SectionContainer key={sectionName}>
          <SectionTitle>{sectionTitles[sectionName]}</SectionTitle>
          <ItemsGrid>
            {items.map((item) => {
              const stats = calculateStats(item.name, sectionName);
              return (
                <ItemCard 
                  key={item.id}
                  onClick={() => handleItemClick(item.name, sectionName)}
                >
                  <ItemName>{item.name}</ItemName>
                  <DeleteButton
                    onClick={(e) => handleDeleteItem(sectionName, item.id, e)}
                  />
                  <ItemStats>
                    <StatsRow>
                      <span>{stats.totalTrades}Trades</span>
                      <StatDivider />
                      <StatNumber type="win">{stats.winTrades}</StatNumber>
                      <StatDivider />
                      <StatNumber type="loss">{stats.lossTrades}</StatNumber>
                      <StatDivider />
                      <StatNumber type="breakeven">{stats.breakevenTrades}</StatNumber>
                      <StatDivider />
                      <StatNumber type="missed">{stats.missedTrades}</StatNumber>
                    </StatsRow>
                    <WinrateBar winrate={stats.winrate} />
                    <WinrateText>{stats.winrate}% Winrate</WinrateText>
                  </ItemStats>
                </ItemCard>
              );
            })}
            <AddItemCard onClick={() => handleAddItem(sectionName)}>
              <AddIcon>+</AddIcon>
            </AddItemCard>
          </ItemsGrid>
        </SectionContainer>
      );

      if (leftSideNames.includes(sectionName)) {
        leftSections.push(sectionContent);
      } else if (sectionName === 'entryTF') {
        entryTFSection = sectionContent;
      } else {
        rightSections.push(sectionContent);
      }
    });

    // Додаємо Entry TF в кінець правої колонки
    if (entryTFSection) {
      rightSections.push(entryTFSection);
    }

    return (
      <>
        <Content>
          <div style={{ gridColumn: '1 / 2', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {leftSections}
          </div>
          <div style={{ gridColumn: '2 / 3', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {rightSections}
          </div>
        </Content>

        {showTradesModal && selectedItem && (
           <Modal onClick={() => setShowTradesModal(false)} scrollY={scrollY}>
             <ModalContent onClick={e => e.stopPropagation()}>
              <h2 style={{ color: '#fff', margin: '0 0 20px', fontSize: '1.5em', textAlign: 'center' }}>
                {sectionTitles[selectedItem.section]}
              </h2>
              
              <ModalItemCard>
                <ItemName style={{ margin: '0 0 15px', fontSize: '1.2em' }}>{selectedItem.name}</ItemName>
                <ItemStats>
                  <StatsRow>
                    <span>{selectedItem.stats.totalTrades} Trades</span>
                    <StatDivider />
                    <StatNumber type="win">{selectedItem.stats.winTrades}</StatNumber>
                    <StatDivider />
                    <StatNumber type="loss">{selectedItem.stats.lossTrades}</StatNumber>
                    <StatDivider />
                    <StatNumber type="breakeven">{selectedItem.stats.breakevenTrades}</StatNumber>
                    <StatDivider />
                    <StatNumber type="missed">{selectedItem.stats.missedTrades}</StatNumber>
                  </StatsRow>
                  <WinrateBar winrate={selectedItem.stats.winrate} />
                  <WinrateText>{selectedItem.stats.winrate}% Winrate</WinrateText>
                </ItemStats>
              </ModalItemCard>

              <TradesListTitle>Related Trades</TradesListTitle>
              <TradesList>
                {relatedTrades.length > 0 ? (
                  relatedTrades.map(trade => (
                    <TradeItem 
                      key={trade.id} 
                      to={`/trade/${trade.id}`}
                    >
                      <TradeInfo>
                        <TradeNumber>#{trade.no}</TradeNumber>
                        <TradeDate>{new Date(trade.date).toLocaleDateString()}</TradeDate>
                      </TradeInfo>
                      <TradeResult result={trade.result}>{trade.result}</TradeResult>
                    </TradeItem>
                  ))
                ) : (
                  <NoTradesMessage>No trades found with this {selectedItem.section}</NoTradesMessage>
                )}
              </TradesList>
            </ModalContent>
          </Modal>
        )}
      </>
    );
  };

  return (
    <ExecutionContainer>
      <Header>
        <BackButton to="/statistics">
        </BackButton>
        <PageTitle>Execution Database</PageTitle>
        <Subtitle>Your execution metrics!</Subtitle>
      </Header>

      {renderSections()}

      {isModalOpen && (
        <Modal onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2>Add New {sectionTitles[currentSection]}</h2>
            <Input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Enter name"
              autoFocus
            />
            <ButtonGroup>
              <Button className="save" onClick={handleSaveItem}>Save</Button>
              <Button className="cancel" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </ExecutionContainer>
  );
}

export default Execution;