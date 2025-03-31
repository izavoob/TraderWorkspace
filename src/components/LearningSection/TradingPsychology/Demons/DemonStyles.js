import styled, { keyframes, css } from 'styled-components';

// Анимации
export const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

// Общие стили для секций
export const Section = styled.div`
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

export const SectionTitle = styled.h3`
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
export const InfoBlock = styled.div`
  background: rgba(94, 44, 165, 0.05);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  border-left: 4px solid #7425C9;
`;

export const InfoTitle = styled.h4`
  color: #ff9d2f;
  margin: 0 0 8px 0;
  font-size: 1.1em;
`;

export const InfoText = styled.p`
  color: #ccc;
  margin: 0;
  font-size: 0.95em;
  line-height: 1.5;
`;

// Стили для кнопки добавления
export const AddButton = styled.button`
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

export const AddIcon = styled.div`
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

export const AddText = styled.span`
  color: #fff;
  font-size: 1.3em;
  font-weight: 500;
  letter-spacing: 0.5px;
  z-index: 2;
`;

// Экспортируем другие общие стили... 