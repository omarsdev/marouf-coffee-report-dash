import DarkModeToggle from 'components/dark-mode-toggle'
import ProfileMenu from 'components/ProfileMenu'
import React, {useState} from 'react'
import {RiCalendar2Line, RiSearchLine} from 'react-icons/ri'
import Box from '@mui/material/Box'
import moment from 'moment'
import CustomLabel from 'components/CustomLabel'
import CustomContainer from 'components/CustomContainer'
import router from 'next/router'
import {useTheme} from '@mui/material'

interface Props {}

export default function Header() {
  const theme = useTheme()
  const [filteredData, setFilteredDate] = useState<any>()

  const data = [
    {name: 'Categories', href: '/categories'},
    {name: 'Teachers', href: '/staff/64736133d682e100148c0222'},
    {
      name: 'Specail Needs Teachers',
      href: '/specialneedsStaff/64736133d682e100148c0222',
    },
    {name: 'Students', href: '/students'},
    {name: 'Advertisements', href: '/advertisements'},
    {name: 'Special Needs', href: '/special-needs'},
    {name: 'Booking Finder', href: '/booking_finder'},
    {name: 'Notifications', href: '/notifications'},
    {name: 'Bookings', href: '/booking'},
  ]

  const search = (query) => {
    const inputValue = query.target.value
    const filtered = data.filter((item) => {
      return item.name.toLowerCase().includes(inputValue.toLowerCase())
    })
    setFilteredDate(filtered)
    if (query.target.value === '') {
      setFilteredDate([])
    }
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
      className="w-full flex absolute top-0 z-50 items-center py-4"
    >
      <div
        style={{paddingLeft: '12rem'}}
        className="w-full flex justify-start items-center"
      >
        <CustomContainer
          noShadow
          type="secondary"
          padding={1}
          radius="medium"
          className="flex items-center"
          style={{width: '28rem'}}
        >
          <RiSearchLine
            style={{
              color: theme.palette.text.secondary,
            }}
            className="mr-4"
            size={'1.2rem'}
          />
          <input
            style={{
              backgroundColor: 'transparent',
              width: '100%',
            }}
            name="search"
            placeholder="Search"
            onChange={search}
          />
        </CustomContainer>
      </div>
      <div className="flex items-center">
        <CustomLabel className=" flex items-center" type="secondary">
          <RiCalendar2Line className="mr-2" size={'1.2rem'} />
          Today
        </CustomLabel>
        <div
          // style={{ color: "#3DBEC9" }}
          className="flex ml-2.5 font-medium whitespace-nowrap"
        >
          {moment().format('MMMM DD')}
        </div>
      </div>
      <div
        style={{paddingRight: '5rem'}}
        className="w-full flex justify-end items-center"
      >
        <DarkModeToggle />
        <ProfileMenu />
      </div>
      {filteredData?.length > 0 && (
        <CustomContainer
          className="w-1/4 h-auto absolute left-48 top-14 p-4 flex flex-col"
          radius="medium"
        >
          {filteredData?.map((item) => {
            return (
              <button
                className={`w-full align items-start flex p-2 hover:bg-gray-500 ${
                  theme.palette.mode === 'dark' ? 'hover:text-black' : ''
                }`}
                onClick={() => router.push(item.href)}
              >
                {item.name}
              </button>
            )
          })}
        </CustomContainer>
      )}
    </Box>
  )
}
