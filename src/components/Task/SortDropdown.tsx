// SortDropdown.tsx
import React, { useState } from 'react';
import {MdSort } from "react-icons/md";

interface SortDropdownProps {
  onSortChange: (selectedOption: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ onSortChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleSortButtonClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const option = event.target.value;
    setSelectedOption(option);
    onSortChange(option);
    setIsDropdownOpen(false); // Close the dropdown after selecting an option
  };

  return (
    <div className="sort-dropdown">
      <button onClick={handleSortButtonClick}><MdSort /></button>
      {isDropdownOpen && (
        <div className="dropdown">
          <select value={selectedOption} onChange={handleOptionChange}>
            <option value="dueDate">Sort by Due Date</option>
            <option value="title">Sort by Title</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
