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
import { useDispatch, useSelector } from "../../app/hook";
import { clearUser, getUser, setUser, setUser as setUserAction } from "../../app/slices/user.slice";
import { login } from '../../app/slices/authSlice';

const LOGIN_URL = "/api/v1/auth/login";

const Login: React.FC = () => {
  // const { setAuth } = useContext(AuthContext);
  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [email, setEmail] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    if (userRef.current) userRef.current.focus();
  }, []);



useEffect(() => {
  console.log('Current Authentication State:', isAuthenticated);
}, [isAuthenticated]);

  useEffect(() => {
    setErrMsg("");
  }, [email, pwd]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        const response = await axios.post(
            LOGIN_URL,
            { email, password: pwd },
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );
       
          setEmail("");
          setPwd("");
          setSuccess(true);
          const userDetailsResponse = await axios.get('/api/v1/user/details', {
            headers: { Authorization: `Bearer ${response?.data?.accessToken}` },
          });
          const userDetails = userDetailsResponse?.data;
          dispatch(login(userDetails));
          dispatch(setUser(userDetails));
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
              <label htmlFor="username" className="RegLabel">Email:</label>
              <input 
              className="inputReg"
                type="text"
                id="email"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
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