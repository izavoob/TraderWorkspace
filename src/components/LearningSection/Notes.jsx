import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  margin-top: 178px; // Змінено з 148px на 178px (148 + 30)
  padding: 20px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const NotesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
`;

const NoteCard = styled.div`
  background: rgba(116, 37, 201, 0.1);
  border: 2px solid #5e2ca5;
  border-radius: 15px;
  padding: 20px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(94, 44, 165, 0.2);
  }
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(94, 44, 165, 0.3);
  padding-bottom: 10px;
`;

const NoteTitle = styled.h3`
  color: #fff;
  margin: 0;
  font-size: 1.2em;
`;

const TradeLink = styled.div`
  color: #b886ee;
  cursor: pointer;
  font-size: 0.9em;
  padding: 5px 10px;
  border-radius: 8px;
  background: rgba(116, 37, 201, 0.2);
  
  &:hover {
    background: rgba(116, 37, 201, 0.3);
  }
`;

const NoteContent = styled.p`
  color: #fff;
  margin: 0;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const NoNotesMessage = styled.div`
  color: #fff;
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
  background: rgba(116, 37, 201, 0.1);
  border-radius: 15px;
  margin-top: 20px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
`;

const NoteModal = styled.div`
  background: #2e2e2e;
  width: 90%;
  max-width: 800px;
  padding: 30px;
  border-radius: 15px;
  border: 2px solid #5e2ca5;
  position: relative;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #5e2ca5;
`;

const ModalTitle = styled.h2`
  color: #fff;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  background: ${props => props.variant === 'delete' ? '#dc3545' : 'conic-gradient(from 45deg, #7425c9, #b886ee)'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
`;

function Notes() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const allNotes = await window.electronAPI.getAllNotes();
      const linkedNotes = allNotes.filter(note => note.tradeId); // Фільтруємо тільки пов'язані з трейдами нотатки
      setNotes(linkedNotes.map(note => ({
        id: note.id,
        title: note.title,
        content: note.content,
        tradeId: note.tradeId,
        tradeNo: note.tradeNo,
        tradeDate: note.tradeDate,
        date: note.created_at
      })));
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handleTradeClick = (tradeId) => {
    if (tradeId) {
      navigate(`/trade/${tradeId}`);
    }
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setEditedTitle(note.title);
    setEditedContent(note.content);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await window.electronAPI.saveNoteWithTrade({
        id: selectedNote.id,
        title: editedTitle,
        content: editedContent,
        tradeId: selectedNote.tradeId
      });
      
      await loadNotes();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await window.electronAPI.deleteNote(selectedNote.id);
        await loadNotes();
        setSelectedNote(null);
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const closeModal = () => {
    setSelectedNote(null);
    setIsEditing(false);
  };

  return (
    <NotesContainer>
      <Header>
        <BackButton to="/learning-section" title="Back" aria-label="Back" />
        <Title>Trade Notes</Title>
      </Header>
      <Content>
        <NotesList>
          {notes.length > 0 ? (
            notes.map(note => (
              <NoteCard key={note.id} onClick={() => handleNoteClick(note)}>
                <NoteHeader>
                  <NoteTitle>{note.title}</NoteTitle>
                  <TradeLink onClick={() => handleTradeClick(note.tradeId)}>
                    Trade #{note.tradeNo} - {new Date(note.tradeDate).toLocaleDateString()}
                  </TradeLink>
                </NoteHeader>
                <NoteContent>{note.content}</NoteContent>
              </NoteCard>
            ))
          ) : (
            <NoNotesMessage>
              No trade notes available. Add notes while creating or editing trades.
            </NoNotesMessage>
          )}
        </NotesList>
      </Content>

      {selectedNote && (
        <ModalOverlay onClick={closeModal}>
          <NoteModal onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={e => setEditedTitle(e.target.value)}
                    style={{
                      background: '#3e3e3e',
                      color: '#fff',
                      border: '1px solid #5e2ca5',
                      padding: '8px',
                      borderRadius: '4px',
                      width: '100%'
                    }}
                  />
                ) : selectedNote.title}
              </ModalTitle>
              <ButtonGroup>
                {isEditing ? (
                  <>
                    <Button onClick={handleSave}>Save</Button>
                    <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={handleEdit}>Edit</Button>
                    <Button variant="delete" onClick={handleDelete}>Delete</Button>
                  </>
                )}
                <Button onClick={closeModal}>Close</Button>
              </ButtonGroup>
            </ModalHeader>
            
            {isEditing ? (
              <textarea
                value={editedContent}
                onChange={e => setEditedContent(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '200px',
                  background: '#3e3e3e',
                  color: '#fff',
                  border: '1px solid #5e2ca5',
                  padding: '10px',
                  borderRadius: '4px',
                  resize: 'vertical'
                }}
              />
            ) : (
              <div style={{ color: '#fff', whiteSpace: 'pre-wrap' }}>
                {selectedNote.content}
              </div>
            )}
          </NoteModal>
        </ModalOverlay>
      )}
    </NotesContainer>
  );
}

export default Notes;