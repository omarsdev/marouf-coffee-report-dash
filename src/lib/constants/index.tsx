export const GLOBAL_THEME = {
  radius: {
    regular: 8,
    full: 100,
  },
  letter: 4,
}

export const ALWAYS_OPEN = [
  {open_hours: {from: '0', to: '24'}, day: 'Sunday', is_open: 'true'},
  {open_hours: {from: '0', to: '24'}, day: 'Monday', is_open: 'true'},
  {open_hours: {from: '0', to: '24'}, day: 'Tuesday', is_open: 'true'},
  {open_hours: {from: '0', to: '24'}, day: 'Wednesday', is_open: 'true'},
  {open_hours: {from: '0', to: '24'}, day: 'Thursday', is_open: 'true'},
  {open_hours: {from: '0', to: '24'}, day: 'Friday', is_open: 'true'},
  {open_hours: {from: '0', to: '24'}, day: 'Saturday', is_open: 'true'},
]

export const STAFF_WORKING_DAYS_TEMPLATE = [
  {
    day: 'Sunday',
    is_open: true,
    allowed_booking_time_end: 24,
    allowed_booking_time_start: 0,
  },
  {
    day: 'Monday',
    is_open: true,
    allowed_booking_time_end: 24,
    allowed_booking_time_start: 0,
  },
  {
    day: 'Tuesday',
    is_open: true,
    allowed_booking_time_end: 21,
    allowed_booking_time_start: 0,
  },
  {
    day: 'Wednesday',
    is_open: true,
    allowed_booking_time_end: 24,
    allowed_booking_time_start: 0,
  },
  {
    day: 'Thursday',
    is_open: true,
    allowed_booking_time_end: 24,
    allowed_booking_time_start: 0,
  },
  {
    day: 'Friday',
    is_open: true,
    allowed_booking_time_end: 24,
    allowed_booking_time_start: 0,
  },
  {
    day: 'Saturday',
    is_open: true,
    allowed_booking_time_end: 24,
    allowed_booking_time_start: 0,
  },
]

export const BOOK_STATUSES = [
  'Pending',
  'Confirmed',
  'Checked In',
  'In Progress',
  'Completed',
  'Cancelled',
  'Blocked',
]
