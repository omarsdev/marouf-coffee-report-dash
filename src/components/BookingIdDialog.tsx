import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import {red} from '@mui/material/colors'
import TextInput from './TextInput'
import {booksApi} from 'lib/api/books'

interface Props {
  isOpen
  confirmCallBack
  handleClose
}

export default function BookingIdDialog({
  isOpen,
  confirmCallBack,
  handleClose,
}: Props) {
  const [bookingNumber, setBookingNumber] = React.useState('')

  const fetchBooking = () => {
    return new Promise(async (resolve, reject) => {
      try {
        let {book} = (await booksApi.findByNumber({
          number: bookingNumber,
        })) as any
        resolve(book)
      } catch (e) {
        reject(e)
      }
    })
  }

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Booking Finder'}</DialogTitle>
        <DialogContent>
          <TextInput
            value={bookingNumber}
            name="bookingNumber"
            label="Booking Number"
            onChange={(_, v) => setBookingNumber(v)}
          />
        </DialogContent>

        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Dismiss
          </Button>
          <Button
            color="error"
            onClick={async () => {
              try {
                let booking = await fetchBooking()
                confirmCallBack(booking)
                handleClose()
              } catch (e) {
                console.log(e)
              }
            }}
          >
            Find
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
