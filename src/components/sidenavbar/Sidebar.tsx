import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { SidebarData, SidebarDataButton, SidebarDataList } from "./SidebarData";
import "../../styles/sidebarStyle.css";
import { FaBars } from "react-icons/fa";
import { Popup } from "../Todolist/Popup";
import { useDispatch, useSelector } from "react-redux";
import axios from '../../api/axios';
import { RootState } from "../../app/store";
import { IoIosLogOut } from "react-icons/io";
import { logout } from '../../app/slices/authSlice';
import { clearUser } from '../../app/slices/user.slice';


interface NewList {
  id: number;
  name: string;
}

const Sidebar: React.FC= () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [hover, setHover] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [listName, setListName] = useState("");
  const [lists, setLists] = useState<NewList[]>([]);

  const toggle = () => setIsOpen(!isOpen);
  const onHover = () => setHover(true);
  const onLeave = () => setHover(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  // const handleSubmit = (newList: NewList) => {
  //   onAddList(newList);

  //   closePopup();
  //   navigate(`/list/${newList.id}/${encodeURIComponent(newList.name)}`);
  // };
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const firstName = useSelector((state: RootState) => state.auth.user?.firstName);
  const lastName = useSelector((state: RootState) => state.auth.user?.lastName);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

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
  }, [isAuthenticated, userId, accessToken]);


  const handleLinkClick = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const dispatch = useDispatch();
  const handleLogout = () => {

    dispatch(logout());
    dispatch(clearUser());

    navigate("/login")
  };
  return (
    <>
      <div className={`nav ${isOpen ? "" : "sidebar-closed"}`}>
        <div style={{ width: isOpen ? "220px" : "50px" }} className="sidebar">
          <div className="top_section">
            <div className="placeholder" >
              <img src={`https://ui-avatars.com/api/?background=f00&color=fff&name=${firstName}+${lastName}`} alt=""  
              style={{borderRadius:"50%",height:"25px"}}/>
              <p style={{ display: isOpen ? "block" : "none" }} className="logo">
                {firstName}
              </p>
            </div>
            <div
              style={{ marginLeft: isOpen ? "85px" : "0px" }}
              className="bars"
            >
              <FaBars onClick={toggle} />
            </div>
          </div>
          {SidebarData.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className={location.pathname === item.path ? "link active" : "link"}
              onClick={handleLinkClick}
            >
              <div className="icon">{item.icon}</div>
              <div
                style={{ display: isOpen ? "flex" : "none" }}
                className="link_text "
              >
                {item.title}
              </div>
            </NavLink>
          ))}

          {SidebarDataList.map((item, index) => (
            <div>
              <NavLink to={item.path} key={index} className="list-link">
                <div
                  style={{
                    display: isOpen ? "flex" : "none",
                    marginTop: "20px",
                  }}
                  className={location.pathname === item.path ? "link_list-text active" : "link_list-text"}
                >
                  {item.title}
                </div>
              </NavLink>
              <div
                style={{
                  marginTop: isOpen ? "-30px" : "9px",
                  marginLeft: isOpen ? "170px" : "5px",
                }}
                className="icon-list"
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
              >
                <p className="addButton" onClick={openPopup}>
                  {hover && (
                    <p
                      className="button-text"
                      style={{ marginTop: isOpen ? "-45px" : "10px" }}
                    >
                      Add list{" "}
                    </p>
                  )}
                  {item.icon}
                </p>
              </div>
            </div>
          ))}
        
        {isOpen && (
        <div className="logout" onClick={handleLogout}>

            <IoIosLogOut style={{ color: "red", fontSize: "17px" }} />
          
          <button className="logout-button" >
            Log out
        </button>
        </div>
        )}
        </div>
        
        <div>
        
        </div>
        
      </div>
      <Popup
        isOpen={isPopupOpen}
        onClose={closePopup}
        onSubmit={handleSubmit}
        createListAPI={createListAPI}
      />
    </>
  );
};

export default Sidebar;
