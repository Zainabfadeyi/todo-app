import React, { useState, useEffect, useRef } from 'react';
import { useFilterService } from '../api/apiFilterService';
import TaskListSection from '../components/Task/TaskListSection';
import { Task } from '../api/createTaskApi';
import { DateTime } from 'luxon';
import styles from "../styles/upcoming.module.css"
import FilterInfo from '../components/Task/FilterInfo';
import { useApiService } from '../api/apiService';



const UpcomingPage: React.FC = () => {
  const { unArchiveTaskAPI,deleteTaskByIdAPI, getTaskDetailsAPI,updateTaskAPI,updateTaskByIdAPI } = useApiService();
  const { filterUpcomingTasksAPI } = useFilterService();
  const [updatedTaskDetails, setUpdatedTaskDetails] = useState<Task | undefined>(undefined);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<Task | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const clearSelectedTask = () => {
    setSelectedTaskDetails(undefined);
  };
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
  }, []);

 
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
      const date = DateTime.now().plus({ days: i }).toISODate(); 
      if (date) {
        nextSevenDays.push(date);
      }
    }

    return nextSevenDays;
  };

  const groupTasksByDate = () => {
    const groupedTasks: { [key: string]: Task[] } = {};

    for (const task of upcomingTasks) {
      const dueDate = task.dueDate;

      if (!groupedTasks[dueDate]) {
        groupedTasks[dueDate] = [];
      }

      groupedTasks[dueDate].push(task);
    }

    return groupedTasks;
  };
  const onUpdateTaskDetails = (updatedDetails: Task | undefined) => {
    setUpdatedTaskDetails(updatedDetails);
  }
  const handleSpecificTask = async (taskId: number|undefined) => {
    setShowModal(true);
    try {
      console.log('Clicked on task with ID:', taskId);
      const response = await getTaskDetailsAPI(taskId);
      setSelectedTaskDetails(response);
       onUpdateTaskDetails(response);
     
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };
  
  const handleUpdateTask = async () => {

    try {
      if (!updatedTaskDetails?.id) {
        console.error("List ID or Task ID is undefined");
        return;
      }
    
      const updatedTaskCopy: Task = {
        id: updatedTaskDetails.id,
        title: updatedTaskDetails.title || "",
        description: updatedTaskDetails.description || "",
        dueDate: updatedTaskDetails.dueDate || "",
        dueTime: updatedTaskDetails.dueTime || "",
        reminder: updatedTaskDetails.reminder || "",
        priority: updatedTaskDetails.priority || "low",
        completed: updatedTaskDetails.completed || false,
        archived: updatedTaskDetails.archived || false,
      };
  
      await updateTaskByIdAPI( updatedTaskDetails.id, updatedTaskCopy);
      setUpdatedTaskDetails(undefined);
  
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  if (updatedTaskDetails) {
    handleUpdateTask();
  }


  return (
    <div className={styles.taskContainer}>
      <div className={styles.taskContent}>
      <div style={{width:"100%", paddingLeft:"20px"}}>
       <h3>Upcoming  </h3>
    </div>
  
    <div  
    className={styles.boardView} >
      {getNextSevenDays().map((date) => (
        <TaskListSection key={date} tasks={groupTasksByDate()[date] || []} dueDate={formatDate(date)}  onTaskClick={handleSpecificTask} onUpdateTask={handleUpdateTask}/>
      ))}
    </div>


    </div>
    {selectedTaskDetails && showModal && (
      <FilterInfo
        setShowModal={setShowModal}  
        task={selectedTaskDetails}
        handleSpecificTask={handleSpecificTask}
        taskId={selectedTaskDetails.id}
        taskDetails={selectedTaskDetails}
        onUpdateTaskDetails={(updatedDetails:Task|undefined) =>
          setUpdatedTaskDetails(updatedDetails)
        }
        onUpdateTask={handleUpdateTask}


      />
)}
    </div>
  );
};

export default UpcomingPage;

