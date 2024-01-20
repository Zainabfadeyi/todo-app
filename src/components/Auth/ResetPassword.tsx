import React, { useState, FormEvent } from "react";
import axios from '../../api/axios';
import { Link, useNavigate} from "react-router-dom";
import styles from "../../styles/resetPassword.module.css"
import { FaFingerprint } from "react-icons/fa";
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate= useNavigate()


  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (newPassword !== confirmPassword) {
  //     setError("Passwords do not match");
  //     return;
  //   }
  //   if (!PWD_REGEX.test(newPassword)) {
  //     setError(
  //       "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be between 8 and 24 characters long."
  //     );
  //     return;
  //   }

  //   setSuccess(true);
  // };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!PWD_REGEX.test(newPassword)) {
      setError(
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be between 8 and 24 characters long."
      );
      return;
    }

    try {
      // Get email and OTP from localStorage
      const userEmail = localStorage.getItem('resetPasswordEmail');
      const otp = localStorage.getItem('resetPasswordOTP');

      if (!userEmail || !otp) {
        setError("Invalid email or OTP not found.");
        return;
      }

      const apiUrl = `/api/v1/reset-password/complete-reset?email=${userEmail}&otp=${otp}&newPassword=${newPassword}`;
      console.log (apiUrl)
      const response = await axios.post(apiUrl);

      if (response.data === "Password reset successful.") {
        setSuccess(true);
      } else {
        setError("Password reset failed. Please try again.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  if (success) {
    navigate("../login")
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper} >
      <div className={styles.LogoWrapper}> 
            <Link to={"/"}>
                <div > 
                    <FaFingerprint/>
                    <span>TODO</span>
                </div> 
            </Link>
      </div>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit} className={styles.formReg}>
        <div style={{display:"block"}}>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className={styles.Password}
            
          />
        </div>
        <div style={{display:"block"}}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={styles.Password}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className={styles.submit}>Reset Password</button>
      </form>
      </div>
    </div>
  );
};

export default ResetPassword;
