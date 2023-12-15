import { Hidden } from '@mui/material'
import React, { useState } from "react"
import styles from "../../styles/TaskInfo.module.css";
import { IoIosCheckmark} from "react-icons/io";

interface Task {
   id: number;
   title: string;
   description: string;
   priority: string;
   dueDate: string;
   dueTime: string;
   reminder: string;
 }
const TaskInfo = ({ setShowModal }: any) => {
   const [checked, setChecked] = useState(false);
   const [tasks, setTasks] = useState<Task[]>([]);
   const [showBorder, setShowBorder] = useState(false);
  return (
   <>
   <div className={styles.modalWrapper}>
      <div className={styles.modalCloser} onClick={() => setShowModal(false)}>
      </div> 
      <div className={styles.modal}>
         <div className={styles.heading}>
            <h4><span style={{ paddingRight: "10px"}}>#</span>list name</h4>
         </div>
         {/* <hr /> */}
         <div className={styles.taskDetailWrapper}>
            <div className={styles.taskFormWrapper}>
               <div>
                  <button className={styles.taskRadioBtn}></button>
               </div>
               <div className={styles.inputs} style={{ borderColor: showBorder ? "#ccc" : "#fff" }} onFocus={() => setShowBorder(true)}>
                  <textarea
                     placeholder='Task Name'
                     className={styles.taskTitle}
                  />
               
                  <textarea
                     placeholder="Description"
                     className={styles.taskDesc}
                  />
               </div>
            </div>
            {
               showBorder && (
                  <div className={styles.controlBtnWrapper}>
                     <button onClick={() => setShowBorder(false)} className={styles.controlBtnClose}>cancel</button>
                     <button className={styles.controlBtn}>save</button>
                  </div>
               )
            }
         </div>
      </div>
   </div>
   </>
  )
}

export default TaskInfo