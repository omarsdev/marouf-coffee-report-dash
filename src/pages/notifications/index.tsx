import ConfirmDialog from 'components/ConfirmDialog'
import CustomButton from 'components/CustomButton'
import CustomContainer from 'components/CustomContainer'
import CustomLabel from 'components/CustomLabel'
import TextInput from 'components/TextInput'
import {notificationApi} from 'lib/api/notification'
import useForm from 'lib/hooks/useForm'
import React, {useState} from 'react'
import Layout from '../../Layout'
import CrmNotifications from './crm'
import Error from 'components/Error'

export default function Notifications() {
  const [loading, setLoading] = useState(false)
  const [backendError, setBackendError] = React.useState<string>('')
  const onNotificationSubmit = async (crm) => {
    clearErrors()
    try {
      setConfirmOpen(false)
      setLoading(true)
      await notificationApi.send({title: values.title, body: values.body})
      handleChange('title', '')
      handleChange('body', '')
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  const {values, errors, handleChange, handleSubmit, clearErrors} = useForm({
    initial: {},
    onSubmit: onNotificationSubmit,
  })

  const [confirmOpen, setConfirmOpen] = useState(false)

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
      <Layout
        meta={{
          title: 'Staff',
        }}
      >
        <CustomLabel size="bigTitle">Notifications</CustomLabel>
        <CustomLabel type="secondary" padding={3} size="normal">
          Send Notifications to all clients
        </CustomLabel>
        <CustomContainer
          style={{
            overflow: 'hidden',
          }}
          className="overflow-hidden"
          radius="medium"
          type="secondary"
          padding={3}
          margin={5}
        >
          <CustomLabel padding={3} className="text-lg font-medium">
            Darsi Student App
          </CustomLabel>
          <TextInput
            label="Title"
            placeholder="Notifcation Title"
            className="w-full"
            name="title"
            value={values.title}
            onChange={handleChange}
            padding={1}
          />
          <TextInput
            label="Body"
            placeholder="Notifcation Body"
            className="w-full"
            multiline
            value={values.body}
            name="body"
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
        <CrmNotifications
          setConfirmOpen={setConfirmOpen}
          setLoading={setLoading}
        />
      </Layout>
    </>
  )
}
