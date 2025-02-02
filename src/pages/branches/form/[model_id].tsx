import {Divider} from '@mui/material'
import CustomAutoComplete from 'components/CustomAutoComplete'
import CustomButton from 'components/CustomButton'
import CustomContainer from 'components/CustomContainer'
import CustomLabel from 'components/CustomLabel'
import CustomSelect from 'components/CustomSelect'
import DropZone from 'components/DropZone'
import FormBottomWidget from 'components/FormBottomWidget'
import MapFormPicker from 'components/MapFormPicker'
import MultiLineOptionSelector from 'components/MultiLineOptionSelector'
import TextInput from 'components/TextInput'
import {branchesApi} from 'lib/api/branches'
import {categoriesApi} from 'lib/api/categories'
import {venuesApi} from 'lib/api/venues'
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
export default function VenueForm({setLoading}) {
  const {
    query: {model_id},
  } = useRouter()
  const isEditting = model_id.toString() !== 'new'

  const [backendError, setBackendError] = React.useState<string>('')

  const {data, isLoading, isError} = useQuery<any>({
    queryFn: () => userApi.getAllAreaManagers(),
    queryKey: ['area_managers'],
  })

  const {data: branch, isLoading: isLoadingBranch} = useQuery<any>({
    queryFn: () => branchApi.getId(model_id.toString()),
    enabled: isEditting,
    queryKey: ['branch' + model_id.toString()],
    select: (data) => {
      const chosenKeys = [
        'name.en',
        'name.ar',
        'lat',
        'lng',
        'miles',
        'area_manager',
      ]
      chosenKeys.map((key) => handleChange(key, get(data?.branch, key)))
      return data
    },
  })

  const submitCreateBranch = async () => {
    try {
      setLoading(true)
      await branchApi.create({...values})
      router.back()
    } catch (e) {
      console.log(e)
      setBackendError(e?.message)
    } finally {
      setLoading(false)
    }
  }
  const submitUpdateBranch = async () => {
    try {
      setLoading(true)
      await branchApi.update(model_id.toString(), {...values})
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
    onSubmit: isEditting ? submitUpdateBranch : submitCreateBranch,
  })

  useEffect(() => {
    if (isEditting) {
      setLoading(isLoading || isLoadingBranch)
    } else {
      setLoading(!isLoading)
    }
  }, [isLoading, isLoadingBranch])

  return (
    <Layout
      meta={{
        title: isEditting ? 'Edit Branch' : 'Add Branch',
      }}
    >
      <CustomLabel size="bigTitle">
        {isEditting ? 'Edit Branch' : 'Add Branch'}
      </CustomLabel>

      <CustomLabel type="secondary" padding={3} size="normal">
        {isEditting ? 'Edit an existing Branch' : 'Create a new Branch'}
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
          label="Branch Name (English)"
          className="w-full"
          name="name.en"
          value={values.name?.en}
          onChange={handleChange}
          padding={1}
        />
        <TextInput
          label="Branch Name (Arabic)"
          className="w-full"
          value={values.name?.ar}
          name="name.ar"
          onChange={handleChange}
          padding={1}
        />

        <TextInput
          label="Location latitude"
          className="w-full"
          value={values.lat}
          name="lat"
          onChange={handleChange}
          padding={2}
          multiline
        />

        <TextInput
          label="Location longitude"
          className="w-full"
          type="number"
          value={values.lng}
          name="lng"
          onChange={handleChange}
          padding={2}
          multiline
        />

        <TextInput
          label="Miles"
          className="w-full"
          value={values.miles}
          name="miles"
          onChange={handleChange}
          padding={2}
          multiline
        />

        <CustomSelect
          id="bootstrap"
          options={data?.users?.map((user) => ({
            label: user?.name?.en,
            value: user?._id,
          }))}
          inputProps={{
            default: '1',
          }}
          // hasEmpty
          // variant='outlined'
          value={values.area_manager}
          label="User Type"
          helperText="Choose Area manager"
          className="w-full"
          onChange={({target: {name, value}}) =>
            handleChange('area_manager', value)
          }
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
