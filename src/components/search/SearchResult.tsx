
import React, { useState } from "react";
import "./SearchResult.css";

import { Task } from "../../api/createTaskApi";
import { useApiService } from '../../api/apiService';
import { useParams } from "react-router-dom";
import { taskId } from "../../api/apiService";
interface SearchResultProps {
  result:string
  task?:Task
  taskId:number|undefined
  onResultClick:(taskId: number | undefined) => Promise<void>;
}

interface Params {
  id?: string;
  [key: string]: string | undefined;
  name?: string;
}

export const SearchResult: React.FC<SearchResultProps> = ({ taskId, result, task,onResultClick }) => {
  const [showModal, setShowModal] = useState(false);

  const { getTaskDetailsAPI, updateTaskAPI } = useApiService();
  const { id, name: TaskName } = useParams<Params>();
  const parseListId = id ? parseInt(id, 10) : undefined;
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<Task | undefined>(
      
    )

  const handleResultClick = async (taskId:number|undefined) => {
    try {
      console.log('Clicked on task with ID:', taskId);
      const response = await getTaskDetailsAPI(taskId);
      setSelectedTaskDetails(response);
      
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
    setShowModal(true);
    onResultClick(taskId)
  };

  return (
    <div>
      <div
        className="search-result"
        onClick={()=> handleResultClick(taskId)}
      >
        {result}
      </div>
  
    </div>
  );
};


