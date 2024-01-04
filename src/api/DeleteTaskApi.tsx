import axios from '../api/axios';
import React, { useState } from 'react';
import { format } from 'date-fns';

export interface Task {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  dueTime: string;
  reminder: string;
}

export const deleteTaskAPI = async (
    parseListId: number|undefined,
    task: Task,
    accessToken: string) => {
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
      
      console.log("API Response:", response);
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };