import { Popup } from "../components/Todolist/Popup";
import EditListPopup from "../components/Todolist/EditListPopup";
import styles from "../styles/list.module.css";
import React, { useState,useEffect,FormEvent } from "react";
import { useNavigate, Link  } from "react-router-dom";
import axios from '../api/axios';
import { RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import ListOnHover from "../components/Todolist/ListOnHover";


interface NewList {
  id: number;
  name: string;
}

function MyListPage() {

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [lists, setLists] = useState<NewList[]>([]);
  const [listName, setListName] = useState(""); 
  const openPopup = () => {
    setIsPopupOpen(true);
    setListName("")
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSubmit = async (newList: NewList) => {
   
    
    if (!newList.name || /^\s*$/.test(newList.name)) {
      return;
    }
    try {
      await createListAPI(newList.name);
      closePopup();
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };
  

  const navigate = useNavigate();
  
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);



  const createListAPI = async (name: string) => {
    try {
      if (!isAuthenticated || !userId ) {
        console.error("User is not authenticated");
        return;
      }

      const apiUrl = `/api/v1/list/${userId}`;
      

      const response = await axios.post(
        apiUrl,
        { name: name },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      
      const newList = { id: response.data.id, name: response.data.name };
      
      setLists((prevLists) => [...prevLists, newList]);
      
      // navigate(`/list/${newList.id}/${encodeURIComponent(newList.text)}`);
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };
  useEffect(() => {
    const fetchLists = async () => {
      try {
        if (!isAuthenticated || !userId) {
          console.error("User is not authenticated");
          return;
        }

        const apiUrl = `/api/v1/list/all/${userId}`;

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const fetchedLists = response.data;
        setLists(fetchedLists);
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };
    fetchLists();
  }, [isAuthenticated, userId, accessToken]);


  const updateListAPI = async (listId: number, name: string) => {
    try {
      if (!userId) {
        console.error("User ID is undefined");
        return;
      }
      const apiUrl = `/api/v1/list/${userId}/${listId}`;
      console.log(apiUrl)
      await axios.put(
        apiUrl,
        { id: listId, name: name },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };
  
const [selectedList, setSelectedList] = useState<NewList | null>(null);

const handleEditClick = (list: NewList) => {
  setSelectedList(list);
  setIsEditPopupOpen(true);
};
// const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
//   if (selectedList) {
//     const updatedList = { ...selectedList, name: listName };

//     await updateListAPI(userId, selectedList.id, listName);
//     setLists((prevLists) =>
//       prevLists.map((l) => (l.id === updatedList.id ? updatedList : l))
//     );
//   }
//   setListName("");
//   setIsEditPopupOpen(false);
  
// };
const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("Before updateListAPI:", userId, selectedList, name);
  console.log("Before updateListAPI:", listName);
  if (selectedList && userId !== undefined) {
    const updatedList = { ...selectedList, name: listName };
    console.log("Before updateListAPI call:", updatedList);
    console.log("Before updateListAPI call list:", listName);
    await updateListAPI(selectedList.id, listName);
    console.log("After updateListAPI call, before setLists:", updatedList);
    setLists((prevLists) =>
      prevLists.map((l) => (l.id === updatedList.id ? updatedList : l))
    );
    console.log("After setLists:", updatedList);

    setListName("");
    setIsEditPopupOpen(false);
  }
  
  
};

const closeEditPopup = () => {
  setIsEditPopupOpen(false);
};

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
            <button className={styles.listButton} type="button">+ Add List</button>
          </div>
          <p className={styles.listCount}>{lists.length} {lists.length === 1 ? "List" : "Lists"}</p>
          <hr/>
          <ul className={styles.myList}>
            {lists.map((list) => (
              <li
              className={styles.listItems}
                key={list.id}
                
              >
                <div className={styles.ListStyleWrapper}>
                  <div className={styles.ListProps}>
                <Link to={`/list/${list.id}/${encodeURIComponent(list.name)}`}
                className={styles.ListStyle}>
                  <span style={{color:"black"}}>
                   # {list.name}
                  </span>
                </Link>
                <div className={styles.HoverMore}>
                  <ListOnHover onEdit={() => handleEditClick(list)}  />
                </div>
                </div>
                
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Popup
          isOpen={isPopupOpen}
          onClose={closePopup}
          onSubmit={handleSubmit}
          createListAPI={createListAPI} 
        />
        <EditListPopup
        isOpen={isEditPopupOpen}
        onClose={closeEditPopup}
        list={selectedList}
        onSubmit={handleEditSubmit}
        />
        
      </div>
    </>
  );
}

export default MyListPage;
