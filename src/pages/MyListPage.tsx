import { Popup } from "../components/Todolist/Popup";
import styles from "../styles/list.module.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NewList {
  id: number;
  text: string;
}
interface Todo {
  id: number;
  text: string;
  title: string;
  isComplete: boolean;
  todoId: number;
}
function MyListPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [lists, setLists] = useState<NewList[]>([]);
  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };
  const handleSubmit = (newList: NewList) => {
    if (!newList.text || /^\s*$/.test(newList.text)) {
      return;
    }
    // Handle the logic for adding a new list
    setLists((prevLists) => [...prevLists, newList]);
    console.log("New list submitted:", newList);

    closePopup();
    const newTodos: NewList[] = [newList, ...lists];
    setLists(newTodos);
    console.log(newTodos);
    navigate(`/list/${newList.id}/${encodeURIComponent(newList.text)}`);
  };
  const addTodo = (todo: NewList) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }
  };
  const handleAddListFromSidebar = (newList: NewList) => {
    setLists((prevLists) => [...prevLists, newList]);
  };

  const navigate = useNavigate();

  return (
    <>
      <div className={styles.listContainer}>
        <div className={styles.listContent}>
          <header>
            <div className="listName">
              <h3>My list</h3>
            </div>
          </header>
          <hr style={{ width: "100%" }} />
          <div className={styles.addList} onClick={openPopup}>
            <button className={styles.listButton}>+ Add List</button>
          </div>
          <ul>
            {lists.map((list) => (
              <li
                className="list-items"
                key={list.id}
                style={{ textAlign: "center" }}
              >
                {list.text}
              </li>
            ))}
          </ul>
        </div>
        <Popup
          isOpen={isPopupOpen}
          onClose={closePopup}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}

export default MyListPage;
