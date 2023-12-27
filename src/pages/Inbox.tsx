import React, {useState, useRef, useEffect} from 'react'
import  styles from "../styles/inbox.module.css"
import { MdCheck, MdSort } from "react-icons/md";
import { IoIosCheckmark, IoIosSearch, IoMdMore } from "react-icons/io";
import TaskOnHover from "../components/Task/TaskOnHover";
import TaskInfo from "../components/Task/TaskInfo";
import Tasksform from "../components/Task/Tasksform";
import { Task } from './ListDetailPage';

interface InboxProps {
  tasks: Task[];
}

type SortType = "due" | "priority" | "title";
const Inbox: React.FC<{ tasks: Task[] }> = ({ tasks }) => { {
  const [isVisible, setIsVisible] = useState(true);
  const [showSort, setShowSort] = useState(false);
  const [hoverSort, setHoverSort] = useState(false);
  const [sort, setSort] = useState<SortType>("due");
  const [contentAdded, setContentAdded] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showButtons, setShowButtons] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const handleSortChange = (selectedSort: SortType) => {
    setSort(selectedSort);
    setShowSort(false);
  };
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
  
  const closeMoreOptions = () => {
    setShowMoreOptions(false);
  };
  const handleOnSubmit = (task: Task) => {
    console.log("New task submitted:", task);
    setTasks((prevTasks) => [...prevTasks, task]);
    setChecked(false); // Reset checked state
    setShowModal(false); // Reset showModal state
    setEditingTask(null); // Reset editingTask state

    closePopup();
  };

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
  const addContent = () => {
    // Add your logic here to add content
    // For now, let's just set contentAdded to true
    setContentAdded(true);
  };
  return (
    <>
    <div  className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.mainHeader}> 
        <header>
            <div className={styles.taskName}>
            <h3>Inbox</h3>
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
                        onClick={() => handleSortChange("title")}
                      >
                        <p>Title</p>
                        {sort === "title" && <MdCheck />}
                      </div>
                      <div
                        className={styles.itemDropdown}
                        onClick={() => handleSortChange("due")}
                      >
                        <p>Due date</p>
                        {sort === "due" && <MdCheck />}
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
        {contentAdded ? (
          <div className={styles.text}>
            <div style={{ textAlign: "left" }} className={styles.taskText}>
            {tasks.map((task, index) => (
              <>
              <div key={index} className={styles.properties}>
                <button
                  onClick={() => setChecked(!checked)}
                  className={styles.propertiesButton}
                  style={{ borderColor: task.priority === "Low" ? "green" : task.priority === "Medium" ? "orange" : task.priority === "Medium" ? "orange" : task.priority=== "High" ? "red": "none" }}
                >
                  {checked && <IoIosCheckmark color={task.priority === "Low" ? "green" : task.priority === "Medium" ? "orange" : task.priority=== "High" ? "red" : "none"} />}
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
                  <TaskOnHover />
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
            className={styles.addTask}
            style={{ display: showButtons ? "flex" : "none" }}
          >
            <button className={styles.taskButton} onClick={openPopup}>
              + Add Task
            </button>
          </div>
          {isPopupOpen && (
            <Tasksform onCancel={closePopup} onSubmit={handleOnSubmit} />
          )}
        </div>
        ):(
          <div>
            <div
            className={styles.addTask}
            style={{ display: showButtons ? "flex" : "none" }}
            
          >
            <button className={styles.taskButton} onClick={openPopup}>
              + Add Task
            </button>
          </div>
          {isPopupOpen && (
            <div
             onSubmit={addContent}>
            <Tasksform onCancel={closePopup} onSubmit={handleOnSubmit} />
            </div>
          )}
        <div className={styles.image}>
          <div>
            <img src="\public\images\image-2.jpg" className={styles.defaultImage} />
          </div>
          <div className={styles.text}>
              Your peace of mind is priceless
            </div>
            <div className={styles.textII}>
            Well done, All your tasks are organized in the right place.
            </div>
        </div>
        </div>
        )}
      </div>
    </div>
    </>
  )
  }
}

export default Inbox