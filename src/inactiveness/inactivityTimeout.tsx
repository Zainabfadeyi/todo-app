import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../app/slices/authSlice';
import { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';

const startLogoutTimer = (logoutAction: () => void): (() => void) => {
  const inactivityTimeout = 5*60 * 1000;
  console.log('Inactivity Timeout set for:', inactivityTimeout / 1000, 'seconds');
  
  let timeoutId: ReturnType<typeof setTimeout>;
  const resetTimer = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      localStorage.clear()
      window.location.replace("/login");
      logoutAction();
    }, inactivityTimeout);
  };

  const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'focus'];

  events.forEach((event) => {
    document.addEventListener(event, resetTimer);
  });

  resetTimer();

  return () => {
    clearTimeout(timeoutId);
    events.forEach((event) => {
      document.removeEventListener(event, resetTimer);
    });
  };
};


const InactivityTimeout: React.FC = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const navigate=useNavigate()

  useEffect(() => {
    const clearLogoutTimer = startLogoutTimer(() => dispatch(logout()));

    return () => {
      clearLogoutTimer(); 
    };
  }, [dispatch,navigate]);

return null;
};

export default InactivityTimeout;
