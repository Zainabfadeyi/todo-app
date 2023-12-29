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
   DialogActions,
   DialogContentText,
 } from "@mui/material";
 
 interface EditPopupProps {
   isOpen: boolean;
   onClose: () => void;
   onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  list: NewList | null;
 }
 interface NewList {
   id: number;
   name: string;
 }

 
 export const Popup: React.FC<EditPopupProps> = (
   { isOpen, onClose, list,onSubmit  },
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

   useEffect(() => {
    if (list) {
      setListName(list.name);
    }
  }, [list]);
  
   return (
     <>
       <Dialog
         open={isOpen}
         onClose={onClose}
         aria-labelledby="dialog-title"
         aria-describedby="dialog-description"
       >
         <DialogTitle id="dialog-title">Edit List</DialogTitle>
         <form onSubmit={(e) => onSubmit(e)}>
           <input
             placeholder="Edit List"
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
                 setListName("");
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
               Save
             </Button>
           </DialogActions>
         </form>
       </Dialog>
     </>
   );
 };
 
 export default Popup;
 