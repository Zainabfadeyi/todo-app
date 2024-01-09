import React, { useState , Dispatch, SetStateAction, useEffect} from "react";
import { FaSearch } from "react-icons/fa";
import { useApiService } from '../../api/apiService'
import "./SearchBar.css";
import { useParams } from "react-router-dom";
import { Task } from "../../api/createTaskApi";
import { SearchResultItem } from "./SearchResultList";

interface SearchBarProps {
  setResults: Dispatch<SetStateAction<SearchResultItem[]>>; 
 
}
interface Params {
  id?: string;
  [key: string]: string | undefined;
  name?: string
}


export const SearchBar: React.FC<SearchBarProps> = ({ setResults }) => {
  const [input, setInput] = useState<string>("");
  const {searchTaskAPI}=useApiService()
  const { id,name:TaskName } = useParams<Params>();
const parseListId = id ? parseInt(id, 10) : undefined;

  const handleChange = (value: string) => {
    setInput(value);
    fetchData(value)
    
  };
  // const fetchData = (value:any) => {
  //   fetch("https://jsonplaceholder.typicode.com/users")
  //     .then((response) => response.json())
  //     .then((json) => {
  //       const results = json.filter((user: any) => {
  //         return (
  //           value &&
  //           user &&
  //           user.name &&
  //           user.name.toLowerCase().includes(value)
  //         );
  //       });
  //       setResults(results);
  //     });
  // };

  const fetchData = async (value: any) => {
    try {
      const results = await searchTaskAPI(parseListId || 0, value);
      setResults(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  useEffect(() => {
    fetchData("");
  }, []);

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
      className="searchbar"
        placeholder="Type to search..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};
