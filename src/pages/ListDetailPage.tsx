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
import Today from "./Today";
import axios from '../api/axios';
import { RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { createTaskApi, Task, fetchTasksApi } from '../api/createTaskApi';
import {getSortedTasksAPI,updateTaskCompletionAPI} from ".././api/apiService"

interface Params {
  id?: string;
  [key: string]: string | undefined;
  name?: string
}




interface NewList {
  id: number;
  name: string;
}


interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void; 
}
type SortType = "id"| "dueDate" | "priority" | "title";

function ListDetailPage() {
  const { name } = useParams<{ name: string }>();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isDeleteListPopupOpen, setIsDeleteListPopupOpen] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [checked, setChecked] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showSort, setShowSort] = useState(false);
  const [sort, setSort] = useState<SortType>("id");
  const [showModal, setShowModal] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
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

  
  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
  };
 

const { id,name:TaskName } = useParams<Params>();
const parseListId = id ? parseInt(id, 10) : undefined;


const createTask = async (task: Task) => {
  try {
    console.log('Creating task in list with ID:', parseListId);
    if (!accessToken) {
      console.error('Access token is undefined');
      return;
    }

    const { createdTask, apiResponse } = await createTaskApi(parseListId, task, accessToken);
    fetchTasks();

    console.log('Create Task API Response:', apiResponse);

    setTasks((prevTasks) => [...prevTasks, createdTask]);
    setChecked(false);
    setShowModal(false);
    setEditingTask(null);
    closePopup();
  } catch (error) {
    console.error('Error creating task:', error);
  }
};


useEffect(() => {
  fetchTasks();
}, [parseListId]);

const fetchTasks = async () => {
  try {
    if (parseListId) {
      const fetchedTasks = await fetchTasksApi(parseListId,accessToken);
      setTasks(fetchedTasks);

      const updatedListsResponse = await axios.get(`/api/v1/list/all/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const updatedLists = updatedListsResponse.data;
      setLists(updatedLists)
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

  const fetchSortedTasks = async () => {
    try {
      if (parseListId && sort) {
        const sortedTasks = await getSortedTasksAPI(parseListId, sort, accessToken);
        console.log (sort)
        setTasks(sortedTasks);
        console.log (sortedTasks)
      }
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
  const navigate = useNavigate();



  const deleteListAPI = async (parseListId: number|undefined) => {
    try {
      if (!userId) {
        console.error("User ID is undefined");
        return;
      }
      const apiUrl = `/api/v1/list/${userId}/${parseListId}`;
      const response = await axios.delete(apiUrl, 
        {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      console.log("API Response:", response);
      const updatedListsResponse = await axios.get(`/api/v1/list/all/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const updatedLists = updatedListsResponse.data;
      setLists(updatedLists);
      navigate('/list')
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };
  
  const handleDeleteClick = (list: NewList) => {
    setSelectedListForDeletion(list);
    setIsDeleteListPopupOpen(true);
  };
  
  const handleDeleteList = () => {
    setIsDeleteListPopupOpen(true)
    if (selectedListForDeletion) {

      console.log("List Details:", selectedListForDeletion); 
      deleteListAPI(parseListId)
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
  const deleteTaskAPI = async (
    parseListId: number|undefined) => {
    try {
      if (!parseListId) {
        console.error("List ID is undefined");
        return;
      }
      const apiUrl = `/api/v1/task/all/${parseListId}`;
      const response = await axios.delete(apiUrl, 
        {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("API Response:", response);

      const updatedTasks = await axios.get(`/api/v1/list/all/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const updatedAllTask = updatedTasks.data;
      setLists(updatedAllTask);
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  const handleClearAllTasks = async  ()=> {

    try {
      if (!parseListId) {
        console.error("List ID is undefined");
        return;
      }
  
      
      await deleteTaskAPI(parseListId);
      setTasks([]);
  
      console.log("All tasks deleted successfully");
    } catch (error) {
      console.error("Error deleting all tasks:", error);
    }
    setIsDeletePopupOpen(false);
  };
  const [selectedList, setSelectedList] = useState<NewList | null>(null);

  const updateListAPI = async () => {
    try {
      if (!userId || !parseListId) {
        console.error("User ID or List ID is undefined");
        return;
      }
  
      const apiUrl = `/api/v1/list/${userId}/${parseListId}`;
      const response = await axios.put(
        apiUrl,
        { name: name, id: parseListId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      console.log("API Response:", response);
  
      const updatedListsResponse = await axios.get(`/api/v1/list/all/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const updatedLists = updatedListsResponse.data;
      setLists(updatedLists);
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };
  
  const handleEditListPopup = () => {
    setIsEditPopupOpen(true);
    updateListAPI();
    const selectedList = lists.find((list) => list.id === parseListId) || null;
    setSelectedList(selectedList);
    closeMoreOptions(); 
  };
  
 
  const onHover = () => setHover(true);
  const onLeave = () => setHover(false);
  const onHoverSort = () => setHoverSort(true);
  const onLeaveSort = () => setHoverSort(false);
  const onHoverMore = () => setHoverMore(true);
  const onLeaveMore = () => setHoverMore(false);

  const handleChange = (field: keyof Task, value: string) => {
    setEditingTask((prevTask) => ({
      ...(prevTask as Task), // Cast prevTask to Task
      [field]: value,
    }));
  };

  const handleCustomDateChange = (value: string) => {
    setEditingTask((prevTask: Task | null) => ({
      ...(prevTask as Task), // Cast prevTask to Task
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
  
      console.log('Update Task Completion API Response:', apiResponse);
  
      updateLocalStorage(updatedTasks);
    } catch (error) {
      console.error('Error updating task completion:', error);
    }
  }
  const updateLocalStorage = (updatedTasks: Task[]) => {
    try {
      localStorage.setItem(`tasks_${parseListId}`, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error updating local storage:', error);
    }
  };

 
  return (
    <>
      <div className={styles.taskContainer}>
        <div className={styles.taskContent}>
          <header>
            <div className={styles.taskName}>
              <h3>{name}</h3>
              <div className={styles.taskIcons}>

                <button className={styles.taskIconButtons}
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
                >
                  {hover && (
                    <p
                      className={styles.iconText}
                    >
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
            {tasks.map((task, index) => (
              <>
              <div key={index} className={styles.properties}>
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
                    onClick={() => {
                      setShowModal(true);
                      setEditingTask(task);
                    }}
                  >
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>{task.dueDate}</p>
                  </div>
                </div>
                <div className={styles.HoverMore}>
                  <TaskOnHover  onTaskEdit={() => handleTaskEditClick(task)} onTaskDelete={() => handleTaskDeleteClick(task)}  />
                </div>
                </div>
              </div>
                {showModal && (
                    <TaskInfo
                      setShowModal={setShowModal}
                    />
                  )}
              </>
            ))}
          </div>
          <div
            className="add-task"
            style={{ display: showButtons ? "flex" : "none" }}
          >
            <button className={styles.taskButton} onClick={openPopup}>
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
        <DeletePopup
          isOpen={isDeletePopupOpen}
          onClose={closeDeletePopup}
          onDeleteAll={handleClearAllTasks}
          deleteTaskAPI= {deleteTaskAPI}
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
        
      </div>
    </>
  );
}

export default ListDetailPage;