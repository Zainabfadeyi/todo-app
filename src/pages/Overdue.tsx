import React, {useState, useRef, useEffect, ChangeEvent} from 'react'
import  styles from "../styles/today.module.css"
import { MdCheck, MdSort } from "react-icons/md";
import { IoIosCheckmark, IoIosSearch, IoMdMore } from "react-icons/io";
import { Task } from '../api/createTaskApi';
import { useFilterService } from '../api/apiFilterService';
import { RootState } from "../app/store";
import {  useSelector } from "react-redux";
import {sortFilterOverdueService} from "../api/sortFilterService"
import { useApiService } from '.././api/apiService';
import FilterOnHover from '../components/Task/FilterOnHover';
import DeleteTaskPopup from '../components/Task/DeleteTaskPopup';


type SortType = "id"| "dueDate" | "priority" | "title";

const Overdue: React.FC<{ tasks: Task[] }> = () => { 
  const [showSort, setShowSort] = useState(false);
  const [hoverSort, setHoverSort] = useState(false);
  const [sort, setSort] = useState<SortType>("id");
  const { archiveTaskAPI,deleteTaskByIdAPI } = useApiService();
  const [checked, setChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeleteTaskPopupOpen, setIsDeleteTaskPopupOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const closeDeleteTaskPopup=()=>{
    setIsDeleteTaskPopupOpen(false)
  }

  const handleSortChange = (selectedSort: SortType) => {
    setSort(selectedSort);
    setShowSort(false);
    localStorage.setItem('Overduesort', selectedSort);
  };

  const fetchOverdueSortTasks = async () => {
    try {
      const sortedTasks = await sortFilterOverdueService(accessToken,sort);
      console.log('Sorted Overdue Tasks:', sortedTasks);
      setOverdueTasks(sortedTasks);
    } catch (error) {
      console.error('Error fetching sorted tasks:', error);
    }
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
        setOverdueTasks(fetchedOverdueTasks);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching overdue tasks:', error);
      }
    };

    fetchOverdueTasks();
  }, [filterOverdueTasksAPI,overdueTasks]);

  if (loading) {
    return <p>Loading...</p>; // You can show a loading indicator here
  }

  const handleArchivedTask = (task:Task) => {
    if (editingTask && editingTask.id) {
      archiveTaskAPI(editingTask.id)
        .then(() => {
          setTasks((prevTasks) => prevTasks.filter((t) => t.id !== editingTask?.id));
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
        });
    }
    setEditingTask(task)
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
              <div key={index} className={styles.properties}>
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
                  <FilterOnHover  onTaskDelete={() => handleTaskDeleteClick(task)} onTaskArchived={() => handleArchivedTask(task)}/>
                </div>
              </div>
              
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
            This is where you Overdue Tasks lies.
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