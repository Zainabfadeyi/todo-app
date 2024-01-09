import React, { useState, FormEvent } from "react";
import { Button, Dialog, DialogTitle, DialogContentText, DialogActions } from "@mui/material";



interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteTask: () => void;
  deleteTaskAPI: (listId: number|undefined) => Promise<void>;
  taskId: number| undefined;
  taskName: string;

}

export const DeleteTaskPopup
: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  onDeleteTask,
  deleteTaskAPI,
  taskId,
  taskName
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setIsDeleting(true); 
      onDeleteTask(); 
      onClose();
    } catch (error) {
      console.error("Error deleting list:", error);
    } finally {
      setIsDeleting(false); 
    }
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title" style={{ fontSize: "19px", color: "red" }}>
          Delete List
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContentText
            id="dialog-description"
            width={"500px"}
            style={{ fontSize: "18px", padding: "10px", marginLeft: "10px" }}
          >
            Are you sure you want to delete {(taskName) || "this List"}
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
              disabled={isDeleting} // Disable the button during deletion
            >
              Cancel
            </Button>
            <Button
              autoFocus
              type="submit"
              style={{
                backgroundColor: "red",
                fontSize: "12px",
                color: "white",
                boxSizing: "border-box",
              }}
              disabled={isDeleting} // Disable the button during deletion
            >
              Delete
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default DeleteTaskPopup
;
