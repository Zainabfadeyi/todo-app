import React, { useState, FormEvent } from "react";
import { Button, Dialog, DialogTitle, DialogContentText, DialogActions } from "@mui/material";


interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteList: () => void;
  deleteListAPI: (listId: number|undefined) => Promise<void>;
  listId: number| undefined;
  listName: string;

}

export const DeleteListPopup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  onDeleteList,
  deleteListAPI,
  listId,
  listName
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setIsDeleting(true); 
      await deleteListAPI(listId);
      onDeleteList(); 
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
            width={"400px"}
            style={{ fontSize: "15px", padding: "10px", marginLeft: "10px" }}
          >
            This will permanently delete <span style={{ fontWeight: "600" }}>&quot;{(listName) || "this List"}&quot;</span>and all its tasks. This can’t be undone.
        
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

export default DeleteListPopup;
