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

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
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
  max-width: 850px;
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
  z-index: 1001;
  
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

const GradientBorder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #7425C9, #B886EE, #7425C9);
  background-size: 200% 100%;
  animation: ${gradientFlow} 3s linear infinite;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
`;

const ModalHeader = styled.div`
  position: relative;
  padding: 28px 32px 20px;
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
    animation: ${gradientFlow} 3s linear infinite;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
  }
`;

const Title = styled.h2`
  color: #fff;
  margin: 0;
  font-size: 1.9rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  background: linear-gradient(90deg, #B886EE, #7425C9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.5px;
  padding-bottom: 5px;
`;

const Subtitle = styled.p`
  color: #B886EE;
  text-align: center;
  font-size: 0.9rem;
  margin: 8px 0 0 0;
  opacity: 0.8;
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
  gap: 32px;
  padding: 32px;
  color: #F0F0F0;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  background: rgba(30, 30, 35, 0.4);
  border-radius: 16px;
  border: 1px solid rgba(94, 44, 165, 0.15);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    border-color: rgba(94, 44, 165, 0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.accentColor || '#7425C9'};
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 5px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1.3em;
  color: #F0F0F0;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &::before {
    content: ${props => props.icon || '""'};
    font-size: 1.1em;
  }
`;

const SectionDescription = styled.p`
  font-size: 0.9em;
  color: #AAA;
  margin: 8px 0 0 0;
  font-style: italic;
  line-height: 1.5;
`;

const inputStyles = css`
  padding: 16px;
  border-radius: 12px;
  background: rgba(20, 20, 25, 0.7);
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

const DateContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  background: rgba(20, 20, 25, 0.5);
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid rgba(94, 44, 165, 0.15);
`;

const DateIcon = styled.span`
  font-size: 1.5em;
  color: #B886EE;
`;

const StyledDateInput = styled(Input)`
  flex: 1;
  cursor: pointer;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 8px;
  
  &:focus {
    box-shadow: none;
  }
  
  &::-webkit-calendar-picker-indicator {
    filter: invert(0.7) sepia(100%) saturate(10000%) hue-rotate(240deg);
    cursor: pointer;
  }
`;

const RatingContainer = styled.div`
  margin-top: 20px;
  background: rgba(15, 15, 20, 0.4);
  padding: 15px;
  border-radius: 12px;
  border: 1px solid rgba(94, 44, 165, 0.1);
`;

const RatingTitle = styled.div`
  font-size: 0.95em;
  color: #CCC;
  margin-bottom: 12px;
  text-align: center;
  font-weight: 500;
`;

const RatingScale = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 0 10px;
`;

const ScaleLabel = styled.span`
  font-size: 0.75em;
  color: #888;
`;

const RatingGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before, &::after {
    content: '';
    position: absolute;
    height: 1px;
    bottom: -8px;
    background: linear-gradient(90deg, transparent, rgba(94, 44, 165, 0.3), transparent);
    width: 100%;
    pointer-events: none;
  }
`;

const RatingButton = styled.button`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: ${props => props.selected ? 'none' : '1px solid rgba(94, 44, 165, 0.3)'};
  background: ${props => {
    if (props.selected) {
      const value = props.value;
      if (value >= 4) return 'linear-gradient(145deg, #4caf50, #45a049)';
      if (value >= 3) return 'linear-gradient(145deg, #ff9800, #f57c00)';
      return 'linear-gradient(145deg, #f44336, #e53935)';
    }
    return 'rgba(20, 20, 25, 0.5)';
  }};
  color: ${props => props.selected ? '#fff' : '#888'};
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.selected ? '0 4px 8px rgba(0, 0, 0, 0.3)' : 'none'};
  transform: ${props => props.selected ? 'scale(1.15)' : 'scale(1)'};
  animation: ${props => props.selected ? pulse : 'none'} 1s ease-in-out;
  
  &:hover {
    transform: ${props => props.selected ? 'scale(1.15)' : 'scale(1.05)'};
    background: ${props => {
    if (props.selected) {
      const value = props.value;
      if (value >= 4) return 'linear-gradient(145deg, #4caf50, #45a049)';
      if (value >= 3) return 'linear-gradient(145deg, #ff9800, #f57c00)';
      return 'linear-gradient(145deg, #f44336, #e53935)';
    }
    return 'rgba(30, 30, 35, 0.7)';
  }};
    border-color: rgba(94, 44, 165, 0.5);
  }
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

const PostSessionBadge = styled.div`
  margin-top: 10px;
  background: rgba(94, 44, 165, 0.1);
  border: 1px solid rgba(94, 44, 165, 0.3);
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 0.9em;
  color: #ccc;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:before {
    content: "📎";
    font-size: 1.1em;
  }
`;

const STERModal = ({ isOpen, onClose, onSave, assessment = null, postSessionId = null, postSessionInfo = null }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    situation: '',
    thoughts: '',
    emotions: '',
    reaction: '',
    situationRating: 0,
    thoughtsRating: 0,
    emotionsRating: 0,
    reactionRating: 0,
    postSessionId: null,
    tags: null
  });

  useEffect(() => {
    if (assessment) {
      setFormData({
        date: assessment.date || new Date().toISOString().split('T')[0],
        situation: assessment.situation || '',
        thoughts: assessment.thoughts || '',
        emotions: assessment.emotions || '',
        reaction: assessment.reaction || '',
        situationRating: parseInt(assessment.situationRating) || 0,
        thoughtsRating: parseInt(assessment.thoughtsRating) || 0,
        emotionsRating: parseInt(assessment.emotionsRating) || 0,
        reactionRating: parseInt(assessment.reactionRating) || 0,
        postSessionId: assessment.post_session_id || null,
        tags: assessment.tags || null
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        situation: '',
        thoughts: '',
        emotions: '',
        reaction: '',
        situationRating: 0,
        thoughtsRating: 0,
        emotionsRating: 0,
        reactionRating: 0,
        postSessionId: postSessionId,
        tags: postSessionId ? 'postsession' : null
      });
    }
  }, [assessment, postSessionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRating = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <GradientBorder />
        <ModalHeader>
          <Title>{assessment ? 'Edit STER Assessment' : 'New STER Assessment'}</Title>
          <Subtitle>Analyze your situations, thoughts, emotions and reactions</Subtitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <Form onSubmit={handleSubmit}>
          <DateContainer>
            <DateIcon>📅</DateIcon>
            <StyledDateInput
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </DateContainer>

          {(assessment?.post_session_id || postSessionId) && postSessionInfo && (
            <PostSessionBadge>
              Linked to Post Session: {postSessionInfo.date} • {postSessionInfo.pair}
            </PostSessionBadge>
          )}

          <FormSection accentColor="#5e2ca5">
            <SectionHeader>
              <SectionTitle icon='"🔍"'>Situation (What happened?)</SectionTitle>
              <SectionDescription>Describe the specific trading scenario or event that triggered your reaction</SectionDescription>
            </SectionHeader>
            <TextArea
              name="situation"
              value={formData.situation}
              onChange={handleChange}
              placeholder="Describe the trading situation in detail..."
            />
            <RatingContainer>
              <RatingTitle>How well did you handle this situation? (1-5)</RatingTitle>
              <RatingScale>
                <ScaleLabel>Poor</ScaleLabel>
                <ScaleLabel>Excellent</ScaleLabel>
              </RatingScale>
              <RatingGroup>
                {[1, 2, 3, 4, 5].map(rating => (
                  <RatingButton
                    key={rating}
                    type="button"
                    value={rating}
                    selected={formData.situationRating === rating}
                    onClick={() => handleRating('situationRating', rating)}
                  >
                    {rating}
                  </RatingButton>
                ))}
              </RatingGroup>
            </RatingContainer>
          </FormSection>

          <FormSection accentColor="#6a3dcf">
            <SectionHeader>
              <SectionTitle icon='"💭"'>Thoughts (What were you thinking?)</SectionTitle>
              <SectionDescription>Record your internal dialogue and beliefs during the situation</SectionDescription>
            </SectionHeader>
            <TextArea
              name="thoughts"
              value={formData.thoughts}
              onChange={handleChange}
              placeholder="What thoughts were going through your mind..."
            />
            <RatingContainer>
              <RatingTitle>How constructive were your thoughts? (1-5)</RatingTitle>
              <RatingScale>
                <ScaleLabel>Destructive</ScaleLabel>
                <ScaleLabel>Constructive</ScaleLabel>
              </RatingScale>
              <RatingGroup>
                {[1, 2, 3, 4, 5].map(rating => (
                  <RatingButton
                    key={rating}
                    type="button"
                    value={rating}
                    selected={formData.thoughtsRating === rating}
                    onClick={() => handleRating('thoughtsRating', rating)}
                  >
                    {rating}
                  </RatingButton>
                ))}
              </RatingGroup>
            </RatingContainer>
          </FormSection>

          <FormSection accentColor="#7849ea">
            <SectionHeader>
              <SectionTitle icon='"😔"'>Emotions (How did you feel?)</SectionTitle>
              <SectionDescription>Identify the emotions that arose during the trading event</SectionDescription>
            </SectionHeader>
            <TextArea
              name="emotions"
              value={formData.emotions}
              onChange={handleChange}
              placeholder="What emotions did you experience and how intense were they..."
            />
            <RatingContainer>
              <RatingTitle>How well did you manage your emotions? (1-5)</RatingTitle>
              <RatingScale>
                <ScaleLabel>Poorly</ScaleLabel>
                <ScaleLabel>Well</ScaleLabel>
              </RatingScale>
              <RatingGroup>
                {[1, 2, 3, 4, 5].map(rating => (
                  <RatingButton
                    key={rating}
                    type="button"
                    value={rating}
                    selected={formData.emotionsRating === rating}
                    onClick={() => handleRating('emotionsRating', rating)}
                  >
                    {rating}
                  </RatingButton>
                ))}
              </RatingGroup>
            </RatingContainer>
          </FormSection>

          <FormSection accentColor="#9a54ff">
            <SectionHeader>
              <SectionTitle icon='"⚡"'>Reaction (What did you do?)</SectionTitle>
              <SectionDescription>Describe your resulting actions and trading decisions</SectionDescription>
            </SectionHeader>
            <TextArea
              name="reaction"
              value={formData.reaction}
              onChange={handleChange}
              placeholder="How did you respond to the situation..."
            />
            <RatingContainer>
              <RatingTitle>How appropriate was your reaction? (1-5)</RatingTitle>
              <RatingScale>
                <ScaleLabel>Ineffective</ScaleLabel>
                <ScaleLabel>Effective</ScaleLabel>
              </RatingScale>
              <RatingGroup>
                {[1, 2, 3, 4, 5].map(rating => (
                  <RatingButton
                    key={rating}
                    type="button"
                    value={rating}
                    selected={formData.reactionRating === rating}
                    onClick={() => handleRating('reactionRating', rating)}
                  >
                    {rating}
                  </RatingButton>
                ))}
              </RatingGroup>
            </RatingContainer>
          </FormSection>

          <ButtonGroup>
            <Button type="button" className="cancel" onClick={onClose}>
              <ButtonContent>
                <ButtonIcon>✕</ButtonIcon>
                Cancel
              </ButtonContent>
            </Button>
            <Button type="submit" className="save">
              <ButtonContent>
                <ButtonIcon>{assessment ? '✓' : '💾'}</ButtonIcon>
                {assessment ? 'Update Assessment' : 'Save Assessment'}
              </ButtonContent>
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default STERModal; 