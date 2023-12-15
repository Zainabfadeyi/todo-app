import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../sidenavbar/Sidebar'
import styles from '../../styles/layout.module.css'

const Layout = () => {
  return (
    <div style={{ display: "flex"}}>
      <Sidebar onAddList={() => {}} />
      <div className={styles.right}>
         <Outlet />
      </div>
    </div>
  )
}

export default Layout