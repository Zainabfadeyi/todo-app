import React, { MouseEvent, useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import styles from "../../styles/taskform.module.css";

interface CustomInputProps {
  value: string;
  onClick: (event: MouseEvent<HTMLInputElement>) => void;
  onShortcutChange: (shortcut: string) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  onClick,
  onShortcutChange,
}) => {
  const [formattedDate, setFormattedDate] = useState("");
  const formatDate = (val: string) => {};
  useEffect(() => {
    console.log("SDfsdf", value)
    switch (value) {
      case "today":
        setFormattedDate("Today");
        break;
      case "tomorrow":
        setFormattedDate("Tomorrow");
        break;
      case "next weekend":
        setFormattedDate("Next Weekend");
        break;
      case "next week":
        setFormattedDate("Next Week");
        break;
      default:
        setFormattedDate(value);
    }
  }, [value]);

  return (
    <>
      <div className={styles.inputInner}>
        <div className={styles.wrapper}>
          <input
            type="text"
            value={formattedDate}
            onClick={onClick}
            readOnly
            style={{ width: "calc(10% - 20px) !important" }}
          />
          <div className={styles.calender}>
            <FaCalendarAlt />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomInput;
