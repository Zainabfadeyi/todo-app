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
          Delete Task
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContentText
            id="dialog-description"
            width={"400px"}
            style={{ fontSize: "18px", padding: "10px", marginLeft: "10px" }}
          >
            Are you sure you want to delete <span style={{ fontWeight: "600" }}>&quot;{(taskName) || "this List"}&quot;</span>
          </DialogContentText>
          <DialogActions>
            <Button
              onClick={() => {
                onClose();
              }}
              type="button"
              style={{
                backgroundColor: "#f5f5f5",
                fontSize: "10px",
                color: "black",
                boxSizing: "border-box",
              }}
              disabled={isDeleting} 
            >
              Cancel
            </Button>
            <Button
              autoFocus
              type="submit"
              style={{
                backgroundColor: "#DC4C3E",
                fontSize: "10px",
                color: "white",
                boxSizing: "border-box",
              }}
              disabled={isDeleting} 
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
