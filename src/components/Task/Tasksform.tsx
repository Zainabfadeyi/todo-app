import React, { ChangeEvent, useState, useRef, FormEvent, useEffect } from 'react';
import styles from "../../styles/taskform.module.css"
import CustomDatePicker from './CustomDatePicker';
import { MdInbox, MdExpandMore  } from "react-icons/md";


interface TaskFormProps {
  onSubmit:(task: Task, listId: number | undefined) => void
  onCancel: () => void;
  listId:number|undefined
  handleChange: (field: keyof Task, value: string) => void;
  handleCustomDateChange: (value: string) => void;
  handleTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleReminderChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface Task {
  id?:number
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  dueTime: string;
  reminder: string;
  completed:boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel,listId}) => {
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
    title: '',
    description: '',
    priority: 'LOW',
    dueDate: '',
    dueTime: '',
    reminder: '',
    completed:false
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
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log('Submitting task:', task, 'with listId:', listId);
      setIsSubmitting(true);

      console.log("Submitting task:", task, "with listId:", listId);
      onSubmit(task,listId);
    } catch (error) {
      console.error("Error submitting task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todayDate = new Date();
  useEffect(() => {
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
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>

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
