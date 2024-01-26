
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { openModal } from '../app/slices/modalSlice';

const InactivityWarning: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const inactivityWarningTimeout = 4*60* 1000;
    console.log('Inactivity Warning set for:', inactivityWarningTimeout / 1000, 'seconds');

    let timeoutId: ReturnType<typeof setTimeout>;

    const showWarning = () => {
      dispatch(openModal());
    };

    timeoutId = setTimeout(() => {
      showWarning();
    }, inactivityWarningTimeout);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [dispatch, navigate]);

  return null;
};

export default InactivityWarning;
