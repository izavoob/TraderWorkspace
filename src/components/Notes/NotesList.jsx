import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NoteModal from './NoteModal.jsx';

const NotesSection = styled.div`
  margin-top: 60px;
  padding: 20px;
  background: #2e2e2e;
  border: 2px solid #5e2ca5;
  border-radius: 15px;
  width: 95%;
`;

const SectionTitle = styled.h3`
  color: rgb(92, 157, 245);
  margin: 0 0 20px;
  font-size: 1.5em;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(94, 44, 165, 0.4);
`;

const NotesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NoteItem = styled.div`
  position: relative;
  background: rgba(94, 44, 165, 0.1);
  border: 2px solid #5e2ca5;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(94, 44, 165, 0.2);
    
    .delete-button {
      opacity: 1;
    }
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
  z-index: 1;

  &:hover {
    background: rgba(244, 67, 54, 0.8);
    transform: scale(1.1);
  }

  &::before {
    content: '×';
    color: white;
    font-size: 18px;
  }
`;

const NoteTitle = styled.h4`
  color: #fff;
  margin: 0;
  font-size: 1.1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TagBadge = styled.span`
  background: ${props => props.type === 'Mistake' ? '#f44336' : '#4caf50'};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: normal;
`;

const AddNoteButton = styled.button`
  background: rgba(94, 44, 165, 0.1);
  border: 2px dashed #5e2ca5;
  border-radius: 15px;
  padding: 27px;
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

const NotesListComponent = ({ sourceType, sourceId, onAddNote, notes = [] }) => {
  const [localNotes, setLocalNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    if (notes && notes.length > 0) {
      // Якщо передані зовнішні нотатки, використовуємо їх
      setLocalNotes(notes);
    } else {
      // Інакше завантажуємо з бази даних
      loadNotes();
    }
  }, [sourceType, sourceId, notes]);

  const loadNotes = async () => {
    try {
      const notesData = await window.electronAPI.getNotesBySource(sourceType, sourceId);
      setLocalNotes(notesData);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (onAddNote) {
      onAddNote();
    } else {
      setSelectedNote(null);
      setIsModalOpen(true);
    }
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    await loadNotes();
  };

  const handleDelete = async (noteId, e) => {
    e.stopPropagation();
    if (window.confirm('Ви впевнені, що хочете видалити цю нотатку?')) {
      try {
        await window.electronAPI.deleteNote(noteId);
        loadNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  return (
    <NotesSection>
      <NotesList>
        {localNotes.map(note => (
          <NoteItem key={note.id} onClick={() => handleNoteClick(note)}>
            <DeleteButton 
              className="delete-button"
              onClick={(e) => handleDelete(note.id, e)}
            />
            <NoteTitle>
              {note.title}
              <TagBadge type={note.tag_name}>{note.tag_name}</TagBadge>
            </NoteTitle>
          </NoteItem>
        ))}
      </NotesList>
      <AddNoteButton onClick={(e) => handleAddNote(e)}>
        <AddIcon>+</AddIcon>
        <AddText>Add Note or Mistake</AddText>
      </AddNoteButton>

      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        note={selectedNote}
        sourceType={sourceType}
        sourceId={sourceId}
      />
    </NotesSection>
  );
};

export default NotesListComponent; 