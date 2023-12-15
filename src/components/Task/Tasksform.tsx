import React, {
  ChangeEvent,
  useState,
  useEffect,
  useRef,
  FormEvent,
} from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  InputLabel,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
}

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  dueTime: string;
  reminder: string;
}

const handleSubmitLogic = (task: Task, onSubmit: (task: Task) => void) => {
  onSubmit({
    id: Math.floor(Math.random() * 10000),
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate,
    dueTime: task.dueTime,
    reminder: task.reminder,
  });
};

export const TaskForm: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [task, setTask] = useState<Task>({
    id: 0,
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    dueTime: "",
    reminder: "",
  });

  const handleChange = (field: keyof Task, value: string) => {
    setTask((prevTask) => ({
      ...prevTask,
      [field]: value,
    }));
  };

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange("dueDate", e.target.value);
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange("dueTime", e.target.value);
  };
  const handleReminderChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange("reminder", e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmitLogic(task, onSubmit);
    setTask({
      id: 0,
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
      dueTime: "",
      reminder: "",
    });
    onClose(); // Optionally close the dialog after submission
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      maxWidth="lg"
      
    >
      <DialogTitle id="dialog-title">Add Task</DialogTitle>
      <form onSubmit={handleSubmit} >
        <DialogContent className="forms" style={{ width: "700px" }} >
          <InputLabel htmlFor="title">Title</InputLabel>
          <TextField
            id="title"
            value={task.title}
            onChange={(e) => handleChange("title", e.target.value)}
            fullWidth
            required
          />

          <InputLabel htmlFor="description">Description</InputLabel>
          <TextField
            id="description"
            value={task.description}
            onChange={(e) => handleChange("description", e.target.value)}
            multiline
            fullWidth
          />

          <InputLabel htmlFor="priority">Priority</InputLabel>
          <TextField
            select
            id="priority"
            value={task.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            fullWidth
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>

          <InputLabel htmlFor="dueDate">Due Date</InputLabel>
          <TextField
            id="dueDate"
            type="date"
            value={task.dueDate}
            onChange={handleDateChange}
            fullWidth
          />

          <InputLabel htmlFor="dueTime">Due Time</InputLabel>
          <TextField
            id="dueTime"
            type="time"
            value={task.dueTime}
            onChange={handleTimeChange}
            fullWidth
          />

          <InputLabel htmlFor="reminder">Reminder</InputLabel>
          <TextField
            id="reminder"
            type="datetime-local"
            value={task.reminder}
            onChange={handleReminderChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setTask({
                id: 0,
                title: "",
                description: "",
                priority: "Low",
                dueDate: "",
                dueTime: "",
                reminder: "",
              });
              onClose();
            }}
            type="button"
            color="secondary"
          >
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;
