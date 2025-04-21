import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';

const StudentNav = ({ user, setUser }) => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    handleClose();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          MWU Learning
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button
            component={RouterLink}
            to="/dashboard"
            color="inherit"
            startIcon={<DashboardIcon />}
            sx={{ 
              fontWeight: isActive('/dashboard') ? 'bold' : 'normal',
              borderBottom: isActive('/dashboard') ? '2px solid white' : 'none'
            }}
          >
            Dashboard
          </Button>
          <Button
            component={RouterLink}
            to="/dashboard/courses"
            color="inherit"
            startIcon={<SchoolIcon />}
            sx={{ 
              fontWeight: isActive('/dashboard/courses') ? 'bold' : 'normal',
              borderBottom: isActive('/dashboard/courses') ? '2px solid white' : 'none'
            }}
          >
            My Courses
          </Button>
          <Button
            component={RouterLink}
            to="/dashboard/assignments"
            color="inherit"
            startIcon={<AssignmentIcon />}
            sx={{ 
              fontWeight: isActive('/dashboard/assignments') ? 'bold' : 'normal',
              borderBottom: isActive('/dashboard/assignments') ? '2px solid white' : 'none'
            }}
          >
            Assignments
          </Button>
          <Button
            component={RouterLink}
            to="/dashboard/grades"
            color="inherit"
            startIcon={<GradeIcon />}
            sx={{ 
              fontWeight: isActive('/dashboard/grades') ? 'bold' : 'normal',
              borderBottom: isActive('/dashboard/grades') ? '2px solid white' : 'none'
            }}
          >
            Grades
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.name || 'Student'}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            {user?.profile_picture ? (
              <Avatar 
                alt={user.name} 
                src={user.profile_picture} 
                sx={{ width: 32, height: 32 }}
              />
            ) : (
              <AccountCircleIcon />
            )}
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default StudentNav; 