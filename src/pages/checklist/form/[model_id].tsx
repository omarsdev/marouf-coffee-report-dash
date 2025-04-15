import CustomContainer from 'components/CustomContainer'
import CustomLabel from 'components/CustomLabel'
import FormBottomWidget from 'components/FormBottomWidget'
import TextInput from 'components/TextInput'
import useForm from 'lib/hooks/useForm'
import router, {useRouter} from 'next/router'
import {redirectGuest} from 'pages/_app'
import React, {useEffect, useMemo, useState} from 'react'
import Layout from '../../../Layout'
import Error from 'components/Error'
import {useQuery} from '@tanstack/react-query'
import {get} from 'lodash'
import {checklistApi} from 'lib/api/checklist'
import {questionsApi} from 'lib/api/questions'
import CustomAutocomplete from 'components/CustomAutoComplete'
import CustomButton from 'components/CustomButton'

export default function CheckListForm({setLoading}) {
  const {
    query: {model_id},
  } = useRouter()

  const isEditting = model_id.toString() !== 'new'
  const [backendError, setBackendError] = useState<string>('')
  const [question, setQuestion] = useState<string | null>(null)

  const {
    data: questions,
    isLoading,
    refetch: refetchQuestions,
  } = useQuery<any>({
    queryFn: () => questionsApi.get(),
    queryKey: ['questions'],
  })

  const {
    data: checkListData,
    isLoading: isLoadingChecklist,
    refetch,
  } = useQuery<any>({
    queryFn: () => checklistApi.getId(model_id.toString()),
    enabled: isEditting,
    queryKey: ['checklist' + model_id.toString()],
    select: (data) => data,
  })

  console.log({checkListData})

  const submitCreate = async () => {
    try {
      setLoading(true)
      const payload = {
        ...values,
        questions: values.questions,
      }
      await checklistApi.create(payload)
      await refetch()
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
      const payload = {
        ...values,
        questions: values.questions,
      }
      await checklistApi.update(model_id.toString(), payload)
      await refetch()
      router.back()
    } catch (e) {
      console.error(e)
      setBackendError(e?.message)
    } finally {
      setLoading(false)
    }
  }

  const submitCreateQuestion = async () => {
    try {
      setLoading(true)
      await questionsApi.create({
        text: question,
        type: 'MultipleChoice',
        media_status: 'no_media',
        options: ['Yes', 'No'],
        required: true,
      })
    } catch (e) {
      console.error(e)
    } finally {
      setQuestion('')
      setLoading(false)
      refetchQuestions()
    }
  }

  const {values, errors, handleChange, handleSubmit, clearErrors} = useForm({
    initial: {
      questions: isEditting ? undefined : [],
    },
    onSubmit: isEditting ? submitUpdate : submitCreate,
  })

  useEffect(() => {
    setLoading(isLoading || isLoadingChecklist)
  }, [isLoading, isLoadingChecklist])

  useEffect(() => {
    if (checkListData) {
      const chosenKeys = ['title', 'description']
      handleChange(
        'questions',
        checkListData?.report.questions?.map((e) => e._id),
      )
      chosenKeys.forEach((key) =>
        handleChange(key, get(checkListData?.report, key)),
      )
    }
  }, [checkListData])

  const availableQuestionOptions = useMemo(() => {
    if (questions?.questions) {
      return questions?.questions
        ?.map((q) => ({
          label: q.text,
          value: q._id,
        }))
        .filter(
          (q) =>
            !values.questions?.some((selected) => selected?.value === q?.value),
        )
    } else {
      return []
    }
  }, [questions, values.questions])

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
        style={{overflow: 'hidden'}}
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

        <div className="w-full flex gap-5 items-center">
          <TextInput
            label="New Question"
            style={{width: '100%'}}
            value={question}
            onChange={(_, value: string) => setQuestion(value)}
            padding={1}
          />
          <CustomButton
            onClick={submitCreateQuestion}
            width="10rem"
            disabled={!question}
            title="Create Question"
          />
        </div>

        {values.questions && (
          <CustomAutocomplete
            id="bootstrap"
            options={availableQuestionOptions}
            value={values.questions}
            label="Questions"
            helperText="Choose Questions"
            className="w-full"
            onChange={({target: {value}}) => {
              handleChange('questions', value)
            }}
            padding={2}
            multiple={true}
          />
        )}

        <Error backendError={backendError} />

        <FormBottomWidget isEdit={isEditting} onSubmit={() => handleSubmit()} />
      </CustomContainer>
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  return await redirectGuest(ctx)
}
