import React,{useState,useEffect,useRef} from 'react';
import {IoMdMore } from "react-icons/io";
import { AiOutlineEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoMdArchive } from "react-icons/io";
import styles from "../../styles/TaskOnHover.module.css";



const TaskOnHover = () => {
   const [showMoreOptions, setShowMoreOptions] = useState(false);
   const TaskDropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleOutEdit = (event: MouseEvent) => {
      if (
        TaskDropdownRef.current &&
        !TaskDropdownRef.current.contains(event.target as Node)
      ) {
        setShowMoreOptions(false);
      }
    };

    document.addEventListener("click", handleOutEdit);

    return () => {
      document.removeEventListener("click", handleOutEdit);
    };
  }, []);

  return (
   <>
    <div  >
      <div className={styles.TaskIcon} ref={TaskDropdownRef}>
      <button
         onClick={() => setShowMoreOptions(!showMoreOptions)}
         className={styles.taskMoreButtons}
         >
         <IoMdMore />
      </button>
      </div>
         {showMoreOptions &&(
               <div className={styles.dropdownmore}>
                     <div className={styles.itemDropdownmore}>
                     <AiOutlineEdit />
                     <p>Edit</p>
                     </div>
                     <hr  className={styles.linebreak}/>
                     <div className={styles.itemDropdownmore}>
                     <IoMdArchive />
                     <p>Archive</p>
                     </div>
                     <hr className={styles.linebreak}/>
                     <div
                     style={{ color: "red" }}
                     className={styles.itemDropdownmore}
                     >
                     <RiDeleteBin5Line />
                     <p>Delete</p>
                     </div>
            </div>)}
         </div>
    </>
  )
}

export default TaskOnHover