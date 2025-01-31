import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import {red} from '@mui/material/colors'

interface Props {
  isOpen
  deleteCallback
  handleClose
}

export default function ResetPassDialog({
  isOpen,
  deleteCallback,
  handleClose,
}: Props) {
  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Reset Record'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action is non-reversable, please make sure of your action
            before proceeding, if entry is incorrect, you can always update it
            using the button.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Dismiss
          </Button>
          <Button
            color="error"
            onClick={() => {
              deleteCallback()
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
