import React, {
  ChangeEvent,
  useState,
  useEffect,
  useRef,
  FormEvent,
} from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
} from "@mui/material";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteAll: () => void;
}

export const DeletePopup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  onDeleteAll,
}) => {
  const handleDelete = () => {
    onDeleteAll(); // Call the onDeleteAll function to perform the deletion
    onClose();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle
          id="dialog-title"
          style={{ fontSize: "19px", color: "red" }}
        >
          Delete All Task
        </DialogTitle>
        <DialogContentText
          id="dialog-description"
          width={"500px"}
          style={{ fontSize: "18px", padding: "10px", marginLeft: "10px" }}
        >
          Are you sure you want to delete all task?
        </DialogContentText>
        <DialogActions>
          <Button
            onClick={() => {
              onClose();
            }}
            type="button"
            style={{
              backgroundColor: "grey",
              fontSize: "10px",
              color: "black",
              boxSizing: "border-box",
            }}
          >
            Cancel
          </Button>
          <Button
            autoFocus
            onClick={handleDelete}
            type="button"
            style={{
              backgroundColor: "red",
              fontSize: "12px",
              color: "white",
              boxSizing: "border-box",
            }}
          >
            Delete
            
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeletePopup;
