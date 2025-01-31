import {Button, TextField, useTheme} from '@mui/material'
import {useRouter} from 'next/router'
import {initializeRequest} from 'pages/_app'
import React, {useEffect, useState} from 'react'
import {
  RiMailCheckFill,
  RiMap2Fill,
  RiPhoneFill,
  RiPrinterCloudFill,
} from 'react-icons/ri'
import cookiecutter from 'cookie-cutter'
import {booksApi} from 'lib/api/books'
import {capitalize, cloneDeep, get, map} from 'lodash'
import {TimePicker} from '@mui/x-date-pickers/TimePicker'
import moment from 'moment'
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker'
import CustomContainer from 'components/CustomContainer'
import {start} from 'repl'

export default function Print({query, setLoading}) {
  const [showControls, setShowControls] = useState(true)
  //@ts-ignore

  const [printData, setPrintData] = useState([])

  const [pageNumbers, setPagesNumbers] = useState({})

  function onDocumentLoadSuccess({numPages}, i) {
    setPagesNumbers({...pageNumbers, [i]: numPages})
  }

  const [dataModel, setDataModel] = useState<any>(null)
  const [startDate, setStartDate] = React.useState(
    moment().subtract(365, 'day').format('DD-MM-YYYY'),
  )
  const [endDate, setEndDate] = React.useState(moment().format('DD-MM-YYYY'))
  const [fetchData, setFetchData] = React.useState<any>({})
  const rehydrater = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        setLoading(true)
        let company = cookiecutter.get('company')
        let token = cookiecutter.get('token')
        await initializeRequest({company, token})
        let {book} = (await booksApi.get({
          entity: query,
          // venue: query,
          // startDate: moment(startDate, 'DD-MM-YYYY').format('MM-DD-YYYY'),
          // endDate: moment(endDate, 'DD-MM-YYYY').format('MM-DD-YYYY'),
        })) as any
        let _books = cloneDeep(book).filter((b) => b.status == 4)

        let _newBooks = {}
        let total = 0
        let totalDiscount = 0
        let totalPriceWithoutDiscount = 0
        let tax = 0
        _books.map((b, i) => {
          total = total + b?.total_price
          totalDiscount = totalDiscount + (b?.service?.discount ?? 0)
          totalPriceWithoutDiscount =
            totalPriceWithoutDiscount + (b?.service?.price ?? 0)
          _newBooks = {
            ..._newBooks,
            [Math.floor(i / 15)]: [
              ...(_newBooks?.[Math.floor(i / 15)] ?? []),
              b,
            ],
          }
        })
        setFetchData({
          total,
          totalDiscount,
          totalPriceWithoutDiscount,
          tax,
          totalItems: _books.length,
        })
        setDataModel(_newBooks)
        resolve(_newBooks)
      } catch (e) {
        reject(e)
      } finally {
        setLoading(false)
      }
    })
  }
  console.log('staff', dataModel)
  const theme = useTheme()
  const [localLoading, setLocalLoading] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(null)
  const rehydrateData = async () => {
    try {
      await rehydrater()
    } catch (e) {
      console.log('ERROR', e)
    }
  }
  React.useEffect(() => {
    rehydrateData()
  }, [])

  useEffect(() => {
    if (!!startDate) {
      rehydrater()
    }
  }, [startDate])

  useEffect(() => {
    if (!!endDate) {
      rehydrater()
    }
  }, [endDate])

  return (
    <div className="flex flex-col justify-center">
      {showControls && (
        <div
          style={{
            width: '21cm',
            margin: 'auto',
          }}
          className="py-4 flex justify-end"
        >
          <CustomContainer type="primary" className=" p-4 w-full">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TextField
                id="startDate"
                label="Start Date"
                type="date"
                defaultValue={moment()
                  .subtract('365', 'day')
                  .format('YYYY-MM-DD')}
                sx={{width: 220}}
                onChange={({target: {value}}) =>
                  setStartDate(moment(value, 'YYYY-MM-DD').format('DD-MM-YYYY'))
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="startDate"
                label="End Date"
                type="date"
                defaultValue={moment().format('YYYY-MM-DD')}
                sx={{width: 220, ml: 4}}
                onChange={({target: {value}}) =>
                  setEndDate(moment(value, 'YYYY-MM-DD').format('DD-MM-YYYY'))
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Button
                sx={{
                  ml: 4,
                  height: 'full',
                }}
                style={{
                  backgroundColor: '#3DBEC9',
                  color: 'white',
                }}
                onClick={() => {
                  setShowControls(false)
                  setTimeout(() => {
                    window.print()
                  }, 250)
                  setTimeout(() => {
                    setShowControls(true)
                  }, 500)
                }}
                type="button"
              >
                <RiPrinterCloudFill />
              </Button>
            </LocalizationProvider>
          </CustomContainer>
        </div>
      )}
      <body className="markpro">
        {map(dataModel, (PAPER) => {
          return (
            <div className="page_A4 ">
              <div className="m-12">
                <div className="flex justify-between">
                  <div className="w-1/3 h-auto">
                    <img
                      src='/assets/logotext.png'
                      style={{height: 80}}
                    />
                  </div>
                  <div className="text-xs mt-4 flex flex-col items-end text-right">
                    <div className="font-medium">
                      {moment(startDate, 'DD-MM-YYYY').format('LL')} -{' '}
                      {moment(endDate, 'DD-MM-YYYY').format('LL')}
                    </div>
                    <div className="font-light uppercase text-gray-400 mt-0.5 text-xs">
                      {get(dataModel, '0.0.venue.name.en', '')} -{' '}
                      {capitalize(get(dataModel, '0.0.venue.phone_number', ''))}
                    </div>
                  </div>
                </div>
                <div className="mt-12">
                  {PAPER?.map((i) => {
                    return (
                      <div className="border-b w-full py-2 flex justify-between items-center">
                        <div>
                          <div>{i?.booking_number}</div>
                          <div className="text-xs font-light text-gray-400">
                            {moment(i.time_start).format('LL')} |{' '}
                            {moment(i.time_start).format('hh:mm A')} -{' '}
                            {moment(i.time_end).format('hh:mm A')}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="border-r mr-2 pr-2 text-right">
                            {/* <div className="text-xs">
                              {i?.service?.name?.en ?? 'No Service'}
                            </div> */}
                            <div className="text-xs font-light text-gray-400">
                              {i?.entity?.title?.en}
                            </div>
                          </div>
                          <div className="">{i.total_price + ' JOD '}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}

        {dataModel && (
          <div className="page_A4 ">
            <div className="m-12">
              <div className="flex justify-between">
                <div className="w-1/3 h-auto">
                  <img
                    src='/assets/logotext.png'
                    style={{height: 80}}
                  />
                </div>
                <div className="text-xs mt-4 flex flex-col items-end text-right">
                  <div className="font-medium">
                    {moment(startDate, 'DD-MM-YYYY').format('LL')} -{' '}
                    {moment(endDate, 'DD-MM-YYYY').format('LL')}
                  </div>
                  <div className="font-light uppercase text-gray-400 text-xs">
                    {get(dataModel, '0.0.venue.name.en', '')} -{' '}
                    {capitalize(get(dataModel, '0.0.venue.phone_number', ''))}
                  </div>
                </div>
              </div>
              <div className="uppercase font-bold mt-6 -bold">
                Payables Summary
              </div>
              <div className="border-b mt-2 w-full py-2 flex justify-between items-center">
                <div>
                  <div className="text-xs">Total Price Without Discount</div>
                </div>
                <div className="flex items-center text-xs">
                  <div className="">
                    {fetchData?.totalPriceWithoutDiscount} JOD
                  </div>
                </div>
              </div>

              <div className="border-b mt-1 w-full py-2 flex justify-between items-center">
                <div>
                  <div className="text-xs">Total Discount On Services</div>
                </div>
                <div className="flex items-center text-xs">
                  <div className="">{fetchData?.totalDiscount} JOD</div>
                </div>
              </div>

              <div className="border-b mt-1 w-full py-2 flex justify-between items-center">
                <div>
                  <div className="text-xs">Total Revenue for Services</div>
                </div>
                <div className="flex items-center text-xs">
                  <div className="">{fetchData?.total} JOD</div>
                </div>
              </div>

              {/* <div className='border-b mt-1 w-full py-2 flex justify-between items-center'>
                            <div>
                                <div className="text-xs">
                                    Total Tax
                                </div>

                            </div>
                            <div className="flex items-center">
                                <div className="">
                                    0 JOD
                                </div>
                            </div>
                        </div> */}

              <div className="border-b mt-1 w-full py-2 flex justify-between items-center">
                <div>
                  <div className="text-xs">Total Reservations</div>
                </div>
                <div className="flex items-center text-xs">
                  <div className="">{fetchData?.totalItems}</div>
                </div>
              </div>

              <div className="border-b mt-1 w-full py-2 flex justify-between items-center">
                <div>
                  <div className="text-xs">Darsi' Share</div>
                </div>
                <div className="flex items-center text-xs">
                  <div className="">0%</div>
                </div>
              </div>

              <div className="border-b mt-1 w-full py-2 flex justify-between items-center">
                <div>
                  <div className="text-xs font-">Due Amount</div>
                </div>
                <div className="flex items-center text-xs font-">
                  <div className="">
                    0 JOD
                    {/* {(fetchData?.total * 0.03).toFixed(2)} JOD */}
                  </div>
                </div>
              </div>

              <div className="border-b mt-1 w-full py-2 flex justify-between items-center">
                <div>
                  <div className="text-xs">Share Tax</div>
                </div>
                <div className="flex items-center text-xs">
                  <div className="">
                    0 JOD
                    {/* {(fetchData?.total * 0.03 * 0.16).toFixed(2)} JOD */}
                  </div>
                </div>
              </div>

              <div className="border-b mt-1 w-full py-2 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold">Total</div>
                </div>
                <div className="flex items-center text-xs font-bold">
                  <div className="">
                    0 JOD
                    {/* {(fetchData?.total * 0.03 * 1.16).toFixed(2)} JOD */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </body>
    </div>
  )
}
