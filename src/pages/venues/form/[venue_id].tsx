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
import {venuesApi} from 'lib/api/venues'
import {ALWAYS_OPEN, STAFF_WORKING_DAYS_TEMPLATE} from 'lib/constants'
import {GoogleGeocodingService} from '../../../lib/googleServices'
import useForm from 'lib/hooks/useForm'
import {useStore} from 'lib/store/store'
import {cloneDeep, indexOf, map, omit, set} from 'lodash'
import router, {useRouter} from 'next/router'
import {redirectGuest} from 'pages/_app'
import {resolve} from 'path'
import React, {useEffect, useState} from 'react'
import shallow from 'zustand/shallow'
import Layout from '../../../Layout'

const hour_options = [
  {
    value: 0,
    label: 0,
  },
  {
    value: 1,
    label: 1,
  },
  {
    value: 2,
    label: 2,
  },
  {
    value: 3,
    label: 3,
  },
  {
    value: 4,
    label: 4,
  },
  {
    value: 5,
    label: 5,
  },
  {
    value: 6,
    label: 6,
  },
  {
    value: 7,
    label: 7,
  },
  {
    value: 8,
    label: 8,
  },
  {
    value: 9,
    label: 9,
  },
  {
    value: 10,
    label: 10,
  },
  {
    value: 11,
    label: 11,
  },
  {
    value: 12,
    label: 12,
  },
  {
    value: 13,
    label: 13,
  },
  {
    value: 14,
    label: 14,
  },
  {
    value: 14,
    label: 14,
  },
  {
    value: 15,
    label: 15,
  },
  {
    value: 16,
    label: 16,
  },
  {
    value: 17,
    label: 17,
  },
  {
    value: 18,
    label: 18,
  },
  {
    value: 19,
    label: 19,
  },
  {
    value: 20,
    label: 20,
  },
  {
    value: 21,
    label: 21,
  },
  {
    value: 22,
    label: 22,
  },
  {
    value: 23,
    label: 23,
  },
  {
    value: 24,
    label: 24,
  },
]

export default function VenueForm({setLoading}) {
  const [placeData, setPlaceData] = React.useState<any>({})
  const [placeDataAR, setPlaceDataAR] = React.useState<any>({})

  const {
    query: {venue_id},
  } = useRouter()
  const isEditting = venue_id.toString() !== 'new'
  const {
    mainCategories,
    rehydrateMainCategories,
    venues,
    rehydrateVenues,
  } = useStore(
    ({mainCategories, rehydrateMainCategories, venues, rehydrateVenues}) => ({
      mainCategories,
      rehydrateMainCategories,
      venues,
      rehydrateVenues,
    }),
    shallow,
  )

  const isForbiddenKey = (key) => {
    const forbiddenKeys = ['_id', 'created_at', '__v', 'status']
    return indexOf(forbiddenKeys, key) >= 0
  }

  const rehydrateMainCategoriesFallback = async () => {
    if (!!!mainCategories) {
      await rehydrateMainCategories()
    }
  }

  const QueryFetchData = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        let venue
        if (!!venues) {
          venue = venues.find((venue) => venue._id == venue_id)
          resolve(venue)
        } else {
          setLoading(true)
          let _venues = (await rehydrateVenues()) as any
          venue = _venues.find((venue) => venue._id == venue_id)
          if (!!venue) {
            resolve(venue)
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
    console.log('QueryUpdateForm', venue_id)
    if (venue_id.toString() == 'new') {
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
    rehydrateMainCategoriesFallback()
  }, [])

  const submitCreateForm = async () => {
    try {
      setLoading(true)
      await venuesApi.create({
        ...omit(values, ['isClosed']),
        open: ALWAYS_OPEN,
        direction: JSON.stringify(values.direction),
      })
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
      // console.log("VALUES", values.open?.filter(d => !values.isClosed[d.day]))
      await venuesApi.edit(
        {
          ...omit(values, ['isClosed']),
          open: values.open?.filter((d) => !values.isClosed[d.day]),
          direction: JSON.stringify(values.direction),
        },
        venue_id,
      )
      router.back()
    } catch (e) {
      console.log(e)
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

  const onOpenChange = ({target: {value}}, day) => {
    let DI = values.open?.findIndex((d) => d.day == day)
    let _clone = cloneDeep(values.open)
    _clone = set(_clone, `${DI}.open_hours.from`, value)
    handleChange('open', _clone)
  }

  const toggleWorkDay = (day) => {
    let DI = day
    if (!(values.open?.findIndex((d) => d.day == day) >= 0)) {
      let _clone = cloneDeep(values.open)
      _clone = [
        ..._clone,
        ALWAYS_OPEN[ALWAYS_OPEN.findIndex((d) => d.day == day)],
      ]
      handleChange('open', _clone)
    }
    let _clone = !!values.isClosed ? cloneDeep(values.isClosed) : {}
    _clone = set(_clone, `${DI}`, !values?.isClosed?.[DI])
    handleChange('isClosed', _clone)
  }

  const onCloseChange = ({target: {value}}, day) => {
    let DI = values.open?.findIndex((d) => d.day == day)
    let _clone = cloneDeep(values.open)
    _clone = set(_clone, `${DI}.open_hours.to`, value)
    handleChange('open', _clone)
  }

  //LOCATION AUTOFILL

  const autoFillPlace = async () => {
    try {
      setLoading(true)
      let data = (await GoogleGeocodingService.ToPlace([
        values.location.coordinates[0],
        values.location.coordinates[1],
      ])) as any
      console.warn('AUTOFILLPLACE', JSON.stringify(data))
      data.results.map((entry) => {
        if (entry.types[0] == 'street_address') {
          setPlaceData((r) => ({
            ...r,
            [entry.types[0]]: entry.address_components[1].long_name,
          }))
        } else {
          setPlaceData((r) => ({
            ...r,
            [entry.types[0]]: entry.address_components[0].long_name,
          }))
        }
      })
    } catch (e) {
      console.error('autoFillPlace', e)
    } finally {
      setLoading(false)
    }
  }
  const autoFillPlaceAR = async () => {
    try {
      setLoading(true)
      let data = (await GoogleGeocodingService.toPlaceARL([
        values.location.coordinates[0],
        values.location.coordinates[1],
      ])) as any
      console.warn('AUTOFILLPLACE', JSON.stringify(data))
      data.results.map((entry) => {
        if (entry.types[0] == 'street_address') {
          setPlaceDataAR((r) => ({
            ...r,
            [entry.types[0]]: entry.address_components[1].long_name,
          }))
        } else {
          setPlaceDataAR((r) => ({
            ...r,
            [entry.types[0]]: entry.address_components[0].long_name,
          }))
        }
      })
    } catch (e) {
      console.error('autoFillPlace', e)
    } finally {
      setLoading(false)
    }
  }

  const [lastLocationState, setLastLocationState] = useState(null)
  useEffect(() => {
    if (values.location?.coordinates[0] !== lastLocationState?.coordinates[0]) {
      setLastLocationState(values.location)
    } else {
    }
  }, [values.location])

  useEffect(() => {
    if (values?.location?.coordinates?.length > 0) {
      autoFillPlace()
      autoFillPlaceAR()
    }
  }, [lastLocationState])

  //LOCATION AUTOFILL END

  useEffect(() => {
    console.log('placeData', placeData)
    console.log('placeDataAR', placeDataAR)
    handleChange('direction.ar', placeDataAR)
    handleChange('direction.en', placeData)
  }, [placeData, placeDataAR])
  const getOpenDay = (day) => {
    return values.open?.[values.open?.findIndex((d) => d.day == day)]
  }

  return (
    <Layout
      meta={{
        title: !isEditting ? 'Add Venue' : 'Edit Venue',
      }}
    >
      <CustomLabel size="bigTitle">
        {!isEditting ? 'Add Venue' : 'Edit Venue'}
      </CustomLabel>

      <CustomLabel type="secondary" padding={3} size="normal">
        {!isEditting ? 'Create a new venue' : 'Editing Venue ' + venue_id}
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
            padding={2}
            pr={3}
          />
          <DropZone
            wfull
            name="image.ar"
            label={'Arabic Image'}
            onChange={handleChange}
            value={values.image?.ar}
            padding={2}
          />
        </div>

        <TextInput
          label="Venue Name (English)"
          placeholder="Elainor"
          className="w-full"
          name="name.en"
          value={values.name?.en}
          onChange={handleChange}
          padding={1}
        />
        <TextInput
          label="Venue Name (Arabic)"
          placeholder="Elainor"
          className="w-full"
          value={values.name?.ar}
          name="name.ar"
          onChange={handleChange}
          padding={1}
        />
        <TextInput
          label="Priority"
          placeholder="42"
          className="w-full"
          value={values.priority}
          name="priority"
          onChange={handleChange}
          padding={2}
        />
        <TextInput
          label="Phone Number"
          placeholder="42"
          className="w-full"
          value={values.phone_number}
          name="phone_number"
          onChange={handleChange}
          padding={2}
        />
        <TextInput
          label="Booking Allowed Days"
          placeholder="5"
          className="w-full"
          value={values.booking_days_after_allowed}
          name="booking_days_after_allowed"
          onChange={handleChange}
          padding={2}
        />

        <CustomSelect
          id="bootstrap"
          options={[
            {
              label: 'Male',
              value: 'm',
            },
            {
              label: 'Female',
              value: 'f',
            },
            {
              label: 'Both Genders',
              value: 'n',
            },
          ]}
          inputProps={{
            default: 'n',
          }}
          // hasEmpty
          // variant='outlined'
          value={values.gender}
          label="Targeted Gender"
          className="w-full"
          onChange={({target: {name, value}}) => handleChange('gender', value)}
          padding={2}
          // helperText="This is helper text"
          // error={'Please enter this correctly!'}
        />

        <MultiLineOptionSelector
          padding={3}
          Label="Associated Categories"
          onChange={handleChange}
          name={'categories'}
          value={values.categories}
          options={mainCategories}
        />

        <MapFormPicker
          initial={values.location}
          name="location"
          onChange={handleChange}
        />
        <Divider sx={{mb: 3}} />
        <div className="flex">
          {ALWAYS_OPEN?.map((day) => {
            return (
              <div className="shadow p-2 mr-2">
                <div
                  onMouseDown={() => {
                    toggleWorkDay(day.day)
                  }}
                  className="flex"
                >
                  <div
                    style={{
                      backgroundColor: !!getOpenDay(day.day)?.open_hours?.from
                        ? values.isClosed?.[day.day]
                          ? 'red'
                          : 'green'
                        : 'red',
                    }}
                    className="h-4 w-4 rounded-full mr-2"
                  ></div>
                  <CustomLabel size="caption">
                    {!!getOpenDay(day.day)?.open_hours?.from
                      ? values.isClosed?.[day.day]
                        ? 'Closed'
                        : 'Open'
                      : 'Closed'}
                  </CustomLabel>
                </div>
                <div className="mt-2 flex flex-row items-center">
                  <div className="font-semibold">{day?.day}</div>
                </div>
                <div className="flex items-center py-3">
                  <CustomSelect
                    //@ts-ignore
                    options={hour_options}
                    value={getOpenDay(day.day)?.open_hours?.from ?? 0}
                    onChange={(v) => onOpenChange(v, day.day)}
                  />
                  <div className="ml-4">
                    <CustomSelect
                      //@ts-ignore
                      options={hour_options}
                      value={getOpenDay(day.day)?.open_hours?.to ?? 24}
                      onChange={(v) => onCloseChange(v, day.day)}
                    />
                  </div>
                </div>
              </div>
            )
          })}
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
