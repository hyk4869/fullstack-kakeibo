'use client';

import { Box, Paper, TextField, InputAdornment, Button } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useCallback, useState } from 'react';
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import axios from 'axios';
import { createAccount } from '../_api/url';
import { useRouter } from 'next/navigation';
import MessageDialog from './messageDialog';

type SignUpPageProps = {
  //
};

type userInfo = {
  userID: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUpPage: React.FC<SignUpPageProps> = () => {
  const [userInfo, setUserInfo] = useState<userInfo>({ userID: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [message, setMessage] = useState<string>('');
  const [messageDialog, setMessageDialog] = useState<boolean>(false);

  const router = useRouter();

  const inputUserData = useCallback(
    (paramKey: string, value: string) => {
      let _userInfo = { ...userInfo };
      switch (paramKey) {
        case 'userID':
        case 'email':
        case 'password':
        case 'confirmPassword':
          _userInfo = { ..._userInfo, [paramKey]: value === '' ? '' : value };
          break;
      }
      setUserInfo(_userInfo);
    },
    [userInfo],
  );

  const isShowPassword = () => setShowPassword((show) => !show);
  const isShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const registerButton = async () => {
    if (
      userInfo.userID === '' ||
      userInfo.email === '' ||
      userInfo.password === '' ||
      userInfo.confirmPassword === ''
    ) {
      return;
    }
    if (userInfo.password === userInfo.confirmPassword) {
      const { confirmPassword, ...postData } = userInfo;
      await axios
        .post(createAccount, postData)
        .then((res) => {
          if (res.data) {
            if (res.data?.status === true) {
              // router.push('/main/summaryTable');
              setMessage(res.data?.message);
              setMessageDialog(true);
              console.log(res.data?.user);
            } else {
              setMessage(res.data?.message);
              setMessageDialog(true);
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        position: 'relative',
        height: '90vh',
      }}
    >
      <Paper
        elevation={10}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '600px',
          background: grey[200],
          minHeight: '450px',
          // position: 'absolute',
          // top: '50%',
          // left: '50%',
          // transform: 'translate(-50%, 50%)',
          margin: 'auto',
        }}
      >
        <h1
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '1.5rem',
          }}
        >
          Create Account
        </h1>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              variant="standard"
              value={userInfo?.userID}
              onChange={(e) => inputUserData('userID', e.target.value)}
              label="userID"
              type="text"
              sx={{ width: '20rem' }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: '1rem' }}>
            <EmailIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              variant="standard"
              value={userInfo?.email}
              onChange={(e) => inputUserData('email', e.target.value)}
              label="email"
              type="text"
              sx={{ width: '20rem' }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: '1rem' }}>
            <KeyIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              variant="standard"
              value={userInfo?.password}
              onChange={(e) => inputUserData('password', e.target.value)}
              label="password"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" onClick={isShowPassword}>
                    {showPassword ? (
                      <Visibility sx={{ cursor: 'pointer' }} />
                    ) : (
                      <VisibilityOff sx={{ cursor: 'pointer' }} />
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{ width: '20rem' }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: '1rem' }}>
            <KeyIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              variant="standard"
              value={userInfo?.confirmPassword}
              onChange={(e) => inputUserData('confirmPassword', e.target.value)}
              label="confirm password"
              type={showConfirmPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" onClick={isShowConfirmPassword}>
                    {showConfirmPassword ? (
                      <Visibility sx={{ cursor: 'pointer' }} />
                    ) : (
                      <VisibilityOff sx={{ cursor: 'pointer' }} />
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{ width: '20rem' }}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', margin: '2rem' }}>
          <Button
            variant="contained"
            onClick={() => registerButton()}
            disabled={
              userInfo.userID === '' ||
              userInfo.email === '' ||
              userInfo.password === '' ||
              userInfo.confirmPassword === ''
            }
          >
            Send
          </Button>
        </Box>
      </Paper>
      <MessageDialog message={message} messageDialog={messageDialog} closeDialog={() => setMessageDialog(false)} />
    </Box>
  );
};

export default SignUpPage;
