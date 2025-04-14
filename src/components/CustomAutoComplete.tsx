import React, {useState, useCallback, useEffect, useRef} from 'react'
import {
  Autocomplete,
  TextField,
  InputLabel,
  CircularProgress,
  Typography,
  Paper,
} from '@mui/material'
import {styled, createTheme} from '@mui/system'

// --- Interfaces and Types ---

interface Option {
  label: string
  value: string
}

type Padding = 1 | 2 | 3 | 4 | 5

interface CustomAutocompleteProps {
  label?: string
  placeholder?: string
  className?: string
  inputProps?: object
  onChange: ({target: {value}}: {target: {value: any}}) => void // Adjusted to handle single/multiple
  name?: string
  padding?: Padding
  id?: string
  helperText?: string
  error?: string
  options?: Option[]
  hasEmpty?: boolean
  value?: any // Option[] for multiple, string for single
  multiple?: boolean
  fetchNextPage?: () => void
  isFetchingNextPage?: boolean
  hasNextPage?: boolean
  isLoading?: boolean
}

// --- Styled Components ---

const BootstrapInput = styled(TextField)(({theme}) => ({
  '& .MuiInputBase-root': {
    position: 'relative',
    border: '1px solid #000',
    borderColor: theme.palette.divider,
    fontSize: 16,
    borderRadius: 7,
    padding: '8px 26px 8px 12px', // Adjusted for Autocomplete
    minWidth: 50,
    //@ts-ignore
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
      borderColor: theme.palette.primary,
    },
  },
  '& .MuiInputBase-input': {
    padding: '8px 0', // Adjust input padding
  },
}))

const CustomPaper = styled(Paper)({
  minWidth: '250px',
  padding: '5px',
})

const defaultTheme = createTheme()

export default function CustomAutocomplete({
  label,
  placeholder,
  value = [], // Default to empty array for multiple, empty string for single
  inputProps,
  className = '',
  onChange,
  name,
  padding,
  id,
  helperText,
  error,
  options = [],
  hasEmpty,
  multiple,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
  isLoading,
}: CustomAutocompleteProps) {
  const menuRef = useRef<HTMLUListElement | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Memoized scroll handler for infinite loading
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      const target = event.target as HTMLElement
      const buffer = 100
      const bottom =
        target.scrollHeight - target.scrollTop <= target.clientHeight + buffer

      if (bottom && hasNextPage && !isFetchingNextPage && fetchNextPage) {
        fetchNextPage()
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  )

  // Reset scroll position when options change while dropdown is open
  useEffect(() => {
    if (isDropdownOpen && menuRef.current) {
      const timerId = setTimeout(() => {
        if (menuRef.current) {
          menuRef.current.scrollTop = 0
        }
      }, 0)
      return () => clearTimeout(timerId)
    }
  }, [options, isDropdownOpen])

  // Convert value to Autocomplete format
  const getValue = () => {
    if (multiple) {
      return Array.isArray(value)
        ? value.map(
            (val: string) =>
              options.find((opt) => opt.value === val) || {
                label: val,
                value: val,
              },
          )
        : []
    }
    return value ? options.find((opt) => opt.value === value) || null : null
  }

  const handleChange = (_event: React.SyntheticEvent, newValue: any) => {
    const updatedValue = multiple
      ? (newValue as Option[]).map((opt) => opt.value)
      : (newValue as Option)?.value || ''
    onChange({target: {value: updatedValue}})
  }

  return (
    <div style={{paddingBottom: padding ? padding * 10 : 0}}>
      {label && (
        <InputLabel error={!!error} shrink htmlFor={id} sx={{mb: 0.5}}>
          {label}
        </InputLabel>
      )}
      <Autocomplete
        multiple={multiple}
        options={
          hasEmpty && !multiple
            ? [{label: 'None', value: ''}, ...options]
            : options
        }
        getOptionLabel={(option) => option.label || ''}
        isOptionEqualToValue={(option, val) => option.value === val.value}
        value={getValue()}
        onChange={handleChange}
        open={isDropdownOpen}
        onOpen={() => setIsDropdownOpen(true)}
        onClose={() => setIsDropdownOpen(false)}
        disableClearable={!hasEmpty}
        loading={isLoading || isFetchingNextPage}
        ListboxProps={{
          onScroll: handleScroll,
          ref: menuRef,
          style: {maxHeight: 250},
        }}
        PaperComponent={CustomPaper}
        renderInput={(params) => (
          <BootstrapInput
            {...params}
            name={name}
            placeholder={placeholder}
            error={!!error}
            inputProps={{
              ...params.inputProps,
              ...inputProps,
            }}
            variant="outlined"
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.value}>
            {option.label}
          </li>
        )}
        noOptionsText={
          !isLoading && !options.length && !isFetchingNextPage ? (
            <em>No options available</em>
          ) : null
        }
        loadingText={
          <div
            style={{display: 'flex', justifyContent: 'center', padding: '8px'}}
          >
            <CircularProgress size={16} />
            <em style={{marginLeft: 8}}>Loading...</em>
          </div>
        }
        className={`w-full ${className}`.trim()}
      />
      {(error || helperText) && (
        <Typography
          variant="caption"
          sx={{
            pl: '12px',
            pt: '4px',
            color: error ? defaultTheme.palette.error.main : 'text.secondary',
            display: 'block',
          }}
        >
          {error ? error : helperText}
        </Typography>
      )}
    </div>
  )
}
