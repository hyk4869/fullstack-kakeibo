'use client';
import React from 'react';
import { Box, Menu, MenuItem } from '@mui/material';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setCategoryContent, setCompanyContent, setHireDateContent, setUserInfo } from '../_store/slice';
import { useRouter } from 'next/navigation';

type SettingDialogProps = {
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  anchorEl: HTMLElement | null;
};

const SettingDialog: React.FC<SettingDialogProps> = (props) => {
  const { setAnchorEl, anchorEl } = props;

  const dispatch = useDispatch();
  const router = useRouter();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = (): void => {
    dispatch(setCategoryContent([]));
    dispatch(setCompanyContent([]));
    dispatch(setHireDateContent([]));
    dispatch(
      setUserInfo({
        userID: '',
        email: '',
        color: '',
        lastLoginAt: null,
        createdAt: null,
        updatedAt: null,
      }),
    );

    Cookies.remove('authToken');
    router.push('/signIn');
  };

  return (
    <Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        id="person"
      >
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default SettingDialog;
