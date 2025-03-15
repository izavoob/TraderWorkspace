import React, { useEffect, useState, useRef } from 'react';
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
`;

// Анімації
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const fadeInText = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Стилізовані компоненти
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #121212;
  position: relative;
  overflow: hidden;
`;

const BackgroundCrystals = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.3;
`;

const CrystalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
`;

const Crystal = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: linear-gradient(45deg, #7425C9, #B886EE, #7425C9);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 3s ease infinite;
  box-shadow: 0 0 ${props => props.size / 2}px rgba(116, 37, 201, 0.7);
  opacity: 0.8;
  clip-path: polygon(
    ${props => 50 + props.variation1}% 0%, 
    ${props => 100 - props.variation2}% ${props => 50 - props.variation3}%, 
    ${props => 50 + props.variation4}% 100%, 
    ${props => 0 + props.variation5}% ${props => 50 + props.variation6}%
  );
  will-change: transform, opacity;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.5),
      transparent
    );
    background-size: 200% 100%;
    animation: ${shimmer} 2s infinite;
    clip-path: inherit;
  }
`;

const FadeOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  opacity: 0;
  z-index: 50;
  pointer-events: none;
`;

const Title = styled.h1`
  position: absolute;
  font-size: 80px;
  text-align: center;
  z-index: 10;
  opacity: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  background: linear-gradient(45deg, #7425C9, #B886EE);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${fadeInText} 0.5s ease forwards;
  animation-delay: 0.8s;
  font-family: Arial, sans-serif;
  font-weight: bold;
  letter-spacing: 1px;
`;

function LoadingScreen({ onComplete }) {
  const [crystals, setCrystals] = useState([]);
  const [backgroundCrystals, setBackgroundCrystals] = useState([]);
  const containerRef = useRef(null);
  const fadeOverlayRef = useRef(null);
  const crystalsRef = useRef([]);
  const backgroundCrystalsRef = useRef([]);
  const titleRef = useRef(null);

  // Функція для кращого створення точок тексту
  const createTextPoints = (text, width, height, fontSize = 60) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    
    // Малюємо текст більшим і товстішим для більшої кількості точок
    ctx.shadowColor = '#7425C9';
    ctx.shadowBlur = 10;
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#7425C9';
    ctx.strokeText(text, width / 2, height / 2);
    ctx.shadowBlur = 0;
    ctx.fillText(text, width / 2, height / 2);
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    const points = [];
    // Зменшуємо крок для більшої детальності
    const step = 8;
    
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        if (data[index + 3] > 0) {
          points.push({
            x: x,
            y: y
          });
        }
      }
    }
    
    // Випадково вибираємо точки, якщо їх забагато
    if (points.length > 200) {
      const shuffled = [...points].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 200);
    }
    
    // Якщо точок мало, створюємо додаткові
    if (points.length < 50) {
      const centerX = width / 2;
      const centerY = height / 2;
      
      for (let i = 0; i < 100; i++) {
        points.push({
          x: centerX + (Math.random() * 200 - 100),
          y: centerY + (Math.random() * 100 - 50)
        });
      }
    }
    
    return points;
  };

  useEffect(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    const textPoints = createTextPoints("Trader Workspace", containerWidth, containerHeight, 80);
    
    const newCrystals = Array.from({ length: 60 }, (_, i) => {
      const point = textPoints[i % textPoints.length];
      return {
        id: i,
        size: Math.random() * 15 + 5,
        x: Math.random() * containerWidth,
        y: Math.random() * containerHeight,
        targetX: point.x,
        targetY: point.y,
        rotation: Math.random() * 360,
        variation1: Math.random() * 20 - 10,
        variation2: Math.random() * 20 - 10,
        variation3: Math.random() * 20 - 10,
        variation4: Math.random() * 20 - 10,
        variation5: Math.random() * 20 - 10,
        variation6: Math.random() * 20 - 10,
      };
    });
    
    const newBackgroundCrystals = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      size: Math.random() * 30 + 15,
      x: Math.random() * containerWidth,
      y: Math.random() * containerHeight,
      rotation: Math.random() * 360,
      variation1: Math.random() * 20 - 10,
      variation2: Math.random() * 20 - 10,
      variation3: Math.random() * 20 - 10,
      variation4: Math.random() * 20 - 10,
      variation5: Math.random() * 20 - 10,
      variation6: Math.random() * 20 - 10,
    }));
    
    setCrystals(newCrystals);
    setBackgroundCrystals(newBackgroundCrystals);
    
    const createTWShape = () => {
      const pointsT = [
        {x: 0.4, y: 0.3}, {x: 0.4, y: 0.7},  // Vertical line
        {x: 0.3, y: 0.3}, {x: 0.5, y: 0.3}   // Horizontal line
      ];
      
      const pointsW = [
        {x: 0.6, y: 0.3}, {x: 0.65, y: 0.7},
        {x: 0.7, y: 0.5}, {x: 0.75, y: 0.7},
        {x: 0.8, y: 0.3}
      ];
      
      return [...pointsT, ...pointsW];
    };

    const animateWaterFlow = () => {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const twPoints = createTWShape();

      crystalsRef.current.forEach((crystal, index) => {
        if (!crystal) return;
        
        // Випадкові параметри руху
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 200;
        const speed = 3 + Math.random() * 3;
        const rotationSpeed = Math.random() * 2 - 1;
        const scaleVariation = 0.1 + Math.random() * 0.2;

        // Випадкова точка для формування TW
        const twPoint = twPoints[index % twPoints.length];
        const targetX = twPoint.x * containerWidth;
        const targetY = twPoint.y * containerHeight;

        try {
          gsap.to(crystal, {
            x: `+=${Math.cos(angle) * distance}`,
            y: `+=${Math.sin(angle) * distance}`,
            rotation: `+=${rotationSpeed * 360}`,
            scale: 1 + scaleVariation,
            duration: speed,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            onRepeat: () => {
              // Поступово рухаємо кристали до позицій TW
              gsap.to(crystal, {
                x: targetX,
                y: targetY,
                duration: 2,
                ease: "power2.out"
              });
            },
            modifiers: {
              x: (x) => {
                const crystalWidth = crystal.offsetWidth;
                return Math.max(-crystalWidth, Math.min(containerWidth + crystalWidth, x));
              },
              y: (y) => {
                const crystalHeight = crystal.offsetHeight;
                return Math.max(-crystalHeight, Math.min(containerHeight + crystalHeight, y));
              }
            }
          });
        } catch (error) {
          console.warn('Помилка анімації:', error);
        }
      });
    
    backgroundCrystalsRef.current.forEach((crystal) => {
      if (!crystal) return;
      
      // Повільніший, більш тонкий рух для фонових кристалів
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 100;
      const speed = 5 + Math.random() * 3;
      const rotationSpeed = Math.random() * 0.5 - 0.25;

      try {
        gsap.to(crystal, {
          x: `+=${Math.cos(angle) * distance}`,
          y: `+=${Math.sin(angle) * distance}`,
          rotation: `+=${rotationSpeed * 360}`,
          duration: speed,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          modifiers: {
            x: (x) => {
              const crystalWidth = crystal.offsetWidth;
              return Math.max(-crystalWidth, Math.min(containerWidth + crystalWidth, x));
            },
            y: (y) => {
              const crystalHeight = crystal.offsetHeight;
              return Math.max(-crystalHeight, Math.min(containerHeight + crystalHeight, y));
            }
          }
        });
      } catch (error) {
        console.warn('Помилка анімації:', error);
      }
    });
  };
    
    animateWaterFlow();
    
    // Збираємо кристали у форму тексту
    crystalsRef.current.forEach((crystal, index) => {
      if (!crystal) return;
      
      try {
        gsap.to(crystal, {
          x: newCrystals[index].targetX,
          y: newCrystals[index].targetY,
          rotation: 0,
          duration: 1.5,
          ease: "power2.out",
          delay: Math.random() * 0.3
        });
      } catch (error) {
        console.warn('Помилка анімації:', error);
      }
    });
    
    // Запускаємо фінальну анімацію
    const timeline = gsap.timeline({
      delay: 1.5,
      onComplete: () => {
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }
    });

    // Світіння кристалів
    timeline.to(crystalsRef.current, {
      scale: 1.5,
      opacity: 1,
      boxShadow: "0 0 30px rgba(116, 37, 201, 1)",
      duration: 0.3,
      stagger: { amount: 0.2 }
    });

    // Вибух кристалів
    timeline.to(crystalsRef.current, {
      x: (i, target) => {
        const angle = Math.random() * Math.PI * 2;
        return `+=${Math.cos(angle) * 1000}`;
      },
      y: (i, target) => {
        const angle = Math.random() * Math.PI * 2;
        return `+=${Math.sin(angle) * 1000}`;
      },
      rotation: () => `+=${Math.random() * 720 - 360}`,
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: "power3.out"
    }, "+=0.3");

    // Вибух фонових кристалів
    timeline.to(backgroundCrystalsRef.current, {
      x: (i, target) => {
        const angle = Math.random() * Math.PI * 2;
        return `+=${Math.cos(angle) * 700}`;
      },
      y: (i, target) => {
        const angle = Math.random() * Math.PI * 2;
        return `+=${Math.sin(angle) * 700}`;
      },
      rotation: () => `+=${Math.random() * 720 - 360}`,
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.5");

    // Фінальне затемнення
    timeline.to(fadeOverlayRef.current, {
      opacity: 1,
      duration: 0.2,
      ease: "power2.inOut"
    }, "-=0.3");
    
    return () => {
      timeline.kill();
      gsap.killTweensOf([
        ...crystalsRef.current,
        ...backgroundCrystalsRef.current,
        fadeOverlayRef.current
      ]);
    };
  }, [onComplete]);

  const setCrystalRef = (el, index) => {
    crystalsRef.current[index] = el;
  };

  const setBackgroundCrystalRef = (el, index) => {
    backgroundCrystalsRef.current[index] = el;
  };

  return (
    <>
      <LoadingGlobalStyle />
      <LoadingContainer ref={containerRef}>
        <Title ref={titleRef}>Trader Workspace</Title>
        <BackgroundCrystals>
          {backgroundCrystals.map((crystal, index) => (
            <Crystal
              key={`bg-${crystal.id}`}
              ref={el => setBackgroundCrystalRef(el, index)}
              size={crystal.size}
              x={crystal.x}
              y={crystal.y}
              rotation={crystal.rotation}
              variation1={crystal.variation1}
              variation2={crystal.variation2}
              variation3={crystal.variation3}
              variation4={crystal.variation4}
              variation5={crystal.variation5}
              variation6={crystal.variation6}
              style={{
                transform: `translate3d(${crystal.x}px, ${crystal.y}px, 0) rotate(${crystal.rotation}deg)`
              }}
            />
          ))}
        </BackgroundCrystals>
        
        <CrystalContainer>
          {crystals.map((crystal, index) => (
            <Crystal
              key={crystal.id}
              ref={el => setCrystalRef(el, index)}
              size={crystal.size}
              x={crystal.x}
              y={crystal.y}
              rotation={crystal.rotation}
              variation1={crystal.variation1}
              variation2={crystal.variation2}
              variation3={crystal.variation3}
              variation4={crystal.variation4}
              variation5={crystal.variation5}
              variation6={crystal.variation6}
              style={{
                transform: `translate3d(${crystal.x}px, ${crystal.y}px, 0) rotate(${crystal.rotation}deg)`
              }}
            />
          ))}
        </CrystalContainer>
        
        <FadeOverlay ref={fadeOverlayRef} />
      </LoadingContainer>
    </>
  );
}

export default LoadingScreen;