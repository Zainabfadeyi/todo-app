import React, {useState, useRef, useEffect, ChangeEvent} from 'react'
import  styles from "../styles/today.module.css"
import { MdCheck, MdSort } from "react-icons/md";
import { IoIosCheckmark, IoIosSearch, IoMdMore } from "react-icons/io";
import { Task } from '../api/createTaskApi';
import { useFilterService } from '../api/apiFilterService';
import {sortFilterTaskService} from "../api/sortFilterService"
import { RootState } from "../app/store";
import {  useSelector } from "react-redux";
import FilterOnHover from '../components/Task/FilterOnHover';
import { useApiService } from '../api/apiService';
import DeleteTaskPopup from '../components/Task/DeleteTaskPopup';
import FilterInfo from '../components/Task/FilterInfo';

type SortType = "id" | "priority" | "title";

const Today: React.FC = () => { 
  const [showSort, setShowSort] = useState(false);
  const [hoverSort, setHoverSort] = useState(false);
  const [sort, setSort] = useState<SortType>("id");
  const [checked, setChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeleteTaskPopupOpen, setIsDeleteTaskPopupOpen] = useState(false);
  const [todayTasks, setTodayTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true);
  const { archiveTaskAPI,deleteTaskByIdAPI,getTaskDetailsAPI,updateTaskByIdAPI ,updateTaskCompletionByIdAPI} = useApiService();
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<Task | undefined>();
  const [updatedTaskDetails, setUpdatedTaskDetails] = useState<Task | undefined>(undefined);
  const closeDeleteTaskPopup=()=>{
    setIsDeleteTaskPopupOpen(false)
  }
  
    const fetchSortTasks = async () => {
      console.log(sort);
      try {
        const sortedTasks = await sortFilterTaskService(accessToken,sort, userId);
        setTodayTasks(sortedTasks);
        console.log(sortedTasks)
      } catch (error) {
        console.error('Error fetching sorted tasks:', error);
      }

    };

    const handleSortChange = (selectedSort: SortType) => {
      setSort(selectedSort);
      setShowSort(false);
      localStorage.setItem('sort', selectedSort);
    };

  useEffect(() => {
    const savedSort = localStorage.getItem('sort');
    if (savedSort) {
      setSort(savedSort as SortType);
    }
    if (accessToken && sort){
      fetchSortTasks();
    }
    
  }, [ sort])
  

  const sortDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSort(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const onHoverSort = () => setHoverSort(true);
  const onLeaveSort = () => setHoverSort(false);
 
  const handleChange = (field: keyof Task, value: string) => {
    setEditingTask((prevTask) => ({
      ...(prevTask as Task), 
      [field]: value,
    }));
  };

  const handleCustomDateChange = (value: string) => {
    setEditingTask((prevTask: Task | null) => ({
      ...(prevTask as Task),
      dueDate: value,
    }));
  };


  
  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange('dueTime', e.target.value);
  };

  const handleReminderChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange('reminder', e.target.value);
  };
  const handleTaskDeleteClick = (task: Task) => {
    setIsDeleteTaskPopupOpen(true);
    setEditingTask(task);
  };
  const handleTaskEditClick = (task: Task) => {
    setShowModal(true)
    setEditingTask(task)
    
  };
  const { filterTodayTasksAPI } = useFilterService();

  useEffect(() => {
    const fetchTodayTasks = async () => {
      try {
        const fetchedTasks = await filterTodayTasksAPI();
        setTodayTasks(fetchedTasks)
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching today tasks:', error);
        fetchTodayTasks();
      }
    };

    fetchTodayTasks();
  }, []);

 
  

  const handleArchivedTask = async (task:Task) => {
    if (task && task.id) {
      archiveTaskAPI(task.id)
        .then(async () => {
          const fetchedTasks = await filterTodayTasksAPI();
          setTodayTasks(fetchedTasks)
        setLoading(false); 
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
        });
    }
  };
  const handleDeleteTask = () => {
    if (editingTask && editingTask.id) {
      deleteTaskByIdAPI(editingTask.id)
        .then(() => {
          setTodayTasks((prevTasks) => prevTasks.filter((t) => t.id !== editingTask?.id));
          setIsDeleteTaskPopupOpen(false);
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
        });
    }
  };
  const handleSpecificTask = async (taskId: number|undefined) => {
    setShowModal(true);
    try {
      console.log('Clicked on task with ID:', taskId);
      const response = await getTaskDetailsAPI(taskId);
      setSelectedTaskDetails(response);
       onUpdateTaskDetails(response);

       const fetchedTasks = await filterTodayTasksAPI();
        setTodayTasks(fetchedTasks);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };
  const onUpdateTaskDetails = (updatedDetails: Task | undefined) => {
    setUpdatedTaskDetails(updatedDetails);
  }
  const handleEditTask = async(taskId: number|undefined) => {
    try {
      console.log('Clicked on task with ID:', taskId);
      const response = await getTaskDetailsAPI(taskId);
      setSelectedTaskDetails(response);
       onUpdateTaskDetails(response);
      const fetchedTasks = await filterTodayTasksAPI();
      setTodayTasks(fetchedTasks);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
    
  };
  
 
 const updateTask = async () => {
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

    setTodayTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTaskDetails.id ? updatedTaskCopy : task
      )
    );
    setUpdatedTaskDetails(undefined);
    const fetchedTasks = await filterTodayTasksAPI();
        setTodayTasks(fetchedTasks)
        const sortedTasks = await sortFilterTaskService(accessToken,sort, userId);
        setTodayTasks(sortedTasks);
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

if (updatedTaskDetails) {
  updateTask();
}

const userId = useSelector((state: RootState) => state.auth.user?.id);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);



  if (loading) {
    return <p>Loading...</p>; 
  }
  const formatDueDate = (dueDate: string) => {
    const options = {
      weekday: 'short' as const,
      month: 'short' as const,
      day: 'numeric' as const,
    };
  
    const formattedDate = new Date(dueDate).toLocaleDateString('en-US', options);
    return formattedDate.toLowerCase();
  };
  const handleTaskCompletionToggle = async (index: number) => {
    try {
      const taskToUpdate = todayTasks[index];
      if (!taskToUpdate || taskToUpdate.id === undefined) {
        console.error('Task or task id is undefined');
        return;
      }
  
      const updatedTasks = todayTasks.map((task, i) => {
        if (i === index) {
          task.completed = !task.completed;
        }
        return task;
      });
  
      setTodayTasks(updatedTasks);
  
      if (!accessToken) {
        console.error('Access token is undefined');
        return;
      }
      const apiResponse = await updateTaskCompletionByIdAPI( taskToUpdate.id, taskToUpdate.completed, accessToken);
  
        if (accessToken) {
          const fetchedTasks = await filterTodayTasksAPI();
          setTodayTasks(fetchedTasks);
        }
  
      } catch (error) {
        console.error('Error updating task completion:', error);
      }
    }
    
  

  return (
    <>
    <div  className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.mainHeader}> 
        <header>
            <div className={styles.taskName}>
            <h2>Today</h2>
            <div className={styles.taskIcons}>
            <div className={styles.taskIconWrapper} ref={sortDropdownRef}>
                  <button
                    className={styles.taskIconButtons}
                    onClick={() => setShowSort(!showSort)}
                    onMouseEnter={onHoverSort}
                    onMouseLeave={onLeaveSort}
                   
                  >
                    {hoverSort && (
                    <p
                      className={styles.iconTextSort}
                    >
                      Sort Task{" "}
                    </p>
                  )}
                    <MdSort />
                  </button>
                  {showSort ? (
                    <div className={styles.dropdown}>
                      <div
                        className={styles.itemDropdown}
                        onClick={() => handleSortChange("id")}
                      >
                        <p>None(Default)</p>
                        {sort === "id" && <MdCheck />}
                      </div>
                      <div
                        className={styles.itemDropdown}
                        onClick={() => handleSortChange("title")}
                      >
                        <p>Title</p>
                        {sort === "title" && <MdCheck />}
                      </div>
                     
                      <div
                        className={styles.itemDropdown}
                        onClick={() => handleSortChange("priority")}
                      >
                        <p>Priority</p>
                        {sort === "priority" && <MdCheck />}
                      </div>
                    </div>
                  ) : null}
                </div>
            </div>
            </div>
          </header>
        </div>
    
        {todayTasks.length > 0 ? (
          <div className={styles.text}>
            <div style={{ textAlign: "left" }} className={styles.taskText}>
            {todayTasks.map((task, index) => (
              <>
              <div key={index} className={styles.properties}>
                <button
                  onClick={() =>handleTaskCompletionToggle(index)}
                  className={styles.propertiesButton}
                  style={{ borderColor: task.priority === "LOW" ? "green" : task.priority === "MEDIUM" ? "orange": task.priority=== "HIGH" ? "red": task.priority === "NONE" ?"#BEBEBE": "none" }}
                >
                  {checked && <IoIosCheckmark color={task.priority === "LOW" ? "green" : task.priority === "MEDIUM" ? "orange" : task.priority=== "HIGH" ? "red" : task.priority === "NONE" ?"#BEBEBE": "none"} />}
                </button>
                <div className={styles.Content}>
                  <div
                    className={styles.Taskprops}
                    onClick={() => handleSpecificTask(task.id)}
                  >
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <div className={styles.maintain}>
                    <p style={{color:"green"}}>{formatDueDate(task.dueDate)}</p>
                    <span style={{color:"#B7B7B7"}}>#{task.todoList?.name || "inbox"}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.HoverMore}>
                  <FilterOnHover  onTaskDelete={() => handleTaskDeleteClick(task)} onTaskArchived={() => handleArchivedTask(task)} onTaskEdit={()=> handleEditTask(task.id)}/>
                </div>
              </div>
              <div className={styles.border}></div>
              {showModal && (
                    <FilterInfo
                      setShowModal={setShowModal}
                      handleSpecificTask={handleSpecificTask}
                      taskId={task.id}
                      task={selectedTaskDetails || undefined}
                      taskDetails={selectedTaskDetails}
                      onUpdateTaskDetails={(updatedDetails:Task|undefined) =>
                        setUpdatedTaskDetails(updatedDetails)
                      }
      
                  />
                )}
              </>
            ))}
          </div>
        </div>
        ):(
        <div className={styles.image}>
          <div>
            <img src="\public\images\image-1.jpg" className={styles.defaultImage} />
          </div>
          <div className={styles.text}>
            What do you need to get done today?
            </div>
            <div className={styles.textII}>
            By default, tasks added here will be due today. Click + to add a task
            </div>
        </div>
        )}
      </div>
      <DeleteTaskPopup
        isOpen={isDeleteTaskPopupOpen}
        onClose={closeDeleteTaskPopup}
        onDeleteTask={handleDeleteTask}
        deleteTaskAPI={deleteTaskByIdAPI}
        taskId={editingTask?.id || 0}
        taskName={editingTask?.title|| ""}
        
        />
    </div>
    
    </>
  );
}

export default Today;