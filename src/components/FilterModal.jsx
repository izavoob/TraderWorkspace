import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
`;

const FilterGroup = styled.div`
  margin-bottom: 15px;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #fff;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  background-color: #2d2d2d;
  color: #fff;
  border: 1px solid #404040;
  margin-bottom: 10px;

  &:focus {
    outline: none;
    border-color: #0366d6;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background-color: ${props => props.primary ? '#0366d6' : '#2d2d2d'};
  color: #fff;

  &:hover {
    background-color: ${props => props.primary ? '#0376e6' : '#3d3d3d'};
  }
`;

const DateInput = styled.input`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  background-color: #2d2d2d;
  color: #fff;
  border: 1px solid #404040;
  margin-bottom: 10px;

  &:focus {
    outline: none;
    border-color: #0366d6;
  }
`;

const FilterModal = ({ isOpen, onClose, onApply, currentFilters }) => {
  const [filters, setFilters] = React.useState(currentFilters || {
    date: '',
    pair: '',
    session: '',
    direction: '',
    result: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    const emptyFilters = {
      date: '',
      pair: '',
      session: '',
      direction: '',
      result: ''
    };
    setFilters(emptyFilters);
    onApply(emptyFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <FilterGroup>
          <FilterLabel>Date</FilterLabel>
          <DateInput
            type="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Pair</FilterLabel>
          <FilterSelect name="pair" value={filters.pair} onChange={handleChange}>
            <option value="">All Pairs</option>
            <option value="EURUSD">EURUSD</option>
            <option value="GBPUSD">GBPUSD</option>
            <option value="USDJPY">USDJPY</option>
            <option value="GER40">GER40</option>
            <option value="XAUUSD">XAUUSD</option>
            <option value="XAGUSD">XAGUSD</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Session</FilterLabel>
          <FilterSelect name="session" value={filters.session} onChange={handleChange}>
            <option value="">All Sessions</option>
            <option value="Asia" style={{ backgroundColor: '#0000ff', color: '#fff' }}>Asia</option>
            <option value="Frankfurt" style={{ backgroundColor: '#ff69b4', color: '#fff' }}>Frankfurt</option>
            <option value="London" style={{ backgroundColor: '#00ff00', color: '#000' }}>London</option>
            <option value="New York" style={{ backgroundColor: '#ffa500', color: '#fff' }}>New York</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Direction</FilterLabel>
          <FilterSelect name="direction" value={filters.direction} onChange={handleChange}>
            <option value="">All Directions</option>
            <option value="Long" style={{ backgroundColor: '#00ff00', color: '#000' }}>Long</option>
            <option value="Short" style={{ backgroundColor: '#ff0000', color: '#fff' }}>Short</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Result</FilterLabel>
          <FilterSelect name="result" value={filters.result} onChange={handleChange}>
            <option value="">All Results</option>
            <option value="Win" style={{ backgroundColor: '#00ff00', color: '#000' }}>Win</option>
            <option value="Loss" style={{ backgroundColor: '#ff0000', color: '#fff' }}>Loss</option>
          </FilterSelect>
        </FilterGroup>

        <ButtonGroup>
          <Button onClick={handleClear}>Clear Filters</Button>
          <Button primary onClick={handleApply}>Apply Filters</Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default FilterModal;