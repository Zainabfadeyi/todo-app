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
  onSubmit: (nlist: NewList) => void;
  createListAPI: (listName: string) => Promise<void>;
  
}
interface NewList {
  id: number;
  name: string;
}


export const Popup: React.FC<PopupProps> = (
  { isOpen, onClose, onSubmit,createListAPI },
  props
) => {
  const [listName, setListName] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setListName(e.target.value);
  };
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  

  const handleSubmit =  async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createListAPI(listName);
      setListName("");
      onClose();
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  const [newLists, setNewLists] = useState<NewList[]>([]);

  const addNewList = (nlist: NewList) => {
    if (!nlist. name || /^\s*$/.test(nlist.name)) {
      return;
    }
   
    setNewLists((prevLists) => [...prevLists, nlist]);
  };
  useEffect(() => {
 
    if (isOpen) {
      setNewLists([]);
    }
  }, [isOpen])

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">Add List</DialogTitle>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Create a List"
            type="text"
            value={listName}
            onChange={handleChange}
            className="todo-input edit"
            style={{
              margin: "0 20px",
              outline: "none",
              border: "1px solid #555",
              fontSize: "16px",
              padding: "8px 15px",
            }}
            ref={inputRef}
            required
          />
          <DialogContentText
            id="dialog-description"
            width={"500px"}
          ></DialogContentText>
          <DialogActions>
            <Button
              onClick={() => {
                setListName(""); // Reset the listName state
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
              type="submit"
              style={{
                backgroundColor: "red",
                fontSize: "12px",
                color: "white",
                boxSizing: "border-box",
              }}
            >
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Popup;
