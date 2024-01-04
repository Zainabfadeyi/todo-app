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

interface PopupTaskProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteAll: () => void;
  deleteTaskAPI: (listId: number|undefined) => Promise<void>;
  listId: number| undefined;
}

export const DeletePopup: React.FC<PopupTaskProps> = ({
  isOpen,
  onClose,
  onDeleteAll,
  deleteTaskAPI,
  listId
}) => {
  
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setIsDeleting(true); 
      await deleteTaskAPI(listId);
      onDeleteAll(); 
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
        <DialogTitle
          id="dialog-title"
          style={{ fontSize: "19px", color: "red" }}
        >
          Delete All Task
        </DialogTitle>
        <form onSubmit={handleDelete}>
        <DialogContentText
          id="dialog-description"
          width={"500px"}
          style={{ fontSize: "18px", padding: "10px", marginLeft: "10px" }}
        >
          Are you sure you want to delete all task?
        </DialogContentText>
        <DialogActions>
          <Button
            autoFocus
            type="button"
            style={{
              backgroundColor: "grey",
              fontSize: "10px",
              color: "black",
              boxSizing: "border-box",
            }}
            disabled={isDeleting} 
            onClick={()=> {onClose()}}
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

export default DeletePopup;
