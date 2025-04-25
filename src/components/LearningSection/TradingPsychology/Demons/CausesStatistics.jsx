import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

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

// Стили компонентов
const Container = styled.div`
  background: #2a2a2a;
  border-radius: 18px;
  padding: 28px;
  margin-bottom: 35px;
  border: 1px solid #5e2ca5;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  
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
  text-align: center;
  background: linear-gradient(90deg, #7425C9, #B886EE);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${gradientAnimation} 6s ease infinite;
  background-size: 200% 200%;
`;

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

const CausesList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
`;

const CauseItem = styled.div`
  background: rgba(94, 44, 165, 0.08);
  border: 1px solid rgba(94, 44, 165, 0.4);
  border-radius: 14px;
  padding: 22px;
  display: flex;
  flex-direction: column;
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

const CauseItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  position: relative;
  padding-right: 100px;
`;

const CauseName = styled.div`
  color: #ff9d2f;
  font-weight: 600;
  font-size: 1.2em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  position: relative;
  padding-left: 8px;
  margin-bottom: 5px;
  text-align: left;
  
  &:before {
    content: '';
    position: absolute;
    left: -2px;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 3px;
    background: linear-gradient(to bottom, #ff9d2f, #ff7b00);
    border-radius: 3px;
  }
`;

const CauseCount = styled.div`
  position: absolute;
  right: 12px;
  top: 0;
  min-width: 45px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9em;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 0 12px;
  border-radius: 14px;
  color: #fff;
  background: ${props => {
    if (props.count === 0) return 'linear-gradient(135deg, #2f2f2f, #3f3f3f)';
    if (props.count <= 2) return 'linear-gradient(135deg, #4caf50, #81c784)';
    if (props.count <= 5) return 'linear-gradient(135deg, #ffc107, #ffd54f)';
    if (props.count <= 8) return 'linear-gradient(135deg, #ff9800, #ffb74d)';
    return 'linear-gradient(135deg, #f44336, #ff5252)';
  }};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.05)
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  ${CauseItem}:hover & {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    
    &:before {
      opacity: 1;
    }
  }
`;

const CauseDescription = styled.div`
  color: #ddd;
  font-size: 0.95em;
  margin-top: 8px;
  line-height: 1.5;
  letter-spacing: 0.2px;
  text-align: left;
  padding-left: 8px;
`;

const CauseSubcategory = styled.div`
  color: #aaa;
  font-size: 0.85em;
  font-style: italic;
  margin-top: 4px;
  padding-left: 8px;
  text-align: left;
`;

const CauseInfo = styled.div`
  flex: 1;
`;

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
  
  ${CauseItem}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

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

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-style: italic;
  font-size: 1.1em;
  background: rgba(94, 44, 165, 0.05);
  border-radius: 14px;
  border: 1px dashed rgba(94, 44, 165, 0.3);
`;

const LoadingState = styled(EmptyState)`
  position: relative;
  overflow: hidden;
  
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: ${shimmer} 1.5s infinite;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: #2d2d2d;
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 550px;
  border: 1px solid #7425C9;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(94, 44, 165, 0.2);
  animation: ${fadeIn} 0.4s ease-out;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #7425C9, #B886EE, #7425C9);
    background-size: 200% 100%;
    animation: ${gradientAnimation} 3s ease infinite;
  }
`;

const ModalTitle = styled.h3`
  color: #ff9d2f;
  margin-top: 0;
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5em;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-align: center;
  position: relative;
  
  &:after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #ff9d2f, #ff7b00);
    margin: 10px auto 0;
    border-radius: 3px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #ddd;
  font-size: 1em;
  font-weight: 500;
  display: flex;
  align-items: center;
  
  &:before {
    content: ${props => props.icon || '""'};
    margin-right: 8px;
    font-size: 1.1em;
  }
`;

const Input = styled.input`
  padding: 14px;
  background: #1e1e1e;
  border: 1px solid rgba(94, 44, 165, 0.4);
  border-radius: 10px;
  color: #fff;
  font-size: 1em;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #7425C9;
    box-shadow: 0 0 0 3px rgba(116, 37, 201, 0.2);
  }
  
  &::placeholder {
    color: #666;
  }
`;

const TextArea = styled.textarea`
  padding: 14px;
  background: #1e1e1e;
  border: 1px solid rgba(94, 44, 165, 0.4);
  border-radius: 10px;
  color: #fff;
  font-size: 1em;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #7425C9;
    box-shadow: 0 0 0 3px rgba(116, 37, 201, 0.2);
  }
  
  &::placeholder {
    color: #666;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 12px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  font-size: 1em;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  
  &.cancel {
    background: rgba(30, 30, 35, 0.7);
    color: #ccc;
    border: 1px solid rgba(80, 80, 80, 0.3);
    
    &:hover {
      background: rgba(40, 40, 45, 0.9);
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  &.save {
    background: linear-gradient(135deg, #7425C9, #9747FF);
    color: #fff;
    border: none;
    box-shadow: 0 4px 10px rgba(116, 37, 201, 0.3);
    
    &:hover {
      filter: brightness(1.1);
      transform: translateY(-2px);
      box-shadow: 0 7px 15px rgba(116, 37, 201, 0.4);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 5px rgba(116, 37, 201, 0.3);
    }
  }
`;

const ButtonIcon = styled.span`
  margin-right: 8px;
  font-size: 1.1em;
`;

// Улучшенный индикатор частоты
const FrequencyIndicator = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(94, 44, 165, 0.08);
  border-radius: 8px;
  margin-top: 15px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(94, 44, 165, 0.15);
`;

const FrequencyBar = styled.div`
  height: 100%;
  background: ${props => {
    if (props.percent === 0) return 'transparent';
    if (props.percent <= 25) return 'linear-gradient(90deg, #4caf50, #81c784)';
    if (props.percent <= 50) return 'linear-gradient(90deg, #ffc107, #ffd54f)';
    if (props.percent <= 75) return 'linear-gradient(90deg, #ff9800, #ffb74d)';
    return 'linear-gradient(90deg, #f44336, #ff5252)';
  }};
  width: ${props => `${Math.min(props.percent, 100)}%`};
  border-radius: inherit;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: ${shimmer} 2s infinite;
    border-radius: inherit;
  }
`;

// Добавляем новый компонент для отображения процентов
const FrequencyPercentage = styled.div`
  position: absolute;
  right: -25px;
  top: -25px;
  font-size: 0.8em;
  color: #aaa;
  opacity: 0;
  transform: translateY(5px);
  transition: all 0.3s ease;
  
  ${CauseItem}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Добавляем стиль для подсказки
const FormHint = styled.div`
  color: #999;
  font-size: 0.85em;
  font-style: italic;
  margin-top: 4px;
  margin-bottom: 4px;
`;

// Добавляем стиль для информационного блока
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

const CausesStatistics = () => {
  const [causes, setCauses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCause, setEditingCause] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const loadCauses = async () => {
    try {
      setIsLoading(true);
      const causesStats = await window.electronAPI.getCausesStatistics();
      setCauses(causesStats);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading causes:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCauses();
  }, []);

  const handleAddCause = () => {
    setEditingCause(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleEditCause = (cause) => {
    setEditingCause(cause);
    setFormData({
      name: cause.name,
      description: cause.description
    });
    setIsModalOpen(true);
  };

  const handleDeleteCause = async (id) => {
    if (window.confirm('Are you sure you want to delete this cause?')) {
      try {
        await window.electronAPI.deleteCause(id);
        await loadCauses();
      } catch (error) {
        console.error('Error deleting cause:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCause) {
        await window.electronAPI.updateCause(editingCause.id, formData);
      } else {
        await window.electronAPI.addCause(formData);
      }
      setIsModalOpen(false);
      await loadCauses();
    } catch (error) {
      console.error('Error saving cause:', error);
    }
  };

  if (isLoading) {
    return <Container><LoadingState>Loading trading demon triggers...</LoadingState></Container>;
  }

  return (
    <Container>
      <SectionTitle>Trigger Causes Statistics</SectionTitle>
      
      <InfoBlock>
        <InfoTitle>What are Trading Demon Triggers?</InfoTitle>
        <InfoText>
          Triggers are conditions, events, or psychological states that activate trading demons. 
          By tracking these causes, you can identify patterns and develop preventive strategies 
          to improve your trading psychology.
        </InfoText>
      </InfoBlock>
      
      <AddButton onClick={handleAddCause}>
        <AddIcon>+</AddIcon>
        <AddText>Add New Trigger Cause</AddText>
      </AddButton>
      
      {causes.length === 0 ? (
        <EmptyState>No trigger causes data available. Add your first cause to track trading demons origins!</EmptyState>
      ) : (
        <CausesList>
          {causes.map((cause, index) => {
            const maxCount = Math.max(...causes.map(c => c.total_count || 0));
            const percent = maxCount > 0 ? (cause.total_count || 0) / maxCount * 100 : 0;
            
            return (
              <CauseItem key={cause.id} index={index}>
                <ActionButtons>
                  <EditButton onClick={() => handleEditCause(cause)} title="Edit cause">✎</EditButton>
                  <DeleteButton onClick={() => handleDeleteCause(cause.id)} title="Delete cause">×</DeleteButton>
                </ActionButtons>
                <CauseItemHeader>
                  <CauseInfo>
                    <CauseName>{cause.name || 'Unnamed Cause'}</CauseName>
                  </CauseInfo>
                  <CauseCount 
                    count={cause.total_count || 0} 
                    title={`Occurrence count: ${cause.total_count || 0}`}
                  >
                    {cause.total_count || 0}
                  </CauseCount>
                </CauseItemHeader>
                
                {cause.description && (
                  <CauseDescription>{cause.description}</CauseDescription>
                )}
                
                <FrequencyIndicator title={`Occurrence frequency: ${percent.toFixed(1)}%`}>
                  <FrequencyBar percent={percent} />
                  <FrequencyPercentage>{percent.toFixed(1)}%</FrequencyPercentage>
                </FrequencyIndicator>
                
                {/* Добавляем индикатор связанных демонов, если необходимо */}
                {cause.relatedDemons && cause.relatedDemons.length > 0 && (
                  <CauseSubcategory>
                    Related demons: {cause.relatedDemons.join(', ')}
                  </CauseSubcategory>
                )}
              </CauseItem>
            );
          })}
        </CausesList>
      )}
      
      {isModalOpen && (
        <ModalOverlay onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <ModalContent>
            <ModalTitle>
              {editingCause ? 'Edit Trigger Cause' : 'Add New Trigger Cause'}
            </ModalTitle>
            <Form onSubmit={handleSubmit}>
              <FormField>
                <Label htmlFor="name" icon="'📋'">Cause Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter the trigger cause name"
                  required
                />
                <FormHint>Enter a clear, concise name for this trading demon trigger</FormHint>
              </FormField>
              <FormField>
                <Label htmlFor="description" icon="'📝'">Cause Description</Label>
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe how this cause triggers trading demons"
                />
                <FormHint>Explain how this cause contributes to trading demon manifestation</FormHint>
              </FormField>
              <ButtonGroup>
                <Button 
                  type="button" 
                  className="cancel" 
                  onClick={() => setIsModalOpen(false)}
                >
                  <ButtonIcon>✕</ButtonIcon>
                  Cancel
                </Button>
                <Button type="submit" className="save">
                  <ButtonIcon>{editingCause ? '✓' : '+'}</ButtonIcon>
                  {editingCause ? 'Update' : 'Save'}
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default CausesStatistics; 