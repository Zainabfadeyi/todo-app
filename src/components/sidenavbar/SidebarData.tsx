import * as CgIcons from "react-icons/cg";
import * as RiIcons from "react-icons/ri";
import * as IoIcons from "react-icons/io";
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
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm7-5q.95 0 1.725-.55T14.8 14H19V5H5v9h4.2q.3.9 1.075 1.45T12 16"/></svg>,
    cName: "nav-text",
    count:0
  },
  {
    title: "Overdue",
    path: "/Overdue",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17q.425 0 .713-.288T13 16q0-.425-.288-.712T12 15q-.425 0-.712.288T11 16q0 .425.288.713T12 17m0-4q.425 0 .713-.288T13 12V8q0-.425-.288-.712T12 7q-.425 0-.712.288T11 8v4q0 .425.288.713T12 13m-7 8q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h4.2q.325-.9 1.088-1.45T12 1q.95 0 1.713.55T14.8 3H19q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5H5zm7-14.75q.325 0 .538-.213t.212-.537q0-.325-.213-.537T12 2.75q-.325 0-.537.213t-.213.537q0 .325.213.538T12 4.25M5 19V5z"/></svg>,
    cName: "nav-text",
    count: 0
  },

  {
    title: "Today",
    path: "/today",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.5q-1.05 0-1.775-.725T6.5 14q0-1.05.725-1.775T9 11.5q1.05 0 1.775.725T11.5 14q0 1.05-.725 1.775T9 16.5M5 22q-.825 0-1.412-.587T3 20V6q0-.825.588-1.412T5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588T21 6v14q0 .825-.587 1.413T19 22zm0-2h14V10H5zM5 8h14V6H5zm0 0V6z"/></svg>,
    cName: "nav-text",
    count: 0
  },
  {
    title: "Upcoming",
    path: "/upcoming",
    icon: <CgIcons.CgCalendarDates />,
    cName: "nav-text",
    count: 0
  },


  {
    title: "Archived",
    path: "/Archived",
    icon: <RiIcons.RiArchiveDrawerLine />,
    cName: "nav-text",
    count: 0
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
interface SidebarItem {
  title: string;
  path: string;
  icon: JSX.Element;
  cName: string;
  count?: number;
}


export const setSidebarData = (updatedData: SidebarItem[]) => {
  
  updatedData.forEach((item) => {
    const existingItem = SidebarData.find((i) => i.title === item.title);
    if (existingItem) {
      existingItem.count = item.count || undefined;
    }
  });
};

