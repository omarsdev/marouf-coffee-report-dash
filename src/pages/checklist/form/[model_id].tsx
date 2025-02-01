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
import {get, map} from 'lodash'
import {checklistApi} from 'lib/api/checklist'
import {questionsApi} from 'lib/api/questions'
export default function VenueForm({setLoading}) {
  const {
    query: {model_id},
  } = useRouter()
  const isEditting = model_id.toString() !== 'new'

  const [backendError, setBackendError] = React.useState<string>('')

  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => questionsApi.get(),
    queryKey: ['questions'],
  })

  const {data: branch, isLoading: isLoadingChecklist} = useQuery({
    queryFn: () => checklistApi.getId(model_id.toString()),
    enabled: isEditting,
    queryKey: ['checklist' + model_id.toString()],
    select: (data) => {
      const chosenKeys = ['title', 'description']
      handleChange(
        'questions',
        data?.report.questions?.map((e) => e._id),
      )
      chosenKeys.map((key) => handleChange(key, get(data?.report, key)))
      return data
    },
  })

  const submitCreate = async () => {
    try {
      setLoading(true)
      await checklistApi.create({...values})
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
      await checklistApi.update(model_id.toString(), {...values})
      router.back()
    } catch (e) {
      console.log(e)
      setBackendError(e?.message)
    } finally {
      setLoading(false)
    }
  }

  const {values, errors, handleChange, handleSubmit, clearErrors} = useForm({
    initial: {
      questions: [],
    },
    // validationSchema:
    onSubmit: isEditting ? submitUpdate : submitCreate,
  })

  useEffect(() => {
    if (isEditting) {
      console.log({loading: isLoading || isLoadingChecklist})
      setLoading(isLoading || isLoadingChecklist)
    } else {
      setLoading(!isLoading)
    }
  }, [isLoading, isLoadingChecklist])

  return (
    <Layout
      meta={{
        title: isEditting ? 'Edit Checklist' : 'Add Checklist',
      }}
    >
      <CustomLabel size="bigTitle">
        {isEditting ? 'Edit Checklist' : 'Add Checklist'}
      </CustomLabel>

      <CustomLabel type="secondary" padding={3} size="normal">
        {isEditting ? 'Edit an existing Checklist' : 'Create a new Checklist'}
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
          label="Title"
          className="w-full"
          name="title"
          value={values.title}
          onChange={handleChange}
          padding={1}
        />
        <TextInput
          label="Description"
          className="w-full"
          name="description"
          value={values.description}
          onChange={handleChange}
          padding={1}
        />

        <CustomSelect
          id="bootstrap"
          options={questions?.questions?.map((question) => ({
            label: question?.text,
            value: question?._id,
          }))}
          inputProps={{
            default: '1',
          }}
          // hasEmpty
          // variant='outlined'
          value={values.questions || []}
          label="Questions"
          helperText="Choose Questions"
          className="w-full"
          // onChange={({target: {name, value}}) =>
          //   handleChange('questions', [...values.questions, value])
          // }
          onChange={({target: {value}}) => {
            const newValue = Array.isArray(value)
              ? value
              : [...(value || []), value]
            handleChange('questions', newValue)
          }}
          padding={2}
          multiple={true}
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
