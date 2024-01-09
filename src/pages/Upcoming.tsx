import React, { useState, useEffect } from 'react';
import { useFilterService } from '../api/apiFilterService';
import TaskListSection from '../components/Task/TaskListSection';
import { Task } from '../api/createTaskApi';
import { DateTime } from 'luxon';
import styles from "../styles/upcoming.module.css"
const UpcomingPage: React.FC = () => {
  const { filterUpcomingTasksAPI } = useFilterService();
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchUpcomingTasks = async () => {
      try {
        const tasks = await filterUpcomingTasksAPI();
        setUpcomingTasks(tasks);
      } catch (error) {
        console.error('Error fetching upcoming tasks:', error);
      }
    };

    fetchUpcomingTasks();
  }, [filterUpcomingTasksAPI]);

 
  const formatDate = (dateString: string): string => {
    return DateTime.fromISO(dateString).toLocaleString({
      month: 'short',
      day: 'numeric',
      weekday: 'long',
      
    });
  };

  const getNextSevenDays = () => {
    const nextSevenDays: string[] = [];

    for (let i = 1; i <= 7; i++) {
      const date = DateTime.now().plus({ days: i }).toISODate(); // Luxon method to calculate the date
      if (date) {
        nextSevenDays.push(date);
      }
    }

    return nextSevenDays;
  };

  const groupTasksByDate = () => {
    const groupedTasks: { [key: string]: Task[] } = {};

    for (const task of upcomingTasks) {
      const dueDate = task.dueDate; // Assuming task.dueDate is a string

      if (!groupedTasks[dueDate]) {
        groupedTasks[dueDate] = [];
      }

      groupedTasks[dueDate].push(task);
    }

    return groupedTasks;
  };

  return (
    <div className={styles.taskContainer}>
      <div className={styles.taskContent}>
      <div style={{width:"100%", paddingLeft:"20px"}}>
       <h3>Upcoming  </h3>
    </div>
  
    <div  
    className={styles.boardView}>
      {getNextSevenDays().map((date) => (
        <TaskListSection key={date} tasks={groupTasksByDate()[date] || []} dueDate={formatDate(date)} />
      ))}
    </div>


    </div>
    </div>
  );
};

export default UpcomingPage;

