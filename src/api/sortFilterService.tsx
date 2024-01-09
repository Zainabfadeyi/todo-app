import axios from './axios';
import { Task } from './createTaskApi';



export const sortFilterTaskService = async ( accessToken:string|null, sort: string | undefined):Promise<Task[]>=> {
  try {

    const apiUrl = `/api/v1/task/filter/today/sorted?sort=${sort}`;


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
export const sortFilterOverdueService = async ( accessToken:string|null, sort: string | undefined):Promise<Task[]>=> {
  try {

    const apiUrl = `/api/v1/task/filter/overdue/sorted?sort=${sort}`;


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
export const sortArchiveFilterService = async ( accessToken:string|null, sort: string | undefined):Promise<Task[]>=> {
  try {

    const apiUrl = `/api/v1/task/filter/archived/sorted?sort=${sort}`;


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