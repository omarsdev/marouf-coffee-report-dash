import {IconButton, Tooltip} from '@mui/material'
import React from 'react'
import {RiDeleteBin2Fill, RiEdit2Fill, RiLockPasswordFill} from 'react-icons/ri'

export default function TableActionCell({
  onDelete,
  onEdit,
  onReset,
}: {
  onDelete
  onEdit
  onReset?
}) {
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
      {onReset && (
        <Tooltip title="Reset Password">
          <IconButton onClick={onReset} sx={{ml: 2}}>
            <RiLockPasswordFill />
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}
