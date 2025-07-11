import {IconButton, Tooltip} from '@mui/material'
import React from 'react'
import {RiDeleteBin2Fill, RiEdit2Fill} from 'react-icons/ri'

export default function TableActionCell({onDelete, onEdit}) {
  return (
    <div className="flex">
      <Tooltip title="Edit">
        <IconButton onClick={onEdit}>
          <RiEdit2Fill />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton onClick={onDelete} sx={{ml: 2}}>
          <RiDeleteBin2Fill />
        </IconButton>
      </Tooltip>
    </div>
  )
}
