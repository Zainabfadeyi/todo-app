import React, { ChangeEvent, useState, useRef, FormEvent } from 'react';
import styles from "../../styles/taskform.module.css"
interface TaskFormProps {
  onSubmit: (task: Task) => void;
  onCancel: () => void;
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

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel }) => {
  const [showBorder, setShowBorder] = useState(false);
  const [task, setTask] = useState<Task>({
    id: 0,
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    dueTime: '',
    reminder: '',
  });

  const handleChange = (field: keyof Task, value: string) => {
    setTask((prevTask) => ({
      ...prevTask,
      [field]: value,
    }));
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange('dueDate', e.target.value);
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange('dueTime', e.target.value);
  };

  const handleReminderChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange('reminder', e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      id: Math.floor(Math.random() * 10000),
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      dueTime: task.dueTime,
      reminder: task.reminder,
    });
    setTask({
      id: 0,
      title: '',
      description: '',
      priority: 'Low',
      dueDate: '',
      dueTime: '',
      reminder: '',
    });
  };

  return (
    <>
    <div className={styles.formWraper} style={{ borderColor: showBorder ? "#ccc" : "#fff" }} onFocus={() => setShowBorder(true)}>
    <form onSubmit={handleSubmit}>
      <div className={styles.TaskWrapper}>
        <div className={styles.formTnD}>
            
            <div>
                <input
                  placeholder='Task name '
                  type="text"
                  value={task.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                  className={styles.Title}
                />
            </div>
        

                <div >
      
                  <textarea
                    className={styles.TaskDescription}
                    placeholder='Description'
                    value={task.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                </div>
            </div>

          <div  className={styles.OtherWrapper}>
            <div className={styles.inputContainer}>
              <label className={styles.Tasklabel}>Priority</label>
              <select
                value={task.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className={styles.taskselect}  
              >
                <option value="">Select...</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>

              </select>
            </div>

            <div className={styles.inputContainer}>
              <label className={styles.Tasklabel}>Due Date</label>
              <input
                type="date"
                value={task.dueDate}
                onChange={handleDateChange}
                className={styles.taskselect}
              />
            </div>

            <div className={styles.inputContainer}>
              <label className={styles.Tasklabel}>Due Time</label>
              <input
                type="time"
                value={task.dueTime}
                onChange={handleTimeChange}
                className={styles.taskselect}
              />
            </div>

            <div className={styles.inputContainer}>
              <label className={styles.Tasklabel}>Reminder</label>
              <input
                type="datetime-local"
                value={task.reminder}
                onChange={handleReminderChange}
                className={styles.taskselect}
              />
            </div>
        </div>
        <hr />

          <div className={styles.TaskButtonform}>
            <button type="button" onClick={() => onCancel()}
            className={styles.controlBtnClose}>
              Cancel
            </button>
            <button type="submit" className={styles.controlBtn}>Add Task</button>
          </div>
      </div>
    </form>
    </div>
    </>
  );
};

export default TaskForm;
