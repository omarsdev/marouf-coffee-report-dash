import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import CustomSelect from 'components/CustomSelect'
import TextInput from 'components/TextInput'
import {ticketsApi} from 'lib/api/tickets'
import useForm from 'lib/hooks/useForm'
import React, {useEffect} from 'react'
import Error from 'components/Error'

interface CompleteDialogProps {
  isOpen
  handleClose
  id
  refetch
}
const CompleteDialog = ({
  isOpen,
  handleClose,
  id,
  refetch,
}: CompleteDialogProps) => {
  const [backendError, setBackendError] = React.useState<string>('')
  const [loading, setLoading] = React.useState(false)
  const onSubmit = async () => {
    try {
      setLoading(true)
      await ticketsApi.edit(id.toString(), {
        ...values,
        resolve: true,
      })
      refetch()
      handleClose()
    } catch (e) {
      console.error(e)
      setBackendError(e?.message)
    } finally {
      setLoading(false)
    }
  }
  const {values, errors, handleChange, handleSubmit} = useForm({
    initial: {},
    onSubmit,
  })

  useEffect(() => {
    handleChange('progress_note', '')
  }, [isOpen])

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        !loading && handleClose()
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{'Complete Ticket'}</DialogTitle>
      <DialogContent sx={{width: '400px'}}>
        <TextInput
          label="Progress Note"
          className="w-full"
          value={values.progress_note}
          onChange={(value) => handleChange('progress_note', value)}
          padding={2}
          query={true}
        />
        <Error backendError={backendError} />
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={handleSubmit}
          disabled={!values.progress_note || loading}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CompleteDialog
