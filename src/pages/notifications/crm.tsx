import ConfirmDialog from 'components/ConfirmDialog'
import CustomButton from 'components/CustomButton'
import CustomContainer from 'components/CustomContainer'
import CustomLabel from 'components/CustomLabel'
import TextInput from 'components/TextInput'
import {notificationApi} from 'lib/api/notification'
import useForm from 'lib/hooks/useForm'
import React, {useState} from 'react'
import Layout from '../../Layout'
import Error from 'components/Error'

export default function CrmNotifications(props) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [backendError, setBackendError] = React.useState<string>('')
  const onNotificationSubmit = async (crm) => {
    clearErrors()
    try {
      setConfirmOpen(false)
      props.setLoading(true)
      await notificationApi.sendcrm({
        title: values.crmTitle,
        body: values.crmBody,
      })
      handleChange('crmTitle', '')
      handleChange('crmBody', '')
    } catch (e) {
      console.log(e)
    } finally {
      props.setLoading(false)
    }
  }

  const {values, errors, handleChange, handleSubmit, clearErrors} = useForm({
    initial: {},
    onSubmit: onNotificationSubmit,
  })

  return (
    <>
      <ConfirmDialog
        isOpen={confirmOpen}
        values={values}
        handleClose={() => setConfirmOpen(false)}
        confirmCallBack={() => {
          handleSubmit()
        }}
      />
      <CustomContainer
        style={{
          overflow: 'hidden',
        }}
        className="overflow-hidden mb-14"
        radius="medium"
        type="secondary"
        padding={3}
      >
        <CustomLabel padding={3} className="text-lg font-medium">
          Darsi Teacher App
        </CustomLabel>
        <TextInput
          label="Title"
          placeholder="Notifcation Title"
          className="w-full"
          name="crmTitle"
          value={values.crmTitle}
          onChange={handleChange}
          padding={1}
        />
        <TextInput
          label="Body"
          placeholder="Notifcation Body"
          className="w-full"
          multiline
          value={values.crmBody}
          name="crmBody"
          onChange={handleChange}
          padding={2}
        />

        <Error backendError={backendError} />

        <CustomButton
          onClick={() => {
            setConfirmOpen(true)
          }}
          fullWidth
          mainButton
          title={'Send Notification'}
        />
      </CustomContainer>
    </>
  )
}
