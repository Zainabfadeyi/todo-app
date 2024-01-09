import React, { useState, useEffect } from "react";
import styles from "../../styles/TaskInfo.module.css";
import { IoIosCheckmark } from "react-icons/io";
import { Task } from "../../api/createTaskApi";
import {useParams } from "react-router-dom";
import { useApiService } from "../../api/apiService";

interface TaskInfoProps {
  setShowModal: (show: boolean) => void;
  taskId?: number;
  task?:Task|null
  updateTaskAPI: (listId:number|undefined,taskId: number|undefined, updatedTask: Task) => Promise<Task>;
  listId:number|undefined
  handleSpecificTask: (taskId: number | undefined) => Promise<void>
  taskDetails?: Task;
  
}
interface Params {
  id?: string;
  [key: string]: string | undefined;
  name?: string
}

const TaskInfo = ({ setShowModal, taskId, task, listId, updateTaskAPI, handleSpecificTask, taskDetails}: TaskInfoProps) => {
  const{getTaskDetailsAPI}= useApiService()
  const [showBorder, setShowBorder] = useState(false);
  // const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  // const [taskName, setTaskName] = useState<string>("");
  // const [description, setDescription] = useState<string>("");
  // const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  // const [dueTime, setDueTime] = useState<string | undefined>(undefined);
  // const [reminder, setReminder] = useState<string | undefined>(undefined);
  const [selectedPriority, setSelectedPriority] = useState<string>("");
const [taskName, setTaskName] = useState<string>("");
const [description, setDescription] = useState<string>("");
const [dueDate, setDueDate] = useState<string>("");
const [dueTime, setDueTime] = useState<string>("");
const [reminder, setReminder] = useState<string>("");

  const [updatedTask, setUpdatedTask] = useState<Task>({
    id: 0,
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    reminder: "",
    priority: "low",
    completed: false,
    archived: false,
  });

  const handlePriorityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const priority = event.target.value;
    setSelectedPriority(priority);
  };

  const handleInputChange = (field: keyof Task, value: string) => {
    setUpdatedTask((prevTask) => ({ ...prevTask, [field]: value }));
  };




  
  
  const today = new Date().toISOString().split("T")[0];
 
  const handleSave = async () => {
    try {
      const updatedTaskCopy = {
        
          title: taskName,
          description,
          dueDate: dueDate || "", 
          dueTime: dueTime || "", 
          reminder: reminder || "", 
          priority: selectedPriority || "low", 
          completed:false
      };
      await updateTaskAPI(listId, taskId, updatedTaskCopy);
      console.log(updatedTaskCopy)

      setShowModal(false);
      
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

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
              <span style={{ paddingRight: "10px" }}>#</span>{listName}
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
                  className={styles.taskTitle}
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}

                />

                <textarea
                  placeholder="Description"
                  className={styles.taskDesc}
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
                // onClick={handleSave}
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
                  onChange={(e) => setSelectedPriority(e.target.value)}
                >

                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Reminder</label>
                <input type="datetime-local" className={styles.select}
                onChange={(e) => setReminder(e.target.value)}
                value={reminder}
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
                  onChange={(e) => setDueDate(e.target.value)}
                  value={dueDate}

                />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Due time</label>
                <input type="time" className={styles.select} 
                onChange={(e) => setDueTime(e.target.value)}
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
