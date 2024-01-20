import React, {useState, useRef, useEffect, ChangeEvent} from 'react'
import  styles from "../styles/today.module.css"
import { MdCheck, MdSort } from "react-icons/md";
import { IoIosCheckmark, IoIosSearch, IoMdMore } from "react-icons/io";
import { Task , fetchTasksApi} from '../api/createTaskApi';
import { useFilterService } from '../api/apiFilterService';
import { RootState } from "../app/store";
import {  useSelector } from "react-redux";
import {sortFilterOverdueService} from "../api/sortFilterService"
import { useApiService } from '.././api/apiService';
import FilterOnHover from '../components/Task/FilterOnHover';
import DeleteTaskPopup from '../components/Task/DeleteTaskPopup';
import TaskInfo from '../components/Task/TaskInfo';
import FilterInfo from '../components/Task/FilterInfo';


type SortType = "id"| "dueDate" | "priority" | "title";

const Overdue: React.FC = () => { 
  const [showSort, setShowSort] = useState(false);
  const [hoverSort, setHoverSort] = useState(false);
  const [sort, setSort] = useState<SortType>("id");
  const { archiveTaskAPI,deleteTaskByIdAPI , getTaskDetailsAPI,updateTaskByIdAPI} = useApiService();
  const [checked, setChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeleteTaskPopupOpen, setIsDeleteTaskPopupOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<Task | undefined>();
  const [updatedTaskDetails, setUpdatedTaskDetails] = useState<Task | undefined>(undefined);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const closeDeleteTaskPopup=()=>{
    setIsDeleteTaskPopupOpen(false)
  }


  const fetchOverdueSortTasks = async () => {
  
    try {
      const sortedTasks = await sortFilterOverdueService(accessToken,sort,userId);    
      setOverdueTasks(sortedTasks);
    } catch (error) {
      console.error('Error fetching sorted tasks:', error);
    }
  };
  const handleSortChange = (selectedSort: SortType) => {
    setSort(selectedSort);
    setShowSort(false);
    localStorage.setItem('Overduesort', selectedSort);
  };


  

useEffect(() => {
  const saveOverdueSort = localStorage.getItem('Overduesort');
    if (saveOverdueSort) {
      setSort(saveOverdueSort as SortType);
    }
 
  if (accessToken && sort){
    fetchOverdueSortTasks();
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

  const handleTaskDeleteClick = (task: Task) => {
    setIsDeleteTaskPopupOpen(true);
    setEditingTask(task);
  };
  const { filterOverdueTasksAPI } = useFilterService();


useEffect(() => {
    const fetchOverdueTasks = async () => {
      try {
        const fetchedOverdueTasks = await filterOverdueTasksAPI();
        setLoading(false);
      } catch (error) {
        console.error('Error fetching overdue tasks:', error);
      }
    };

    fetchOverdueTasks();
  }, []);

  if (loading) {
    return <p>Loading...</p>; 
  }

  const handleEditTask = async(taskId: number|undefined) => {
    try {
      console.log('Clicked on task with ID:', taskId);
      const response = await getTaskDetailsAPI(taskId);
      setSelectedTaskDetails(response);
       onUpdateTaskDetails(response);
      const fetchedOverdueTasks = await filterOverdueTasksAPI();
      setOverdueTasks(fetchedOverdueTasks)
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
    
  };

  const handleArchivedTask = (task:Task) => {
    if (task && task.id) {
      archiveTaskAPI(task.id)
        .then(async() => {
          const fetchedOverdueTasks = await filterOverdueTasksAPI();
          setOverdueTasks(fetchedOverdueTasks)
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
          setOverdueTasks((prevTasks) => prevTasks.filter((t) => t.id !== editingTask?.id));
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
      // const updatedTasks = tasks.map((task) => (task.id === taskId ? response : task));
      // setTasks(updatedTasks);
      const fetchedOverdueTasks = await filterOverdueTasksAPI();
          setOverdueTasks(fetchedOverdueTasks)
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };
  
  const updateTask = async () => {
    try {
      if (!updatedTaskDetails?.id) {
        console.error("Task ID is undefined");
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
  
      setOverdueTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTaskDetails.id ? updatedTaskCopy : task
        )
      );
      setUpdatedTaskDetails(undefined);
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


  return (
    <>
    <div  className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.mainHeader}> 
        <header>
            <div className={styles.taskName}>
            <h3 style={{color:"red"}}>Overdue</h3>
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
        <hr />
        {overdueTasks.length > 0 ? (
          <div className={styles.text}>
            <div style={{ textAlign: "left" }} className={styles.taskText}>
            {overdueTasks.map((task, index) => (
              <>
              <div key={task.id} className={styles.properties}>
                <button
                  onClick={() => setChecked(!checked)}
                  className={styles.propertiesButton}
                  style={{ borderColor: task.priority === "LOW" ? "green" : task.priority === "MEDIUM" ? "orange": task.priority=== "HIGH" ? "red": "none" }}
                >
                  {checked && <IoIosCheckmark color={task.priority === "LOW" ? "green" : task.priority === "MEDIUM" ? "orange" : task.priority=== "HIGH" ? "red" : "none"} />}
                </button>
                <div className={styles.Content}>
                  <div
                    className={styles.Taskprops}
                    onClick={() => handleSpecificTask(task.id)}
                  >
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>{task.dueDate}</p>
                  </div>
                </div>
                <div className={styles.HoverMore}>
                  <FilterOnHover  onTaskDelete={() => handleTaskDeleteClick(task)} onTaskArchived={() => handleArchivedTask(task)} onTaskEdit={()=> handleEditTask(task.id)}/>
                </div>
              </div>

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
            This is where your Overdue Tasks lies.
            </div>
            <div className={styles.textII}>
            By default, Overdue taks would be added here.
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


export default Overdue