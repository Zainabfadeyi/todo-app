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
}
interface NewList {
  id: number;
  text: string;
}
const handleSubmitLogic = (
  listName: string,
  onSubmit: (nlist: NewList) => void
) => {
  onSubmit({
    id: Math.floor(Math.random() * 10000),
    text: listName,
  });
};

export const Popup: React.FC<PopupProps> = (
  { isOpen, onClose, onSubmit },
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
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmitLogic(listName, onSubmit);
    setListName("");
    onClose(); // Optionally close the dialog after submission
  };

  const [newLists, setNewLists] = useState<NewList[]>([]);

  const addNewList = (nlist: NewList) => {
    if (!nlist.text || /^\s*$/.test(nlist.text)) {
      return;
    }
    // Add your logic to handle the new list
    setNewLists((prevLists) => [...prevLists, nlist]);
  };

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
