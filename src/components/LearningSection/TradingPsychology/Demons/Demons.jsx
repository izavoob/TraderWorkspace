import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import DemonModal from './DemonModal.jsx';
import CausesStatistics from './CausesStatistics.jsx';

// Анимации
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

// Базовые стили контейнера и секций
const Container = styled.div`
  max-width: 1820px;
  margin: 0 auto;
  height: 100vh;
  background-color: #1a1a1a;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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

const Title = styled.h1`
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
  margin-top: 128px;
  padding: 20px;
  color: white;
  max-width: 1800px;
  margin-left: auto;
  margin-right: auto;
  overflow-y: auto;
  height: calc(100vh - 148px);
`;

const Description = styled.p`
  color: #ccc;
  font-size: 1.1em;
  line-height: 1.6;
  margin-bottom: 30px;
  text-align: center;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

// Контейнер для размещения секций рядом
const SectionsContainer = styled.div`
  display: flex;
  gap: 25px;
  
  @media (max-width: 1500px) {
    flex-direction: column;
  }
`;

const SectionWrapper = styled.div`
  flex: 1;
  min-width: 0; // Важно для корректного поведения flexbox с overflow
  animation: ${fadeIn} 0.6s ease-out;
  
  &:nth-child(2) {
    @media (max-width: 1500px) {
      margin-top: 20px;
    }
  }
`;

// Общие стили для секций
const Section = styled.div`
  background: #2a2a2a;
  border-radius: 18px;
  padding: 28px;
  margin-bottom: 30px;
  border: 1px solid #5e2ca5;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  height: 100%;
  
  &:hover {
    box-shadow: 0 15px 30px rgba(94, 44, 165, 0.2);
  }
`;

const SectionTitle = styled.h3`
  color: #8a57de;
  margin-bottom: 24px;
  font-size: 1.6em;
  text-align: center;
  border-bottom: 2px solid #5e2ca5;
  padding-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 600;
  background: linear-gradient(90deg, #7425C9, #B886EE);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${gradientAnimation} 6s ease infinite;
  background-size: 200% 200%;
`;

// Информационный блок
const InfoBlock = styled.div`
  background: rgba(94, 44, 165, 0.05);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  border-left: 4px solid #7425C9;
`;

const InfoTitle = styled.h4`
  color: #ff9d2f;
  margin: 0 0 8px 0;
  font-size: 1.1em;
`;

const InfoText = styled.p`
  color: #ccc;
  margin: 0;
  font-size: 0.95em;
  line-height: 1.5;
`;

// Стили для кнопки добавления
const AddButton = styled.button`
  background: rgba(94, 44, 165, 0.1);
  border: 2px dashed #7b42d8;
  border-radius: 18px;
  padding: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin-bottom: 25px;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(94, 44, 165, 0), rgba(94, 44, 165, 0.1), rgba(94, 44, 165, 0));
    background-size: 200% 100%;
    animation: ${shimmer} 3s infinite;
    z-index: 1;
  }

  &:hover {
    background: rgba(94, 44, 165, 0.15);
    transform: translateY(-3px);
    box-shadow: 0 7px 14px rgba(0, 0, 0, 0.2);
    border-color: #9747FF;
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const AddIcon = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7425c9, #b886ee);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: white;
  margin-right: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 2;
  
  ${AddButton}:hover & {
    animation: ${pulse} 1s infinite;
  }
`;

const AddText = styled.span`
  color: #fff;
  font-size: 1.3em;
  font-weight: 500;
  letter-spacing: 0.5px;
  z-index: 2;
`;

// Стили для категорий
const CategoryFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const CategoryButton = styled.button`
  background: ${props => props.active ? 'rgba(94, 44, 165, 0.8)' : 'rgba(94, 44, 165, 0.1)'};
  color: #fff;
  border: 1px solid #5e2ca5;
  border-radius: 20px;
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95em;
  letter-spacing: 0.5px;
  
  &:hover {
    background: rgba(94, 44, 165, 0.5);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Стили для списка демонов
const DemonList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

// Сначала определяем DemonCard
const DemonCard = styled.div`
  background: rgba(94, 44, 165, 0.08);
  border: 1px solid rgba(94, 44, 165, 0.4);
  border-radius: 14px;
  padding: 22px;
  padding-top: 28px;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  position: relative;
  animation: ${fadeIn} 0.4s ease-out;
  animation-fill-mode: both;
  animation-delay: ${props => props.index * 0.05}s;
  
  &:hover {
    background: rgba(94, 44, 165, 0.12);
    transform: translateY(-3px) scale(1.01);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    border-color: rgba(94, 44, 165, 0.6);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 14px;
    box-shadow: 0 0 0 4px rgba(94, 44, 165, 0);
    transition: box-shadow 0.3s ease;
    pointer-events: none;
  }
  
  &:hover:after {
    box-shadow: 0 0 0 4px rgba(94, 44, 165, 0.3);
  }
`;

// Затем определяем ActionButtons, который будет реагировать на наведение на DemonCard
const ActionButtons = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  z-index: 5;
  opacity: 0;
  transform: translateY(-5px);
  transition: all 0.3s ease;
  
  ${DemonCard}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Определяем общие стили для кнопок действий
const actionButtonStyles = css`
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.1);
    
    &:before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

// Обновляем кнопки с учетом изменений в ActionButtons
const EditButton = styled.button`
  ${actionButtonStyles}
  color: #90caf9;
  border-color: rgba(33, 150, 243, 0.3);
  
  &:hover {
    box-shadow: 0 0 12px rgba(33, 150, 243, 0.5);
    border-color: rgba(33, 150, 243, 0.5);
  }
`;

const DeleteButton = styled.button`
  ${actionButtonStyles}
  color: #ffab91;
  border-color: rgba(244, 67, 54, 0.3);
  
  &:hover {
    box-shadow: 0 0 12px rgba(244, 67, 54, 0.5);
    border-color: rgba(244, 67, 54, 0.5);
  }
`;

// Обновляем CategoryTag, чтобы не конфликтовал с кнопками
const CategoryTag = styled.div`
  position: absolute;
  top: -10px;
  left: 15px; // Переносим слева для лучшего расположения
  background: linear-gradient(135deg, rgba(94, 44, 165, 0.7), rgba(151, 71, 255, 0.7));
  color: white;
  font-size: 0.75em;
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid rgba(94, 44, 165, 0.6);
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  z-index: 5;
  
  ${DemonCard}:hover & {
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, rgba(94, 44, 165, 0.8), rgba(151, 71, 255, 0.8));
  }
`;

const DemonName = styled.h4`
  color: #ff9d2f;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.2em;
  border-bottom: 1px solid rgba(94, 44, 165, 0.3);
  padding-bottom: 8px;
  padding-right: 30px;
  font-weight: 600;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 50px;
    height: 2px;
    background: linear-gradient(to right, #ff9d2f, transparent);
    border-radius: 1px;
  }
`;

const DemonDescription = styled.p`
  color: #ddd;
  font-size: 0.95em;
  line-height: 1.5;
  margin: 0;
  letter-spacing: 0.2px;
`;

const Solutions = styled.div`
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed rgba(94, 44, 165, 0.3);
`;

const SolutionsTitle = styled.h5`
  color: #ff9d2f;
  margin: 0 0 5px 0;
  font-size: 0.95em;
  font-weight: 600;
`;

const Demons = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [demonsList, setDemonsList] = useState([]);
  const [filteredDemons, setFilteredDemons] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDemon, setSelectedDemon] = useState(null);
  const [categories, setCategories] = useState(['All']);

  const loadDemons = async () => {
    try {
      console.log('Loading trading demons...');
      const demons = await window.electronAPI.getAllDemons();
      console.log('Received demons:', demons);
      setDemonsList(demons || []);
      setFilteredDemons(demons || []);
      
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(demons.map(demon => demon.category))];
      setCategories(uniqueCategories);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading trading demons:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDemons();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredDemons(demonsList);
    } else {
      setFilteredDemons(demonsList.filter(demon => demon.category === selectedCategory));
    }
  }, [selectedCategory, demonsList]);

  const handleAddDemon = () => {
    setSelectedDemon(null);
    setIsModalOpen(true);
  };

  const handleEditDemon = (demon, e) => {
    e.stopPropagation();
    setSelectedDemon(demon);
    setIsModalOpen(true);
  };

  const handleSaveDemon = async (demonData) => {
    try {
      console.log('Saving demon:', demonData);
      
      if (selectedDemon) {
        await window.electronAPI.updateDemon(selectedDemon.id, demonData);
      } else {
        await window.electronAPI.addDemon(demonData);
      }
      
      await loadDemons();
    } catch (error) {
      console.error('Error saving trading demon:', error);
    }
  };

  const handleDeleteDemon = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this trading demon?')) {
      try {
        await window.electronAPI.deleteDemon(id);
        await loadDemons();
      } catch (error) {
        console.error('Error deleting trading demon:', error);
      }
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Header>
        <BackButton to="/learning-section/trading-psychology" title="Back" aria-label="Back" />
        <Title>Trading Demons</Title>
        <Subtitle>Recognize and overcome your psychological barriers</Subtitle>
      </Header>

      <Content>
        <Description>
          Trading psychology is a critical aspect of successful trading. Understanding and addressing
          your psychological barriers is essential for consistent results.
        </Description>

        <SectionsContainer>
          {/* ЛЕВАЯ КОЛОНКА - Каталог демонов */}
          <SectionWrapper>
            <Section>
              <SectionTitle>Trading Demons Catalog</SectionTitle>
              
              <InfoBlock>
                <InfoTitle>What are Trading Demons?</InfoTitle>
                <InfoText>
                  Trading demons are psychological barriers and emotional reactions that prevent you from making
                  rational decisions in trading. Recognizing your demons is the first step toward building stable
                  and profitable trading.
                </InfoText>
              </InfoBlock>
              
              <AddButton onClick={handleAddDemon}>
                <AddIcon>+</AddIcon>
                <AddText>Add New Demon</AddText>
              </AddButton>

              <CategoryFilter>
                {categories.map(category => (
                  <CategoryButton 
                    key={category}
                    active={selectedCategory === category}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </CategoryButton>
                ))}
              </CategoryFilter>

              <DemonList>
                {filteredDemons.map((demon, index) => (
                  <DemonCard key={demon.id} index={index}>
                    <CategoryTag>{demon.category}</CategoryTag>
                    <ActionButtons>
                      <EditButton onClick={(e) => handleEditDemon(demon, e)} title="Edit demon">
                        ✎
                      </EditButton>
                      <DeleteButton onClick={(e) => handleDeleteDemon(demon.id, e)} title="Delete demon">
                        ×
                      </DeleteButton>
                    </ActionButtons>
                    <DemonName>{demon.name}</DemonName>
                    <DemonDescription>{demon.description}</DemonDescription>
                    
                    {demon.solutions && (
                      <Solutions>
                        <SolutionsTitle>Solutions:</SolutionsTitle>
                        <DemonDescription>{demon.solutions}</DemonDescription>
                      </Solutions>
                    )}
                  </DemonCard>
                ))}
              </DemonList>
            </Section>
          </SectionWrapper>

          {/* ПРАВАЯ КОЛОНКА - Статистика причин */}
          <SectionWrapper>
            <CausesStatistics />
          </SectionWrapper>
        </SectionsContainer>
      </Content>

      <DemonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDemon}
        demon={selectedDemon}
      />
    </Container>
  );
};

export default Demons; 