import {
  InputBaseProps,
  InputLabel,
  InputProps,
  TextField,
  TextFieldProps,
} from '@mui/material'
import {styled} from '@mui/system'
import {useFormik} from 'formik'
import React, {ChangeEvent} from 'react'

type Padding = 0 | 1 | 2 | 3 | 4 | 5
interface Props {
  label?: string
  placeholder?: string
  className?: any
  inputProps?: any
  onChange?: any
  name?: string
  padding?: Padding
  value?: any
  helperText?: string
  error?: string
  type?: string
  multiline?
  secureEntry?: Boolean
  sx?: any
  disabled?
  query?
  pb?
}

const ColorTextField = styled(TextField)<TextFieldProps>(({theme}) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 7,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary,
    },
    '&.Mui-focused fieldset': {
      // borderColor: theme.palette.text.primary,
    },
  },
}))

export default function TextInput({
  disabled,
  label,
  multiline = false,
  placeholder,
  value,
  inputProps,
  className,
  onChange,
  name,
  padding,
  helperText,
  error,
  secureEntry,
  type,
  query,
  pb,
}: Props) {
  const _onChange = (
    event,
  ): ChangeEvent<HTMLInputElement | HTMLTextAreaElement> => {
    if (!!onChange) {
      return onChange(name, event.target.value)
    }
  }

  const _onQueryChange = (
    event,
  ): ChangeEvent<HTMLInputElement | HTMLTextAreaElement> => {
    if (!!onChange) {
      return onChange(event.target.value)
    }
  }

  return (
    <div
      style={{
        paddingBottom: padding ? padding * 10 : 0,
      }}
    >
      {label && (
        <InputLabel shrink error={!!error} htmlFor={'input_id=' + name}>
          {label}
        </InputLabel>
      )}
      <ColorTextField
        disabled={disabled}
        key={'INPUT_KEY=' + name}
        sx={{
          pb: pb ? pb : 0.5,
        }}
        color="primary"
        id={'input_id=' + name}
        autoComplete="new-password"
        error={!!error}
        inputProps={[
          {...(!!inputProps ? inputProps : {})},
          {
            autocomplete: 'password',
            form: {
              autocomplete: 'off',
            },
          },
        ]}
        name={name}
        multiline={multiline}
        placeholder={placeholder}
        className={`${className} w-full`}
        value={value}
        //@ts-ignore
        onChange={!query ? _onChange : _onQueryChange}
        type={secureEntry ? 'password' : type ? type : 'default'}
      />

      {(error || helperText) && (
        <div className="pt-1">
          <InputLabel error={!!error} shrink htmlFor={'input_id=' + name}>
            {error ? error : helperText}
          </InputLabel>
        </div>
      )}
    </div>
  )
}
