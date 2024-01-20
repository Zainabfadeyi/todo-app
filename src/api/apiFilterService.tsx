
import axios from '../api/axios';
import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { Task } from './createTaskApi';

interface FilteredTasks {
  tasks: Task[];
}

interface Params {
  id?: string;
  [key: string]: string | undefined;
  name?: string;
}

export const useFilterService = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const filterTodayTasksAPI = async () => {
    try {
      const apiUrl = `/api/v1/task/filter/today/${userId}`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Error fetching filtered tasks: ${error}`);
    }
  };

  const filterOverdueTasksAPI = async () => {
    try {
      const apiUrl = `/api/v1/task/filter/overdue/${userId}`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Error fetching overdue tasks: ${error}`);
    }
  };

  const filterUpcomingTasksAPI = async () => {
    try {
      const apiUrl = `/api/v1/task/filter/upcoming/${userId}`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Error fetching upcoming tasks: ${error}`);
    }
  };

  const filterArchivedTasksAPI = async () => {
    try {
      const apiUrl = `/api/v1/task/archive/${userId}`;
      console.log(apiUrl)

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Error fetching archived tasks: ${error}`);
    }
  };

  return {
    filterTodayTasksAPI,
    filterOverdueTasksAPI,
    filterUpcomingTasksAPI,
    filterArchivedTasksAPI,
  };
};
