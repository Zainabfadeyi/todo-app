import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from '../sidenavbar/Sidebar'
import styles from '../../styles/layout.module.css'

interface NewList {
  id: number;
  text: string;
}
const AuthLayout = () => {
  const [authToken, setAuthToken] = useState("");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const authState = localStorage.getItem("authState");
    const token = authState ? JSON.parse(authState).accessToken : "";
    console.log(token);
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
            (!authToken) ? (
              <div>
                  <Outlet />
              </div>
              ) : (
                <Navigate to={"/Login"} />
              )
          ): null
        )
      }
    </>
  )
}

export default AuthLayout