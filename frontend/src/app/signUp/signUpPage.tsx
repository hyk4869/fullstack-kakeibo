'use client';

import { Box, Paper, TextField, InputAdornment, Button, FormControl, FormHelperText } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useCallback, useState } from 'react';
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import axios from 'axios';
import { createAccount } from '../_api/url';
import MessageDialog from './messageDialog';
import { CustomValidation } from '../_customComponents/customValidation/validationClass';
import { ReturnValidationData } from '../_customComponents/customValidation/validationInterfaces';
import { useRouter } from 'next/navigation';

type SignUpPageProps = {
  //
};

type userInfo = {
  userID: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type inputInfo = {
  userID?: ReturnValidationData;
  email?: ReturnValidationData;
  password?: ReturnValidationData;
  confirmPassword?: ReturnValidationData;
};

const SignUpPage: React.FC<SignUpPageProps> = () => {
  const [userInfo, setUserInfo] = useState<userInfo>({ userID: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [message, setMessage] = useState<string>('');
  const [messageDialog, setMessageDialog] = useState<boolean>(false);
  const [changePage, setChangePage] = useState<boolean>(false);

  const [inputInfo, setInputInfo] = useState<inputInfo>();

  const validation = new CustomValidation();

  const router = useRouter();

  /** userIDのバリデーション */
  const userIDValidation = validation.userIDCheck(userInfo.userID);
  /** emailのバリデーション */
  const emailValidation = validation.emailCheck(userInfo.email);
  /** passwordのバリデーション */
  const passwordValidation = validation.passwordCheck(userInfo.password);
  /** 確認用のpasswordのバリデーション */
  const confirmPasswordValidation = validation.passwordDuplicateCheck(userInfo.password, userInfo.confirmPassword);

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
              setMessage(res.data?.message);
              setMessageDialog(true);
              setChangePage(true);
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

  const signInPage = () => {
    router.push('/signIn');
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
          <FormControl
            sx={{ width: '20rem', marginBottom: '0.1rem' }}
            error={inputInfo?.userID?.type === 'warn' || inputInfo?.userID?.type === 'error'}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField
                variant="standard"
                value={userInfo?.userID}
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

          <FormControl sx={{ width: '20rem', marginBottom: '0.1rem' }} error={inputInfo?.email?.type === 'warn'}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: '1rem' }}>
              <EmailIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField
                variant="standard"
                value={userInfo?.email}
                onChange={(e) => inputUserData('email', e.target.value)}
                onBlur={() =>
                  setInputInfo((prev) => {
                    return { ...prev, email: emailValidation };
                  })
                }
                label="email"
                type="text"
                InputProps={{ sx: { minWidth: '300px' } }}
              />
            </Box>
            <FormHelperText
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginLeft: '2rem',
                color: inputInfo?.email?.type === 'warn' ? 'red' : 'green',
              }}
            >
              {inputInfo?.email?.comment}
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
                value={userInfo?.password}
                onChange={(e) => inputUserData('password', e.target.value)}
                onBlur={() =>
                  setInputInfo((prev) => {
                    return { ...prev, password: passwordValidation };
                  })
                }
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
                  sx: { minWidth: '300px' },
                }}
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

          <FormControl
            sx={{ width: '20rem', marginBottom: '0.1rem' }}
            error={inputInfo?.confirmPassword?.type === 'warn'}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-end', marginTop: '1rem' }}>
              <KeyIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField
                variant="standard"
                value={userInfo?.confirmPassword}
                onChange={(e) => inputUserData('confirmPassword', e.target.value)}
                onBlur={() =>
                  setInputInfo((prev) => {
                    return { ...prev, confirmPassword: confirmPasswordValidation };
                  })
                }
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
                  sx: { minWidth: '300px' },
                }}
              />
            </Box>
            <FormHelperText
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginLeft: '2rem',
                color: inputInfo?.confirmPassword?.type === 'warn' ? 'red' : 'green',
              }}
            >
              {inputInfo?.confirmPassword?.comment}
            </FormHelperText>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', margin: '2rem' }}>
          <Button
            variant="contained"
            onClick={() => registerButton()}
            disabled={
              inputInfo?.userID?.status === false ||
              inputInfo?.email?.status === false ||
              inputInfo?.password?.status === false ||
              inputInfo?.confirmPassword?.status === false ||
              userInfo.confirmPassword === ''
            }
            sx={{ padding: '0.5rem 5rem' }}
          >
            Send
          </Button>
        </Box>
      </Paper>

      <Button variant="outlined" onClick={signInPage}>
        SIGN IN
      </Button>
      <MessageDialog
        message={message}
        messageDialog={messageDialog}
        closeDialog={() => setMessageDialog(false)}
        changePage={changePage}
      />
    </Box>
  );
};

export default SignUpPage;
