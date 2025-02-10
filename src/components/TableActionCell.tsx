import {IconButton, Tooltip} from '@mui/material'
import React from 'react'
import {RiDeleteBin2Fill, RiEdit2Fill, RiLockPasswordFill} from 'react-icons/ri'
import {IoEyeOutline} from 'react-icons/io5'

export default function TableActionCell({
  onDelete,
  onEdit,
  onReset,
  onView,
}: {
  onDelete?
  onEdit?
  onReset?
  onView?
}) {
  return (
    <div className="flex">
      {onEdit && (
        <Tooltip title="Edit">
          <IconButton onClick={onEdit}>
            <RiEdit2Fill />
          </IconButton>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip title="Delete">
          <IconButton onClick={onDelete} sx={{ml: 2}}>
            <RiDeleteBin2Fill />
          </IconButton>
        </Tooltip>
      )}
      {onReset && (
        <Tooltip title="Reset Password">
          <IconButton onClick={onReset} sx={{ml: 2}}>
            <RiLockPasswordFill />
          </IconButton>
        </Tooltip>
      )}
      {onView && (
        <Tooltip title="View">
          <IconButton onClick={onView} sx={{ml: 2}}>
            <IoEyeOutline />
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}
