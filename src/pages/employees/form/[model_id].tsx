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
import {branchApi} from 'lib/api/branch'
import {get, map} from 'lodash'
import {Data} from '@react-google-maps/api'
export default function EmployeesForm({setLoading}) {
  const {
    query: {model_id},
  } = useRouter()
  const isEditting = model_id.toString() !== 'new'

  const [backendError, setBackendError] = React.useState<string>('')

  const {data, isLoading} = useQuery<any>({
    queryFn: () => userApi.getId(model_id.toString()),
    enabled: isEditting,
    queryKey: ['users' + model_id.toString()],
  })

  const {data: branches, isLoading: isLoadingBranch} = useQuery<any>({
    queryFn: () => branchApi.get(),
    queryKey: ['branches'],
  })

  const submitCreate = async () => {
    const payload = {
      ...values,
      role_type:
        values.role === 'QC'
          ? 'QC'
          : values.role === '2'
          ? 'default'
          : undefined,
      role: values.role === 'QC' ? undefined : values.role,
    }
    try {
      setLoading(true)
      await userApi.create(payload)
      router.back()
    } catch (e) {
      console.error(e)
      setBackendError(e?.message)
    } finally {
      setLoading(false)
    }
  }
  const submitUpdate = async () => {
    const payload = {
      ...values,
      role_type:
        values.role === 'QC'
          ? 'QC'
          : values.role === '2'
          ? 'default'
          : undefined,
      role: values.role === 'QC' ? undefined : values.role,
    }
    try {
      setLoading(true)
      await userApi.edit(model_id.toString(), payload)
      router.back()
    } catch (e) {
      console.error(e)
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
    if (isEditting && data) {
      const chosenKeys = ['name.en', 'name.ar', 'email', 'phone', 'password']
      chosenKeys.map((key) => handleChange(key, get(data?.user, key)))

      if (data?.user?.role === 2 && data?.user?.role_type === 'QC') {
        handleChange('role_type', 'QC')
        handleChange('role', 'QC')
      } else if (
        data?.user?.role === 2 &&
        data?.user?.role_type === 'default'
      ) {
        handleChange('role', '2')
      } else {
        handleChange('role', data?.user.role.toString())
      }
    }
  }, [data])

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading])

  return (
    <Layout
      meta={{
        title: isEditting ? 'Edit Employee' : 'Add Employee',
      }}
    >
      <CustomLabel size="bigTitle">
        {isEditting ? 'Edit Employee' : 'Add Employee'}
      </CustomLabel>

      <CustomLabel type="secondary" padding={3} size="normal">
        {isEditting ? 'Edit an existing Employee' : 'Create a new Employee'}
      </CustomLabel>

      {isEditting && data?.user && (
        <span
          style={{
            background: !data?.user?.deleted ? 'green' : 'red',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '85px',
            padding: '2px',
            marginBottom: 5,
            borderRadius: '20px',
            color: 'white',
          }}
        >
          {data?.user?.deleted ? 'deactivate' : 'activate'}
        </span>
      )}

      <CustomContainer
        style={{
          overflow: 'hidden',
          marginTop: '1rem',
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
              label: 'Area Manager',
              value: '2',
            },
            {
              label: 'Quality control',
              value: 'QC',
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
          onChange={({target: {value}}) => handleChange('role', value)}
          padding={2}
        />

        {values.role === '3' && (
          <CustomSelect
            id="bootstrap"
            options={branches?.branches?.map((branch) => ({
              label: branch?.name?.en,
              value: branch?._id,
            }))}
            value={values.branch_access}
            label="Branch"
            helperText="Choose branch"
            className="w-full"
            // onChange={({target: {name, value}}) => handleChange('userId', value)}
            onChange={({target: {name, value}}) =>
              handleChange('branch_access', value)
            }
            padding={2}
          />
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
