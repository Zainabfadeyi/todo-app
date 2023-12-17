import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Tasksform from "../components/Task/Tasksform";
import styles from "../styles/listDetails.module.css";
import { IoIosCheckmark, IoIosSearch, IoMdMore } from "react-icons/io";
import { MdCheck, MdDelete, MdSort } from "react-icons/md";
import DeletePopup from "../components/Todolist/DeletePopup";
import { AiOutlineEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import TaskInfo from "../components/Task/TaskInfo";
import DeleteListPopup from "../components/Todolist/DeleteListPopup";

interface NewList {
  id: number;
  text: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  dueTime: string;
  reminder: string;
}


interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void; // Ensure it accepts Task, not NewList
}
type SortType = "due" | "priority" | "title";

function ListDetailPage() {
  const { name } = useParams<{ name: string }>();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [checked, setChecked] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showSort, setShowSort] = useState(false);
  const [sort, setSort] = useState<SortType>("title");
  const [showModal, setShowModal] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null); 
  const openPopup = () => {
    setIsPopupOpen(true);
    setShowButtons(false);
  };
  const openDeletePopup = () => {
    setIsDeletePopupOpen(true);
    setShowButtons(false);
  };
  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setShowButtons(true);
  };
  const closePopup = () => {
    setIsPopupOpen(false);
    setShowButtons(true);
  };
  const handleOnSubmit = (task: Task) => {
    console.log("New task submitted:", task);
    setTasks((prevTasks) => [...prevTasks, task]);
    closePopup();
  };
  const handleSortChange = (selectedSort: SortType) => {
    setSort(selectedSort);
    setShowSort(false);
  };
  const handleClearAllTasks = () => {
    setTasks([]);
    setIsDeletePopupOpen(false);
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

  const handleEditList = () => {
    // Logic to handle edit list
    closeMoreOptions();
  };

  const handleDeleteList = () => {
    setIsDeletePopupOpen(true); // Open the delete list popup
    setShowButtons(false);
    // closeMoreOptions();
  };
  

  return (
    <>
      <div className={styles.taskContainer}>
        <div className={styles.taskContent}>
          <header>
            <div className={styles.taskName}>
              <h3>{name}</h3>
              <div className={styles.taskIcons}>
                <button className={styles.taskIconButtons}>
                  <IoIosSearch />
                </button>
                <div className={styles.taskIconWrapper} ref={sortDropdownRef}>
                  <button
                    className={styles.taskIconButtons}
                    onClick={() => setShowSort(!showSort)}
                    
                  >
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
                <div className={styles.taskIconWrapper} ref={EditDropdownRef}>
                  <button
                    className={styles.taskIconButtons}
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                  >
                    <IoMdMore />
                  </button>
                  {showMoreOptions && (
                    <div className={styles.dropdownmore}>
                      <div
                        className={styles.itemDropdownmore}
                        onClick={handleEditList}
                      >
                        <AiOutlineEdit />
                        <p>Edit List</p>
                      </div>
                      <div
                        className={styles.itemDropdownmore}
                        onClick={handleDeleteList}
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
          <div style={{ textAlign: "left" }} className={styles.taskText}>
            {tasks.map((task, index) => (
              <div
                key={index}
                className={styles.properties}
                
              >
                <button
                  onClick={() => setChecked(!checked)}
                  className={styles.propertiesButton}
                >
                  {checked && <IoIosCheckmark />}
                </button>
                <div className={styles.Taskprops}
                onClick={() => {setShowModal(true);
                  setEditingTask(task);
                }}>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>{task.dueDate}</p>
                </div>
                {showModal && <TaskInfo 
                setShowModal={setShowModal} 
                // task={editingTask}
                />}
              </div>
            ))}
          
          </div>
          <div className="add-task" >
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
              onSubmit={handleOnSubmit}
            />
          )}
        </div>
        <DeletePopup
          isOpen={isDeletePopupOpen}
          onClose={closeDeletePopup}
          onDeleteAll={handleClearAllTasks}
        />
        <DeleteListPopup
        isOpen={isDeletePopupOpen}
        onClose={closeDeletePopup}
        onDeleteList={handleDeleteList}
        />
      </div>
    </>
  );
}

export default ListDetailPage;
