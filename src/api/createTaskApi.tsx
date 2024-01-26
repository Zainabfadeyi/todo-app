import axios from '../api/axios';
import React, { useState } from 'react';
import { format } from 'date-fns';


export interface TodoList {
  id: number;
  name: string;
}

export interface Task {
  id?: number;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  dueTime: string;
  reminder: string;
  completed: boolean;
  archived?: boolean;
  todoList?: TodoList;
}




export interface TaskResponse {
    createdTask: Task;
    apiResponse: any; 
  }
  
  export const createTaskApi = async (
    listId: number | undefined,
    task: Task,
    userId: string|undefined,
    accessToken: string
  ): Promise<TaskResponse> => {
    try {
      const formattedTask = {
        ...task,
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : task.dueDate
      };
      // const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
      // const userId = useSelector((state: RootState) => state.auth.user?.id);
    
      // const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  
      const response = await axios.post(`/api/v1/task/${userId}/${listId}`, formattedTask, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const createdTask: Task = response.data;
      
  
      return { createdTask, apiResponse: response.data };
    } catch (error) {
      throw new Error(`Error creating task: ${error}`);
    }
  };
  export const createTaskApiById = async (
    task: Task,
    userId: string|undefined,
    accessToken: string
  ): Promise<TaskResponse> => {
    try {
      const formattedTask = {
        ...task,
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : task.dueDate
      };
  
      const response = await axios.post(`/api/v1/task/ ${userId}`, formattedTask, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const createdTask: Task = response.data;
      
  
      return { createdTask, apiResponse: response.data };
    } catch (error) {
      throw new Error(`Error creating task: ${error}`);
    }
  };
  
  

export const fetchTasksApi = async (userId:string |undefined,listId: number | undefined, accessToken: string|null) => {
    try {
      if (listId === undefined) {
        throw new Error('List ID is undefined');
      }
      const apiUrl=`/api/v1/task/all/${userId}/${listId}`;
      const response = await axios.get(apiUrl,  {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });  
      console.log(apiUrl)

      return response.data; 
    } catch (error) {
      throw new Error(`Error fetching tasks: ${error}`);
    }
  };

  export const fetchAllTasksApi = async ( accessToken: string|null,userId: string|undefined) => {
    try {
      
      const response = await axios.get(`/api/v1/task/all/${userId}`,  {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });  

      return response.data; 
    } catch (error) {
      throw new Error(`Error fetching tasks: ${error}`);
    }
  };
