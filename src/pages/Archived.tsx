import React, {useState, useRef, useEffect, ChangeEvent} from 'react'
import  styles from "../styles/today.module.css"
import { MdCheck, MdSort } from "react-icons/md";
import { IoIosCheckmark, IoIosSearch, IoMdMore } from "react-icons/io";
import ArchiveOnHover from "../components/Task/ArchiveOnHover";
import { Task } from '../api/createTaskApi';
import { useFilterService } from '../api/apiFilterService';
import { useApiService } from '../api/apiService';
import DeleteTaskPopup from '../components/Task/DeleteTaskPopup';
import { RootState } from "../app/store";
import {  useSelector } from "react-redux";
import { sortArchiveFilterService } from '../api/sortFilterService';
import { useParams } from 'react-router-dom';
import FilterInfo from '../components/Task/FilterInfo';

interface Params {
  id?: string;
  [key: string]: string | undefined;
  name?: string
}

type SortType = "id"| "dueDate" | "priority" | "title";

const Archived:  React.FC = () => { 
  const { unArchiveTaskAPI,deleteTaskByIdAPI, getTaskDetailsAPI,updateTaskByIdAPI, updateTaskCompletionByIdAPI } = useApiService();
  const [showSort, setShowSort] = useState(false);
  const [hoverSort, setHoverSort] = useState(false);
  const [sort, setSort] = useState<SortType>("id");
  const [checked, setChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isDeleteTaskPopupOpen, setIsDeleteTaskPopupOpen] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ArchivedTasks, setArchivedTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<Task | undefined>();
  const [updatedTaskDetails, setUpdatedTaskDetails] = useState<Task | undefined>(undefined);
  const { id,name:TaskName } = useParams<Params>();
  const parseListId = id ? parseInt(id, 10) : undefined;
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

    const fetchSortTasks = async () => {
      console.log(sort);
      try {
        const sortedTasks = await sortArchiveFilterService(accessToken,sort, userId);
        setArchivedTasks(sortedTasks);
        
      } catch (error) {
        console.error('Error fetching sorted tasks:', error);
      }

    };
    const handleSortChange = (selectedArSort: SortType) => {
      setSort(selectedArSort);
      setShowSort(false);
      localStorage.setItem('Archivesort', selectedArSort);
    };



  useEffect(() => {
    const ArchiveSort = localStorage.getItem('Archivesort');
    if (ArchiveSort) {
      setSort(ArchiveSort as SortType);
    }
    if (accessToken && sort){
      fetchSortTasks();
    }
    
  }, [sort])

  const closeDeleteTaskPopup=()=>{
    setIsDeleteTaskPopupOpen(false)
  }

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

  const handleTaskDeleteClick = (task: Task) => {
    setIsDeleteTaskPopupOpen(true);
    setEditingTask(task);
  };


  const { filterArchivedTasksAPI } = useFilterService();

  useEffect(() => {
    const fetchArchivedTasks = async () => {
      try {
        const fetchedTasks = await filterArchivedTasksAPI();
        setArchivedTasks(fetchedTasks);
        console.log(fetchedTasks)
        setLoading(false); 
        
      } catch (error) {
        console.error('Error fetching Archived tasks:', error);
        fetchArchivedTasks();
      }
    };

    fetchArchivedTasks();
  }, []);

  if (loading) {
    return <p>Loading...</p>; 
  }
 

  const handleUnArchivedTask = async (task:Task) => {
    if (task && task.id) {
      unArchiveTaskAPI(task.id)
        .then(async () => {
          const fetchedTasks = await filterArchivedTasksAPI();
            setArchivedTasks(fetchedTasks);
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
          setTasks((prevTasks) => prevTasks.filter((t) => t.id !== editingTask?.id));
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
    
      const fetchedTasks = await filterArchivedTasksAPI();
            setArchivedTasks(fetchedTasks);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };
  const handleEditTask = async(taskId: number|undefined) => {
    try {
      console.log('Clicked on task with ID:', taskId);
      const response = await getTaskDetailsAPI(taskId);
      setSelectedTaskDetails(response);
       onUpdateTaskDetails(response);
      const fetchedTasks = await filterArchivedTasksAPI();
      setArchivedTasks(fetchedTasks);
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

    setArchivedTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTaskDetails.id ? updatedTaskCopy : task
      )
    );
    setUpdatedTaskDetails(undefined);
    const fetchedTasks = await filterArchivedTasksAPI();
        setArchivedTasks(fetchedTasks);
        const sortedTasks = await sortArchiveFilterService(accessToken,sort, userId);
        setArchivedTasks(sortedTasks);
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

if (updatedTaskDetails) {
  updateTask();
}
const onUpdateTaskDetails = (updatedDetails: Task | undefined) => {
  setUpdatedTaskDetails(updatedDetails);
}

const handleTaskCompletionToggle = async (index: number) => {
  try {
    const taskToUpdate = ArchivedTasks[index];
    if (!taskToUpdate || taskToUpdate.id === undefined) {
      console.error('Task or task id is undefined');
      return;
    }

    const updatedTasks = ArchivedTasks.map((task, i) => {
      if (i === index) {
        task.completed = !task.completed;
      }
      return task;
    });

    setArchivedTasks(updatedTasks);

    if (!accessToken) {
      console.error('Access token is undefined');
      return;
    }

    const apiResponse = await updateTaskCompletionByIdAPI( taskToUpdate.id, taskToUpdate.completed, accessToken);

  } catch (error) {
    console.error('Error updating task completion:', error);
  }
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
  
  return (
    <>
    <div  className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.mainHeader}> 
        <header>
            <div className={styles.taskName}>
            <h2>Archived</h2>
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
                      onClick={() => handleSortChange("dueDate")}
                    >
                      <p>Due date</p>
                      {sort === "dueDate" && <MdCheck />}
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
      
        {ArchivedTasks.length > 0 ? (
          <div className={styles.text}>
            <div style={{ textAlign: "left" }} className={styles.taskText}>
            {ArchivedTasks.map((task, index) => (
              <>
              <div key={task.id} className={styles.properties}>
                 <button
                    onClick={() => handleTaskCompletionToggle(index)}
                    className={styles.propertiesButton}
                    style={{ borderColor: task.priority === "LOW" ? "green" : task.priority === "MEDIUM" ? "orange" : task.priority === "HIGH" ?"red" : task.priority === "NONE" ?"#BEBEBE": "none" }}
                  >
                    {task.completed&& <IoIosCheckmark color={task.priority === "LOW" ? "green" : task.priority === "MEDIUM" ? "orange" : task.priority === "HIGH" ?"red" : task.priority === "NONE" ?"#BEBEBE": "none"} />}
                      </button>
                      <div className={`${styles.Content} ${task.completed ? styles.completedTask : ''}`}>
                      <div className={styles.Content}></div>
                  <div
                    className={styles.Taskprops}
                    onClick={() => handleSpecificTask(task.id)}
                  >
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <div className={styles.maintain}>
                    <p>{formatDueDate(task.dueDate)}</p>
                    <span style={{color:"#B7B7B7"}}>#{task.todoList?.name || "inbox"}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.HoverMore}>
                  <ArchiveOnHover onTaskDelete={() => handleTaskDeleteClick(task)} onTaskUnArchived={() => handleUnArchivedTask(task)} onTaskEdit={() => handleEditTask(task.id)}/>
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
            <img src="\public\images\image-2.jpg" className={styles.defaultImage} />
          </div>
          <div className={styles.text}>
            Tasks you dont want to see anymore in your lists?
            </div>
            <div className={styles.textII}>
            Archive tasks are here!!!
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

export default Archived