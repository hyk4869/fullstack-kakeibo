'use client';
import React, { useState } from 'react';
import { Box, Button, FormControl, FormHelperText, InputAdornment, Paper, TextField, Tooltip } from '@mui/material';
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import KeyIcon from '@mui/icons-material/Key';
import { grey } from '@mui/material/colors';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { signInLink } from '../_api/url';
import Cookies from 'js-cookie';
import MessageDialog from './messageDialog';
import { useDispatch } from 'react-redux';
import { setCategoryContent, setCompanyContent, setHireDateContent, setUserInfo } from '../_store/slice';
import { CustomValidation } from '../_customComponents/customValidation/validationClass';
import { type inputInfo } from '../signUp/signUpPage';

type LoginPageProps = {
  //
};

type loginInformation = {
  userID: string | null;
  password: string | null;
};

const LogiPage: React.FC<LoginPageProps> = () => {
  const [loginInfo, setLoginInfo] = useState<loginInformation>({ userID: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messageDialog, setMessageDialog] = useState<boolean>(false);
  const [inputInfo, setInputInfo] = useState<inputInfo>();

  const router = useRouter();
  const dispatch = useDispatch();

  const validation = new CustomValidation();

  /** userIDのバリデーション */
  const userIDValidation = validation.userIDCheck(loginInfo.userID);
  /** passwordのバリデーション */
  const passwordValidation = validation.passwordCheck(loginInfo.password);

  const inputUserData = (paramKey: string, value: string) => {
    let _loginInfo = { ...loginInfo };
    switch (paramKey) {
      case 'userID':
      case 'password':
        _loginInfo = { ..._loginInfo, [paramKey]: value === '' ? '' : value };
        setLoginInfo(_loginInfo);
        break;
    }
  };

  const loginButton = async (loginInfo: loginInformation) => {
    await axios
      .post(signInLink, loginInfo)
      .then((res) => {
        if (res.data) {
          if (res.data.status === true) {
            Cookies.set('authToken', res.data?.token);
            dispatch(setUserInfo(res.data?.user));
            setMessage(res.data?.message);
            setMessageDialog(true);

            const masterData = res.data?.masterData;
            dispatch(setCategoryContent(masterData.categoryData));
            dispatch(setCompanyContent(masterData.companyData));
            dispatch(setHireDateContent(masterData.hireData));

            router.push('/main/summaryTable');
          } else {
            setMessage(res.data?.message);
            setMessageDialog(true);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const isShowPassword = () => setShowPassword((show) => !show);

  const handleSingUp = () => {
    router.push('/signUp');
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
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '600px',
          background: grey[200],
          minHeight: '320px',
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
          Login Page
        </h1>

        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <FormControl
            sx={{ width: '20rem', marginBottom: '0.1rem' }}
            error={inputInfo?.userID?.type === 'warn' || inputInfo?.userID?.type === 'error'}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField
                variant="standard"
                value={loginInfo?.userID}
                onChange={(e) => inputUserData('userID', e.target.value)}
                onBlur={() =>
                  setInputInfo((prev) => {
                    return { ...prev, userID: userIDValidation };
                  })
                }
                label="userID"
                type="text"
                InputProps={{ sx: { minWidth: '300px' } }}
              />
            </Box>
            <FormHelperText
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginLeft: '2rem',
                color: inputInfo?.userID?.type === 'warn' || inputInfo?.userID?.type === 'error' ? 'red' : 'green',
              }}
            >
              {inputInfo?.userID?.comment}
            </FormHelperText>
          </FormControl>

          <FormControl
            sx={{ width: '20rem', marginBottom: '0.1rem' }}
            error={inputInfo?.password?.type === 'warn' || inputInfo?.password?.type === 'error'}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: '1rem' }}>
              <KeyIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField
                variant="standard"
                value={loginInfo?.password}
                onChange={(e) => inputUserData('password', e.target.value)}
                onBlur={() =>
                  setInputInfo((prev) => {
                    return { ...prev, password: passwordValidation };
                  })
                }
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
                sx={{ minWidth: '300px' }}
              />
            </Box>
            <FormHelperText
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginLeft: '2rem',
                color: inputInfo?.password?.type === 'warn' || inputInfo?.password?.type === 'error' ? 'red' : 'green',
              }}
            >
              {inputInfo?.password?.comment}
            </FormHelperText>
          </FormControl>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2rem', margin: '2.5rem 0' }}>
            <Tooltip title={'新しいアカウントを作成します'} arrow>
              <Button variant="outlined" color="primary" onClick={() => handleSingUp()}>
                sign up
              </Button>
            </Tooltip>
            <Button variant="contained" onClick={() => loginButton(loginInfo)}>
              login
            </Button>
          </Box>
        </Box>
      </Paper>
      <MessageDialog message={message} messageDialog={messageDialog} closeDialog={() => setMessageDialog(false)} />
    </Box>
  );
};

export default React.memo(LogiPage);
