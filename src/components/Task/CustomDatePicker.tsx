import React, { useState, useEffect, useRef } from "react";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomInput from "./CusotmInput";
import { BsFillCalendarFill } from "react-icons/bs";
import { IoIosSunny } from "react-icons/io";
import { MdWeekend } from "react-icons/md";
import { FaCalendarCheck } from "react-icons/fa";
import styles from "../../styles/taskform.module.css";




function CustomDatePicker({ setTask }: any) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [shortcutInput, setShortcutInput] = useState<string>("");
  
 const closeShortcutDate=()=>{
  setShowShortcuts(false);
 }

  const toggleShortcuts = () => {
    setShowShortcuts(!showShortcuts);
  };
  const onShortcutChange = (shortcut: string) => {
    let newDate:string;
    console.log("the shortcut", shortcut)
    switch (shortcut) {
      case 'today':
        newDate = today;
        break;
      case 'tomorrow':
        const tomorrow = new Date();
        tomorrow.setDate(todayDate.getDate() + 1);
        newDate = tomorrow.toDateString();
        break;
     
      case 'next weekend':
        const nextWeekend = new Date();
        const daysUntilNextSaturday = 6 - nextWeekend.getDay();
        nextWeekend.setDate(todayDate.getDate() + daysUntilNextSaturday);
        newDate = nextWeekend.toDateString();
        break;
      case 'next week':
        const nextWeek = new Date();
        nextWeek.setDate(todayDate.getDate() + 7);
        newDate = nextWeek.toDateString();
        break;
        
      default:
        newDate = today;
    }

    setTask((prevTask: any) => ({
      ...prevTask,
      dueDate: newDate,
    }));
    setShowShortcuts(false);
    setShortcutInput(shortcut);
    setSelectedDate(null);; 
    console.log(`Shortcut changed: ${shortcut}`);
  };

  const today = new Date().toDateString();
  const todayDate = new Date();

  const sortShowDateRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortShowDateRef.current &&
        !sortShowDateRef.current.contains(event.target as Node)
      ) {
        setShowShortcuts(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className={styles.inputContainer} ref={sortShowDateRef}
      style={{ paddingLeft: 0 }}>
        <label>
          <div>
            <CustomInput
              value={
                selectedDate
            ? selectedDate.toDateString()
              : shortcutInput
              }
              onClick={() => toggleShortcuts()}
              onShortcutChange={onShortcutChange}
            />
          </div>
          {showShortcuts && (
            <div className={styles.dropdownContent} 
            onClick={closeShortcutDate}>
              <div className={styles.dateShortcuts}>
                <div className={styles.dropdownmore}
                onClick={() => toggleShortcuts()}
                >
                  <BsFillCalendarFill />
                  <button
                    type="button"
                    onClick={() => onShortcutChange("today")}
                    className={styles.itemdropdownButton}
                  >
                    Today
                  </button>
                </div>
                <div className={styles.dropdownmore}
                onClick={closeShortcutDate}
                >
                  <IoIosSunny />
                  <button
                    type="button"
                    onClick={() => {
                      onShortcutChange("tomorrow");
                      
                      }}
                    className={styles.itemdropdownButton}

                  >
                    Tomorrow
                  </button>
                </div>
                <div className={styles.dropdownmore}>
                  <MdWeekend />
                  <button
                    type="button"
                    onClick={() => onShortcutChange("next weekend")}
                    className={styles.itemdropdownButton}
                  >
                    Next Weekend
                  </button>
                </div>
                <div className={styles.dropdownmore}>
                  <FaCalendarCheck />
                  <button
                    type="button"
                    onClick={() => onShortcutChange("next week")}
                    className={styles.itemdropdownButton}
                  >
                    Next Week
                  </button>
                </div>
              </div>
              <Datepicker
                className={styles.datepicker}
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  toggleShortcuts(); // Close shortcuts after selecting a date
                  setShortcutInput(""); 
                  setShowShortcuts(false)
                  setTask((prevTask: any) => ({
                    ...prevTask,
                    dueDate: date?.toDateString() ?? "",
                  }));
                }}
                inline
              />
            </div>
          )}
        </label>
      </div>
    </>
  );
}

export default CustomDatePicker;
