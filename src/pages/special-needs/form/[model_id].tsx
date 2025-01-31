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
import {specialneedsApi} from 'lib/api/specialneeds'
import {venuesApi} from 'lib/api/venues'
import useForm from 'lib/hooks/useForm'
import {useStore} from 'lib/store/store'
import {indexOf, map, set} from 'lodash'
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
    // venues,
    specialneeds: dataModel,
    rehydrateSpecialNeeds: rehydrater,
    // rehydrateVenues,
  } = useStore(
    ({venues, specialneeds, rehydrateSpecialNeeds, rehydrateVenues}) => ({
      // venues,
      // rehydrateVenues,
      specialneeds,
      rehydrateSpecialNeeds,
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
      // handleChange('venue', '64736133d682e100148c0222')
    } catch (e) {
      console.log('QueryUpdateForm Error', e)
    }
  }

  const getVenues = async () => {
    try {
      // await rehydrateVenues()
    } catch (e) {
      console.log(e)
    }
  }

  React.useEffect(() => {
    QueryUpdateForm()
    rehydrateData()
    // getVenues()
  }, [])

  const submitCreateForm = async () => {
    try {
      setLoading(true)
      await specialneedsApi.create({...values})
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
      await specialneedsApi.edit({...values}, model_id)
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
        title: !isEditting ? 'Add Special Need' : 'Edit Special Need',
      }}
    >
      <CustomLabel size="bigTitle">
        {!isEditting ? 'Add Special Need' : 'Edit Special Need'}
      </CustomLabel>
      <CustomLabel type="secondary" padding={3} size="normal">
        {!isEditting
          ? 'Create a new Special Need'
          : 'Editing Special Need ' + model_id}
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
        <div className="flex w-full">
          <DropZone
            wfull
            name="image.light"
            label={'Light Image'}
            onChange={handleChange}
            value={values.image?.light}
            padding={3}
            pr={3}
          />
          <DropZone
            wfull
            name="image.dark"
            label={'Dark Image'}
            onChange={handleChange}
            value={values.image?.dark}
            padding={3}
          />
        </div>

        <div className="flex w-full">
          <DropZone
            // wfull
            name="icon.light"
            label={'Light Icon'}
            onChange={handleChange}
            value={values.icon?.light}
            padding={3}
            pr={3}
            height={100}
            width={130}
          />
          <DropZone
            // wfull
            name="icon.dark"
            label={'Dark Icon'}
            onChange={handleChange}
            value={values.icon?.dark}
            padding={3}
            height={100}
            width={110}
          />
        </div>

        <TextInput
          label="Priority"
          placeholder="5"
          className="w-full"
          value={values.priority}
          name="priority"
          onChange={handleChange}
          padding={3}
        />

        {/* <CustomSelect
          label={'Venue'}
          options={venues?.map((v) => ({label: v?.name?.en, value: v._id}))}
          name="venue"
          value={values.venue}
          padding={3}
          onChange={({target: {value}}) => handleChange('venue', value)}
        /> */}

        <TextInput
          label="Name (EN)"
          placeholder="Name in English"
          className="w-full"
          value={values.name?.en}
          name="name.en"
          onChange={handleChange}
          padding={3}
        />

        <TextInput
          label="Name (AR)"
          placeholder="Name in Arabic"
          className="w-full"
          value={values.name?.ar}
          name="name.ar"
          onChange={handleChange}
          padding={3}
        />

        <TextInput
          label="Description (EN)"
          placeholder="Description in English"
          className="w-full"
          value={values.description?.en}
          name="description.en"
          onChange={handleChange}
          padding={3}
          multiline
        />

        <TextInput
          label="Description (AR)"
          placeholder="Description in Arabic"
          className="w-full"
          value={values.description?.ar}
          name="description.ar"
          onChange={handleChange}
          padding={3}
          multiline
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
