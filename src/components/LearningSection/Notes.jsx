import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotesContainer = styled.div`
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

const Title = styled.h1`
  margin: 0 auto;
  font-size: 2.5em;
  color: #fff;
  text-align: center;
  z-index: 1;
`;

const Content = styled.div`
  margin-top: 148px;
  padding: 20px;
  height: calc(100vh - 148px);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const EditorContainer = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
`;

const Sidebar = styled.div`
  width: 300px;
  background: rgba(116, 37, 201, 0.1);
  border-radius: 15px;
  padding: 20px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid #5e2ca5;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(116, 37, 201, 0.5);
    border-radius: 4px;
  }
`;

const MainContent = styled.div`
  flex: 1;
  background: rgba(116, 37, 201, 0.1);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid #5e2ca5;
`;

const NoteItem = styled.div`
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  h3 {
    color: white;
    margin: 0 0 5px 0;
    font-size: 1.1em;
  }

  small {
    color: #888;
    font-size: 0.9em;
  }
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 8px;
  padding: 12px;
  color: white;
  width: 100%;
  margin-bottom: 15px;
  font-size: 1.1em;
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 8px;
  padding: 12px;
  color: white;
  width: 100%;
  flex: 1;
  resize: none;
  font-size: 1em;
  line-height: 1.5;
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  margin-top: 15px;
`;

const Button = styled.button`
  background: conic-gradient(from 45deg, #7425C9, #B886EE);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1em;
  
  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }
  
  &:active {
    transform: scale(0.98);
  }

  ${props => props.danger && `
    background: #ff4444;
  `}
`;

// ... Rest of the component logic remains the same ...

function Notes() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleNewNote = () => {
    setSelectedNote(null);
    setTitle('');
    setContent('');
  };

  const handleSaveNote = () => {
    if (!title.trim()) return;

    const newNote = {
      id: selectedNote?.id || Date.now(),
      title: title.trim(),
      content: content.trim(),
      date: new Date().toISOString()
    };

    if (selectedNote) {
      setNotes(notes.map(note => 
        note.id === selectedNote.id ? newNote : note
      ));
    } else {
      setNotes([newNote, ...notes]);
    }
  };

  const handleDeleteNote = () => {
    if (!selectedNote) return;
    setNotes(notes.filter(note => note.id !== selectedNote.id));
    handleNewNote();
  };

  return (
    <NotesContainer>
      <Header>
        <BackButton to="/learning-section" title="Back" aria-label="Back" />
        <Title>Notes</Title>
      </Header>
      <Content>
        <EditorContainer>
          <Sidebar>
            <ButtonsContainer>
              <Button onClick={handleNewNote}>New Note</Button>
            </ButtonsContainer>
            {notes.map(note => (
              <NoteItem
                key={note.id}
                onClick={() => {
                  setSelectedNote(note);
                  setTitle(note.title);
                  setContent(note.content);
                }}
                style={{
                  background: selectedNote?.id === note.id 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(255, 255, 255, 0.05)'
                }}
              >
                <h3 style={{ color: 'white', margin: '0 0 5px 0' }}>{note.title}</h3>
                <small style={{ color: '#888' }}>
                  {new Date(note.date).toLocaleString()}
                </small>
              </NoteItem>
            ))}
          </Sidebar>
          <MainContent>
            <Input
              type="text"
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextArea
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <ButtonsContainer style={{ marginTop: '10px' }}>
              {selectedNote && (
                <Button onClick={handleDeleteNote} style={{ background: '#ff4444' }}>
                  Delete
                </Button>
              )}
              <Button onClick={handleSaveNote}>
                {selectedNote ? 'Update' : 'Save'}
              </Button>
            </ButtonsContainer>
          </MainContent>
        </EditorContainer>
      </Content>
    </NotesContainer>
  );
}

export default Notes;