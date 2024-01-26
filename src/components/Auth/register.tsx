import React, { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { FaFingerprint } from "react-icons/fa";
import axios from '../../api/axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const USERLASTNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGISTER_URL = "/api/v1/auth/register";

const Register: React.FC = () => {
  const userRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [validName, setValidName] = useState<boolean>(false);
  const [userFocus, setUserFocus] = useState<boolean>(false);
  const [lastNameFocus, setLastNameFocus] = useState<boolean>(false);
  const [emailFocus, setEmailFocus] = useState<boolean>(false);

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [validEmail, setValidEmail] = useState<boolean>(false);

  const [pwd, setPwd] = useState<string>('');
  const [validPwd, setValidPwd] = useState<boolean>(false);
  const [pwdFocus, setPwdFocus] = useState<boolean>(false);

  const [matchPwd, setMatchPwd] = useState<string>('');
  const [validMatch, setValidMatch] = useState<boolean>(false);
  const [matchFocus, setMatchFocus] = useState<boolean>(false);

  const [role, setRole] = useState<string>('USER');

  const [errMsg, setErrMsg] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (userRef.current) userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(firstName));
  }, [firstName]);
  useEffect(() => {
    setValidName(USERLASTNAME_REGEX.test(lastName));
  }, [lastName]);
  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg('');
  }, [ firstName, lastName, email, pwd, matchPwd,]);

  const [customMessage, setCustomMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const v1 = USER_REGEX.test(firstName);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }

        try {
            const response = await axios.post(REGISTER_URL,
              
                JSON.stringify({ firstName, lastName, email, password:pwd, role:"USER" }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            setSuccess(true);

            setFirstName('');
            setLastName('');
            setEmail('');
            setPwd('');
            setMatchPwd('');
            setRole('USER');

            setCustomMessage('Registration successful! Redirecting to login page...');
      setTimeout(() => {
        window.location.href = '/login';}, 2000)
          } catch (err:any) {
            console.error(err.response.status, err.response.data);
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            if (errRef.current) errRef.current.focus();
        }
  };

  return (
    <>
      <div className="Reg">
        {customMessage ? (
          <section className="sectionReg">
            <h1>{customMessage}</h1>
          </section>
        ) : (
          <div className="RegContainer">
            <div className="LogoWrapper">
              <Link to={"/"}>
                <div>
                  <FaFingerprint />
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
              <h1>Register</h1>
              <form onSubmit={handleSubmit} className="formReg">
                <label htmlFor="firstname" className="RegLabel">
                  First Name:
                  {
                    userFocus && (
                      <>
                        <FontAwesomeIcon
                            icon={faCheck}
                            className={firstName && validName ? "valid" : "hide"}
                          />
                          <FontAwesomeIcon
                            icon={faTimes}
                            className={!firstName && !validName ? "invalid" : "hide"}
                        />
                      </>
                    )
                  }
                </label>
                <input
                  className="inputReg"
                  type="text"
                  id="firstname"
                  ref={firstNameRef}
                  autoComplete="off"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                  required
                />
                <label htmlFor="lastname" className="RegLabel">
                  Last Name:
                  {
                    lastNameFocus && (
                      <>
                          <FontAwesomeIcon
                          icon={faCheck}
                          className={lastName && validName ? "valid" : "hide"}
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className={!lastName && !validName ? "invalid" : "hide"}
                        />
                      </>
                    )
                  }
                  
                </label>
                <input
                  className="inputReg"
                  type="text"
                  id="lastname"
                  ref={lastNameRef}
                  autoComplete="off"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  onFocus={() => setLastNameFocus(true)}
                  onBlur={() => setLastNameFocus(false)}
                  required
                />

                <label htmlFor="email" className="RegLabel">
                  Email:
                  {
                    emailFocus &&(
                      <>
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={validEmail ? "valid" : "hide"}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={!validEmail ? "invalid" : "hide"}
                      />
                    </>
                    )

                  }
                </label>
                <input
                  className="inputReg"
                  type="email"
                  id="email"
                  ref={emailRef}
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  aria-invalid={!validEmail ? "true" : "false"}
                  aria-describedby="emailnote"
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
                <p
                  id="emailnote"
                  className={!validEmail ? "instructions" : "offscreen"}
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Please enter a valid email address.
                </p>
                <label htmlFor="password" className="RegLabel">
                    Password:
                    <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                </label>
                <input
                className="inputReg"
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                    aria-invalid={validPwd ? "false" : "true"}
                    aria-describedby="pwdnote"
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                />
                <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    8 to 24 characters.<br />
                    Must include uppercase and lowercase letters, a number and a special character.<br />
                    Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                </p>

                <label htmlFor="confirm_pwd" className="RegLabel">
                    Confirm Password:
                    <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                </label>
                <input
                className="inputReg"
                    type="password"
                    id="confirm_pwd"
                    onChange={(e) => setMatchPwd(e.target.value)}
                    value={matchPwd}
                    required
                    aria-invalid={validMatch ? "false" : "true"}
                    aria-describedby="confirmnote"
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                />
                <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Must match the first password input field.
                </p>


                <button
                  disabled={ !validEmail || !validPwd || !validMatch}
                  className="buttonReg"
                  type="submit"
                >
                  Sign Up
                </button>
              </form>
              <p className="suggest">
                Already registered?
                <span className="line">
                  <Link to="/login">Sign in</Link>
                </span>
              </p>
            </section>
          </div>
        )}
        <div className="ImgContainer">
          <img src="images/svg-9.svg" alt="" className="RegImage" />
        </div>
      </div>
    </>
  );
};

export default Register;
