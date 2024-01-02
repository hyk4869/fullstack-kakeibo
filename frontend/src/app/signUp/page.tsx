'use client';

import { Box, Paper, TextField, InputAdornment } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useState } from 'react';
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';

type SignUpPageProps = {
  //
};

type userInfo = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUpPage: React.FC<SignUpPageProps> = () => {
  const [userInfo, setUserInfo] = useState<userInfo>({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputUserData = (paramKey: string, value: string) => {
    let _userInfo = { ...userInfo };
    switch (paramKey) {
      case 'name':
      case 'email':
      case 'password':
      case 'confirmPassword':
        _userInfo = { ..._userInfo, [paramKey]: value === '' ? null : value };
        setUserInfo(_userInfo);
        break;
    }
  };

  const isShowPassword = () => setShowPassword((show) => !show);
  const isShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const registerButton = () => {
    //
  };
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '600px',
          background: grey[200],
          minHeight: '500px',
          // position: 'absolute',
          // top: '50%',
          // left: '50%',
          // transform: 'translate(-50%, 50%)',
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
          Sign Up Page
        </h1>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              variant="standard"
              value={userInfo?.name}
              onChange={(e) => inputUserData('name', e.target.value)}
              label="name"
              type="text"
              sx={{ width: '20rem' }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
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
      </Paper>
    </Box>
  );
};

export default SignUpPage;
