'use client';
import React, { useState } from 'react';
import { Box, Button, InputAdornment, Paper, TextField } from '@mui/material';
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import KeyIcon from '@mui/icons-material/Key';
import { grey } from '@mui/material/colors';

type LoginPageProps = {
  //
};

type loginInformation = {
  userID: string | null;
  password: string | null;
};

const LogiPage: React.FC<LoginPageProps> = () => {
  const [loginInfo, setLoginInfo] = useState<loginInformation>({ userID: '', password: '' });
  const [openTrigger, setOpenTrigger] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputUserData = (paramKey: string, value: string) => {
    let _loginInfo = { ...loginInfo };
    switch (paramKey) {
      case 'userID':
      case 'password':
        _loginInfo = { ..._loginInfo, [paramKey]: value === '' ? null : value };
        setLoginInfo(_loginInfo);
        break;
    }
  };

  const loginButton = (loginInfo: loginInformation) => {
    //
  };

  const isShowPassword = () => setShowPassword((show) => !show);

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
          minHeight: '300px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, 50%)',
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
          Login Page
        </h1>

        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              variant="standard"
              value={loginInfo?.userID}
              onChange={(e) => inputUserData('userID', e.target.value)}
              label="userID"
              type="text"
              sx={{ width: '20rem' }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: '1rem' }}>
            <KeyIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              variant="standard"
              value={loginInfo?.password}
              onChange={(e) => inputUserData('password', e.target.value)}
              label="Password"
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
          <Button variant="contained" onClick={() => loginButton(loginInfo)} sx={{ marginTop: '1rem' }}>
            login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default React.memo(LogiPage);
