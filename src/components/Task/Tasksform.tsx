import React, { ChangeEvent, useState, useRef, FormEvent, useEffect } from 'react';
import styles from "../../styles/taskform.module.css"
import CustomDatePicker from './CustomDatePicker';
import { MdInbox, MdExpandMore  } from "react-icons/md";


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
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleCustomDateChange = (value: string) => {
    setTask((prevTask) => ({
      ...prevTask,
      dueDate: value,
    }));
  };
  const toggleShortcuts = () => {
    setShowShortcuts(!showShortcuts);
  };

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
  const handleShortcutChange = (shortcut: string) => {
    let newDate:string;

    switch (shortcut) {
      case 'today':
        newDate = today;
        break;
      case 'tomorrow':
        const tomorrow = new Date();
        tomorrow.setDate(todayDate.getDate() + 1);
        newDate = tomorrow.toISOString().split('T')[0];
        break;
     
      case 'nextWeekend':
        const nextWeekend = new Date();
        const daysUntilNextSaturday = 6 - nextWeekend.getDay() + 1;
        nextWeekend.setDate(todayDate.getDate() + daysUntilNextSaturday);
        newDate = nextWeekend.toISOString().split('T')[0];
        break;
      case 'nextWeek':
        const nextWeek = new Date();
        nextWeek.setDate(todayDate.getDate() + 7); // Adding 7 days to get the next week
        newDate = nextWeek.toISOString().split('T')[0];
        break;
        
      default:
        newDate = today;
    }
    console.log("sdfasdfasdfsdfsdfsdf", newDate);
    setTask((prevTask) => ({
      ...prevTask,
      dueDate: newDate,
    }));
    setShowShortcuts(false);
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
      priority: '',
      dueDate: '',
      dueTime: '',
      reminder: '',
    });
  };
  const today = new Date().toISOString().split('T')[0];
  const todayDate = new Date();
  useEffect(() => {
    console.log(task)
  }, [task])
  
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
              <div className={styles.CustomDatepicker}>
              <CustomDatePicker setTask={setTask}/>
              </div>
              </div>
            <div className={styles.inputContainer}>
              <label className={styles.Tasklabel}>Due Time</label>
              <input
                type="time"
                value={task.dueTime}
                onChange={handleTimeChange}
                className={styles.taskSelectTime}
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
        <div className={styles.footer}>
          <div className={styles.Listform}>
            <div className={styles.inboxWrapper}>
          
          <button type="button" className={styles.inboxButton}>
            <span className={styles.inboxSpan}>
              <div className={styles.info}>
                  <MdInbox />
                      <span>
                          inbox
                      </span>
                  <MdExpandMore />
              </div>
              </span>
            </button>
            
            </div>
          </div>
          <div className={styles.TaskButtonform}>
            <button type="button" onClick={() => onCancel()}
            className={styles.controlBtnClose}>
              Cancel
            </button>
            <button type="submit" className={styles.controlBtn}>
              Add Task
              </button>
          </div>
        </div>
      </div>
    </form>
    </div>
    </>
  );
};

export default TaskForm;
