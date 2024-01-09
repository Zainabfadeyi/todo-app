import axios from '../api/axios';
import { Task } from '../api/createTaskApi';
import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

interface NewList {
  id: number;
  name: string;
}

interface Params {
  id?: string;
  [key: string]: string | undefined;
  name?: string
}

export interface taskId{
  taskId:number|undefined
}
export interface SearchResultItem {
  task: Task;  
  listId: number | undefined;
  
}

export const useApiService = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const navigate = useNavigate();
  const { id } = useParams<Params>();
  const parseListId = id ? parseInt(id, 10) : undefined;

  const getSortedTasksAPI = async (parseListId: number | undefined, sort: string | undefined, accessToken: string|null) => {
    try {
      const apiUrl = `/api/v1/task/sorted/${parseListId}?sort=${sort}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching tasks: ${error}`);
    }
  };

  const updateTaskCompletionAPI = async (parseListId: number | undefined, taskId: number, completed: boolean, accessToken: string | null) => {
    try {
      const apiUrl = `/api/v1/task/completed/${parseListId}/${taskId}?completed=${completed}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error updating task completion: ${error}`);
    }
  };

  const deleteListAPI = async () => {
    try {
      const apiUrl = `/api/v1/list/${userId}/${parseListId}`;
      const response = await axios.delete(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const updatedListsResponse = await axios.get(`/api/v1/list/all/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });


      const updatedLists = updatedListsResponse.data;
      
      navigate('/list');
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };
  
  const deleteAllTaskAPI = async (
    parseListId: number|undefined) => {
    try {
      if (!parseListId) {
        console.error("List ID is undefined");
        return;
      }
      const apiUrl = `/api/v1/task/all/${parseListId}`;
      const response = await axios.delete(apiUrl, 
        {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const updatedTasks = await axios.get(`/api/v1/list/all/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const updatedAllTask = updatedTasks.data;
      // setLists(updatedAllTask);
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };
  const deleteTaskAPI = async (taskId: number | undefined) => {
    try {
      if ( !parseListId || !taskId) {
        console.error("List ID, or Task ID is undefined");
        return;
      }
  
      const apiUrl = `/api/v1/task/${parseListId}/${taskId}`;
      
  
      const response = await axios.delete(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
    
  
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  const deleteTaskByIdAPI = async (taskId: number | undefined) => {
    try {
      
  
      const apiUrl = `/api/v1/task/${taskId}`;
      console.log(apiUrl)
  
      const response = await axios.delete(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      console.log("Task Deletion API Response:", response);
  
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  const updateListAPI = async (parseListId:number , name:string) => {
    try {
      if (!userId || !parseListId) {
        console.error("User ID or List ID is undefined");
        return;
      }
  
      const apiUrl = `/api/v1/list/${userId}/${parseListId}`;
      const response = await axios.put(
        apiUrl,
        { name: name, id: parseListId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      console.log("API Response:", response);
  
      const updatedListsResponse = await axios.get(`/api/v1/list/all/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const updatedLists = updatedListsResponse.data;
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };

  const getTaskDetailsAPI = async (taskId:number|undefined) => {
    try {
    
      const apiUrl = `/api/v1/task/${parseListId}/${taskId}`;
      console.log(apiUrl)
      
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response)

      return response.data;
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };
  const updateTaskAPI = async (parseListId:number|undefined, taskId: number|undefined, updatedTask: Task) => {
    try {
      if (!parseListId || !taskId) {
        console.error("List ID or Task ID is undefined");
        return;
      }

      const apiUrl = `/api/v1/task/${parseListId}/${taskId}`;
      console.log(apiUrl)
      const response = await axios.put(apiUrl, updatedTask, 
        {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Task updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };
  const archiveTaskAPI = async (taskId: number) => {
    try {
      const apiUrl = `/api/v1/task/archive/${taskId}`;  
      const response = await axios.post(apiUrl, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Task archived successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error archiving task:', error);
      throw error;
    }
  }
  const unArchiveTaskAPI = async (taskId: number) => {
    try {
      const apiUrl = `/api/v1/task/unarchive/${taskId}`;  
      const response = await axios.post(apiUrl, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Task archived successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error archiving task:', error);
      throw error;
    }
  }
  const searchTaskAPI = async (todoListId: number, search: string) => {
    try {
      const apiUrl = `/api/v1/task/search/${todoListId}?search=${search}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data ;
    } catch (error) {
      console.error(`Error searching tasks: ${error}`);
      throw error;
    }
  };


  return {
    getSortedTasksAPI,
    updateTaskCompletionAPI,
    deleteListAPI,
    deleteAllTaskAPI,
    deleteTaskAPI,
    updateListAPI,
    getTaskDetailsAPI,
    updateTaskAPI,
    archiveTaskAPI,
    unArchiveTaskAPI,
    searchTaskAPI,
    deleteTaskByIdAPI
  };
};




