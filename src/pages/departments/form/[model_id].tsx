import CustomContainer from 'components/CustomContainer'
import CustomLabel from 'components/CustomLabel'
import FormBottomWidget from 'components/FormBottomWidget'
import TextInput from 'components/TextInput'
import useForm from 'lib/hooks/useForm'
import router, {useRouter} from 'next/router'
import {redirectGuest} from 'pages/_app'
import React, {useEffect} from 'react'
import Layout from '../../../Layout'
import Error from 'components/Error'
import {useQuery} from '@tanstack/react-query'
import {get} from 'lodash'
import {departmentsApi} from 'lib/api/departments'

export default function VenueForm({setLoading}) {
  const {
    query: {model_id},
  } = useRouter()
  const isEditting = model_id.toString() !== 'new'

  const [backendError, setBackendError] = React.useState<string>('')

  const {data, isLoading} = useQuery({
    queryFn: () => departmentsApi.getId(model_id.toString()),
    enabled: isEditting,
    queryKey: ['departments' + model_id.toString()],
    select: (data) => {
      const chosenKeys = ['department_name.en', 'department_name.ar']
      chosenKeys.map((key) => handleChange(key, get(data?.report, key)))
      return data
    },
  })

  const submitCreate = async () => {
    try {
      setLoading(true)
      await departmentsApi.create({...values})
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
      await departmentsApi.edit(model_id.toString(), {...values})
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
        title: isEditting ? 'Edit Department' : 'Add Department',
      }}
    >
      <CustomLabel size="bigTitle">
        {isEditting ? 'Edit Department' : 'Add Department'}
      </CustomLabel>

      <CustomLabel type="secondary" padding={3} size="normal">
        {isEditting ? 'Edit an existing Department' : 'Create a new Department'}
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
          label="Department Name (English)"
          className="w-full"
          name="department_name.en"
          value={values.department_name?.en}
          onChange={handleChange}
          padding={1}
        />
        <TextInput
          label="Department Name (Arabic)"
          className="w-full"
          value={values.department_name?.ar}
          name="department_name.ar"
          onChange={handleChange}
          padding={1}
        />

        {!isEditting && (
          <>
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
          </>
        )}

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
