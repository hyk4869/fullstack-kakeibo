'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../_store/store';
import SettingDialog from './setting';
import { setHeaderHeight } from '../_store/slice';

type CustomMenuBarProps = {
  TitleName?: string;
};

const CustomMenuBar: React.FC<CustomMenuBarProps> = (props) => {
  const { TitleName } = props;
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { width, height } = useWindowSize();
  const userData = useSelector((state: RootState) => state.getUserInfo);
  const heightValue = useSelector((state: RootState) => state.headerHeightSlice);

  const refTitleBar = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch();

  const headerName = useMemo(() => {
    return (
      <Box sx={{ display: 'flex', gap: '20px' }}>
        <Box>{TitleName ?? ''}</Box>
        <Box>{userData.userID + ' 様' ?? ''}</Box>
      </Box>
    );
  }, [TitleName, userData.userID]);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const headerHeight = refTitleBar.current?.clientHeight ?? 0;
      if (headerHeight !== heightValue) {
        dispatch(setHeaderHeight(headerHeight));
      }
    };

    updateHeaderHeight();

    window.addEventListener('resize', updateHeaderHeight);

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, [dispatch, heightValue]);

  const openSetting = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <AppBar ref={refTitleBar} style={{ position: 'fixed', width: '100vw', background: blue[400] }}>
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
          <Button color="inherit" onClick={openSetting} id="person">
            <PersonIcon />
          </Button>
        </Toolbar>
      </AppBar>
      <SideBar openSideBar={openSideBar} onCloseSideBar={() => setOpenSideBar(false)} />
      <SettingDialog setAnchorEl={setAnchorEl} anchorEl={anchorEl} />
    </>
  );
};

export default React.memo(CustomMenuBar);
