import * as React from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';


import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {

    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
    const { signedin, user, dispatch } = useAuthContext();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch({ type: 'SIGNOUT' });
        localStorage.removeItem('user');
        window.location.href = '/auth/signin';
    }

  return (
    <nav className='fixed top-0 left-0 w-full h-[65px] flex justify-center bg-blue-200'>
        <div className='max-w-[1800px] h-full w-full flex items-center justify-between'>
            <Link to='/' className='ml-8'>
                <h1 className='font-bold text-2xl'>
                    Recipevibe
                </h1>       
            </Link>

            {
                signedin ? 

                <React.Fragment>
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            textAlign: 'center', 
                            marginRight: '32px',
                        }}>
                        <Tooltip title="Account settings">
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Avatar sx={{ width: 32, height: 32 }}>
                                <img 
                                    src='https://firebasestorage.googleapis.com/v0/b/mittarv-assignment-1.appspot.com/o/default-user.jpeg?alt=media&token=da0f0922-f01d-4f71-bc40-6ce844b369b0'
                                    alt='Profile picture'
                                />
                            </Avatar>
                        </IconButton>
                        </Tooltip>
                    </Box>
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1.5,
                                },
                                '&::before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                                backgroundColor: '#c0dcfc',
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={handleClose}>
                            <Avatar /> Profile
                        </MenuItem>

                        <MenuItem onClick={handleClose}>
                            <Avatar /> My recipes
                        </MenuItem>

                        <Divider />

                        {/* <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                                <PersonAdd fontSize="small" />
                            </ListItemIcon>
                            Add another account
                        </MenuItem>

                        <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            Settings
                        </MenuItem> */}

                        <MenuItem onClick={() => {
                            handleLogout();
                            handleClose();
                        }}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            <p className='text-red-500'> Logout </p> 
                        </MenuItem>

                    </Menu>
                </React.Fragment>

                :

                <Button
                    style={{ 
                        textTransform: 'none', 
                        fontSize: '17px', 
                        fontWeight: 600,
                        marginRight: '32px',
                        borderRadius: '5px',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        paddingLeft: '16px',
                        paddingRight: '16px'
                    }}
                    onClick={() => {
                        searchParams.set('redirect_uri', currentUrl);
                        window.location.href = `/auth/signin?${searchParams.toString()}${currentUrl.hash}`;
                    }}
                    variant='contained'
                >
                    <div className='flex gap-3 items-center'>

                        <AccountCircleIcon />
                        Signin    
                    </div>
                </Button>    

            }
            
        </div>
    </nav>
  )
}

export default Navbar;
