import React, { useState } from "react";
import { Outlet } from 'react-router-dom'
import Sidebar from '../sidenavbar/Sidebar'
import styles from '../../styles/layout.module.css'

interface NewList {
  id: number;
  text: string;
}
const Layout = () => {
  const [lists, setLists] = useState<NewList[]>([]);
  const handleAddList = (newList: NewList) => {
    setLists((prevLists) => [...prevLists, newList]);
  };
  return (
    <div style={{ display: "flex"}}>
      <Sidebar/>
      <div className={styles.right}>
         <Outlet />
      </div>
    </div>
  )
}

export default Layout