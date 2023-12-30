import { Popup } from "../components/Todolist/Popup";
import EditListPopup from "../components/Todolist/EditListPopup";
import DeleteListPopup from "../components/Todolist/DeleteListPopup";
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
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [lists, setLists] = useState<NewList[]>([]);
  const [name, setName] = useState(""); 

  
  const openPopup = () => {
    setIsPopupOpen(true);
    setName("")
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
      
      navigate(`/list/${newList.id}/${encodeURIComponent(newList.name)}`);
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
  }, [isAuthenticated, userId, accessToken]);//add ",list" later


  const updateListAPI = async (listId: number, listName: string) => {
    try {
      if (!userId) {
        console.error("User ID is undefined");
        return;
      }
      const apiUrl = `/api/v1/list/${userId}/${listId}`;
      console.log(apiUrl)
      await axios.put(
        apiUrl,
        {id:listId, name: listName },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const updatedListsResponse = await axios.get(`/api/v1/list/all/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const updatedLists = updatedListsResponse.data;
      setLists(updatedLists);
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };
  
const [selectedList, setSelectedList] = useState<NewList | null>(null);

const handleEditClick = (list: NewList) => {
  setSelectedList(list);
  setIsEditPopupOpen(true);
};

const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("Before updateListAPI:", userId, selectedList, name);
  console.log("Before updateListAPI:", name);
  if (selectedList && userId !== undefined) {
    const updatedList = { ...selectedList, name: name };
    console.log("Before updateListAPI call:", updatedList);
    console.log("Before updateListAPI call list:", name);
    await updateListAPI(selectedList.id, name);
    console.log("After updateListAPI call, before setLists:", updatedList);
    setName("");
    setIsEditPopupOpen(false);
  }
  
 };
const closeEditPopup = () => {
  setIsEditPopupOpen(false);
};

const [selectedListForDeletion, setSelectedListForDeletion] = useState<NewList | null>(null);
const handleDeleteClick = (list: NewList) => {
  setSelectedListForDeletion(list);
  setIsDeletePopupOpen(true);
};
const deleteListAPI = async (listId: number) => {
  try {
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }

    const apiUrl = `/api/v1/list/${userId}/${listId}`;
    console.log(apiUrl);

    await axios.delete(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    
    const updatedListsResponse = await axios.get(`/api/v1/list/all/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const updatedLists = updatedListsResponse.data;
    setLists(updatedLists);
  } catch (error) {
    console.error("Error deleting list:", error);
  }
};

const handleDeleteList = () => {
  if (selectedListForDeletion) {
    deleteListAPI(selectedListForDeletion.id).then(() => {
      setLists((prevLists) => prevLists.filter((l) => l.id !== selectedListForDeletion.id));
      setIsDeletePopupOpen(false);
    });
  }
};

const closeDeletePopup = () => {
  setIsDeletePopupOpen(false);
};


  return (
    <>
      <div className={styles.listContainer}>
        <div className={styles.listContent}>
          <header>
            <div className="name">
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
                  <ListOnHover onEdit={() => handleEditClick(list)} onDelete={() => handleDeleteClick(list)}  />
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
        updateListAPI={updateListAPI}
        />
        <DeleteListPopup
          isOpen={isDeletePopupOpen}
          onClose={closeDeletePopup}
          onDeleteList={handleDeleteList}
          deleteListAPI={deleteListAPI}
          listId={selectedListForDeletion?.id || 0}
          listName={selectedListForDeletion?.name || ""}
        />
      </div>
    </>
  );
}

export default MyListPage;
