import {Autocomplete, InputLabel, TextField} from '@mui/material'
import React, {useEffect, useState} from 'react'

interface Option {
  label: string
  value: string
}

type Padding = 1 | 2 | 3 | 4 | 5
interface Props {
  label?: string
  placeholder?: string
  className?: string
  inputProps?: any
  onChange: ({target: {value}}: {target: {value: Option[]}}) => void
  name?: string
  padding?: Padding
  id?: string
  helperText?: string
  error?: string
  options?: Option[]
  hasEmpty?: boolean
  value?: Option[]
  multiple?: boolean
}

export default function CustomAutocomplete({
  label,
  placeholder,
  value = [],
  inputProps,
  className = '',
  onChange,
  name,
  padding,
  id,
  helperText,
  error,
  options = [],
  multiple,
}: Props) {
  const [selectedValues, setSelectedValues] = useState<Option[]>(value || [])

  // useEffect(() => {
  //   if (value && Array.isArray(value)) {
  //     setSelectedValues(value)
  //   } else {
  //     setSelectedValues([])
  //   }
  // }, [value])

  const handleChange = (_event: any, newValue: Option[] | null) => {
    const updatedValue = newValue ? newValue : []
    setSelectedValues(updatedValue)
    onChange({target: {value: updatedValue}})
  }

  return (
    <div style={{paddingBottom: padding ? padding * 10 : 0}}>
      {label && (
        <InputLabel error={!!error} shrink htmlFor={id}>
          {label}
        </InputLabel>
      )}
      <Autocomplete
        multiple={multiple}
        options={options}
        getOptionLabel={(option) => option.label || ''}
        value={value}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder={placeholder}
            error={!!error}
            helperText={helperText}
            inputProps={{...params.inputProps, ...inputProps}}
          />
        )}
        className={`w-full ${className}`.trim()}
      />
      {error && (
        <div className="pt-1">
          <InputLabel error={!!error} shrink htmlFor={id}>
            {error}
          </InputLabel>
        </div>
      )}
    </div>
  )
}
