import {Avatar, CircularProgress, MenuItem} from '@mui/material'
import {Box} from '@mui/system'
import {GridAddIcon} from '@mui/x-data-grid'
import BookingIdDialog from 'components/BookingIdDialog'
import CustomButton from 'components/CustomButton'
import CustomContainer from 'components/CustomContainer'
import CustomLabel from 'components/CustomLabel'
import PanelSegmentation from 'components/PanelSegmentation'
import TextInput from 'components/TextInput'
import {booksApi} from 'lib/api/books'
import {BOOK_STATUSES} from 'lib/constants'
import {useStore} from 'lib/store/store'
import {MOMENT_JORDAN} from 'lib/timezone'
import {capitalize, get, truncate} from 'lodash'
import moment from 'moment'
import router, {useRouter} from 'next/router'
import {BOOK_STATUSES_COLORS} from 'pages/bookings/ModelList'
import React from 'react'
import {RiServiceLine} from 'react-icons/ri'
import Layout from '../../Layout'
import {redirectGuest} from '../_app'

export const BOOK_STATUSES_ACTIONS = [
  'Set Pending',
  'Set Confirmed',
  'Set Checked In',
  'Set In Progress',
  'Set Completed',
  'Cancel Booking',
  'Set Hold',
] as Array<string>

export default function Staff(props) {
  const {
    query: {venue: query},
  } = useRouter()
  const {user} = useStore()

  const [isOpen, setOpen] = React.useState(false)
  const [booking, setBooking] = React.useState(null)

  const [localLoading, setLocalLoading] = React.useState(false)

  console.log('user', booking)

  React.useEffect(() => {
    console.log('user', booking)
  }, [])

  return (
    <>
      <BookingIdDialog
        isOpen={isOpen}
        confirmCallBack={(v) => {
          setBooking(v)
        }}
        handleClose={() => {
          setOpen(false)
        }}
      />

      <Layout
        meta={{
          title: 'Bookings',
        }}
      >
        {localLoading && (
          <div className="absolute inset-0 flex flex-50 justify-center items-center">
            <CircularProgress />
          </div>
        )}
        <div className="flex justify-between">
          <div>
            <CustomLabel size="bigTitle">Booking Finder</CustomLabel>
            <CustomLabel type="secondary" padding={3} size="normal">
              Find booking by it's number and adjust it
            </CustomLabel>
          </div>
          <div>
            <CustomButton
              onClick={() => {
                setOpen(true)
              }}
              startIcon={<GridAddIcon />}
              width="10rem"
              title="Find Booking"
            />
          </div>
        </div>

        <CustomContainer
          style={{
            overflow: 'hidden',
          }}
          className="overflow-hidden mb-14"
          radius="medium"
          type="secondary"
          padding={3}
        >
          {booking?.user?._id && (
            <div>
              <div className="font-bold text-lg mt-0">Booking</div>
              <div className="mt-2 shadow">
                <MenuItem
                  sx={{
                    justifyContent: 'space-between',
                  }}
                >
                  <div className="">
                    <div className="tracking-widest">
                      {booking?.booking_number}
                    </div>
                    <div className="text-xs text-gray-400 ">
                      {MOMENT_JORDAN(booking?.time_start).format('LL')} |{' '}
                      {MOMENT_JORDAN(booking?.time_start).format('hh:mm A')} -{' '}
                      {MOMENT_JORDAN(booking?.time_end).format('hh:mm A')}
                    </div>
                  </div>
                  <div>
                    <div
                      className="px-2 py-1 rounded-md"
                      style={{
                        backgroundColor: BOOK_STATUSES_COLORS[booking?.status],
                      }}
                    >
                      <p className="text-white">
                        {BOOK_STATUSES[booking?.status]}
                      </p>
                    </div>
                  </div>
                </MenuItem>
              </div>
              <div className="flex justify-between">
                <div className="w-1/2 h-full pr-4">
                  <div className="font-bold text-lg mt-4 ">User</div>
                  <div className="mt-2 shadow">
                    <MenuItem>
                      <Avatar
                        sx={{width: 32, height: 32, color: 'text.primary'}}
                      >
                        {get(booking, 'user.name.0', '')}
                      </Avatar>{' '}
                      <div className="ml-3">
                        {truncate(booking?.user?.name, {
                          length: 500,
                          omission: '..',
                        })}

                        <div className="text-xs text-gray-400">
                          {booking?.user?.email}
                        </div>
                      </div>
                    </MenuItem>
                  </div>

                  <div className="font-bold text-lg mt-4">Teacher</div>
                  <div className="mt-2 shadow">
                    <MenuItem>
                      <Avatar
                        sx={{width: 32, height: 32, color: 'text.primary'}}
                      >
                        <img src={booking?.entity?.image} />
                      </Avatar>{' '}
                      <div className="ml-3">
                        {truncate(booking?.entity?.title?.en, {
                          length: 500,
                          omission: '..',
                        })}

                        <div className="text-xs text-gray-400 ">
                          {booking?.entity?.description?.en}
                        </div>
                      </div>
                    </MenuItem>
                  </div>

                  <div className="font-bold text-lg mt-4">Service</div>
                  <div className="mt-2 shadow">
                    <MenuItem>
                      <Avatar
                        sx={{width: 32, height: 32, color: 'text.primary'}}
                      >
                        <RiServiceLine />
                      </Avatar>{' '}
                      <div className="ml-3">
                        {truncate(booking?.service?.name?.en, {
                          length: 500,
                          omission: '..',
                        })}

                        <div className="text-xs text-gray-400 ">
                          {booking?.service?.description?.en}
                        </div>
                      </div>
                    </MenuItem>
                  </div>

                  {/* <div className="font-bold text-lg mt-4">Venue</div>
                  <div className="mt-2 shadow">
                    <MenuItem>
                      <Box sx={{width: 44, height: 32, color: 'text.primary'}}>
                        <img
                          className="h-full w-full"
                          style={{objectFit: 'cover'}}
                          src={booking?.venue?.image?.en}
                        />
                      </Box>{' '}
                      <div className="ml-3">
                        {capitalize(
                          truncate(booking?.venue?.name?.en, {
                            length: 500,
                            omission: '..',
                          }),
                        )}

                        <div className="text-xs text-gray-400 ">
                          {booking?.venue?.phone_number}
                        </div>
                      </div>
                    </MenuItem>
                  </div> */}
                </div>
                <div className="w-1/2 h-full">
                  <div className="font-bold text-lg mt-4">Price Break-Down</div>
                  <div className="flex items-center mt-1 w-full justify-between">
                    <div className="text-xs font-semibold">Full Price</div>
                    <div className="text-xs text-gray-400 ">
                      {booking?.service?.price} JOD
                    </div>
                  </div>
                  <div className="flex items-center mt-1 w-full justify-between">
                    <div className="text-xs font-semibold">Discount</div>
                    <div className="text-xs text-gray-400 ">
                      {booking?.service?.discount} JOD
                    </div>
                  </div>

                  <div className="flex items-center mt-1 w-full justify-between pb-1 border-b">
                    <div className="text-xs font-semibold">Tax</div>
                    <div className="text-xs text-gray-400 ">{0} JOD</div>
                  </div>
                  <div className="flex items-center mt-1 w-full justify-between">
                    <div className="text-xs font-semibold">Total Price</div>
                    <div className="text-xs text-gray-400 ">
                      {booking?.total_price} JOD
                    </div>
                  </div>

                  <div className="font-bold text-lg mt-4">Actions</div>
                  <div className="mt-1">
                    {BOOK_STATUSES_ACTIONS.map((action, i) => {
                      if (i == 3 || i == 6 || i == 1) {
                        return
                      }
                      return (
                        <div
                          onClick={async () => {
                            try {
                              setLocalLoading(true)
                              await booksApi.edit(
                                {
                                  status: i,
                                },
                                booking?._id,
                              )
                              const {book} = (await booksApi.findByNumber({
                                number: booking?.booking_number,
                              })) as any
                              console.log('BOOK', book)
                              setBooking(book)
                            } catch (e) {
                              console.log(e)
                            } finally {
                              setLocalLoading(false)
                            }
                          }}
                          className="px-2 flex cursor-pointer items-center border border-gray-300 py-1 mb-2 rounded-md"
                        >
                          <div
                            style={{
                              backgroundColor: BOOK_STATUSES_COLORS[i],
                            }}
                            className="h-3 w-3 mr-3 rounded-full"
                          ></div>
                          <div> {action}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* <CustomButton
                        onClick={() => {
                            // setConfirmOpen(true)
                        }}
                        fullWidth
                        mainButton
                        title={'Send Notification'}
                    /> */}
        </CustomContainer>
      </Layout>
    </>
  )
}

export async function getServerSideProps(ctx) {
  return await redirectGuest(ctx)
}
