import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import deleteIcon from '../../assets/icons/delete-icon.svg';

const AnalyticsContainer = styled.div`
  max-width: 1820px;
  margin: 20px auto;
  min-height: 100vh;
  background-color: #1a1a1a;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Header = styled.header`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
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

const BackButton = styled(Link)`
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

const Content = styled.div`
  margin-top: 50px;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  max-width: 1820px;
  margin-left: auto;
  margin-right: auto;
`;

const SectionContainer = styled.div`
  background-color: #2e2e2e;
  border: 2px solid #5e2ca5;
  border-radius: 15px;
  padding: 30px;
  box-sizing: border-box;
  height: fit-content;
  min-width: 0;
`;

const SectionTitle = styled.h2`
  color: rgb(92, 157, 245);
  margin: 0 0 20px;
  font-size: 1.8em;
  text-align: left;
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
  color: ${props => props.color || '#fff'};
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #2e2e2e;
  padding: 30px;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
  width: 400px;
  max-width: 90%;
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

const Title = styled.h2`
  color: rgb(92, 157, 245);
  margin: 0 0 20px;
  font-size: 1.8em;
  text-align: left;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(94, 44, 165, 0.4);
`;

function Analytics() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTradesModal, setShowTradesModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [relatedTrades, setRelatedTrades] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [sections, setSections] = useState({
    pairs: [],
    directions: [],
    sessions: [],
    positionType: []
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [tradesData, pairs, directions, sessions, positionType] = await Promise.all([
          window.electronAPI.getTrades(),
          window.electronAPI.getAllExecutionItems('pairs'),
          window.electronAPI.getAllExecutionItems('directions'),
          window.electronAPI.getAllExecutionItems('sessions'),
          window.electronAPI.getAllExecutionItems('positionType')
        ]);

        setTrades(tradesData);
        setSections({
          pairs: pairs.map(item => item.name),
          directions: directions.map(item => item.name),
          sessions: sessions.map(item => item.name),
          positionType: positionType.map(item => item.name)
        });
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const calculateStats = (itemName, section) => {
    const relevantTrades = trades.filter(trade => {
      switch(section) {
        case 'pairs':
          return trade.pair === itemName;
        case 'directions':
          return trade.direction === itemName;
        case 'sessions':
          return trade.session === itemName;
        case 'positionType':
          return trade.positionType === itemName;
        default:
          return false;
      }
    });

    const totalTrades = relevantTrades.length;
    const winTrades = relevantTrades.filter(trade => trade.result === 'Win').length;
    const lossTrades = relevantTrades.filter(trade => trade.result === 'Loss').length;
    const winrate = totalTrades > 0 ? (winTrades / totalTrades) * 100 : 0;

    return {
      totalTrades,
      winTrades,
      lossTrades,
      winrate: Math.round(winrate)
    };
  };

  const handleItemClick = async (itemName, section) => {
    try {
      const filteredTrades = trades.filter(trade => {
        switch(section) {
          case 'pairs':
            return trade.pair === itemName;
          case 'directions':
            return trade.direction === itemName;
          case 'sessions':
            return trade.session === itemName;
          case 'positionType':
            return trade.positionType === itemName;
          default:
            return false;
        }
      });

      const stats = calculateStats(itemName, section);
      setSelectedItem({ name: itemName, section, stats });
      setRelatedTrades(filteredTrades);
      setShowTradesModal(true);

      // Додаємо автоматичний скрол до центру
      setTimeout(() => {
        const modalElement = document.querySelector('.modal-content');
        if (modalElement) {
          modalElement.scrollIntoView({
            block: 'center'
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error loading related trades:', error);
    }
  };

  const handleAddItem = (section) => {
    setCurrentSection(section);
    setNewItemName('');
    setIsModalOpen(true);

    // Додаємо автоматичний скрол до центру
    setTimeout(() => {
      const modalElement = document.querySelector('.modal-content');
      if (modalElement) {
        modalElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  };

  const handleSaveItem = async () => {
    if (!newItemName.trim()) return;

    try {
      // Зберігаємо новий елемент в базі даних
      await window.electronAPI.addExecutionItem(currentSection, newItemName.trim());

      // Оновлюємо локальний стан
      const updatedSections = { ...sections };
      updatedSections[currentSection] = [...sections[currentSection], newItemName.trim()];
      setSections(updatedSections);
      
      setIsModalOpen(false);
      setNewItemName('');
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const renderSections = () => {
    const leftSections = [];
    const rightSections = [];

    Object.entries(sections).forEach(([sectionName, items]) => {
      const sectionContent = (
        <SectionContainer key={sectionName}>
          <SectionTitle>
            {sectionName === 'pairs' ? 'Pairs' :
             sectionName === 'directions' ? 'Directions' :
             sectionName === 'sessions' ? 'Sessions' :
             sectionName === 'positionType' ? 'Position Type' : sectionName}
          </SectionTitle>
          <ItemsGrid>
            {items.map((item) => {
              const stats = calculateStats(item, sectionName);
              return (
                <ItemCard 
                  key={item}
                  onClick={() => handleItemClick(item, sectionName)}
                >
                  <ItemName>{item}</ItemName>
                  <ItemStats>
                    <StatsRow>
                      <span>{stats.totalTrades} Trades</span>
                      <StatDivider />
                      <StatNumber color="#4CAF50">{stats.winTrades}</StatNumber>
                      <StatDivider />
                      <StatNumber color="#f44336">{stats.lossTrades}</StatNumber>
                    </StatsRow>
                    <WinrateBar winrate={stats.winrate} />
                    <WinrateText>{stats.winrate}% Win Rate</WinrateText>
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

      if (sectionName === 'pairs' || sectionName === 'directions') {
        leftSections.push(sectionContent);
      } else {
        rightSections.push(sectionContent);
      }
    });

    return (
      <>
        <Content>
          <div style={{ gridColumn: '1 / 2', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {leftSections}
          </div>
          <div style={{ gridColumn: '2 / 3', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {rightSections}
          </div>
        </Content>

        {showTradesModal && selectedItem && (
          <Modal onClick={() => setShowTradesModal(false)}>
            <ModalContent className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 style={{ color: '#fff', margin: '0 0 20px', fontSize: '1.5em', textAlign: 'center' }}>
                {selectedItem.name}
              </h2>
              
              <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
                <ItemStats>
                  <StatsRow>
                    <span>{selectedItem.stats.totalTrades} Trades</span>
                    <StatDivider />
                    <StatNumber color="#4CAF50">{selectedItem.stats.winTrades}</StatNumber>
                    <StatDivider />
                    <StatNumber color="#f44336">{selectedItem.stats.lossTrades}</StatNumber>
                  </StatsRow>
                  <WinrateBar winrate={selectedItem.stats.winrate} />
                  <WinrateText>{selectedItem.stats.winrate}% Win Rate</WinrateText>
                </ItemStats>
              </div>

              <h3 style={{ color: '#fff', margin: '20px 0 10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px' }}>
                Related Trades
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {relatedTrades.length > 0 ? (
                  relatedTrades.map(trade => (
                    <Link
                      key={trade.id}
                      to={`/trade/${trade.id}`}
                      style={{
                        background: '#1a1a1a',
                        padding: '15px',
                        borderRadius: '10px',
                        border: '1px solid #5e2ca5',
                        color: 'white',
                        textDecoration: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', color: '#b886ee' }}>#{trade.no}</span>
                        <span style={{ color: '#888' }}>{new Date(trade.date).toLocaleDateString()}</span>
                      </div>
                      <span style={{
                        padding: '5px 10px',
                        borderRadius: '5px',
                        backgroundColor: trade.result === 'Win' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                        color: trade.result === 'Win' ? '#4caf50' : '#f44336'
                      }}>
                        {trade.result}
                      </span>
                    </Link>
                  ))
                ) : (
                  <p style={{ color: '#888', textAlign: 'center', margin: '20px 0' }}>
                    No trades found
                  </p>
                )}
              </div>
            </ModalContent>
          </Modal>
        )}

        {isModalOpen && (
          <Modal onClick={() => setIsModalOpen(false)}>
            <ModalContent className="modal-content" onClick={e => e.stopPropagation()}>
              <Title>Add new {currentSection}</Title>
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
      </>
    );
  };

  return (
    <AnalyticsContainer>
      <Header>
        <BackButton to="/statistics" />
        <PageTitle>Analytics</PageTitle>
      </Header>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <span style={{ color: '#fff' }}>Loading...</span>
        </div>
      ) : (
        renderSections()
      )}
    </AnalyticsContainer>
  );
}

export default Analytics;