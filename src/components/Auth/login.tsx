import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  FormEvent,
} from "react";
import "../../styles/RegStyle.css";
// import AuthContext from "./context/AuthProvider";
import axios from '../../api/axios';
import {Link} from "react-router-dom"
import { FaFingerprint } from "react-icons/fa";



const LOGIN_URL = "/api/v1/auth/login";

const Login: React.FC = () => {
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
    
    try {
        const response = await axios.post(
            LOGIN_URL,
            { email: user, password: pwd },
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );
        console.log(JSON.stringify(response?.data));
        const accessToken = response?.data?.accessToken;
        const roles = response?.data?.roles;
        console.log(accessToken, roles);
          setUser("");
          setPwd("");
          setSuccess(true);
    } catch (err  : any) {
      console.log(err, "==errr==")
        if (!err?.response) {
            setErrMsg('No Server Response');
        } else if (err.response?.status === 400) {
            setErrMsg('Missing Username or Password');
        } else if (err.response?.status === 401) {
            setErrMsg('Unauthorized');
        } else {
            setErrMsg('Login Failed');
        }
        if (errRef.current) errRef.current.focus();
    }
  };

  return (
    < >
    
      <div className="Login">

        {success ? (
          <section className="suggest">
            <h1>You are logged in!</h1>
            <span className="line">
              <a href="./dashboard">Go to Dashboard</a>
            </span>
          </section>
        ) : (
          <div className="RegContainer">
            <div className="LogoWrapper"> 
                <Link to={"/"}>
                    <div > 
                        <FaFingerprint/>
                        <span>TODO</span>
                    </div> 
                </Link>
              </div>
          <section className="sectionReg">

            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}
            className="formReg">
              <label htmlFor="username" className="RegLabel">Username:</label>
              <input 
              className="inputReg"
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
              />

              <label htmlFor="password" className="RegLabel">Password:</label>
              <input
              className="inputReg"
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
              />
              <button type="submit" className="buttonReg" >Sign In</button>
            </form>
            <p className="suggest">
              Need an Account?
              <span className="line">
                <a href="./register">Sign Up</a>
              </span>
            </p>
          </section>
          </div>
        )}

        <div className="ImgContainer">
            <img src="public/images/svg-11.svg"  className="RegImage" />
        </div>

      </div>
    </>
  );
};

export default Login;
