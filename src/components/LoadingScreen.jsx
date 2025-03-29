import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { gsap } from 'gsap';

// Глобальні стилі для екрану завантаження
const LoadingGlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #121212;
  }
  
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
`;

// Контейнер для екрану завантаження
const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #121212;
  z-index: 9999;
`;

// Контейнер для анімації
const AnimationContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

// Стилізований SVG контейнер
const StyledSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: visible;
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Текст логотипу
const LogoText = styled.div`
  position: absolute;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 64px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 3px;
  z-index: 100;
  top: 35%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  pointer-events: none;
  background: linear-gradient(45deg, #7425C9, #9355D9, #B886EE, #9355D9, #7425C9);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  color: transparent;
  animation: ${gradientAnimation} 5s ease infinite;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

// Горизонтальна лінія для трансформації
const HorizontalLine = styled.div`
  position: absolute;
  height: 4px;
  background: linear-gradient(90deg, #5e2ca5, #7425C9);
  border-radius: 2px;
  opacity: 0;
  z-index: 50;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 15px rgba(94, 44, 165, 0.8);
`;

// Стилі для групи свічок з анімацією переходу
const CandleGroup = styled.g`
  transition: transform 2s cubic-bezier(0.4, 0, 0.2, 1);
`;

const LoadingScreen = () => {
  const svgRef = useRef(null);
  const horizontalLineRef = useRef(null);
  const logoTextRef = useRef(null);
  const [candleOffsets, setCandleOffsets] = useState([]);
  
  // Функція для генерації випадкових зміщень для свічок
  const generateRandomOffsets = () => {
    const offsets = [];
    let prevOffset = 0;
    
    for (let i = 0; i < 35; i++) {
      // Генеруємо випадкове зміщення від -60 до 60, але з урахуванням попереднього значення
      // щоб уникнути різких перепадів
      const randomOffset = Math.max(
        -60,
        Math.min(
          60,
          prevOffset + (Math.random() - 0.5) * 70
        )
      );
      offsets.push(randomOffset);
      prevOffset = randomOffset;
    }
    return offsets;
  };

  // Генеруємо нові зміщення кожні 2 секунди
  useEffect(() => {
    setCandleOffsets(generateRandomOffsets());
    
    const interval = setInterval(() => {
      setCandleOffsets(generateRandomOffsets());
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Створюємо часову лінію для анімації
    const timeline = gsap.timeline({
      onComplete: () => {
       
      }
    });
    
    // Анімація сітки - швидша на 70%
    timeline.from('.grid-line', {
      scale: 0,
      opacity: 1,
      duration: 0.24,
      stagger: 0.006,
      transformOrigin: 'center',
      ease: 'power2.out'
    });
    
    // Анімація свічок - швидша на 70%
    timeline.from('.candle-body', {
      height: 0,
      opacity: 1,
      duration: 0.3,
      stagger: 0.03,
      transformOrigin: 'bottom',
      ease: 'power1.out'
    }, '-=0.09');
    
    // Анімація вікнів свічок - швидша на 70%
    timeline.from('.candle-wick', {
      height: 0,
      opacity: 1,
      duration: 0.24,
      stagger: 0.03,
      transformOrigin: 'bottom',
      ease: 'power1.out'
    }, '-=0.24');
    
    // Додаємо світіння до свічок - швидша на 70%
    timeline.to('.candle-body', {
      filter: 'drop-shadow(0 0 5px #5e2ca5)',
      duration: 0.15,
      stagger: 0.015
    }, '-=0.15');
    
    // Додаємо логування для відстеження прогресу анімації
    timeline.eventCallback("onUpdate", () => {
    });
    
    return () => {
      // Очищення анімації при розмонтуванні компонента
      timeline.kill();
    };
  }, []);
  
  return (
    <>
      <LoadingGlobalStyle />
      <LoadingContainer>
        <AnimationContainer>
          <StyledSVG ref={svgRef} viewBox="0 0 1000 600" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Сітка - горизонтальні лінії */}
            {Array.from({ length: 20 }).map((_, i) => (
              <line 
                key={`h-${i}`}
                className="grid-line"
                x1="0" 
                y1={i * 30} 
                x2="1000" 
                y2={i * 30} 
                stroke="#333333" 
                strokeWidth="1"
              />
            ))}
            
            {/* Сітка - вертикальні лінії */}
            {Array.from({ length: 30 }).map((_, i) => (
              <line 
                key={`v-${i}`}
                className="grid-line"
                x1={i * 33.33} 
                y1="0" 
                x2={i * 33.33} 
                y2="600" 
                stroke="#333333" 
                strokeWidth="1"
              />
            ))}
            
            {/* Свічки - розташовані нижче центру екрану */}
            <g transform="translate(25, 350)">
              {Array.from({ length: 35 }).map((_, index) => (
                <CandleGroup 
                  key={`candle-${index}`} 
                  className="candle-group" 
                  transform={`translate(${index * 27}, ${candleOffsets[index] || 0})`}
                >
                  <rect 
                    className="candle-body" 
                    x="0" 
                    y={index % 2 === 0 ? "-10" : "10"} 
                    width="15" 
                    height={index % 2 === 0 ? "70" : "50"} 
                    fill={index % 3 === 0 ? "#2ca55e" : "#a52c2c"} 
                    rx="2" 
                  />
                  <line 
                    className="candle-wick" 
                    x1="7.5" 
                    y1={index % 2 === 0 ? "-25" : "-5"} 
                    x2="7.5" 
                    y2={index % 2 === 0 ? "-10" : "10"} 
                    stroke={index % 3 === 0 ? "#2ca55e" : "#a52c2c"} 
                    strokeWidth="2" 
                  />
                  <line 
                    className="candle-wick" 
                    x1="7.5" 
                    y1={index % 2 === 0 ? "60" : "60"} 
                    x2="7.5" 
                    y2={index % 2 === 0 ? "75" : "70"} 
                    stroke={index % 3 === 0 ? "#2ca55e" : "#a52c2c"} 
                    strokeWidth="2" 
                  />
                </CandleGroup>
              ))}
            </g>
          </StyledSVG>
          
          <HorizontalLine ref={horizontalLineRef} />
          <LogoText ref={logoTextRef}>
            Trading Workspace
          </LogoText>
        </AnimationContainer>
      </LoadingContainer>
    </>
  );
};

export default LoadingScreen;
