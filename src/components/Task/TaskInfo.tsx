import { Hidden } from "@mui/material";
import React, { useState, useEffect } from "react";
import styles from "../../styles/TaskInfo.module.css";
import { IoIosCheckmark } from "react-icons/io";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  dueTime: string;
  reminder: string;
}
interface TaskInfoProps {
  setShowModal: (show: boolean) => void;
  task?: Task; // Optional task prop for editing existing task
}
const TaskInfo = ({ setShowModal, task }: any) => {
  const [checked, setChecked] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showBorder, setShowBorder] = useState(false);

  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  const handlePriorityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const priority = event.target.value;
    setSelectedPriority(priority);
  };
  useEffect(() => {
    // Set initial values when the task prop is provided
    if (task) {
      setChecked(true);
      setShowBorder(true);
      setSelectedPriority(task.priority);
    }
  }, [task]);
  const today = new Date().toISOString().split("T")[0];
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
              <span style={{ paddingRight: "10px" }}>#</span>list name
            </h4>
          </div>

          <div className={styles.taskDetailWrapper}>
            <div className={styles.taskFormWrapper}>
              <div>
                <button className={styles.taskRadioBtn}></button>
              </div>
              <div
                className={styles.inputs}
                style={{ borderColor: showBorder ? "#ccc" : "#fff" }}
                onFocus={() => setShowBorder(true)}
              >
                <textarea
                  placeholder="Task Name"
                  className={styles.taskTitle}
                  defaultValue={task?.title || ""}
                />

                <textarea
                  placeholder="Description"
                  className={styles.taskDesc}
                  defaultValue={task?.description || ""}
                />
              </div>
            </div>
            {showBorder && (
              <div className={styles.controlBtnWrapper}>
                <button
                  onClick={() => setShowBorder(false)}
                  className={styles.controlBtnClose}
                >
                  Cancel
                </button>
                <button className={styles.controlBtn}>Save</button>
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
                  value={selectedPriority || ""}
                  onChange={handlePriorityChange}
                  className={styles.select}
                >
                  <option value="">Select...</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Reminder</label>
                <input type="datetime-local" className={styles.select} />
              </div>
            </div>
            <div className={styles.inputWrapper}>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Due date</label>
                <input
                  type="date"
                  min={today}
                  className={styles.select}
                  defaultValue={task?.dueDate || ""}
                />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Due time</label>
                <input type="time" className={styles.select} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskInfo;
