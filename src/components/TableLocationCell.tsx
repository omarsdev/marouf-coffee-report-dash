import {IconButton, Tooltip} from '@mui/material'
import React from 'react'
import {RiMap2Fill} from 'react-icons/ri'

interface Props {
  onPress
}

export default function TableLocationCell(props: Props) {
  return (
    <Tooltip title="Show Location">
      <IconButton onClick={props.onPress}>
        <RiMap2Fill />
      </IconButton>
    </Tooltip>
  )
}
