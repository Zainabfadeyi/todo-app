import React from 'react'
import axios from "./axios"
import { AxiosError } from 'axios';
import { RootState } from "../app/store";
import { useSelector } from "react-redux";

export const userFormService = () => {
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);

const changeEmailAPI = async (newEmail: string, currentPassword: string): Promise<void> => {
  try {
    const response = await axios.patch(
        '/api/v1/user/changeEmail',
        {
          currentPassword,
          newEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      

    console.log('Email changed successfully', response.data);
  }catch (error) {
    if ((error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        // Password mismatch error
        throw new Error('Current password is incorrect. Please try again.');
      }
    }


    console.error('Error changing email:', error);
    throw error;
  }
};
const changePasswordAPI = async (
    currentPassword: string,
    newPassword: string,
    confirmationPassword: string
  ): Promise<void> => {
    try {
      // Add validation logic for the password and confirm password match here if needed

      const response = await axios.patch(
        '/api/v1/user/changePassword',
        {
          currentPassword,
          newPassword,
          confirmationPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Password changed successfully', response.data);
    } catch (error) {
      if ((error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          // Password mismatch error
          throw new Error('Current password is incorrect. Please try again.');
        }
      }

      console.error('Error changing password:', error);
      throw error;
    }
  };
 
  const deleteAccountAPI = async (currentPassword: string): Promise<void> => {
    try {
      const response = await axios.delete('/api/v1/user/deleteAccount', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          currentPassword,
        },
      });
  
      console.log('Account deleted successfully', response.data);
    } catch (error) {
      if ((error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          throw new Error('Current password is incorrect. Please try again.');
        }
      }
  
      console.error('Error deleting account:', error);
      throw error;
    }
  };
  


return{
    changeEmailAPI,
    changePasswordAPI,
    deleteAccountAPI
};


};

