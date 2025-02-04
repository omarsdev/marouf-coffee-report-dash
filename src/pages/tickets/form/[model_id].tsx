import CustomContainer from 'components/CustomContainer'
import CustomLabel from 'components/CustomLabel'
import CustomSelect from 'components/CustomSelect'
import FormBottomWidget from 'components/FormBottomWidget'
import TextInput from 'components/TextInput'
import useForm from 'lib/hooks/useForm'
import router, {useRouter} from 'next/router'
import {redirectGuest} from 'pages/_app'
import React, {useEffect} from 'react'
import Layout from '../../../Layout'
import Error from 'components/Error'
import {useQuery} from '@tanstack/react-query'
import {userApi} from 'lib/api/user'
import {get} from 'lodash'
export default function TicketsForm({setLoading}) {
  const {
    query: {model_id},
  } = useRouter()
  const isEditting = model_id.toString() !== 'new'

  const [backendError, setBackendError] = React.useState<string>('')

  const {data, isLoading} = useQuery<any>({
    queryFn: () => userApi.getId(model_id.toString()),
    enabled: isEditting,
    queryKey: ['users' + model_id.toString()],
    select: (data) => {
      const chosenKeys = [
        'name.en',
        'name.ar',
        'email',
        'phone',
        'password',
        'role',
      ]
      chosenKeys.map((key) => handleChange(key, get(data?.user, key)))
      return data
    },
  })

  const submitCreate = async () => {
    try {
      setLoading(true)
      await userApi.create({...values})
      router.back()
    } catch (e) {
      console.log(e)
      setBackendError(e?.message)
    } finally {
      setLoading(false)
    }
  }
  const submitUpdate = async () => {
    try {
      setLoading(true)
      await userApi.edit(model_id.toString(), {...values})
      router.back()
    } catch (e) {
      console.log(e)
      setBackendError(e?.message)
    } finally {
      setLoading(false)
    }
  }

  const {values, errors, handleChange, handleSubmit, clearErrors} = useForm({
    initial: {},
    // validationSchema:
    onSubmit: isEditting ? submitUpdate : submitCreate,
  })

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading])

  return (
    <Layout
      meta={{
        title: isEditting ? 'Edit Ticket' : 'Add Ticket',
      }}
    >
      <CustomLabel size="bigTitle">
        {isEditting ? 'Edit Ticket' : 'Add Ticket'}
      </CustomLabel>

      <CustomLabel type="secondary" padding={3} size="normal">
        {isEditting ? 'Edit an existing Ticket' : 'Create a new Ticket'}
      </CustomLabel>

      <CustomContainer
        style={{
          overflow: 'hidden',
        }}
        className="overflow-hidden mb-14"
        radius="medium"
        type="secondary"
        padding={3}
      >
        <TextInput
          label="Employee Name (English)"
          className="w-full"
          name="name.en"
          value={values.name?.en}
          onChange={handleChange}
          padding={1}
        />
        <TextInput
          label="Employee Name (Arabic)"
          className="w-full"
          value={values.name?.ar}
          name="name.ar"
          onChange={handleChange}
          padding={1}
        />

        <TextInput
          label="Email"
          className="w-full"
          value={values.email}
          name="email"
          onChange={handleChange}
          padding={2}
          multiline
        />

        <TextInput
          label="Phone"
          className="w-full"
          value={values.phone}
          name="phone"
          onChange={handleChange}
          padding={2}
          multiline
        />

        <TextInput
          label="Password"
          className="w-full"
          value={values.password}
          name="password"
          onChange={handleChange}
          padding={2}
          secureEntry={true}
        />

        <CustomSelect
          id="bootstrap"
          options={[
            {
              label: 'Super Admin',
              value: '0',
            },
            {
              label: 'Department',
              value: '1',
            },
            {
              label: 'Area Manager',
              value: '2',
            },
            {
              label: 'Branch User',
              value: '3',
            },
          ]}
          inputProps={{
            default: '1',
          }}
          // hasEmpty
          // variant='outlined'
          value={values.role}
          label="Role"
          helperText="Choose Employee Role"
          className="w-full"
          onChange={({target: {name, value}}) => handleChange('role', value)}
          padding={2}
        />

        <Error backendError={backendError} />

        <FormBottomWidget
          isEdit={isEditting}
          onSubmit={() => {
            handleSubmit()
          }}
        />
      </CustomContainer>
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  return await redirectGuest(ctx)
}
