import * as React from 'react';
import Box from '@mui/material/Box';

import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import IconButtonProps from "@mui/material"
//@ts-ignore
import { AnimatePresence, motion } from 'framer-motion/dist/framer-motion'
import { RiChatSmile3Fill } from 'react-icons/ri';
import { useTheme } from '@mui/material';
import Widget from './widget';

export default function FormWidget() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const theme = useTheme()
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        console.log("event", event)
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [hover, setHover] = React.useState(false);
    return (
        <>
            {/* <Tooltip title="Account settings"> */}
            <motion.div
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className=" absolute right-0 text-white bottom-0 m-12 rounded-full bg-primary-500  flex justify-center items-center"
            >
                <motion.div
                    style={{
                        borderColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#DCDBE7',
                    }}
                    animate={{
                        scale: !(hover || open) ? 1 : 1.55,
                        transition: {
                            type: 'loop',
                        }
                    }}
                    className="h-16 w-16 absolute  border rounded-full"
                >

                </motion.div>
                <motion.div
                    style={{
                        borderColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#DCDBE7',
                    }}
                    animate={{
                        scale: !(hover || open) ? 1 : 2.1,
                        transition: {
                            type: 'loop',

                        }
                    }}
                    className="h-16 w-16 absolute border rounded-full"
                >


                </motion.div>
                <IconButton
                    onClick={handleClick}
                    sx={{
                        // filter: 'drop-shadow(0px 2px 23px rgba(0,0,0,0.64))',
                        boxShadow: theme.palette.mode !== 'dark' ? '0px 0px 30px 9px #D0CDD9' : '0px 0px 23px 9px #1E1E1E'
                        // boxShadow: 10,
                    }}
                    aria-controls={open ? 'form-widget' : undefined}
                    aria-haspopup="true"
                    className="text-white h-16 w-16 z-30"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <RiChatSmile3Fill size='2rem' />
                </IconButton>
            </motion.div>
            {/* </Tooltip> */}
            <Menu
                anchorEl={anchorEl}
                id='form-widget'
                open={open}
                onClose={handleClose}
                disableEnforceFocus
                disableRestoreFocus
                // onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        borderRadius: 7,
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mb: 2,
                        // ml:12,
                        '& .MuiAvatar-root': {
                            width: 100,
                            height: 100,
                            ml: 0,
                            mt: 0,
                            mb: 0,
                            mr: 0
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            bottom: 0,
                            right: 25,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
                <Widget />
            </Menu>
        </ >
    );
}