
import React from 'react';
import { Task } from '../../api/createTaskApi';
import styles from "../../styles/upcoming.module.css"
import { IoIosCheckmark } from 'react-icons/io';

interface TaskListSectionProps {
  tasks: Task[];
  dueDate: string; // Assuming dueDate is a string for simplicity
}

const TaskListSection: React.FC<TaskListSectionProps> = ({ tasks, dueDate }) => {
  return (
    <div>
    <div style={{width:"200%", marginRight:"40px", paddingRight:"50px"}}>
      <h4 >{dueDate}</h4>
      </div>
      {/* <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <p>{task.title}</p>
            <p>{task.description}</p>
          
          </li>
        ))}
      </ul> */}
            <div style={{ textAlign: "left" }} className={styles.taskname}>
            {tasks.map((task, index) => (
              <>
              <div key={index} className={styles.properties}>
                
                <button
                    className={styles.propertiesButton}
                    style={{ borderColor: task.priority === "LOW" ? "green" : task.priority === "MEDIUM" ? "orange" : task.priority === "HIGH" ?"red": "none" }}
                  >
                </button>
                <div className={`${styles.Content} ${task.completed ? styles.completedTask : ''}`}></div>
                <div className={styles.Content}>
                  
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>{task.dueDate}</p>
                    <p>{task.todoList?.name}</p>
                </div>
                
                </div>
                <div style={{margin:"10px"}}></div>
               </>
               ))}
          </div>

   
    </div>
  );
};

export default TaskListSection;