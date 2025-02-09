import {Checkbox, InputLabel} from '@mui/material'
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
import {get} from 'lodash'
import {questionsApi} from 'lib/api/questions'
export default function QuestionsForm({setLoading}) {
  const {
    query: {model_id},
  } = useRouter()
  const isEditting = model_id.toString() !== 'new'

  const [backendError, setBackendError] = React.useState<string>('')

  const {data: branch, isLoading: isLoadingChecklist} = useQuery<any>({
    queryFn: () => questionsApi.getId(model_id.toString()),
    enabled: isEditting,
    queryKey: ['questions' + model_id.toString()],
    select: (data) => {
      const chosenKeys = ['text', 'type', 'media_status', 'required', 'options']
      chosenKeys.map((key) => handleChange(key, get(data?.report, key)))
      return data
    },
  })

  const submitCreate = async () => {
    try {
      setLoading(true)
      await questionsApi.create({...values})
      router.back()
    } catch (e) {
      console.error(e)
      setBackendError(e?.message)
    } finally {
      setLoading(false)
    }
  }
  const submitUpdate = async () => {
    try {
      setLoading(true)
      await questionsApi.update(model_id.toString(), {...values})
      router.back()
    } catch (e) {
      console.error(e)
      setBackendError(e?.message)
    } finally {
      setLoading(false)
    }
  }

  const {values, errors, handleChange, handleSubmit, clearErrors} = useForm({
    initial: {
      required: false,
    },
    // validationSchema:
    onSubmit: isEditting ? submitUpdate : submitCreate,
  })

  useEffect(() => {
    setLoading(isLoadingChecklist)
  }, [isLoadingChecklist])

  return (
    <Layout
      meta={{
        title: isEditting ? 'Edit Question' : 'Add Question',
      }}
    >
      <CustomLabel size="bigTitle">
        {isEditting ? 'Edit Question' : 'Add Question'}
      </CustomLabel>

      <CustomLabel type="secondary" padding={3} size="normal">
        {isEditting ? 'Edit an existing Question' : 'Create a new Question'}
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
          label="Text"
          className="w-full"
          name="text"
          value={values.text}
          onChange={handleChange}
          padding={1}
        />

        <CustomSelect
          id="bootstrap"
          options={[
            {
              label: 'Multiple Choice',
              value: 'MultipleChoice',
            },
          ]}
          inputProps={{
            default: '1',
          }}
          // hasEmpty
          // variant='outlined'
          value={values.type}
          label="Type"
          helperText="Choose Type"
          className="w-full"
          onChange={({target: {name, value}}) => handleChange('type', value)}
          padding={2}
        />

        <CustomSelect
          id="bootstrap"
          options={[
            {
              label: 'No Media',
              value: 'no_media',
            },
          ]}
          inputProps={{
            default: '1',
          }}
          // hasEmpty
          // variant='outlined'
          value={values.media_status}
          label="Media Status"
          helperText="Choose Media Status"
          className="w-full"
          onChange={({target: {name, value}}) =>
            handleChange('media_status', value)
          }
          padding={2}
        />

        <CustomSelect
          id="bootstrap"
          options={[
            {
              label: 'Yes',
              value: 'Yes',
            },
            {
              label: 'No',
              value: 'No',
            },
          ]}
          inputProps={{
            default: '1',
          }}
          // hasEmpty
          // variant='outlined'
          value={values.options || []}
          label="Options"
          helperText="Choose Options"
          className="w-full"
          onChange={({target: {value}}) => {
            const newValue = Array.isArray(value)
              ? value
              : [...(value || []), value]
            handleChange('options', newValue)
          }}
          padding={2}
          multiple={true}
        />

        <InputLabel shrink>Required</InputLabel>
        <Checkbox
          checked={values.required}
          value={values.required}
          inputProps={{'aria-label': 'primary checkbox'}}
          onChange={({target: {name, checked}}) =>
            handleChange('required', checked)
          }
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
