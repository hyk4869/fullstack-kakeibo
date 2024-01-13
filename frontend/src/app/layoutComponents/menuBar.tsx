'use client';
import React, { useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { blue } from '@mui/material/colors';
import PersonIcon from '@mui/icons-material/Person';
import SideBar from './sideBar';
import useWindowSize from '../_util/useWindowSize';
import { useSelector } from 'react-redux';
import { RootState } from '../_store/store';

type CustomMenuBarProps = {
  TitleName?: string;
};

const CustomMenuBar: React.FC<CustomMenuBarProps> = (props) => {
  const { TitleName } = props;
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);
  const { width, height } = useWindowSize();
  const userData = useSelector((state: RootState) => state.getUserInfo);

  const headerName = useMemo(() => {
    return (
      <Box sx={{ display: 'flex', gap: '20px' }}>
        <Box>{TitleName ?? ''}</Box>
        <Box>{userData.userID + ' 様' ?? ''}</Box>
      </Box>
    );
  }, [TitleName, userData.userID]);

  return (
    <>
      <Box sx={{ marginBottom: '80px' }}>
        <AppBar style={{ position: 'fixed', maxHeight: 'min-content', width: '100vw', background: blue[400] }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, ml: 1 }}
              onClick={() => setOpenSideBar((prev) => !prev)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {headerName}
            </Typography>
            {/* TODO: 後で消す */}
            {`確認用 width: ${width}`} - {`height: ${height}`}
            <Button color="inherit">
              <PersonIcon />
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <SideBar openSideBar={openSideBar} onCloseSideBar={() => setOpenSideBar(false)} />
    </>
  );
};

export default React.memo(CustomMenuBar);
