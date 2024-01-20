
import React, { useState } from 'react';
import { Task } from '../../api/createTaskApi';
import styles from "../../styles/upcoming.module.css"
import { IoIosCheckmark } from 'react-icons/io';

interface TaskListSectionProps {
  tasks: Task[];
  dueDate: string; 
  onTaskClick: (taskId: number|undefined) => void;
  onUpdateTask: (updatedTask: Task)=> void
}


const TaskListSection: React.FC<TaskListSectionProps> = ({ tasks, dueDate, onTaskClick ,onUpdateTask}) => {
  

  return (
    <div className={styles.PropsCover}>
    <div className={styles.Cover}>
      <div className={styles.SectionBoard}>{dueDate}</div>
      </div>
      
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
                <div className={styles.Content } onClick={() => onTaskClick(task.id)}>
                  
                    <h3 style={{fontSize:"14px"}}>{task.title}</h3>
                    <p  style={{fontSize:"12px"}}>{task.description}</p>
                    <p  style={{fontSize:"12px"}}>{task.dueDate}</p>
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