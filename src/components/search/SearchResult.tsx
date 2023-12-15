import React from "react";
import "./SearchResult.css";

interface SearchResultProps {
  result: string;
}

export const SearchResult: React.FC<SearchResultProps> = ({ result }) => {
  return (
    <div
      className="search-result"
      onClick={(e) => alert(`You selected ${result}!`)}
    >
      {result}
    </div>
  );
};
