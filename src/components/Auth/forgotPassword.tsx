import React, { useState } from "react";
import VerifyEmailForm from "./VerifyEmailForm";
import styles from "../../styles/forgotPassword.module.css"
import { FaFingerprint } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { usePasswordReset } from "../../api/passwordReset";

const ForgotPassword: React.FC = () => {
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [showForm, setShowForm] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { confirmEmail, sendVerificationEmail } = usePasswordReset()

  const handleVerificationSent = async () => {
    try {
      setLoading(true);

      const existsResponse = await confirmEmail(email);

      if (existsResponse === "Email exists") {
        await sendVerificationEmail(email);
        localStorage.setItem('resetPasswordEmail', email);
      localStorage.setItem('isEmailVerified', 'false');

        setShowVerifyEmail(true);
      } else {
        setError("Email not found");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerificationSent();
    navigate('../verify-otp')
  };

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
        <form onSubmit={handleSubmit} className={styles.emailForm}>
          <h1>Forgot your password?</h1>
          <div> To reset your password, please enter the email address of your Todo account.</div>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.emailInput}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
      <p className="suggest">
        Need an Account?
        <span className="line">
          <a href="./register">Sign Up</a>
        </span>
      </p>
      </div>
      <div className={styles.image}>
            <img src="public/picture2.png"  className={styles.picture}/>
        </div>
    </div>
  );
};

export default ForgotPassword;
