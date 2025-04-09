import {IconButton, Tooltip} from '@mui/material'
import React from 'react'
import {
  RiDeleteBin2Fill,
  RiEdit2Fill,
  RiLockPasswordFill,
  RiCheckboxCircleFill,
} from 'react-icons/ri'
import {IoEyeOutline} from 'react-icons/io5'
import {BiTransferAlt} from 'react-icons/bi'

export default function TableActionCell({
  onDelete,
  onEdit,
  onReset,
  onView,
  onComplete,
  onTransfer,
}: {
  onDelete?
  onEdit?
  onReset?
  onView?
  onComplete?
  onTransfer?
}) {
  return (
    <div className="flex">
      {onView && (
        <Tooltip title="View">
          <IconButton onClick={onView}>
            <IoEyeOutline />
          </IconButton>
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip title="Edit">
          <IconButton onClick={onEdit}>
            <RiEdit2Fill />
          </IconButton>
        </Tooltip>
      )}
      {onTransfer && (
        <Tooltip title="Transfer">
          <IconButton onClick={onTransfer}>
            <BiTransferAlt />
          </IconButton>
        </Tooltip>
      )}
      {onComplete && (
        <Tooltip title="Complete">
          <IconButton onClick={onComplete}>
            <RiCheckboxCircleFill />
          </IconButton>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip title="Delete">
          <IconButton onClick={onDelete}>
            <RiDeleteBin2Fill />
          </IconButton>
        </Tooltip>
      )}
      {onReset && (
        <Tooltip title="Reset Password">
          <IconButton onClick={onReset}>
            <RiLockPasswordFill />
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}
