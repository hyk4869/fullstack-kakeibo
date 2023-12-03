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
export const linkStyle = {
  textDecoration: 'none',
  color: grey[700],
  cursor: 'pointer',
  width: '250px',
};

const SideBarList: React.FC<SideBarListProps> = (props) => {
  const { onCloseSideBar } = props;
  const ListContent = useMemo(() => {
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
          <List>
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
                  onClick={onCloseSideBar}
                  key={a.key}
                >
                  <ListItem>
                    <Link href={a.link} style={linkStyle}>
                      {a.label}
                    </Link>
                  </ListItem>
                </Box>
              );
            })}
          </List>
          <Divider />
          <Box sx={{ paddingTop: '10px', color: colorBlack }}>Monthly Spending</Box>
          <List>
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
                  onClick={onCloseSideBar}
                  key={a.key}
                >
                  <ListItem key={a.key}>
                    <Link href={a.link} style={linkStyle}>
                      {a.label}
                    </Link>
                  </ListItem>
                </Box>
              );
            })}
          </List>
          <Divider />
          <Box sx={{ paddingTop: '10px', color: colorBlack }}>Salay & Tax & Company Info</Box>
          <List>
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
                  onClick={onCloseSideBar}
                  key={a.key}
                >
                  <ListItem>
                    <Link href={a.link} style={linkStyle}>
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
  }, []);

  return ListContent;
};

export default React.memo(SideBarList);
