
import React, { useState, useRef, useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import axios from '../../api/axios';
import styles from "../../styles/verifyemail.module.css";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { configConsumerProps } from "antd/es/config-provider";

const VerifyEmailForm: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState<number>(300); 
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  
  const userEmail = useSelector((state: RootState) => state.auth.user?.email);

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prev) => prev - 1);
      } else {
        clearInterval(timer);
        setError("OTP has expired");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (otp.every((value) => /^\d+$/.test(value))) {
      validateOtp()
    }
  }, [otp]);


  const handleOtpChange = (index: number, value: string) => {
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (index < otp.length - 1 && value !== "") {
        inputRefs.current[index + 1]?.focus();
      }

      setError(null);
      setSuccess(false);
    } else {
      setError("Please enter a single digit");
    }
  };


  const validateOtp = async () => {
    try {
      setLoading(true);
      const storedEmail = localStorage.getItem('resetPasswordEmail');
      const isEmailVerified = localStorage.getItem('isEmailVerified');
  
      if (!storedEmail || !isEmailVerified) {
        setError("Invalid email or email not verified.");
        return;
      }
  
      const apiUrl = `/api/v1/reset-password/validate-otp?email=${storedEmail}&otp=${otp.join('')}`;
      console.log(apiUrl);
  
      const response = await axios.post(apiUrl);
      console.log("this is the response", response)
  
      if (response.status === 200) {
        const successfulOtp = otp.join('');
      localStorage.setItem('resetPasswordOTP', successfulOtp); 

      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
      }, 2000);
      navigate('../resetpassword');
      console.log(response.data)
        navigate('../resetpassword');
        console.log(response.data);
        
      } else if (response.status === 401) {
        
        console.error("Invalid OTP");
        setError("Invalid OTP.");
        console.log("this is the response",response)
      } else {
        console.error("Unexpected Response:", response.data);
        setError("Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error validating OTP:", error);
      setError("Invalid 0TP.");
    } finally {
      setLoading(false);
    }
  };
  

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };
  const isMounted = useRef(true);

useEffect(() => {
  return () => {
    isMounted.current = false;
  };
}, []);

  return (
    <div className={styles.container}>
      <div className={styles.Text}>
        <h2>Verify Your Email</h2>
        <p>Enter the 6-digit OTP sent to your email. Expires in: {formatTime(countdown)}</p>
      </div>
      <div className={styles.otpInput}>
        {otp.map((value, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={value}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            ref={(el) => (inputRefs.current[index] = el)}
            className={styles.otpCode}
          />
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Verification successful!</p>}
    </div>
  );
};

export default VerifyEmailForm;
