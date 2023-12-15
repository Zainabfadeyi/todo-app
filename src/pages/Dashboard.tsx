import Sidebar from '../components/sidenavbar/Sidebar'
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

interface NewList {
  id:number;
  text: string;
}


function Dashboard() {
  const navigate = useNavigate();
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
    // Navigate to the new page with the list name and id
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
  return (
   <div>
   {/* <Sidebar onAddList={handleAddListFromSidebar}/> */}
    <h1>hoivou f oj</h1>
    <p>57trkuglo8uylio</p>
   </div>
  )
}

export default Dashboard