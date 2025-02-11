import {
  Input,
  InputBase,
  InputBaseProps,
  InputLabel,
  InputProps,
  MenuItem,
  Select,
  SelectProps,
} from '@mui/material'
import {styled} from '@mui/system'
import React, {ChangeEvent} from 'react'

interface Option {
  label: string
  value: string
}

type Padding = 1 | 2 | 3 | 4 | 5
interface Props {
  label?: string
  placeholder?: string
  className?: any
  inputProps?: any
  onChange?: (event: any) => void
  name?: string
  padding?: Padding
  id?: string
  helperText?: string
  error?: string
  options?: Array<Option>
  hasEmpty?: boolean
  value?: any
  multiple?: boolean
}

export default function CustomSelect({
  label,
  placeholder,
  value,
  inputProps,
  className,
  onChange,
  name,
  padding,
  id,
  helperText,
  error,
  options,
  hasEmpty,
  multiple,
}: Props) {
  const BootstrapInput = styled(InputBase)(({theme}) => ({
    '& .MuiInputBase-input': {
      position: 'relative',
      border: '1px solid #000',
      borderColor: theme.palette.divider,
      fontSize: 16,
      borderRadius: 7,
      padding: '16px 26px 16px 12px',
      minWidth: 50,
      //@ts-ignore
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      '&:hover': {
        borderColor: theme.palette.primary,
        // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }))

  return (
    <div
      style={{
        paddingBottom: padding ? padding * 10 : 0,
      }}
    >
      {label && (
        <InputLabel error={!!error} shrink htmlFor={id}>
          {label}
        </InputLabel>
      )}
      <Select
        input={<BootstrapInput />}
        id={id}
        inputProps={{inputProps}}
        placeholder={placeholder}
        className={`${className} w-full`}
        aria-placeholder={placeholder}
        value={value}
        displayEmpty={!!hasEmpty}
        onChange={onChange}
        multiple={multiple}
        renderValue={(selected) => (
          <div style={{whiteSpace: 'pre-wrap'}}>
            {Array.isArray(selected)
              ? selected
                  ?.map(
                    (val) => options?.find((opt) => opt?.value === val)?.label,
                  )
                  ?.join('\n')
              : options?.find((opt) => opt?.value === selected)?.label}
          </div>
        )}
      >
        {!!hasEmpty && (
          <MenuItem value={''}>
            <em>None</em>
          </MenuItem>
        )}
        {options?.map((option) => {
          return <MenuItem value={option.value}>{option.label}</MenuItem>
        })}
      </Select>
      {(error || helperText) && (
        <div className="pt-1">
          <InputLabel error={!!error} shrink htmlFor={id}>
            {error ? error : helperText}
          </InputLabel>
        </div>
      )}
    </div>
  )
}
