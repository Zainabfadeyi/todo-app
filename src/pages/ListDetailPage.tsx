import React, { useState, useEffect, useRef,ChangeEvent, } from "react";
import { redirect, useParams,useNavigate } from "react-router-dom";
import Tasksform from "../components/Task/Tasksform";
import styles from "../styles/listDetails.module.css";
import { IoIosCheckmark, IoIosSearch, IoMdMore } from "react-icons/io";
import { MdCheck, MdDelete, MdSort } from "react-icons/md";
import DeletePopup from "../components/Todolist/DeletePopup";
import { AiOutlineEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import TaskInfo from "../components/Task/TaskInfo";
import DeleteListPopup from "../components/Todolist/DeleteListPopup";
import EditListPopup from "../components/Todolist/EditListPopup";
import TaskOnHover from "../components/Task/TaskOnHover";
import { RootState } from "../app/store";
import {  useSelector } from "react-redux";
import { createTaskApi, Task, fetchTasksApi } from '../api/createTaskApi';
import {  useApiService } from '.././api/apiService';
import DeleteTaskPopup from "../components/Task/DeleteTaskPopup";
import { SearchBar } from "../components/search/SearchBar";
import { SearchResultItem, SearchResultsList } from "../components/search/SearchResultList";

interface Params {
  id?: string;
  [key: string]: string | undefined;
  name?: string
}



interface NewList {
  id: number;
  name: string;
}

type SortType = "id"| "dueDate" | "priority" | "title";

function ListDetailPage() {
  const { getSortedTasksAPI, updateTaskCompletionAPI, deleteListAPI,deleteAllTaskAPI,deleteTaskAPI,updateListAPI, getTaskDetailsAPI, updateTaskAPI, archiveTaskAPI } = useApiService();
  const { name } = useParams<{ name: string }>();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isEditTaskPopupOpen, setIsEditTaskPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isDeleteListPopupOpen, setIsDeleteListPopupOpen] = useState(false);
  const [isDeleteTaskPopupOpen, setIsDeleteTaskPopupOpen] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [checked, setChecked] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showSort, setShowSort] = useState(false);
  const [sort, setSort] = useState<SortType>("id");
  const [showModal, setShowModal] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [updatedTask, setUpdatedTask] = useState<Task []>([]);
  const [hover, setHover] = useState(false);
  const [hoverSort, setHoverSort] = useState(false);
  const [hoverMore, setHoverMore] = useState(false);
  const [lists, setLists] = useState<NewList[]>([]);
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
  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setShowButtons(true);
  };
  const closeDeleteTaskPopup=()=>{
    setIsDeleteTaskPopupOpen(false)
  }
  const closeEditTaskPopup = () => {
    setIsEditTaskPopupOpen(false);
  };
  
  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
  };
 

const { id,name:TaskName } = useParams<Params>();
 const parseListId = id ? parseInt(id, 10) : undefined;


const createTask = async (task: Task) => {
  try {
    if (!accessToken) {
      console.error('Access token is undefined');
      return;
    }

    const { createdTask} = await createTaskApi(parseListId, task, userId, accessToken);
   

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
    if (parseListId) {
      const fetchedTasks = await fetchTasksApi(userId,parseListId,accessToken);
      setTasks(fetchedTasks);
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};


  const fetchSortedTasks = async () => {
    try {
      if (parseListId && sort) {
        const sortedTasks = await getSortedTasksAPI(parseListId, sort, accessToken);
        setTasks(sortedTasks);
      }

    } catch (error) {
      console.error('Error fetching sorted tasks:', error);
    }

  };


  const handleSortChange = (selectedSort: SortType) => {
    setSort(selectedSort);
    setShowSort(false);
  };
  
useEffect(() => {
  if (parseListId && sort) {
    fetchSortedTasks();
  }
}, [parseListId, sort]); 

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
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [selectedListForDeletion, setSelectedListForDeletion] = useState<NewList | null>(null);
  const handleEditList = () => {
    setIsPopupOpen(true);
    closeMoreOptions();
  };

  
  const handleDeleteClick = (list: NewList) => {
    setSelectedListForDeletion(list);
    setIsDeleteListPopupOpen(true);
  };

  const handleDeleteList = () => {
    setIsDeleteListPopupOpen(true)
    if (selectedListForDeletion) {
      console.log("List Details:", selectedListForDeletion);
      deleteListAPI()
        .then(() => {
          setLists((prevLists) => prevLists.filter((l) => l.id !== parseListId));
          console.log("List deleted successfully");
        })
        .then(() => {
          handleDeleteClick(selectedListForDeletion);
        })
        .catch((error) => {
          console.error("Error deleting list:", error);
        });
    }
  };
  
  const closeDeleteListPopup = () => {
    setIsDeleteListPopupOpen(false);
    setShowButtons(true);
  };

  const handleClearAllTasks = async  ()=> {

    try {
      if (!parseListId) {
        console.error("List ID is undefined");
        return;
      }
  
      
      await deleteAllTaskAPI(parseListId);
      setTasks([]);
  
      console.log("All tasks deleted successfully");
    } catch (error) {
      console.error("Error deleting all tasks:", error);
    }
    setIsDeletePopupOpen(false);
  };
  const [selectedList, setSelectedList] = useState<NewList | null>(null);
  
  
  const handleEditListPopup = () => {
    setIsEditPopupOpen(true);
    const selectedList = lists.find((list) => list.id === parseListId) || null;
    setSelectedList(selectedList);
    closeMoreOptions(); 
  };
  
  const handleTaskDeleteClick = (task: Task) => {
    setIsDeleteTaskPopupOpen(true);
    setEditingTask(task);
  };
 
  
  const handleDeleteTask = () => {
    if (editingTask && editingTask.id) {
      deleteTaskAPI(editingTask.id)
        .then(() => {
          setTasks((prevTasks) => prevTasks.filter((t) => t.id !== editingTask?.id));
          setIsDeleteTaskPopupOpen(false);
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
        });
    }
  };
const handleArchivedTask = async (task:Task) => {
    if (task && task.id) {
    archiveTaskAPI(task.id)
        .then(async () => {
          const fetchedTasks = await fetchTasksApi(userId,parseListId,accessToken);
          setTasks(fetchedTasks);
          
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
        });
       
    }
    
      
    
  };
  
 
 
  const onHover = () => setHover(true);
  const onLeave = () => setHover(false);
  const onHoverSort = () => setHoverSort(true);
  const onLeaveSort = () => setHoverSort(false);
  const onHoverMore = () => setHoverMore(true);
  const onLeaveMore = () => setHoverMore(false);

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
  
      const apiResponse = await updateTaskCompletionAPI(parseListId, taskToUpdate.id, taskToUpdate.completed, accessToken);

      if (parseListId) {
        const fetchedTasks = await fetchTasksApi(userId,parseListId,accessToken);
        setTasks(fetchedTasks);
      }

    } catch (error) {
      console.error('Error updating task completion:', error);
    }
  }

  const [results, setResults] =  useState<SearchResultItem[]>([]);

  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);

  const openSearchPopup = () => {
    setIsSearchPopupOpen(true);
  };

  const closeSearchPopup = () => {
    setIsSearchPopupOpen(false);
  };
  const searchPopupRef = useRef(null);

  const handleClickOutside = (event:MouseEvent) => {
    if (searchPopupRef.current && !((searchPopupRef.current as HTMLDivElement).contains(event.target as Node))) {
      closeSearchPopup();
    }
  };

  useEffect(() => {
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
    
    const handleResultClick = async (taskId: number | undefined): Promise<void> => {
     
      try {
        const response = await getTaskDetailsAPI(taskId);
        setSelectedTaskDetails(response);
        setShowModal(true);
      } catch (error) {
        console.error("Error handling result click:", error);
      }
    };
   
 
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
    
        await updateTaskAPI( updatedTaskDetails.id, updatedTaskCopy);
        
        setTasks((prevTasks) =>
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
  

 
  return (
    <>
      <div className={styles.taskContainer}>
        <div className={styles.taskContent}>
          <header>  
            <div className={styles.taskName}>
              <h3>{name}</h3>{isSearchPopupOpen && (
            <div  ref={searchPopupRef} className={styles.searchPopup}>
              <div className="search-popup-content">
                <SearchBar setResults={setResults} />
                {results && results.length > 0 && (
                  <SearchResultsList results={results} onResultClick={handleResultClick} />
                )}
              </div>
           
            </div>
          )}

              <div className={styles.taskIcons}>

                <button className={styles.taskIconButtons}
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
                onClick={openSearchPopup}
                >
                  {hover && (<p className={styles.iconText}>
                      Search{" "}
                    </p>
                  )}
                  <IoIosSearch />
                </button>

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
                <div className={styles.taskIconWrapper} ref={EditDropdownRef}>
                  <button
                    className={styles.taskIconButtons}
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                    onMouseEnter={onHoverMore}
                    onMouseLeave={onLeaveMore}
                  >
                    {hoverMore && (
                    <p
                      className={styles.iconTextMore}
                    >
                      More Option{" "}
                    </p>
                  )}
                    
                    <IoMdMore />
                  </button>
                  {showMoreOptions && (
                    <div className={styles.dropdownmore}>
                      <div
                        className={styles.itemDropdownmore}
                        onClick={() => handleEditListPopup()}

                      >
                        <AiOutlineEdit />
                        <p>Edit List</p>
                      </div>
                      
                      <div
                        className={styles.itemDropdownmore}
                        onClick={() => handleDeleteList()}
                        style={{ color: "red" }}
                      >
                        <RiDeleteBin5Line />
                        <p>Delete List</p>
                      </div>
  
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header> 

          <hr style={{ width: "100%" }} />
          <div style={{ textAlign: "left" }} className={styles.taskname}>
            {Array.isArray(tasks) && tasks.length > 0 ? (
                  tasks.map((task, index) => (
                    <>
                    <div key={index} className={styles.properties}>
                      <div className={styles.PropsCons}>
                      
                      <button
                          onClick={() => handleTaskCompletionToggle(index)}
                          className={styles.propertiesButton}
                          style={{ borderColor: task.priority === "LOW" ? "green" : task.priority === "MEDIUM" ? "orange" : task.priority === "HIGH" ?"red": "none" }}
                        >
                          {task.completed&& <IoIosCheckmark color={task.priority === "LOW" ? "green" : task.priority === "MEDIUM" ? "orange" : task.priority === "HIGH" ?"red": "none"} />}
                      </button>
                      <div className={`${styles.Content} ${task.completed ? styles.completedTask : ''}`}>
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
                      </div>
                      <div className={styles.HoverMore}>
                        <TaskOnHover  onTaskEdit={() => handleTaskEditClick(task.id)} onTaskDelete={() => handleTaskDeleteClick(task)} onTaskArchived={() => handleArchivedTask(task)} />
                      </div>
                      </div>
                    </div>
                      {showModal && (
                          <TaskInfo
                            setShowModal={setShowModal}
                            handleSpecificTask={handleSpecificTask}
                            taskId={task.id}
                            listId={parseListId}
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
              className={styles.imageProps}>
                <button className={styles.taskButton} onClick={openPopup}
                style={{ display: showButtons ? "flex" : "none" }}>
                  + Add Task
                </button>
                {isPopupOpen && (
                <Tasksform 
                  onCancel={closePopup}
                  onSubmit={(task) => createTask(task)}
                  listId={parseListId}
                  handleChange={handleChange}
                  handleCustomDateChange={handleCustomDateChange}
                  handleTimeChange={handleTimeChange}
                  handleReminderChange={handleReminderChange}
                />
                
              )}
              </div>
              <div className={styles.image}>
                  <div>
                    <img src="\public\images\image-10.jpg" className={styles.defaultImage} />
                  </div>
                  <div className={styles.text}>
                  Start small (or dream big)...
                    </div>
                    <div className={styles.textII}>
                    Track tasks, follow progress, and discuss details in one central, shared project.
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
                <button className={styles.taskButton} onClick={openPopup}
                 >
                  + Add Task
                </button>
                <button
                  className={styles.taskButton}
                  style={{ color: "red" }}
                  onClick={openDeletePopup}
                >
                  Clear All
                </button>
                </div>
              
              {isPopupOpen && (
                <Tasksform 
                  onCancel={closePopup}
                  onSubmit={(task) => createTask(task)}
                  listId={parseListId}
                  handleChange={handleChange}
                  handleCustomDateChange={handleCustomDateChange}
                  handleTimeChange={handleTimeChange}
                  handleReminderChange={handleReminderChange}
                />
                
              )}
              </div>
            )}
          
        </div>
        <DeletePopup
          isOpen={isDeletePopupOpen}
          onClose={closeDeletePopup}
          onDeleteAll={handleClearAllTasks}
          deleteTaskAPI= {deleteAllTaskAPI}
          listId={parseListId}
        />
        <DeleteListPopup
          isOpen={isDeleteListPopupOpen}
          onClose={closeDeleteListPopup}
          onDeleteList={handleDeleteList}
          deleteListAPI={deleteListAPI}
          listId={parseListId}
          listName={TaskName|| ""}
        />
        <EditListPopup
          isOpen={isEditPopupOpen}
          onClose={closeEditPopup}
          list={selectedList}
          updateListAPI={updateListAPI}

        />
        <DeleteTaskPopup
        isOpen={isDeleteTaskPopupOpen}
        onClose={closeDeleteTaskPopup}
        onDeleteTask={handleDeleteTask}
        deleteTaskAPI={deleteTaskAPI}
        taskId={editingTask?.id || 0}
        taskName={editingTask?.title|| ""}
        
        />
        
      </div>
    </>
  );
}

export default ListDetailPage;