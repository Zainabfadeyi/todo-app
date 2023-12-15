import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  FormEvent,
} from "react";
import "../../styles/RegStyle.css";
// import AuthContext from "./context/AuthProvider";
// import axios from './api/axios';

const LOGIN_URL = "/login";

const Home: React.FC = () => {
  // const { setAuth } = useContext(AuthContext);
  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [user, setUser] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (userRef.current) userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // try {
    //     const response = await axios.post(
    //         LOGIN_URL,
    //         JSON.stringify({ user, pwd }),
    //         {
    //             headers: { 'Content-Type': 'application/json' },
    //             withCredentials: true
    //         }
    //     );
    //     console.log(JSON.stringify(response?.data));
    //     const accessToken = response?.data?.accessToken;
    //     const roles = response?.data?.roles;
    // setAuth({ user, pwd, roles, accessToken });
    console.log(user, pwd);
    setUser("");
    setPwd("");
    setSuccess(true);
    // } catch (err) {
    //     if (!err?.response) {
    //         setErrMsg('No Server Response');
    //     } else if (err.response?.status === 400) {
    //         setErrMsg('Missing Username or Password');
    //     } else if (err.response?.status === 401) {
    //         setErrMsg('Unauthorized');
    //     } else {
    //         setErrMsg('Login Failed');
    //     }
    //     if (errRef.current) errRef.current.focus();
    // }
  };

  return (
    <>
      <body className="RegLogin">
        <h1>My Todo App</h1>

        <p>
          Need an Account?
          <br />
          <span className="line">
            {/*put router link here*/}
            <a href="./register">Sign Up</a>
          </span>
        </p>
        <p>
          Else
          <br />
          <span className="line">
            {/*put router link here*/}
            <a href="./login">Login</a>
          </span>
        </p>
      </body>
    </>
  );
};

export default Home;
