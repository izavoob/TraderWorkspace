import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import DemonModal from './DemonModal.jsx';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

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
  max-width: 1200px;
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
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const DemonSection = styled.div`
  background: #2a2a2a;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  border: 1px solid #5e2ca5;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  color: #5e2ca5;
  margin-bottom: 20px;
  font-size: 1.4em;
  text-align: center;
  border-bottom: 2px solid #5e2ca5;
  padding-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const DemonList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const DemonCard = styled.div`
  background: rgba(94, 44, 165, 0.1);
  border: 1px solid #5e2ca5;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(94, 44, 165, 0.2);
  }
`;

const DemonName = styled.h4`
  color: #ff8c00;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.2em;
  border-bottom: 1px solid rgba(94, 44, 165, 0.3);
  padding-bottom: 5px;
`;

const DemonDescription = styled.p`
  color: #ccc;
  font-size: 1em;
  line-height: 1.5;
  margin: 0;
`;

const AddButton = styled.button`
  background: rgba(94, 44, 165, 0.1);
  border: 2px dashed #5e2ca5;
  border-radius: 15px;
  padding: 20px;
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
  margin-right: 10px;
`;

const AddText = styled.span`
  color: #fff;
  font-size: 1.2em;
`;

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
  
  &:hover {
    background: rgba(94, 44, 165, 0.5);
  }
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

  ${DemonCard}:hover & {
    opacity: 1;
  }
`;

const EditButton = styled.button`
  position: absolute;
  top: 10px;
  right: 40px;
  background: rgba(33, 150, 243, 0.5);
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
    background: rgba(33, 150, 243, 0.8);
    transform: scale(1.1);
  }

  ${DemonCard}:hover & {
    opacity: 1;
  }
`;

const CategoryTag = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(94, 44, 165, 0.2);
  color: #ccc;
  font-size: 0.85em;
  padding: 3px 8px;
  border-radius: 10px;
  border: 1px solid rgba(94, 44, 165, 0.3);
`;

const Solutions = styled.div`
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed rgba(94, 44, 165, 0.3);
`;

const SolutionsTitle = styled.h5`
  color: #ff8c00;
  margin: 0 0 5px 0;
  font-size: 0.9em;
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
          Trading demons are psychological barriers and emotional reactions that prevent you from making
          rational decisions in trading. Recognizing your demons is the first step toward building stable
          and profitable trading.
        </Description>

        <DemonSection>
          <SectionTitle>Trading Demons Catalog</SectionTitle>
          
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
            {filteredDemons.map((demon) => (
              <DemonCard key={demon.id}>
                <CategoryTag>{demon.category}</CategoryTag>
                <EditButton onClick={(e) => handleEditDemon(demon, e)}>
                  ✎
                </EditButton>
                <DeleteButton onClick={(e) => handleDeleteDemon(demon.id, e)}>
                  ×
                </DeleteButton>
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
        </DemonSection>
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