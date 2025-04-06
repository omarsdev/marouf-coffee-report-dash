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
import styles from './Header.module.css'

interface Props {}

export default function Header() {
  const theme = useTheme()
  const [filteredData, setFilteredDate] = useState<any>()

  const data = [
    {
      name: 'Schedules',
      href: '/schedules',
    },

    {
      name: 'Tickets',
      href: '/tickets',
    },
    {
      name: 'Employees',
      href: '/employees',
    },
    {
      name: 'Branches',
      href: '/branches',
    },
    {
      name: 'Departments',
      href: '/departments',
    },
    {
      name: 'Checklist',
      href: '/checklist',
    },
    {
      name: 'Questions',
      href: '/questions',
    },
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
      sx={{bgcolor: 'background.default', color: 'text.primary'}}
      className={styles.header}
    >
      {/* Left: Search */}
      <div className={styles.left}>
        <CustomContainer
          noShadow
          type="secondary"
          padding={1}
          radius="medium"
          className={styles.searchContainer}
        >
          <RiSearchLine
            style={{color: theme.palette.text.secondary}}
            size={'1.2rem'}
          />
          <input
            className={styles.searchInput}
            name="search"
            placeholder="Search"
            onChange={search}
          />
        </CustomContainer>
      </div>

      {/* Middle: Date Display */}
      <div className={styles.center}>
        <CustomLabel className={styles.dateLabel} type="secondary">
          <RiCalendar2Line className={styles.icon} size={'1.2rem'} />
          Today
        </CustomLabel>
        <div className={styles.date}>{moment().format('MMMM DD')}</div>
      </div>

      {/* Right: Profile & Theme Toggle */}
      <div className={styles.right}>
        <DarkModeToggle />
        <ProfileMenu />
      </div>

      {/* Search Results Dropdown */}
      {filteredData && filteredData.length > 0 && (
        <CustomContainer className={styles.searchDropdown} radius="medium">
          {filteredData.map((item) => (
            <button
              key={item.href}
              className={`${styles.searchResult} ${
                theme.palette.mode === 'dark' ? styles.darkMode : ''
              }`}
              onClick={() => router.push(item.href)}
            >
              {item.name}
            </button>
          ))}
        </CustomContainer>
      )}
    </Box>
  )
}
