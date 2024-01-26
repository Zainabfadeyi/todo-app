import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../app/slices/modalSlice';
import '../styles/modal.css';
import { RootState } from '../app/store';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean        
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeModal());
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        {children}
        
      </div>
    </div>
  );
};

export default Modal;
