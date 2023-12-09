'use client';
import Link from 'next/link';
import { Box, List, ListItem, Divider } from '@mui/material';
import React, { useMemo } from 'react';
import { colorBlack } from '../_customComponents/customProperties';
import { HomeListURL, MonthlySpendingListURL, SalaryListURL } from './sideBarListContent';
import { grey } from '@mui/material/colors';

type SideBarListProps = {
  onCloseSideBar: () => void;
};

const linkStyle = (isMaster: boolean) => {
  return { textDecoration: 'none', color: isMaster ? grey[500] : grey[700], cursor: 'pointer', width: '250px' };
};

const SideBarList: React.FC<SideBarListProps> = (props) => {
  const { onCloseSideBar } = props;
  return (
    <>
      <Box
        sx={{
          width: '250px',
          maxWidth: '300px',
          padding: '30px 10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <List onClick={onCloseSideBar}>
          {HomeListURL.map((a) => {
            return (
              <Box
                sx={{
                  width: '100%',
                  '&:hover': {
                    backgroundColor: grey[300],
                    borderRadius: '50px',
                  },
                }}
                key={a.key}
              >
                <ListItem>
                  <Link href={a.link} style={linkStyle(a.isMaster)}>
                    {a.label}
                  </Link>
                </ListItem>
              </Box>
            );
          })}
        </List>

        <Divider />

        <Box sx={{ paddingTop: '10px', color: colorBlack }}>Monthly Spending</Box>
        <List onClick={onCloseSideBar}>
          {MonthlySpendingListURL.map((a) => {
            return (
              <Box
                sx={{
                  width: '100%',
                  '&:hover': {
                    backgroundColor: grey[300],
                    borderRadius: '50px',
                  },
                }}
                key={a.key}
              >
                <ListItem key={a.key}>
                  <Link href={a.link} style={linkStyle(a.isMaster)}>
                    {a.label}
                  </Link>
                </ListItem>
              </Box>
            );
          })}
        </List>

        <Divider />

        <Box sx={{ paddingTop: '10px', color: colorBlack }}>Salay & Tax & Company Info</Box>
        <List onClick={onCloseSideBar}>
          {SalaryListURL.map((a) => {
            return (
              <Box
                sx={{
                  width: '100%',
                  '&:hover': {
                    backgroundColor: grey[300],
                    borderRadius: '50px',
                  },
                }}
                key={a.key}
              >
                <ListItem>
                  <Link href={a.link} style={linkStyle(a.isMaster)}>
                    {a.label}
                  </Link>
                </ListItem>
              </Box>
            );
          })}
        </List>
      </Box>
    </>
  );
};

export default React.memo(SideBarList);
