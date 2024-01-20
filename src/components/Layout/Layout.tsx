import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from '../sidenavbar/Sidebar'
import styles from '../../styles/layout.module.css'

interface NewList {
  id: number;
  text: string;
}
const Layout = () => {
  const [authToken, setAuthToken] = useState("");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const authState = localStorage.getItem("authState");
    const token = authState ? JSON.parse(authState).accessToken : "";
    if(token) {
      setAuthToken(token);
    }
    setLoaded(true);
  }, [])
  
  return (
    <>
      {
        (
          loaded ? (
            (authToken) ? (
              <div style={{ display: "flex"}}>
                <Sidebar/>
                <div className={styles.right}>
                  <Outlet />
                </div>
              </div>
              ) : (
                <Navigate to={"/login"} />
              )
          ): null
        )
      }
    </>
  )
}

export default Layout