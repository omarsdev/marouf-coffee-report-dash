import * as React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import {RiAliensFill, RiLogoutCircleLine} from 'react-icons/ri'
import UserUser from 'lib/hooks/useUser'
import request from 'lib/api'
import router from 'next/router'
import {useCookies} from 'react-cookie'
import shallow from 'zustand/shallow'
import useStore from 'lib/store/store'
import {get, truncate} from 'lodash'
import {red} from '@mui/material/colors'

export default function ProfileMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [_, setCookies] = useCookies([])

  return (
    <React.Fragment>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          sx={{backgroundColor: 'background.paper', color: 'text.primary'}}
          // className="text-xl"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <RiAliensFill />
        </IconButton>
      </Tooltip>
      <Menu
        disableAutoFocus={true}
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
            minWidth: '10.5rem',
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
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
          },
        }}
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
      >
        {/* <MenuItem>
          <Avatar sx={{width: 32, height: 32, color: 'text.primary'}}>
            {get(user, 'name.0', '')}
          </Avatar>{' '}
          <div className="ml-1">
            {truncate(get(user, 'name', ''), {
              length: 18,
              omission: '..',
            })}
            <div className="text-xs text-gray-400">{'Content Manager'}</div>
          </div>
        </MenuItem>
        <Divider /> */}
        {/* <MenuItem
        // sx={{
        //   pt: 1.5,
        //   pb: 1.5,
        // }}
        >
          <ListItemIcon>
            <RiNotification2Fill size="1.1rem" />
            / <Notification fontSize="medium" /> /
          </ListItemIcon>
          Notifications
        </MenuItem> */}
        {/* <MenuItem
        // sx={{
        //   pt: 1.5,
        //   pb: 1.5
        // }}
        >
          <ListItemIcon>
            <RiSettingsFill size="1.1rem" />
            / <Settings fontSize="medium" /> /
          </ListItemIcon>
          Settings
        </MenuItem> */}
        <MenuItem
          // sx={{
          //   pt: 1.5,
          //   pb: 1.5
          // }}
          onClick={() => {
            request.removeSession()
            setCookies('token', null)
            // router.push('/', "/", { shallow: false })
            window.location.replace('/')
          }}
        >
          <ListItemIcon>
            <RiLogoutCircleLine size="1.1rem" color={red['500']} />
            {/* <Logout fontSize="medium" /> */}
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}
