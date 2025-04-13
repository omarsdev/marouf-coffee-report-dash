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

interface TransferDialogProps {
  isOpen
  handleClose
  departments
  id
  refetch
}
const TransferDialog = ({
  isOpen,
  handleClose,
  departments,
  id,
  refetch,
}: TransferDialogProps) => {
  const [backendError, setBackendError] = React.useState<string>('')
  const [loading, setLoading] = React.useState(false)
  const onSubmit = async () => {
    try {
      setLoading(true)
      await ticketsApi.update(id.toString(), {
        ...values,
        transfer_to_department: true,
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
    handleChange('department', '')
    handleChange('transfer_note', '')
  }, [isOpen])

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        !loading && handleClose()
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: {
          zIndex: 1600,
        },
      }}
    >
      <DialogTitle id="alert-dialog-title">{'Transfer Ticket'}</DialogTitle>
      <DialogContent sx={{width: {xs: '300px', md: '400px'}}}>
        <CustomSelect
          id="bootstrap"
          options={departments?.departments?.map((department) => ({
            label: department?.department_name?.en,
            value: department._id,
          }))}
          label="Department"
          placeholder="Department"
          className="w-full"
          value={values.department}
          onChange={({target: {value}}) => handleChange('department', value)}
          padding={2}
        />
        <TextInput
          label="Transfer Note"
          className="w-full"
          value={values.transfer_note}
          onChange={(value) => handleChange('transfer_note', value)}
          padding={2}
          query={true}
        />
        <Error backendError={backendError} />
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={handleSubmit}
          disabled={!values.department || !values.transfer_note || loading}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TransferDialog
