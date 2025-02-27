import React from 'react';
import GalleryItem from './GalleryItem.jsx';
import styled from 'styled-components';

const Header = styled.header`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  padding: 20px;
  border-radius: 0 0 10px 10px;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 128px;
  min-height: 6.67vh;
  max-height: 128px;
`;

const Greeting = styled.h1`
  margin: 0;
  font-size: 2.5em;
  color: #fff;
`;

const WorkPhrase = styled.p`
  color: #ff8c00;
  margin-top: 10px;
  font-size: 1.2em;
`;

const Gallery = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 30px;
  margin-top: 168px;
  padding: 20px;
  width: 100%;
  overflow-x: hidden; /* Прибираємо горизонтальний скролінг */
`;

function Home() {
  const galleryItems = [
    { title: 'Trading Journal', path: '/trade-journal', description: 'Analyze your future trades in one place using our advanced tools and indicators.' },
    { title: 'Daily Routine', path: '/daily-routine', description: 'Add your daily thoughts and plans.' },
    { title: 'Performance Analysis', path: '/performance-analysis', description: 'Explore and improve your skills.' },
    { title: 'Statistics', path: '/statistics', description: 'All information about your trading.' },
    { title: 'Risk Management', path: '/risk-management', description: 'Save your deposit.' },
    { title: 'Reporting System', path: '/reporting-system', description: 'Get detailed reports.' },
    { title: 'Learning Section', path: '/learning-section', description: 'Learn new skills.' },
    { title: 'Settings', path: '/settings', description: 'Make using app comfortable.' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return 'Good Morning!';
    if (hour >= 11 && hour < 17) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  return (
    <>
      <Header>
        <Greeting>{getGreeting()}</Greeting>
        <WorkPhrase>Let's get to work!</WorkPhrase>
      </Header>
      <Gallery>
        {galleryItems.map((item) => (
          <GalleryItem key={item.path} title={item.title} path={item.path} description={item.description} />
        ))}
      </Gallery>
    </>
  );
}

export default Home;