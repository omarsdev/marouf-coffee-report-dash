import {IconButton, Tooltip} from '@mui/material'
import React from 'react'
import {
  RiAccountBoxFill,
  RiBillFill,
  RiBook2Fill,
  RiMap2Fill,
  RiMoneyCnyBoxFill,
  RiMoneyEuroBoxFill,
  RiUser2Fill,
} from 'react-icons/ri'

interface Props {
  onPress
  onBookingPress
  onAccountingPress
  staff?
}

export default function TableUserCell(props: Props) {
  return (
    <>
      {props.staff && (
        <Tooltip title="Staff">
          <IconButton onClick={props.onPress}>
            <RiUser2Fill />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Booking">
        <IconButton
          sx={{
            ml: 2,
          }}
          onClick={props.onBookingPress}
        >
          <RiBook2Fill />
        </IconButton>
      </Tooltip>
      <Tooltip title="Accounting">
        <IconButton
          sx={{
            ml: 2,
          }}
          onClick={props.onAccountingPress}
        >
          <RiMoneyEuroBoxFill />
        </IconButton>
      </Tooltip>
    </>
  )
}
