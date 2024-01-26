import React, { useState, useEffect } from "react";
import styles from "../../styles/TaskInfo.module.css";
import { IoIosCheckmark } from "react-icons/io";
import { Task } from "../../api/createTaskApi";
import {useParams } from "react-router-dom";
import { useApiService } from "../../api/apiService";

interface TaskInfoProps {
  setShowModal: (show: boolean) => void;
  taskId?: number|undefined;
  task?:Task|null
  listId?:number|undefined
  handleSpecificTask: (taskId: number | undefined) => Promise<void>
  taskDetails?: Task;
  onUpdateTaskDetails:(updatedDetails: Task | undefined) => void;

  
  
}
interface Params {
  id?: string;
  [key: string]: string | undefined;
  name?: string
}

const TaskInfo = ({ setShowModal, task, taskDetails,  onUpdateTaskDetails,}: TaskInfoProps) => {
const {updateTaskByIdAPI,}= useApiService()
  const [showBorder, setShowBorder] = useState(false);

  const [selectedPriority, setSelectedPriority] = useState<string>("");
  
const [taskName, setTaskName] = useState<string>("");
const [description, setDescription] = useState<string>("");
const [dueDate, setDueDate] = useState<string>("");
const [dueTime, setDueTime] = useState<string>("");
const [reminder, setReminder] = useState<string>("");

  
  const today = new Date().toISOString().split("T")[0];

  const { id,name:listName } = useParams<Params>();
const parseListId = id ? parseInt(id, 10) : undefined;


useEffect(() => {
  if (taskDetails) {
    setTaskName(taskDetails.title );
    setDescription(taskDetails.description);
    setDueDate(taskDetails.dueDate );
    setDueTime(taskDetails.dueTime);
    setReminder(taskDetails.reminder);
    setSelectedPriority(taskDetails.priority);
  }
}, [taskDetails]);
const [fieldsUpdated, setFieldsUpdated] = useState(false);


useEffect(() => {
  if (fieldsUpdated) {
    const updatedTaskDetails: Task = {
      id:taskDetails?.id,
      title: taskName || "",
      description: description || "",
      dueDate: dueDate || "",
      dueTime: dueTime || "",
      reminder: reminder || "",
      priority: selectedPriority || "LOW",
      completed: taskDetails?.completed || false,
      archived: taskDetails?.archived || false,
    };

    updateTaskByIdAPI(updatedTaskDetails.id, updatedTaskDetails);

    onUpdateTaskDetails(updatedTaskDetails);
    setFieldsUpdated(false);
  }
}, [fieldsUpdated, taskDetails]);



const handleSave = async () => {
  try {
    
    const updatedTaskDetails: Task = {
      id:taskDetails?.id,
      title: taskName || "",
      description: description || "",
      dueDate: dueDate || "",
      dueTime: dueTime || "",
      reminder: reminder || "",
      priority: selectedPriority || "LOW",
      completed: taskDetails?.completed || false,
      archived: taskDetails?.archived || false,
    };

    onUpdateTaskDetails(updatedTaskDetails);
    console.log(updatedTaskDetails)
    setShowModal(false);
  } catch (error) {
    console.error("Error updating task:", error);
  }
};
const updateTaskDueDate = async (newDueDate: string) => {
  try {
    if (!taskDetails?.id) {
      console.error("Task ID is undefined");
      return;
    }

    const updatedTaskDetails: Task = {
      id: taskDetails.id,
      title: taskDetails.title || "", 
      description: taskDetails.description || "", 
      dueDate: newDueDate,
      dueTime: taskDetails.dueTime || "", 
      reminder: taskDetails.reminder || "", 
      priority: taskDetails.priority || "LOW", 
      completed: taskDetails.completed || false,
      archived: taskDetails.archived || false,
    };

    // await updateTaskByIdAPI(updatedTaskDetails.id, updatedTaskDetails);

    onUpdateTaskDetails(updatedTaskDetails);
  } catch (error) {
    console.error("Error updating due date:", error);
  }
};


const updateTaskDueTime = async (newDueTime: string) => {
  try {
    if (!taskDetails?.id) {
      console.error("Task ID is undefined");
      return;
    }

    const updatedTaskDetails: Task = {
      id: taskDetails.id,
      title: taskDetails.title || "", 
      description: taskDetails.description || "", 
      dueDate: taskDetails.dueDate || "", 
      dueTime: newDueTime,
      reminder: taskDetails.reminder || "", 
      priority: taskDetails.priority || "LOW", 
      completed: taskDetails.completed || false,
      archived: taskDetails.archived || false,
    };

    // await updateTaskByIdAPI(updatedTaskDetails.id, updatedTaskDetails);

    onUpdateTaskDetails(updatedTaskDetails);
  } catch (error) {
    console.error("Error updating due time:", error);
  }
};

const updateTaskReminder = async (newReminder: string) => {
  try {
    if (!taskDetails?.id) {
      console.error("Task ID is undefined");
      return;
    }

    const updatedTaskDetails: Task = {
      id: taskDetails.id,
      title: taskDetails.title || "", 
      description: taskDetails.description || "", 
      dueDate: taskDetails.dueDate || "", 
      dueTime: taskDetails.dueTime || "", 
      reminder: newReminder,
      priority: taskDetails.priority || "LOW", 
      completed: taskDetails.completed || false,
      archived: taskDetails.archived || false,
    };

    // await updateTaskByIdAPI(updatedTaskDetails.id, updatedTaskDetails);

    onUpdateTaskDetails(updatedTaskDetails);
  } catch (error) {
    console.error("Error updating reminder:", error);
  }
};

const updateTaskPriority = async (newPriority: string) => {
  try {
    if (!taskDetails?.id) {
      console.error("Task ID is undefined");
      return;
    }

    const updatedTaskDetails: Task = {
      id: taskDetails.id,
      title: taskDetails.title || "", 
      description: taskDetails.description || "", 
      dueDate: taskDetails.dueDate || "", 
      dueTime: taskDetails.dueTime || "", 
      reminder: taskDetails.reminder || "", 
      priority: newPriority,
      completed: taskDetails.completed || false,
      archived: taskDetails.archived || false,
    };

    // await updateTaskByIdAPI(updatedTaskDetails.id, updatedTaskDetails);
    console.log(updatedTaskDetails)


    onUpdateTaskDetails(updatedTaskDetails);
  } catch (error) {
    console.error("Error updating priority:", error);
  }
};

const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newDueDate = e.target.value;
  setDueDate(newDueDate);
  updateTaskDueDate(newDueDate);
  setFieldsUpdated(true);
};

const handleDueTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newDueTime = e.target.value;
  setDueTime(newDueTime);
  updateTaskDueTime(newDueTime);
  setFieldsUpdated(true);
};

const handleReminderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newReminder = e.target.value;
  setReminder(newReminder);
  updateTaskReminder(newReminder);
  setFieldsUpdated(true);
};





const handlePriorityChange = (
  event: React.ChangeEvent<HTMLSelectElement>
) => {
  const newPriority = event.target.value;
  setSelectedPriority(newPriority);
  updateTaskPriority(newPriority);
  setFieldsUpdated(true);
  console.log(newPriority)
};

  
  
  return (
    <>
      <div className={styles.modalWrapper}>
        <div
          className={styles.modalCloser}
          onClick={() => setShowModal(false)}
        ></div>
        <div className={styles.modal}>
          <div className={styles.heading}>
            <h4>
              <span style={{ padding: "10px" }}>#</span>{listName}
            </h4>
          </div>

          <div className={styles.taskDetailWrapper}>
            <div className={styles.taskFormWrapper}>
              <div>
                <button
                    className={styles.propertiesButton}
                    style={{ borderColor: task?.priority === "LOW" ? "green" : task?.priority === "MEDIUM" ? "orange" : task?.priority === "HIGH" ?"red": "none" }}
                  >
                    {task?.completed&& <IoIosCheckmark color={task?.priority === "LOW" ? "green" : task?.priority === "MEDIUM" ? "orange" : task.priority === "HIGH" ?"red": "none"} />}
                </button>
              </div>
              <div
                className={styles.inputs}
                style={{ borderColor: showBorder ? "#ccc" : "#fff" }}
                onFocus={() => setShowBorder(true)}
              >
                <textarea
                  placeholder="Task Name"
                  required
                  className={styles.taskTitle}
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                

                />

                <textarea
                  placeholder="Description"
                  className={styles.taskDesc}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
               
              </div>
            </div>
            {showBorder && (
              <div className={styles.controlBtnWrapper}>
                <button
                  onClick={() => {
                    setShowBorder(false);
                    setShowModal(true);
                  }}
                  className={styles.controlBtnClose}
                >
                  Cancel
                </button>
                <button 
                className={styles.controlBtn}
                onClick={handleSave}
                >Save
                </button>
              </div>
            )}
            <div className={styles.inputWrapper}>
              <div className={styles.inputContainer}>
                <label htmlFor="prioritySelect" className={styles.label}>
                  {" "}
                  Priority
                </label>
                <select
                  id="prioritySelect"
                  value={selectedPriority}
                  className={styles.select}
                  onChange={handlePriorityChange}
                >
                  <option value="NONE">NONE</option>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Reminder</label>
                <input type="datetime-local" className={styles.select}
                value={reminder}
                onChange={handleReminderChange}
                />
              </div>
            </div>
            <div className={styles.inputWrapper}>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Due date</label>
                <input
                  type="date"
                  min={today}
                  className={styles.select}
                  // onChange={(e) => setDueDate(e.target.value)}
                  onChange={handleDueDateChange}
                  value={dueDate}

                />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Due time</label>
                <input type="time" className={styles.select} 
                // onChange={(e) => setDueTime(e.target.value)}
                onChange={handleDueTimeChange}
                value={dueTime}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskInfo;
