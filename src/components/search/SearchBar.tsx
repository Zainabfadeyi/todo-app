import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

import "./SearchBar.css";

interface SearchBarProps {
  setResults: React.Dispatch<React.SetStateAction<any[]>>;
}

export const SearchBar: React.FC<SearchBarProps> = ({ setResults }) => {
  const [input, setInput] = useState<string>("");

  // const handleChange = (value: string) => {
  //   setInput(value);

  //   // You can keep any additional filtering logic here if needed

  //   // For example, you can filter a predefined list of users
  //   const staticUsers = [
  //     { id: 1, name: "John Doe" },
  //     { id: 2, name: "Jane Smith" },
  //     // Add more users as needed
  //   ];

  //   const results = staticUsers.filter((user) => {
  //     return (
  //       value &&
  //       user &&
  //       user.name &&
  //       user.name.toLowerCase().includes(value.toLowerCase())
  //     );
  //   });

  //   setResults(results);
  // };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Type to search..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
};
