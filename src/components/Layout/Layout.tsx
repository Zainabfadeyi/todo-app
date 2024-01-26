import React, { useEffect, useState } from "react";
import { Navigate, Outlet,useNavigate } from 'react-router-dom'
import Sidebar from '../sidenavbar/Sidebar'
import styles from '../../styles/layout.module.css'
import InactivityTimeout from "../../inactiveness/inactivityTimeout";
import InactivityWarning from "../../inactiveness/InactivityWarning";
import Modal from "../../inactiveness/Modal";
import { useSelector } from 'react-redux';
import { RootState } from "../../app/store";
import { useDispatch } from "../../app/hook";
import { closeModal, openModal } from "../../app/slices/modalSlice";
import { logout } from '../../app/slices/authSlice';
import { clearUser } from '../../app/slices/user.slice';

const Layout = () => {
  const [authToken, setAuthToken] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [countdown, setCountdown] = useState<number>(60); 
  useEffect(() => {
    const authState = localStorage.getItem("authState");
    const token = authState ? JSON.parse(authState).accessToken : "";
    if(token) {
      setAuthToken(token);
    }
    setLoaded(true);
  }, [])
  
  
  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prev) => prev - 1);
      } else {
        clearInterval(timer);
        dispatch(openModal());
        resetTimer();

      }
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);
  const isModalOpen = useSelector((state:RootState) => state.modal.isOpen);
  const dispatch = useDispatch();
  const navigate= useNavigate()

  const handleClose = () => {
    resetTimer()
    dispatch(closeModal());
  };
  const resetTimer = () => {

    setCountdown(6089);
  };

  const handleLogout = () => {

    dispatch(logout());
    dispatch(clearUser());

    navigate("/login")
  };
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };
  
  
  return (
    <>
      {
        (
          loaded ? (
            (authToken) ? (
              <div style={{ display: "flex"}}>
                <InactivityWarning />
                <Modal isOpen={isModalOpen}>
                <div className="modal-overlay">
                  <div className="modalss">
                    
                    <p style={{ textAlign: "center" }}>
                      Warning: Inactivity may log you out. 
                      Please interact with the page to stay logged in.
                      </p>
                      <span style={{display:"flex", justifyContent:"center", color:"red", fontSize: "30px", padding: "10px 0", fontWeight: "600"}}>{formatTime(countdown)}</span>
                      <div className="ModalButton" style={{ justifyContent: "space-between" }}>
                        <button
                        style={{
                          backgroundColor: "#f5f5f5",
                          fontSize: "14px",
                          color: "black",
                          padding:"10px 20px",
                          boxSizing: "border-box",
                          borderRadius:"10px",
                          border:"none",
                          cursor:"pointer",
                          fontWeight: "500"
                        }}
                        onClick={handleClose}>Cancel</button>
                        <button 
                        style={{
                                  backgroundColor: "#DC4C3E",
                                  fontSize: "14px",
                                  color: "white",
                                  padding:"10px 20px",
                                  boxSizing: "border-box",
                                  border:"none",
                                  borderRadius:"10px",
                                  cursor:"pointer",
                                  fontWeight: "500"
                                  }}
                                  onClick={handleLogout} >Logout
                        </button>
                      </div>
                    
                  </div>
                  
                  <button className="close-button" onClick={handleClose}>
                      &times;
                    </button>
                  
                </div>
                </Modal>
                <InactivityTimeout />
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