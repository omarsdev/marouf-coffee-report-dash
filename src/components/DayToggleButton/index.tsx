import React from 'react'
import {ToggleButton} from '@mui/material'

interface DayToggleButtonProps {
  value: number
  label: string
}

const DayToggleButton = ({label, value}: DayToggleButtonProps) => {
  return (
    <ToggleButton
      value={value}
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50% !important',
        border: '1px solid rgba(0, 0, 0, 0.2) !important',
        '&.Mui-selected': {
          bgcolor: 'primary.main',
          color: 'white',
          border: 'none',
          '&:hover': {bgcolor: 'primary.dark'},
        },
      }}
    >
      {label}
    </ToggleButton>
  )
}

export default DayToggleButton
