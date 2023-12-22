import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { SidebarData, SidebarDataButton, SidebarDataList } from "./SidebarData";
import "../../styles/sidebarStyle.css";
import { FaBars } from "react-icons/fa";
import { Popup } from "../Todolist/Popup";

import { Container, Sidenav } from "rsuite";

interface NewList {
  id: number;
  text: string;
}

interface SidebarProps {
  onAddList: (newList: NewList) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddList }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [hover, setHover] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggle = () => setIsOpen(!isOpen);
  const onHover = () => setHover(true);
  const onLeave = () => setHover(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSubmit = (newList: NewList) => {
    onAddList(newList);
    closePopup();
    navigate(`/list/${newList.id}/${encodeURIComponent(newList.text)}`);
  };

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

  return (
    <>
      <div className={`nav ${isOpen ? "" : "sidebar-closed"}`}>
        <div style={{ width: isOpen ? "220px" : "50px" }} className="sidebar">
          <div className="top_section">
            <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">
              Todo
            </h1>
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
        </div>
      </div>
      <Popup
        isOpen={isPopupOpen}
        onClose={closePopup}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Sidebar;
