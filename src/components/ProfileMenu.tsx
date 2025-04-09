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
import cookie from "cookie-cutter"
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
    <>
      <Tooltip title="Account settings">
        <IconButton onClick={handleClick} className="p-2">
          <RiAliensFill className="text-lg" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            width: '220px',
            mt: 1.5,
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            // Perform logout logic
            window.location.replace('/')
          }}
          className="flex items-center"
        >
          <ListItemIcon>
            <RiLogoutCircleLine size="1.1rem" color={red[500]} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  )
}
