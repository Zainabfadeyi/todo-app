import React, { useState } from 'react';
import Popup from './Popup';
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';

interface TodoProps {
  todos: TodoItem[];
  completeTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  updateTodo: (id: number, value: string) => void;
}

interface TodoItem {
  id: number;
  title: string;
  isComplete: boolean;
}

function Todo({ todos, completeTodo}: TodoProps) {
  // const [edit, setEdit] = useState({
  //   id: null as null | number,
  //   value: '',
  // });

  // const submitUpdate = (value: string) => {
  //   setEdit({
  //     id: null,
  //     value: '',
  //   });
  // };

//   if (edit.id !== null) {
//     return <Popup 
//     isOpen={isPopupOpen}
//     onClose={closePopup}
//     onSubmit={submitUpdate} />;
//   }

  // return todos.map((todo, index) => (
    // <div
    //   className={todo.isComplete ? 'todo-row complete' : ' todo-row'}
    //   key={index}
    // >
    //   <div key={todo.id} onClick={() => completeTodo(todo.id)}>
    //     {todo.title}
    //   </div>
    //   <div className="icons">
    //     <RiCloseCircleLine
        
    //       className="delete-icon"
    //     />
    //     <TiEdit
    //       onClick={() => setEdit({ id: todo.id, value: todo.title })}
    //       className="edit-icon"
    //     />
    //   </div>
    // </div>
  // ));
}

export default Todo;
