'use client';
import { Drawer } from '@mui/material';
import React from 'react';
import SideBarList from './sideBarList';

type SideBarProps = {
  openSideBar: boolean;
  onCloseSideBar: () => void;
};

const SideBar: React.FC<SideBarProps> = (props) => {
  const { openSideBar, onCloseSideBar } = props;
  return (
    <>
      <Drawer open={openSideBar} onClose={onCloseSideBar}>
        <SideBarList onCloseSideBar={onCloseSideBar} />
      </Drawer>
    </>
  );
};

export default React.memo(SideBar);
