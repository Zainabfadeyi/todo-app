import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from 'react-router-dom'
import InactivityTimeout from "../../inactiveness/inactivityTimeout";
import InactivityWarning from "../../inactiveness/InactivityWarning";


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
              <>
              <div>
                  <Outlet />
              </div>
              </>
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