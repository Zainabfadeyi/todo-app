import axios from '../api/axios';
import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export const usePasswordReset=() =>{
    const userId = useSelector((state: RootState) => state.auth.user?.id);
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const navigate = useNavigate();

    const confirmEmail = async (email:string) : Promise<string>=> {
        try {
            const apiUrl =  `/api/v1/reset-password/check-email?email=${email}`;
          const response = await axios.get(apiUrl, {
          });
          return response.data;
          
        } catch (error) {
          
          console.error("Password reset error:", error);
          throw new Error("Error confirming email");
        }
      };
      
  const sendVerificationEmail = async (email:string) => {
    try {
      const apiUrl = `/api/v1/reset-password/generate-otp?email=${email}`;
     
      const response = await axios.post(apiUrl);

      console.log("Generate OTP response:", response.data);
    } catch (error) {
      console.error("Error sending verification email:", error);

    }
  };
  

      return{
        confirmEmail,
        sendVerificationEmail
      }
}