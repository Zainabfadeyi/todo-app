import React, {useState, useRef, useEffect,ChangeEvent} from 'react'
import  styles from "../styles/inbox.module.css"
import listD from "../styles/listDetails.module.css";
import { MdCheck, MdSort } from "react-icons/md";
import { IoIosCheckmark, } from "react-icons/io";
import TaskOnHover from "../components/Task/TaskOnHover";
import Tasksform from "../components/Task/Tasksform";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import {  Task, createTaskApiById, fetchAllTasksApi } from '../api/createTaskApi';
import {  useApiService } from '.././api/apiService';
import {sortNonlistId} from "../api/sortFilterService"
import DeleteTaskPopup from '../components/Task/DeleteTaskPopup';
import InboxInfo from '../components/Task/InboxInfo';

type SortType = "id"| "dueDate" | "priority" | "title";
const Inbox: React.FC = () =>  {
  const { getTaskDetailsAPI,updateTaskCompletionByIdAPI, updateTaskByIdAPI, archiveTaskAPI, deleteTaskByIdAPI } = useApiService();
  const [showSort, setShowSort] = useState(false);
  const [sort, setSort] = useState<SortType>("id");
  const [checked, setChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showButtons, setShowButtons] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hover, setHover] = useState(false);
  const [hoverSort, setHoverSort] = useState(false);
  const [isDeleteTaskPopupOpen, setIsDeleteTaskPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const openPopup = () => {
    setIsPopupOpen(true);
    setShowButtons(false);
  };
  const closePopup = () => {
    setIsPopupOpen(false);
    setShowButtons(true);
  };

  const openDeletePopup = () => {
    setIsDeletePopupOpen(true);
    setShowButtons(false);
  };
 
  const closeDeleteTaskPopup=()=>{
    setIsDeleteTaskPopupOpen(false)
  }
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
  const handleTaskDeleteClick = (task: Task) => {
    setIsDeleteTaskPopupOpen(true);
    setEditingTask(task);
  };

  const createTask = async (task: Task) => {
    try {
      if (!accessToken) {
        console.error('Access token is undefined');
        return;
      }
  
      const { createdTask} = await createTaskApiById( task,userId, accessToken);
      fetchAllTasks();
  
  
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setChecked(false);
      setEditingTask(task);
      setIsPopupOpen(false)
      setShowButtons(true)
      
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };
  
  
  useEffect(() => {
    fetchAllTasks();
  }, []);
  
  const fetchAllTasks = async () => {
    try {
      if (accessToken) {
        const fetchedTasks = await fetchAllTasksApi(accessToken, userId);
        setTasks(fetchedTasks);
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };


  const fetchSortTasks = async () => {
    console.log(sort);
    try {
      const sortedTasks = await sortNonlistId(accessToken,sort,userId);
      setTasks(sortedTasks);
      console.log(sortedTasks)
    } catch (error) {
      console.error('Error fetching sorted tasks:', error);
    }

  };
  
  
    const handleSortChange = (selectedSort: SortType) => {
      setSort(selectedSort);
      setShowSort(false);
    };
    useEffect(() => {
      const NonListSort = localStorage.getItem('NonListsort');
      if (NonListSort) {
        setSort(NonListSort as SortType);
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
  
    const EditDropdownRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
      const handleOutEdit = (event: MouseEvent) => {
        if (
          EditDropdownRef.current &&
          !EditDropdownRef.current.contains(event.target as Node)
        ) {
          setShowMoreOptions(false);
        }
      };
  
      document.addEventListener("click", handleOutEdit);
  
      return () => {
        document.removeEventListener("click", handleOutEdit);
      };
    }, []);
  
    const openMoreOptions = () => {
      setShowMoreOptions(true);
    };
  
    const closeMoreOptions = () => {
      setShowMoreOptions(false);
    };
  
  
  const handleArchivedTask = async (task:Task) => {
      if (task && task.id) {
      archiveTaskAPI(task.id)
          .then(async () => {
            const fetchedTasks = await fetchAllTasksApi(accessToken, userId);
            setTasks(fetchedTasks);
            
          })
          .catch((error) => {
            console.error("Error deleting task:", error);
          });
         
      }
      
        
      
    };
    
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
   
  
    const handleTaskCompletionToggle = async (index: number) => {
      try {
        const taskToUpdate = tasks[index];
        if (!taskToUpdate || taskToUpdate.id === undefined) {
          console.error('Task or task id is undefined');
          return;
        }
    
        const updatedTasks = tasks.map((task, i) => {
          if (i === index) {
            task.completed = !task.completed;
          }
          return task;
        });
    
        setTasks(updatedTasks);
    
        if (!accessToken) {
          console.error('Access token is undefined');
          return;
        }
    
        const apiResponse = await updateTaskCompletionByIdAPI( taskToUpdate.id, taskToUpdate.completed, accessToken);
  
        if (accessToken) {
          const fetchedTasks = await fetchAllTasksApi(accessToken, userId);
          setTasks(fetchedTasks);
        }
  
      } catch (error) {
        console.error('Error updating task completion:', error);
      }
    }
      const [selectedTaskDetails, setSelectedTaskDetails] = useState<Task | undefined>(
        
      );
    const handleSpecificTask = async (taskId: number|undefined) => {
        setShowModal(true);
        try {
          console.log('Clicked on task with ID:', taskId);
          const response = await getTaskDetailsAPI(taskId);
          setSelectedTaskDetails(response);
           onUpdateTaskDetails(response);
          const updatedTasks = tasks.map((task) => (task.id === taskId ? response : task));
          setTasks(updatedTasks);
          setShowModal(true);
        } catch (error) {
          console.error("Error fetching task details:", error);
        }
      };
  
      const handleTaskEditClick = async(taskId: number|undefined) => {
        setShowModal(true)
        try {
          console.log('Clicked on task with ID:', taskId);
          const response = await getTaskDetailsAPI(taskId);
          setSelectedTaskDetails(response);
           onUpdateTaskDetails(response);
          const updatedTasks = tasks.map((task) => (task.id === taskId ? response : task));
          setTasks(updatedTasks);
          setShowModal(true);
        } catch (error) {
          console.error("Error fetching task details:", error);
        }
        
      };
  
      const [updatedTaskDetails, setUpdatedTaskDetails] = useState<Task | undefined>(undefined);
     
      const onUpdateTaskDetails = (updatedDetails: Task | undefined) => {
        setUpdatedTaskDetails(updatedDetails);
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
          
        //   setTasks((prevTasks) =>
        //   prevTasks.map((task) =>
        //     task.id === updatedTaskDetails.id ? updatedTaskCopy : task
        //   )
        // );
            setUpdatedTaskDetails(undefined);
            const fetchedTasks = await fetchAllTasksApi(accessToken, userId);
        setTasks(fetchedTasks);
        const sortedTasks = await sortNonlistId(accessToken,sort,userId);
        setTasks(sortedTasks);
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
  
  return (
    <>
    <div  className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.mainHeader}> 
        <header>
            <div className={styles.taskName}>
            <h2>Inbox</h2>
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
                      className={listD.iconTextSort}
                    >
                      Sort Task{" "}
                    </p>
                  )}
                    <MdSort />
                  </button>
                  {showSort ? (
                    <div className={listD.dropdown}>
                      <div
                        className={styles.itemDropdown}
                        onClick={() => handleSortChange("id")}
                      >
                        <p>None(Default)</p>
                        {sort === "id" && <MdCheck />}
                      </div>
                      <div
                        className={listD.itemDropdown}
                        onClick={() => handleSortChange("title")}
                      >
                        <p>Title</p>
                        {sort === "title" && <MdCheck />}
                      </div>
                      <div
                        className={listD.itemDropdown}
                        onClick={() => handleSortChange("dueDate")}
                      >
                        <p>Due date</p>
                        {sort === "dueDate" && <MdCheck />}
                      </div>
                      <div
                        className={listD.itemDropdown}
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
    
        <div style={{ textAlign: "left" }} className={listD.taskname}>
            {Array.isArray(tasks) && tasks.length > 0 ? (
                  tasks.map((task, index) => (
                    <>
                    <div key={index} className={listD.properties}>
                      <div className={listD.PropsCons}>
                      
                      <button
                          onClick={() => handleTaskCompletionToggle(index)}
                          className={listD.propertiesButton}
                          style={{ borderColor: task.priority === "LOW" ? "green" : task.priority === "MEDIUM" ? "orange" : task.priority === "HIGH" ?"red": task.priority === "NONE" ?"#BEBEBE": "none" }}
                        >
                          {task.completed&& <IoIosCheckmark color={task.priority === "LOW" ? "green" : task.priority === "MEDIUM" ? "orange" : task.priority === "HIGH" ?"red": task.priority === "NONE" ?"#BEBEBE": "none"} />}
                      </button>
                      <div className={`${listD.Content} ${task.completed ? listD.completedTask : ''}`}>
                      <div className={listD.Content}>
                        <div
                          className={listD.Taskprops}
                          onClick={() => handleSpecificTask(task.id)}
                        >
                          <h3>{task.title}</h3>
                          <p>{task.description}</p>
                          <p>{formatDueDate(task.dueDate)}</p>
                          
                        </div>
                      </div>
                      </div>
                      <div className={listD.HoverMore}>
                        <TaskOnHover  onTaskEdit={() => handleTaskEditClick(task.id)} onTaskDelete={() => handleTaskDeleteClick(task)} onTaskArchived={() => handleArchivedTask(task)} />
                      </div>
                      </div>
                    </div>
                    <div className={styles.border}></div>
                      {showModal && (
                          <InboxInfo
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
                  ))
                ) : (
                  <div >
              <div 
              className={listD.imageProps}>
                <button className={listD.taskButton} onClick={openPopup}
                style={{ display: showButtons ? "flex" : "none" }}>
                  + Add Task
                </button>
                {isPopupOpen && (
                <Tasksform 
                  onCancel={closePopup}
                  onSubmit={(task) => createTask(task)}
                  handleChange={handleChange}
                  handleCustomDateChange={handleCustomDateChange}
                  handleTimeChange={handleTimeChange}
                  handleReminderChange={handleReminderChange}
                />
                
              )}
              </div>
              <div className={listD.image}>
            <div>
                <img src="\public\images\image-2.jpg" className={listD.defaultImage} />
            </div>
              <div className={listD.text}>
                  Your peace of mind is priceless
                </div>
                <div className={listD.textII}>
                  Well done, All your tasks are organized in the right place.
                </div>
            </div>
                </div>
                )}

          </div>
          {Array.isArray(tasks) && tasks.length > 0 && (
              <div className="add-task"
              
             >
              <div
              style={{ display: showButtons ? "flex" : "none" }}>
                <button className={listD.taskButton} onClick={openPopup}
                 >
                  + Add Task
                </button>
                </div>
              
              {isPopupOpen && (
                <Tasksform 
                  onCancel={closePopup}
                  onSubmit={(task) => createTask(task)}
                  handleChange={handleChange}
                  handleCustomDateChange={handleCustomDateChange}
                  handleTimeChange={handleTimeChange}
                  handleReminderChange={handleReminderChange}
                />
                
              )}
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
  )
}

export default Inbox
