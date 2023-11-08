import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { blue } from '@mui/material/colors';
import PersonIcon from '@mui/icons-material/Person';

type CustomMenuBarProps = {
  TitleName?: string;
};
const CustomMenuBar: React.FC<CustomMenuBarProps> = (props) => {
  const { TitleName } = props;
  return (
    <Box sx={{ flexGrow: 1, margin: '80px' }}>
      <AppBar style={{ position: 'fixed', maxHeight: 'min-content', width: '100vw', background: blue[400] }}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {TitleName ?? ''}
          </Typography>
          <Button color="inherit">
            <PersonIcon />
            {/* <div style={{ paddingLeft: '1rem' }}>{userDataValue.username ?? ''}</div> */}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default React.memo(CustomMenuBar);
