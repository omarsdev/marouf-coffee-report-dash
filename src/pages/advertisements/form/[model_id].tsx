import {Box, Divider} from '@mui/material'
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
import {advertisesApi} from 'lib/api/advertises'
import {branchesApi} from 'lib/api/branches'
import {categoriesApi} from 'lib/api/categories'
import {venuesApi} from 'lib/api/venues'
import useForm from 'lib/hooks/useForm'
import {useStore} from 'lib/store/store'
import {indexOf, map} from 'lodash'
import router, {useRouter} from 'next/router'
import {redirectGuest} from 'pages/_app'
import {resolve} from 'path'
import React, {useEffect, useRef, useState} from 'react'
import shallow from 'zustand/shallow'
import Layout from '../../../Layout'
import _ from 'lodash'
import {GooglePlacesService} from 'lib/googleServices'
import Error from 'components/Error'
import {booksApi} from 'lib/api/books'
export default function VenueForm({setLoading}) {
  const [backendError, setBackendError] = React.useState<string>('')
  const [location, setLocation] = React.useState<any>(null)
  const {
    query: {model_id},
  } = useRouter()
  const isEditting = model_id.toString() !== 'new'
  const {
    // venues,
    advertises: dataModel,
    rehydrateAdvertisements: rehydrater,
    // rehydrateVenues,
  } = useStore(
    ({advertises, rehydrateAdvertisements}) => ({
      // venues,
      // rehydrateVenues,
      advertises,
      rehydrateAdvertisements,
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

  const [query, setQuery] = useState('')
  const [showing, setShowing] = useState(false)
  const [results, setResults] = useState([])

  const theResult = [`sdkjlskd`, `sdkjlskd`, `sdkjlskd`, `sdkjlskd`, `sdkjlskd`]

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

  // useEffect(() => {
  //   if ('geolocation' in navigator) {
  //     // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
  //     navigator.geolocation.getCurrentPosition(({coords}) => {
  //       const {latitude, longitude} = coords
  //       setLocation({latitude, longitude})
  //     })
  //   }
  // }, [])

  const autocomplete = useRef(
    _.throttle(
      async ({query}) => {
        if (query == '') {
          return
        }
        try {
          let location = null
          // if (props.mapRegion) {
          // let theLocation = [location.latitude, location.longitude]
          // }
          // setLoading(true)
          let {predictions} = (await booksApi.autocomplete(query)) as any
          // let results = await GooglePlacesService.autoComplete(query, location)
          predictions.map((item) => {
            console.log('item', item)
          })
          setResults(predictions)
        } catch (e) {
          console.log(e)
        } finally {
          // setLoading(false)
        }
      },
      1000,
      {trailing: true, leading: false},
    ),
  )

  useEffect(() => {
    autocomplete.current({query})
    if (query.length > 0) {
      setShowing(true)
    } else {
      setShowing(false)
    }
  }, [query])

  const onPlaceSelection = async (item) => {
    try {
      let place = await GooglePlacesService.getPlace(item.place_id)
      setTimeout(() => {
        handleChange('location', {
          lat: place?.geometry?.location?.lat,
          lng: place?.geometry?.location?.lng,
        })
        setQuery('')
        // onSearchSelection({
        //   latitude: place?.geometry?.location?.lat,
        //   longitude: place?.geometry?.location?.lng,
        // })
      }, 200)
    } catch (e) {
      console.error(e, 'are you here')
    } finally {
    }
  }

  const submitCreateForm = async () => {
    try {
      setLoading(true)
      console.log('values', values)
      let hello = await advertisesApi.create({
        ...values,
        phone_number: values.phone_number.toString(),
        location: {lat: values.location.lat, lng: values.location.lng},
      })
      console.log('hello', hello)
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
      await advertisesApi.edit({...values}, model_id)
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
        title: !isEditting ? 'Add Advertisement' : 'Edit Advertisement',
      }}
    >
      <CustomLabel size="bigTitle">
        {!isEditting ? 'Add Advertisement' : 'Edit Advertisement'}
      </CustomLabel>
      <CustomLabel type="secondary" padding={3} size="normal">
        {!isEditting
          ? 'Create a new Advertisement'
          : 'Editing Advertisement ' + model_id}
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
            name="image.en"
            label={'English Image'}
            onChange={handleChange}
            value={values.image?.en}
            padding={3}
            pr={3}
          />
          <DropZone
            wfull
            name="image.ar"
            label={'Arabic Image'}
            onChange={handleChange}
            value={values.image?.ar}
            padding={3}
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
          label="Link"
          placeholder="https://rnfirebase.io/"
          className="w-full"
          value={values.link}
          name="link"
          onChange={handleChange}
          padding={3}
        />

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
          multiline
          label="Description (EN)"
          placeholder="Description in English"
          className="w-full"
          value={values.description?.en}
          name="description.en"
          onChange={handleChange}
          padding={3}
        />

        <TextInput
          label="Description (AR)"
          multiline
          placeholder="Description in Arabic"
          className="w-full"
          value={values.description?.ar}
          name="description.ar"
          onChange={handleChange}
          padding={3}
        />

        <TextInput
          label="Phone Number"
          placeholder="+962791234567"
          className="w-full"
          value={values.phone_number}
          name="phone_number"
          onChange={handleChange}
          padding={3}
        />

        <TextInput
          label="Search Location"
          placeholder="Abdali Mall"
          className="w-full"
          value={query}
          // name="search"
          onChange={setQuery}
          padding={0}
          pb={0.0000000001}
          query
        />

        {showing && (
          <Box
            className="example"
            sx={{
              width: `66%`,
              zIndex: 100,
              maxHeight: 195,
              overflowY: 'scroll',
              position: 'absolute',
              borderRadius: '10px 10px 10px 10px',
              borderWidth: 1,
              backgroundColor: 'background.default',
              '&:hover': {
                // backgroundColor: 'primary.main',
                // opacity: [0.9, 0.8, 0.7],
              },
            }}
          >
            {results?.map((item, index) => (
              <div
                key={index}
                onClick={() => onPlaceSelection(item)}
                className="flex items-center justify-between w-full p-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
              >
                <p>{item?.structured_formatting?.main_text}</p>
              </div>
            ))}
          </Box>
        )}

        {/* <div className="absolute w-2/3 z-20 bg-gray-200">
          {theResult?.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between w-full p-3 border-b border-gray-200"
            >
              <p>{item}</p>
            </div>
          ))}
        </div> */}

        <MapFormPicker
          location={values.location}
          initial={values.location}
          name="location"
          onChange={handleChange}
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
