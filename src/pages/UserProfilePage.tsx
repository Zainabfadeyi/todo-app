import React, { useState } from 'react';
import style from '../styles/userProfile.module.css'; 
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { reset } from '../app/slices/authSlice';
import { userFormService } from '../api/userFormService';
interface UserProfile {
  firstname: string;
  lastname: string;
  email: string;
}
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const UserProfileForm: React.FC = () => {
  const {changeEmailAPI,changePasswordAPI,deleteAccountAPI}= userFormService()
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstname: user?.firstName || '',
    lastname: user?.lastName || '',
    email: user?.email || '',
  });
  const [passwordError, setPasswordError] = useState<string>('');
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [emailError, setEmailError] = useState<string>('');
  const [showEmailForm, setShowEmailForm] = useState<boolean>(false);
  const [emailFormData, setEmailFormData] = useState({
    currentPassword: '',
    newEmail: '',
    confirmNewEmail: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handlePasswordChange = () => {
    setShowPasswordForm(true);
  };

  const handlePasswordFormChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSavePassword = async() => {
    if (!PWD_REGEX.test(passwordFormData.newPassword)) {
        setPasswordError('Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character. It should be between 8 and 24 characters.');
        return;
      }
      if (passwordFormData.newPassword !== passwordFormData.confirmNewPassword) {
        setPasswordError('New Password and Confirm New Password do not match.');
        return;
      }

      try {
        await changePasswordAPI(
          passwordFormData.currentPassword,
          passwordFormData.newPassword,
          passwordFormData.confirmNewPassword
        );
    
        setShowPasswordForm(false);
      } catch (error) {
        if (error === 'Current password is incorrect. Please try again.') {
          setPasswordError('Current password is incorrect. Please try again.');
        } else {
          // Handle other errors
        }
      }
      navigate("/login")
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    setShowPasswordForm(false);
  };
  const handleEmailChange = () => {
    setShowEmailForm(true);
  };

  const handleEmailFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const navigate= useNavigate()

  const handleSaveEmail= async () => {
    if (emailFormData.newEmail !== emailFormData.confirmNewEmail) {
      setEmailError('New Email and Confirm New Email do not match.');
      return;
    }
    if (!PWD_REGEX.test(emailFormData.currentPassword)) {
      setEmailError('Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character. It should be between 8 and 24 characters.');
      return;
    }
    try {
      await changeEmailAPI(emailFormData.newEmail, emailFormData.currentPassword);
  
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        email: emailFormData.newEmail,
      }));
      setShowEmailForm(false);
    } catch (error) {
      if (error === 'Current password is incorrect. Please try again.') {
        setPasswordError('Current password is incorrect. Please try again.');
      } else {
       
      }
    }
    setShowEmailForm(false);
    setEmailFormData({
      currentPassword: '',
      newEmail: '',
      confirmNewEmail: '',
    });
    
  };
  const handleCancelPasswordChange = () => {
    setShowPasswordForm(false);
    setPasswordError('');
    setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
  };
  const handleCancelEmailChange = () => {
    setShowEmailForm(false);
    setEmailError('');
    setEmailFormData({
      currentPassword: '',
      newEmail: '',
      confirmNewEmail: '',
    });
  };
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteAccountData, setDeleteAccountData] = useState({
    currentPassword: '',
    reason: '',
  });

 

  const handleDeleteAccount = () => {
    
    setShowDeleteModal(true);

  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    
    setDeleteAccountData({
      currentPassword: '',
      reason: '',
    });
  };

  const handleConfirmDeleteAccount = async() => {
    try {
      await deleteAccountAPI(deleteAccountData.currentPassword);
  
      
    } catch (error) {
      if (error === 'Current password is incorrect. Please try again.') {
        setPasswordError('Current password is incorrect. Please try again.');
      } else {
        
      }
    }
  //   const dispatch = useDispatch();
  // dispatch(reset());
    
    console.log('Account deleted!');
    setUserProfile({
      firstname: '',
      lastname: '',
      email: '',
    });
    navigate("/")
    setShowDeleteModal(false);
  };

  return (
    <div className={style.userprofile}>
      <form>
        <div>
          <label htmlFor="firstname" className={style.label}>
            First Name:
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={userProfile.firstname}
            onChange={handleChange}
            className={style.input}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="lastname" className={style.label}>
            Last Name:
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={userProfile.lastname}
            onChange={handleChange}
            className={style.input}
            readOnly
          />
        </div>
      </form>
      <div className={style.emailWrapper}>
      <label htmlFor="email" className={style.label}>
            Email:
          </label>
          <p style={{marginBottom:"10px"}}>{userProfile.email}</p>
      <button onClick={handleEmailChange} className={style.button}>
        Change Email
      </button>

      {showEmailForm && (
        <div className={style.modal}>
        <div className={style.modalContainer}>
          <header style={{textAlign:"center", color:"red"}}>Change Email</header>
          <form>
          <div className={style.modalContent}>
            <div >
              <label htmlFor="newEmail" className={style.label}>
                New Email:
              </label>
              <input
                type="email"
                id="newEmail"
                name="newEmail"
                value={emailFormData.newEmail}
                onChange={handleEmailFormChange}
                className={style.passwordinput}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmNewEmail" className={style.label}>
                Confirm New Email:
              </label>
              <input
                type="email"
                id="confirmNewEmail"
                name="confirmNewEmail"
                value={emailFormData.confirmNewEmail}
                onChange={handleEmailFormChange}
                className={style.passwordinput}
                required
              />
            </div>
            <div>
              <label htmlFor="currentPassword" className={style.label}>
                Current Password:
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={emailFormData.currentPassword}
                onChange={handleEmailFormChange}
                className={style.passwordinput}
                required
              />
            </div>
            {emailError && (
              <p className={style.error}>{emailError}</p>|| <p className={style.error}>{passwordError}</p>

            )}
            </div>
          </form>
          <div className={style.modalButton}>
          <button onClick={handleCancelEmailChange} className={style.button}
          style={{marginRight:"8px"}}>
            Cancel
          </button>
          <button onClick={handleSaveEmail} className={style.button}
          style={{backgroundColor:"red"}}>
            Change Email
          </button>
          </div>
        </div>
        </div>
      )}
      </div>
      <div className={style.passwordWrapper}>
      <label htmlFor="email" className={style.label}>
            Password:
          </label>
      <button onClick={handlePasswordChange} className={style.button}>
        Change Password
      </button>

      {showPasswordForm && (
        <div className={style.modal}>
        <div className={style.modalContainer}>
          <header style={{textAlign:"center", color:"red"}}>Change Password</header>
          <form>
          <div className={style.modalContent}>
            <div>
              <label htmlFor="currentPassword" className={style.label}>
                Current Password:
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordFormData.currentPassword}
                onChange={handlePasswordFormChange}
                className={style.passwordinput}
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className={style.label}>
                New Password:
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordFormData.newPassword}
                onChange={handlePasswordFormChange}
                className={style.passwordinput}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmNewPassword" className={style.label}>
                Confirm New Password:
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={passwordFormData.confirmNewPassword}
                onChange={handlePasswordFormChange}
                className={style.passwordinput}
                required
              />
            </div>
            {passwordError && (
                <p className={style.error}>{passwordError}</p>
              )}
              </div>
          </form>
          <div className={style.modalButton}>
          <button onClick={handleCancelPasswordChange} className={style.button}
          style={{marginRight:"8px"}}>
            Cancel
          </button>
          <button onClick={handleSavePassword} className={style.button}
          style={{backgroundColor:"red"}}>
            Change Password
          </button>
          </div>
          </div>
        </div>
      )}
      </div>

      
      <div className={style.deleteWrapper}>
      <label htmlFor="newPassword" className={style.label}>
                Delete Account:
              </label>
        <p>This will immediately delete all of your data including tasks, projects, comments, and more. This can’t be undone.</p>      
      <button onClick={handleDeleteAccount} className={style.deletebutton}>
        Delete Account
      </button>
      {showDeleteModal && (
        <div className={style.modal}>
        <div className={style.modalContainer}>
        <header style={{textAlign:"center", color:"red"}}>Delete Account</header>
        <div style={{marginBottom:"30px"}}>We'll be sorry to see you go, but thanks for trying Todo!</div>
          <div className={style.modalContent}>
            <form>
                <div style={{marginBottom:"20px"}}>Deleting your account is permanent. All your data will be wiped out immediately and you won't be able to get it back.</div>
                <div>
                <label htmlFor="reason" className={style.label}>
                  Reason for Delete (Optional):
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={deleteAccountData.reason}
                  onChange={(e) =>
                    setDeleteAccountData((prevData) => ({
                      ...prevData,
                      reason: e.target.value,
                    }))
                  }
                  className={style.modaltextinput}
                />
              </div>
              <div>
                <label htmlFor="currentPassword" className={style.label}>
                  Current Password:
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={deleteAccountData.currentPassword}
                  onChange={(e) =>
                    setDeleteAccountData((prevData) => ({
                      ...prevData,
                      currentPassword: e.target.value,
                    }))
                  }
                  className={style.modalinput}
                  required
                />
              </div>
              
            </form>
            <div className={style.modalButton}>
            <button onClick={handleCloseDeleteModal} className={style.button}
            style={{marginRight:"8px"}}>
              Cancel
            </button>
            <button
              onClick={handleConfirmDeleteAccount}
              className={style.button}
              style={{backgroundColor:"red"}}
            >
              Yes, Delete
            </button>
            </div>
          </div>
        </div>
        </div>
      )}
      </div>

    </div>
  );
};

export default UserProfileForm;

