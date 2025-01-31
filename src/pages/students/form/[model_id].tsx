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
import {useStore} from 'lib/store/store'
import {indexOf, map} from 'lodash'
import router, {useRouter} from 'next/router'
import {redirectGuest} from 'pages/_app'
import {resolve} from 'path'
import React from 'react'
import shallow from 'zustand/shallow'
import Layout from '../../../Layout'
import Error from 'components/Error'
export default function VenueForm({setLoading}) {
  const [backendError, setBackendError] = React.useState<string>('')
  const {
    query: {model_id},
  } = useRouter()
  const isEditting = model_id.toString() !== 'new'
  const {
    mainCategories: dataModel,
    rehydrateMainCategories: rehydrater,
  } = useStore(
    ({mainCategories, rehydrateMainCategories}) => ({
      mainCategories,
      rehydrateMainCategories,
    }),
    shallow,
  )

  const isForbiddenKey = (key) => {
    const forbiddenKeys = ['_id', 'created_at', '__v', 'status']
    return indexOf(forbiddenKeys, key) >= 0
  }

  const rehydrateData = async () => {
    if (!!!dataModel) {
      await rehydrater()
    }
  }

  const QueryFetchData = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        let model
        if (!!dataModel) {
          model = dataModel.find((m) => m._id == model_id)
          resolve(model)
        } else {
          setLoading(true)
          let _models = (await rehydrater()) as any
          model = _models.find((m) => m._id == model_id)
          if (!!model) {
            resolve(model)
          } else {
            reject('1')
          }
        }
        setLoading(false)
      } catch (e) {
        reject(e)
      }
    })
  }

  const QueryUpdateForm = async () => {
    console.log('QueryUpdateForm', model_id)
    if (model_id.toString() == 'new') {
      console.log('QueryUpdateForm NewTrigger')
      return
    }
    try {
      let venue = (await QueryFetchData()) as any
      map(venue, (item, key) => {
        // console.log("QueryUpdateForm", item, key)
        if (!isForbiddenKey(key)) {
          handleChange(key, item)
        }
      })
    } catch (e) {
      console.log('QueryUpdateForm Error', e)
    }
  }

  React.useEffect(() => {
    QueryUpdateForm()
    rehydrateData()
  }, [])

  const submitCreateForm = async () => {
    try {
      setLoading(true)
      await categoriesApi.create({...values})
      router.back()
    } catch (e) {
      console.log(e)
      setBackendError(e?.message)
    } finally {
      setLoading(false)
    }
  }

  const submitUpdateForm = async () => {
    try {
      setLoading(true)
      await categoriesApi.edit({...values}, model_id)
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
    onSubmit: !isEditting ? submitCreateForm : submitUpdateForm,
  })

  React.useEffect(() => {
    console.log('FORM', values)
  }, [values])

  return (
    <Layout
      meta={{
        title: !isEditting ? 'Add Category' : 'Edit Category',
      }}
    >
      <CustomLabel size="bigTitle">
        {!isEditting ? 'Add Category' : 'Edit Category'}
      </CustomLabel>

      <CustomLabel type="secondary" padding={3} size="normal">
        {!isEditting ? 'Create a new category' : 'Editing Category ' + model_id}
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
          label="Name (English)"
          placeholder="Mathematics"
          className="w-full"
          name="name.en"
          value={values.name?.en}
          onChange={handleChange}
          padding={1}
        />
        <TextInput
          label="Name (Arabic)"
          placeholder="الرياضيات"
          className="w-full"
          value={values.name?.ar}
          name="name.ar"
          onChange={handleChange}
          padding={1}
        />

        <TextInput
          label="Description (English)"
          placeholder="Description in English"
          className="w-full"
          value={values.description?.en}
          name="description.en"
          onChange={handleChange}
          padding={2}
          multiline
        />

        <TextInput
          label="Description (Arabic)"
          placeholder="Description in Arabic"
          className="w-full"
          value={values.description?.ar}
          name="description.ar"
          onChange={handleChange}
          padding={2}
          multiline
        />

        <TextInput
          label="Priority"
          placeholder="5"
          className="w-full"
          value={values.priority}
          name="priority"
          onChange={handleChange}
          padding={3}
        />

        <div className="flex">
          <DropZone
            square
            name="image.light"
            label={'Light Mode Image'}
            onChange={handleChange}
            value={values.image?.light}
            padding={3}
            pr={3}
          />
          <DropZone
            square
            name="image.dark"
            label={'Dark Mode Image'}
            onChange={handleChange}
            value={values.image?.dark}
            padding={3}
          />
        </div>
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
