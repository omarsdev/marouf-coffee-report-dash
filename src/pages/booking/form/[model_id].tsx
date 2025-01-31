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
import {staffApi} from 'lib/api/staff'
import {venuesApi} from 'lib/api/venues'
import useForm from 'lib/hooks/useForm'
import {useStore} from 'lib/store/store'
import {indexOf, map, omit, split} from 'lodash'
import router, {useRouter} from 'next/router'
import {initializeRequest, redirectGuest} from 'pages/_app'
import {resolve} from 'path'
import React, {useState} from 'react'
import shallow from 'zustand/shallow'
import Layout from '../../../Layout'
import cookiecutter from 'cookie-cutter'
import {userApi} from 'lib/api/userApi'
import {STAFF_WORKING_DAYS_TEMPLATE} from 'lib/constants'

export default function Form({setLoading}) {
  const {
    query: {model_id: venue_model},
  } = useRouter() as any

  const model_id = venue_model.split('___')[1]
  const venue_id = venue_model.split('___')[0]

  const isEditting = model_id.toString() !== 'new'
  // const { mainCategories: dataModel, rehydrateMainCategories: rehydrater, } = useStore(({ mainCategories, rehydrateMainCategories }) => ({ mainCategories, rehydrateMainCategories }), shallow)

  const [dataModel, setDataModel] = useState<any>(null)

  const rehydrater = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        setLoading(true)
        let company = cookiecutter.get('company')
        let token = cookiecutter.get('token')
        await initializeRequest({company, token})
        let {staff} = (await staffApi.get(venue_id)) as any
        setDataModel(staff)
        resolve(staff)
      } catch (e) {
        reject(e)
      } finally {
        setLoading(false)
      }
    })
  }

  const isForbiddenKey = (key) => {
    const forbiddenKeys = [
      '_id',
      'created_at',
      '__v',
      'status',
      'working_hours',
      'venues',
      'services',
      'user.password',
    ]
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
      let m = (await QueryFetchData()) as any
      map(m, (item, key) => {
        // console.log("QueryUpdateForm", item, key)
        if (!isForbiddenKey(key)) {
          handleChange(key, item)
        }
      })
      handleChange('user.password', undefined)
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
      const body = {
        ...values.user,
        title: {
          en: values.title?.en,
          ar: values.title?.ar,
        },
        description: {
          en: values.description?.en,
          ar: values.description?.ar,
        },
        priority: values.priority,
        price_added: values.price_added,
        work_days: STAFF_WORKING_DAYS_TEMPLATE,
        calender_color: '#000',
        booking_days_limit: 60,
        image: values.image,
        venue: venue_id,
      }
      await staffApi.addAndLink(body)
      router.back()
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  const submitUpdateForm = async () => {
    try {
      setLoading(true)
      // await categoriesApi.edit({ ...values }, model_id)

      // const user_body = {
      //     email: values.user?.email,
      //     phone: values.user?.phone,
      // }

      const staff_body = {
        title: {
          en: values.title?.en,
          ar: values.title?.ar,
        },
        description: {
          en: values.description?.en,
          ar: values.description?.ar,
        },
        priority: values.priority,
        price_added: values.price_added,
        image: values.image,
      }

      // await userApi.update(user_body, values.user?._id)
      await staffApi.edit(staff_body, model_id)
      router.back()
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  const {values, errors, handleChange, handleSubmit, clearErrors} = useForm({
    initial: {
      user: {type: 1},
    },
    // validationSchema:
    onSubmit: !isEditting ? submitCreateForm : submitUpdateForm,
  })

  React.useEffect(() => {
    console.log('FORM', values)
  }, [values])

  return (
    <Layout
      meta={{
        title: !isEditting ? 'Add Teacher' : 'Edit Teacher',
      }}
    >
      <CustomLabel size="bigTitle">
        {!isEditting ? 'Add Teacher' : 'Edit Teacher'}
      </CustomLabel>

      <CustomLabel type="secondary" padding={3} size="normal">
        {!isEditting ? 'Create new Teacher' : 'Editing Teacher ' + model_id}
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
        <CustomLabel type="secondary" padding={3} size="bigTitle">
          Teacher User Information
        </CustomLabel>

        {/* <TextInput
                    label='Name'
                    placeholder='Ahmad Ali'
                    className="w-full"
                    name='user.name'
                    value={values.user?.name}
                    onChange={handleChange}
                    padding={1}
                /> */}

        <TextInput
          label="Email Address"
          placeholder="zaina@vuedal.com"
          className="w-full"
          name="user.email"
          value={values.user?.email}
          onChange={handleChange}
          padding={1}
          disabled={isEditting}
        />

        <TextInput
          label="Phone Number"
          placeholder="+962789788778"
          className="w-full"
          name="user.phone"
          value={values.user?.phone}
          onChange={handleChange}
          padding={1}
          disabled={isEditting}
        />

        <TextInput
          label="Password"
          placeholder="*********"
          className="w-full"
          secureEntry={true}
          name="user.password"
          value={values.user?.password}
          onChange={handleChange}
          padding={1}
          disabled={isEditting}
        />

        {!isEditting && (
          <CustomSelect
            id="bootstrap"
            options={[
              {
                label: 'Super/Owner',
                value: '1',
              },
              {
                label: 'Employee',
                value: '2',
              },
            ]}
            inputProps={{
              default: '1',
            }}
            // hasEmpty
            // variant='outlined'
            value={values.user?.type}
            label="User Type"
            helperText="Choose Super/Owner if they are the first staff"
            className="w-full"
            onChange={({target: {name, value}}) =>
              handleChange('user.type', value)
            }
            padding={1}
            // helperText="This is helper text"
            // error={'Please enter this correctly!'}
          />
        )}

        <Divider sx={{mb: 3}} />

        <CustomLabel type="secondary" padding={3} size="bigTitle">
          Teacher Personal Information
        </CustomLabel>

        <TextInput
          label="Name (English)"
          placeholder="Zaina Azam"
          className="w-full"
          value={values.title?.en}
          name="title.en"
          onChange={handleChange}
          padding={1}
        />
        <TextInput
          label="Name (Arabic)"
          placeholder="Zaina Azam"
          className="w-full"
          value={values.title?.ar}
          name="title.ar"
          onChange={handleChange}
          padding={1}
        />

        <TextInput
          label="Position (English)"
          placeholder="Math Teacher"
          className="w-full"
          value={values.description?.en}
          name="description.en"
          onChange={handleChange}
          padding={2}
        />

        <TextInput
          label="Position (Arabic)"
          placeholder="Math Teacher"
          className="w-full"
          value={values.description?.ar}
          name="description.ar"
          onChange={handleChange}
          padding={2}
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

        <TextInput
          label="Price Added"
          placeholder="5"
          className="w-full"
          value={values.price_added}
          name="price_added"
          onChange={handleChange}
          padding={3}
        />

        <div className="flex">
          <DropZone
            square
            name="image"
            label={'Picture'}
            onChange={handleChange}
            value={values.image}
            padding={3}
            pr={3}
            circle
          />
        </div>

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
