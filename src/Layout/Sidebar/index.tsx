//@ts-ignore
import {
  Avatar,
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
  MenuItem,
  Tooltip,
} from '@mui/material'
import {Box, styled, useTheme} from '@mui/system'
import CustomContainer from 'components/CustomContainer'
//@ts-ignore
import {AnimatePresence, motion} from 'framer-motion'
import {truncate} from 'fs/promises'
import React, {useState} from 'react'
import {
  RiArrowLeftRightLine,
  RiBook2Fill,
  RiBookmarkFill,
  RiNotification2Fill,
  RiTruckFill,
  RiUserHeartFill,
  RiUserStarFill,
} from 'react-icons/ri'
import {RiAppsFill, RiBillFill} from 'react-icons/ri'
import {FaUserClock, FaChalkboardTeacher, FaUserGraduate} from 'react-icons/fa'
import {MdStorefront} from 'react-icons/md'
import router, {useRouter} from 'next/router'
import {useStore} from 'lib/store/store'
import shallow from 'zustand/shallow'

import Image from 'next/image'
import {get} from 'lodash'
// import darkLogo from "../../assets/mainLogoDark.png";
// import Logo from "../../assets/mainLogo.png";

const ColoredIconButton = styled(IconButton)<IconButtonProps>(({theme}) => ({
  '&:disabled': {
    color:
      theme.palette.mode == 'dark'
        ? theme.palette.text.primary
        : theme.palette.text.secondary,
  },
}))

export default function SideBar() {
  const MenuItems = [
    // {
    //     title: "Dashboard",
    //     tooltip: "Dashboard",
    //     href: '/dashboard',
    //     icon: <RiDashboardFill size='1.7rem' />
    // },
    {
      title: 'Branches',
      tooltip: 'Branches',
      href: '/branches',
      icon: <MdStorefront size="1.7rem" />,
    },
    {
      title: 'Teachers',
      tooltip: 'Teachers',
      href: '/staff/64736133d682e100148c0222',
      icon: <FaChalkboardTeacher size="1.7rem" />,
    },
    {
      title: 'Pending Teachers',
      tooltip: 'Pending Teachers',
      href: '/pending-staff/64736133d682e100148c0222',
      icon: <FaUserClock size="1.7rem" />,
    },
    {
      title: 'Special Needs Teachers',
      tooltip: 'Special Needs Teachers',
      href: '/specialneedsStaff/64736133d682e100148c0222',
      icon: <RiUserStarFill size="1.7rem" />,
    },
    {
      title: 'Students',
      tooltip: 'Students',
      href: '/students',
      icon: <FaUserGraduate size="1.7rem" />,
    },
    {
      title: 'Advertisements',
      tooltip: 'Advertisements',
      href: '/advertisements',
      icon: <RiBillFill size="1.7rem" />,
    },
    {
      title: 'Special Needs',
      tooltip: 'Special Needs',
      href: '/special-needs',
      icon: <RiUserHeartFill size="1.7rem" />,
    },
    {
      title: 'Booking Finder',
      tooltip: 'Booking Finder',
      href: '/booking_finder',
      icon: <RiBook2Fill size="1.7rem" />,
    },
    {
      title: 'Bookings',
      tooltip: 'Bookings',
      href: '/booking',
      icon: <RiBookmarkFill size="1.7rem" />,
    },
    {
      title: 'Notifications',
      tooltip: 'Notifications',
      href: '/notifications',
      icon: <RiNotification2Fill size="1.7rem" />,
    },

    // {
    //     title: "Vouchers",
    //     tooltip: "Vouchers",
    //     href: '/vouchers',
    //     icon: <RiCoupon2Fill size='1.7rem' />
    // },
    // {
    //     title: "Product Variations",
    //     tooltip: "",
    //     icon: <RiFilePaper2Fill size='1.7rem'/>
    // },
    // {
    //     title: "Delivery",
    //     tooltip: "Delivery",
    //     href: '/delivery',
    //     icon: <RiTruckFill size='1.7rem' />
    // },
    // {
    //     title: "Settings",
    //     tooltip: "Settings",
    //     href: '/settings',
    //     icon: <RiSettingsFill size='1.7rem' />
    // },
  ]

  const [open, setOpen] = useState(false)
  const theme = useTheme()

  const {pathname} = useRouter()
  const {settings} = useStore(({settings}) => ({settings}), shallow)
  React.useEffect(() => {
    console.log('logo', settings, pathname)
  }, [settings])
  return (
    <motion.div
      style={{
        zIndex: 1500,
        width: '7rem',
      }}
      animate={{
        width: !open ? '7rem' : '14rem',
      }}
      className="h-screen absolute left-0"
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
        }}
        style={{
          height: '100%',
          width: '100%',
          borderRadius: 0,
          zIndex: 1500,
        }}
        className="py-5  flex flex-col justify-center items-center"
      >
        {true ? (
          <Box
            //get(settings, 'logo_link.light', false) && get(settings, 'logo_link.dark', false)
            className="relative"
            sx={{
              height: open ? 50 : 50,
              width: 50,
              borderRadius: 1000,
              // backgroundColor: theme.palette.mode == 'dark' ? theme.palette.text.primary : theme.palette.text.secondary
            }}
          >
            {theme.palette.mode == 'dark' ? (
              <img src="/assets/mainLogoDark.png" />
            ) : (
              <img src="/assets/mainLogo.png" />
            )}
          </Box>
        ) : (
          <Avatar
            sx={{
              height: 50,
              width: 50,
              backgroundColor:
                theme.palette.mode == 'dark'
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
            }}
            className="font-bold"
          >
            {get(settings, 'display_title.en', '')
              .split(' ')
              .map((w) => w[0])
              .join('')}
          </Avatar>
        )}

        <div className="flex flex-col justify-center w-full items-center h-full">
          {MenuItems.map((item: any) => {
            return (
              <div
                className={`flex mb-4 py-1 w-full relative justify-center items-center cursor-pointer rounded-sm ${
                  open ? 'sidebar_item' : ''
                }`}
              >
                <motion.div
                  animate={{
                    width: open ? '10rem' : '3rem',
                    transition: {
                      type: 'linear',
                    },
                  }}
                  className="mx-auto flex justify-center items-center"
                >
                  <Tooltip placement="right" title={item.tooltip}>
                    <ColoredIconButton
                      onClick={() => {
                        router.push(item.href, item.herf, {shallow: true})
                      }}
                      disabled={open}
                      sx={{
                        color:
                          pathname == item.href
                            ? '#3DBEC9'
                            : item.tooltip == 'Teachers' &&
                              pathname == '/staff/[venue]'
                            ? '#3DBEC9'
                            : item.tooltip == 'Special Needs Teachers' &&
                              pathname == '/specialneedsStaff/[venue]'
                            ? '#3DBEC9'
                            : theme.palette.mode == 'dark'
                            ? theme.palette.text.primary
                            : theme.palette.text.secondary,
                      }}
                    >
                      {item.icon}
                    </ColoredIconButton>
                  </Tooltip>

                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{
                          width: '100%',
                          opacity: 0.2,
                          marginLeft: 0,
                        }}
                        animate={{
                          width: '100%',
                          opacity: 1,
                          marginLeft: '1rem',
                          transition: {
                            type: 'linear',
                            duration: 0.05,
                          },
                        }}
                        exit={{
                          width: 0,
                          opacity: 0,
                          marginLeft: 0,
                          transition: {
                            duration: 0.25,
                          },
                        }}
                        style={{
                          marginTop: '0',
                          color:
                            theme.palette.mode == 'dark'
                              ? theme.palette.text.primary
                              : theme.palette.text.secondary,
                        }}
                        className=" overflow-hidden select-none font-semibold flex items-center"
                        onClick={() => {
                          router.push(item.href, item.herf, {shallow: true})
                        }}
                      >
                        {item.title}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            )
          })}
        </div>
        <motion.div
          className="justify-center flex"
          style={{
            border: '1px solid #000',
            borderColor: theme.palette.divider,
            color: open ? 'white' : theme.palette.text.secondary,
            overflow: 'hidden',
            height: 50,
            backgroundColor: open ? '#3DBEC9' : 'transparent',
          }}
          animate={{
            borderRadius: open ? '100px' : '100px',
            width: open ? '10rem' : '45px',
          }}
        >
          <IconButton
            sx={{
              width: '100%',
              borderRadius: 0,
            }}
            onClick={() => setOpen(!open)}
            color="inherit"
          >
            <RiArrowLeftRightLine />
          </IconButton>
        </motion.div>
      </Box>
    </motion.div>
  )
}
