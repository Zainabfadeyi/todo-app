// apiService.ts
import axios from '../api/axios';
import {  Task } from '../api/createTaskApi';


export const getSortedTasksAPI = async (parseListId: number | undefined, sort: string | undefined, accessToken: string|null) => {
  try {
    

    const apiUrl = `/api/v1/task/sorted/${parseListId}?sort=${sort}`;
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data
  } catch (error) {
    throw new Error(`Error fetching tasks: ${error}`);
  }
}


export const updateTaskCompletionAPI = async (parseListId: number | undefined, taskId: number, completed: boolean, accessToken: string | null) => {
  try {
    const apiUrl = `/api/v1/task/completed/${parseListId}/${taskId}?completed=${completed}`;
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data
  } catch (error) {
    throw new Error(`Error updating task completion: ${error}`);
  }
};


