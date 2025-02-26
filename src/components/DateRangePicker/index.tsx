import React from 'react'
import {Grid, TextField} from '@mui/material'
import {DesktopDatePicker} from '@mui/x-date-pickers'

interface DateRangePickerProps {
  values: {fromDate: Date; toDate: Date}
  handleChange: (name: string, value: Date) => void
}

const DateRangePicker = ({values, handleChange}: DateRangePickerProps) => {
  return (
    <Grid container spacing={2} mb={2}>
      <Grid item xs={6}>
        <DesktopDatePicker
          label="From"
          value={values.fromDate}
          onChange={(value) => handleChange('fromDate', value)}
          renderInput={(props) => <TextField fullWidth {...props} />}
        />
      </Grid>
      <Grid item xs={6}>
        <DesktopDatePicker
          label="To"
          value={values.toDate}
          onChange={(value) => handleChange('toDate', value)}
          renderInput={(props) => <TextField fullWidth {...props} />}
        />
      </Grid>
    </Grid>
  )
}

export default DateRangePicker
