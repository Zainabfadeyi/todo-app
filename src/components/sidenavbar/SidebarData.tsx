import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as CgIcons from "react-icons/cg";
import * as RiIcons from "react-icons/ri";
import * as IoIcons from "react-icons/io";
import { Popup } from "../Todolist/Popup";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
export const SidebarData = [
  {
    title: "Profile",
    path: "/userprofile",
    icon: <CgProfile />,
    cName: "nav-text",
  },
  {
    title: "Inbox",
    path: "/inbox",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },

  {
    title: "Today",
    path: "/today",
    icon: <BsIcons.BsCalendarFill />,
    cName: "nav-text",
  },
  {
    title: "Upcoming",
    path: "/upcoming",
    icon: <CgIcons.CgCalendarDates />,
    cName: "nav-text",
  },
  {
    title: "Overdue",
    path: "/Overdue",
    icon: <CgIcons.CgCalendarDates />,
    cName: "nav-text",
  },
  // {
  //   title: "Completed",
  //   path: "/Completed",
  //   icon: <FaIcons.FaCheckCircle />,
  //   cName: "nav-text",
  // },
  {
    title: "Archived",
    path: "/Archived",
    icon: <RiIcons.RiArchiveDrawerLine />,
    cName: "nav-text",
  },
];
export const SidebarDataList = [
  {
    title: "My Lists",
    path: "/list",
    icon: <IoIcons.IoIosAdd />,
    cName: "nav-text my-list",
  },
];
export const SidebarDataButton = [
  {
    icon: <IoIcons.IoIosAdd />,
  },
];
export const SidebarLogout = [
  {
    title: "Log out",
    path: "/login",
    icon: <IoIosLogOut />,
    cName: "nav-text logout",
  },
];
