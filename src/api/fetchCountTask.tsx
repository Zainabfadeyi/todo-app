import axios from '../api/axios';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';

const fetchTaskCount = async (apiUrl: string, userId: string | undefined, accessToken: string | null) => {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    return response.data;
   
  } catch (error) {
    throw new Error(`Error fetching task count: ${error}`);
  }
};

const useFetchTaskCount = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const fetchInboxCount = async () => {
    const apiUrl = `/api/v1/task/inbox/count/${userId}`;
    return fetchTaskCount(apiUrl, userId, accessToken);
  };

  const fetchOverdueCount = async () => {
    const apiUrl = `/api/v1/task/overdue/count/${userId}`;
    return fetchTaskCount(apiUrl, userId, accessToken);
  };
  const fetchTodayCount = async () => {
    const apiUrl = `/api/v1/task/today/count/${userId}`;
    return fetchTaskCount(apiUrl, userId, accessToken);
  };
  const fetchUpcomingCount = async () => {
    const apiUrl = `/api/v1/task/upcoming/count/${userId}`;
    return fetchTaskCount(apiUrl, userId, accessToken);
  };
  const fetchArchivedCount = async () => {
    const apiUrl = `/api/v1/task/archive/count/${userId}`;
    return fetchTaskCount(apiUrl, userId, accessToken);
  };
  return {
    fetchInboxCount,
    fetchOverdueCount,
    fetchTodayCount,
    fetchUpcomingCount,
    fetchArchivedCount,
  };
};

export default useFetchTaskCount;
