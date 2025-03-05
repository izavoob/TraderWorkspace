import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import deleteIcon from '../../assets/icons/delete-icon.svg';

const ExecutionContainer = styled.div`
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
  margin: 0 0 auto;
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

  const calculateStats = (itemName, sectionName) => {
    const relevantTrades = trades.filter(trade => {
      if (sectionName === 'volumeConfirmation') {
        // Для volumeConfirmation перевіряємо, чи містить рядок цей елемент
        return trade.volumeConfirmation && trade.volumeConfirmation.includes(itemName);
      }
      return trade[sectionName] === itemName;
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
                <ItemCard key={item.id}>
                  <ItemName>{item.name}</ItemName>
                  <DeleteButton onClick={(e) => handleDeleteItem(sectionName, item.id, e)}>×</DeleteButton>
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
        <div style={{ gridColumn: '1 / 2', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {leftSections}
        </div>
        <div style={{ gridColumn: '2 / 3', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {rightSections}
        </div>
      </>
    );
  };

  return (
    <ExecutionContainer>
      <Header>
        <BackButton to="/statistics" />
        <PageTitle>Execution Database</PageTitle>
      </Header>

      <Content>
        {renderSections()}
      </Content>

      {isModalOpen && (
        <Modal>
          <ModalContent>
            <h2>Add New {sectionTitles[currentSection]}</h2>
            <Input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Enter name"
              autoFocus
            />
            <ButtonGroup>
              <Button className="cancel" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button className="save" onClick={handleSaveItem}>
                Save
              </Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </ExecutionContainer>
  );
}

export default Execution; 