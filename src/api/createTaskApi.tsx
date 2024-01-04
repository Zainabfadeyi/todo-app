import axios from '../api/axios';
import React, { useState } from 'react';
import { format } from 'date-fns';

export interface Task {
  id?:number
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  dueTime: string;
  reminder: string;
  completed:boolean;
}



export interface TaskResponse {
    createdTask: Task;
    apiResponse: any; 
  }
  
  export const createTaskApi = async (
    listId: number | undefined,
    task: Task,
    accessToken: string
  ): Promise<TaskResponse> => {
    try {
      const formattedTask = {
        ...task,
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : task.dueDate
      };
  
      const response = await axios.post(`/api/v1/task/${listId}`, formattedTask, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const createdTask: Task = response.data; // Assuming the server returns the created task
  
      return { createdTask, apiResponse: response.data };
    } catch (error) {
      throw new Error(`Error creating task: ${error}`);
    }
  };
  
  

export const fetchTasksApi = async (listId: number | undefined, accessToken: string|null) => {
    try {
      if (listId === undefined) {
        throw new Error('List ID is undefined');
      }
      const response = await axios.get(`/api/v1/task/all/${listId}`,  {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });  

      return response.data; // Assuming the server returns the list of tasks
    } catch (error) {
      throw new Error(`Error fetching tasks: ${error}`);
    }
  };

