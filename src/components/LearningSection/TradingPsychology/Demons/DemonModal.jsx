import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(116, 37, 201, 0.5); }
  50% { box-shadow: 0 0 20px rgba(116, 37, 201, 0.8); }
  100% { box-shadow: 0 0 5px rgba(116, 37, 201, 0.5); }
`;

const ModalOverlay = styled.div`
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
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
  perspective: 1000px;
`;

const ModalContent = styled.div`
  background: #222;
  padding: 0;
  border-radius: 24px;
  width: 90%;
  max-width: 800px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.8),
    inset 0 -5px 10px rgba(0, 0, 0, 0.2),
    inset 0 5px 10px rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(94, 44, 165, 0.3);
  animation: ${slideUp} 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  transform-origin: center;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(10, 10, 15, 0.1);
    border-radius: 4px;
    margin: 20px 0;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #7425C9, #9747FF);
    border-radius: 4px;
    border: 2px solid #222;
  }
`;

const HeaderGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const ModalHeader = styled.div`
  position: relative;
  padding: 24px 32px;
  border-bottom: 1px solid rgba(94, 44, 165, 0.2);
  position: sticky;
  top: 0;
  z-index: 5;
  background: #222;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, #7425C9, #B886EE, #7425C9);
    background-size: 200% 100%;
    animation: ${HeaderGradient} 3s ease infinite;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
  }
`;

const Title = styled.h2`
  color: #fff;
  margin: 0;
  font-size: 1.8rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  background: linear-gradient(90deg, #B886EE, #7425C9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.5px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(20, 20, 25, 0.4);
  border: none;
  color: #B886EE;
  font-size: 22px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 
    0 3px 6px rgba(0, 0, 0, 0.2),
    inset 0 -2px 2px rgba(0, 0, 0, 0.1),
    inset 0 2px 2px rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: rgba(116, 37, 201, 0.3);
    transform: scale(1.1) rotate(90deg);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 32px;
  color: #F0F0F0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
  }
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const LabelIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: linear-gradient(135deg, #7425C9, #B886EE);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: ${props => props.icon || '"🔍"'};
    font-size: 14px;
  }
`;

const Label = styled.label`
  color: #F0F0F0;
  font-size: 1.1em;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const inputStyles = css`
  padding: 16px;
  border-radius: 12px;
  background: #1a1a1a;
  color: #F0F0F0;
  font-size: 1rem;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  border: 1px solid rgba(94, 44, 165, 0.2);
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.3),
    0 1px 2px rgba(255, 255, 255, 0.05);
  
  &:focus {
    outline: none;
    border-color: #7425C9;
    box-shadow: 
      inset 0 2px 4px rgba(0, 0, 0, 0.3),
      0 0 0 3px rgba(116, 37, 201, 0.2);
    animation: ${glow} 2s infinite;
  }
  
  &::placeholder {
    color: #666;
    opacity: 0.7;
  }
`;

const Input = styled.input`
  ${inputStyles}
`;

const TextArea = styled.textarea`
  ${inputStyles}
  min-height: 130px;
  resize: vertical;
  line-height: 1.5;
`;

const Select = styled.select`
  ${inputStyles}
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%237425C9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
  padding-right: 45px;
  cursor: pointer;
  
  option {
    background: #1a1a1a;
    color: #F0F0F0;
    padding: 10px;
  }
`;

const CategoryTag = styled.div`
  position: absolute;
  top: -10px;
  right: 0;
  font-size: 0.8em;
  padding: 3px 8px;
  border-radius: 20px;
  background: rgba(94, 44, 165, 0.2);
  border: 1px solid rgba(94, 44, 165, 0.3);
  color: #B886EE;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(94, 44, 165, 0.2);
`;

const Button = styled.button`
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.5px;
  
  &.save {
    background: linear-gradient(135deg, #7425C9, #9747FF);
    color: #fff;
    border: none;
    box-shadow: 
      0 4px 15px rgba(116, 37, 201, 0.4),
      inset 0 2px 2px rgba(255, 255, 255, 0.3);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 
        0 6px 20px rgba(116, 37, 201, 0.6),
        inset 0 2px 2px rgba(255, 255, 255, 0.3);
    }
    
    &:active {
      transform: translateY(-1px);
      box-shadow: 
        0 2px 10px rgba(116, 37, 201, 0.4),
        inset 0 2px 2px rgba(255, 255, 255, 0.3);
    }
  }
  
  &.cancel {
    background: rgba(30, 30, 35, 0.7);
    color: #ccc;
    border: 1px solid rgba(80, 80, 80, 0.3);
    box-shadow: 
      0 4px 10px rgba(0, 0, 0, 0.2),
      inset 0 1px 1px rgba(255, 255, 255, 0.1);
    
    &:hover {
      background: rgba(40, 40, 45, 0.8);
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`;

const ButtonContent = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ButtonIcon = styled.span`
  font-size: 1.2em;
`;

const FormHint = styled.span`
  font-size: 0.85em;
  color: #888;
  margin-top: -8px;
  font-style: italic;
`;

const DemonModal = ({ isOpen, onClose, onSave, demon = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    solutions: '',
    category: 'Emotional'
  });

  useEffect(() => {
    if (demon) {
      setFormData({
        name: demon.name || '',
        description: demon.description || '',
        solutions: demon.solutions || '',
        category: demon.category || 'Emotional'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        solutions: '',
        category: 'Emotional'
      });
    }
  }, [demon]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <ModalHeader>
          <Title>{demon ? 'Edit Trading Demon' : 'Add New Trading Demon'}</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <LabelContainer>
              <LabelIcon icon='"✏️"' />
              <Label>Name</Label>
            </LabelContainer>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Give your trading demon a name..."
              required
            />
            <FormHint>Be specific and descriptive with the name</FormHint>
          </FormGroup>

          <FormGroup>
            <LabelContainer>
              <LabelIcon icon='"🏷️"' />
              <Label>Category</Label>
            </LabelContainer>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Emotional">Emotional</option>
              <option value="Psychological">Psychological</option>
              <option value="Discipline">Discipline</option>
              <option value="Risk Management">Risk Management</option>
              <option value="Fear-based">Fear-based</option>
              <option value="Greed-based">Greed-based</option>
              <option value="Self-sabotage">Self-sabotage</option>
              <option value="Cognitive">Cognitive</option>
              <option value="Behavioral">Behavioral</option>
              <option value="Uncategorized">Uncategorized</option>
            </Select>
            <CategoryTag>{formData.category}</CategoryTag>
          </FormGroup>

          <FormGroup>
            <LabelContainer>
              <LabelIcon icon='"📝"' />
              <Label>Description</Label>
            </LabelContainer>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the trading demon, how it manifests, and its impact on trading performance..."
              required
            />
            <FormHint>Include how this demon typically affects your trading decisions</FormHint>
          </FormGroup>

          <FormGroup>
            <LabelContainer>
              <LabelIcon icon='"💡"' />
              <Label>Solutions</Label>
            </LabelContainer>
            <TextArea
              name="solutions"
              value={formData.solutions}
              onChange={handleChange}
              placeholder="Provide strategies and techniques to overcome this trading demon..."
            />
            <FormHint>List specific, actionable steps to combat this demon</FormHint>
          </FormGroup>

          <ButtonGroup>
            <Button type="button" className="cancel" onClick={onClose}>
              <ButtonContent>
                <ButtonIcon>✕</ButtonIcon>
                Cancel
              </ButtonContent>
            </Button>
            <Button type="submit" className="save">
              <ButtonContent>
                <ButtonIcon>{demon ? '✓' : '+'}</ButtonIcon>
                {demon ? 'Update Demon' : 'Save Demon'}
              </ButtonContent>
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DemonModal; 