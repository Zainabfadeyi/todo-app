import React from "react";
import "./SerachResultList.css";
import { SearchResult } from "./SearchResult";


export interface SearchResultItem {
  title: string;
  id:number|undefined  
}

interface SearchResultsListProps {
  results: SearchResultItem[];
  taskId?:number|undefined
  onResultClick: (taskId: number | undefined) => Promise<void>;
}

export const SearchResultsList: React.FC<SearchResultsListProps> = ({ results,taskId ,onResultClick}) => {
  return (
    <div className="results-list">
      {results.map((result,Id) => (
        <SearchResult result={result.title} onResultClick={onResultClick} taskId={result.id} key={Id}/>
      ))}
    </div>
  );
};


