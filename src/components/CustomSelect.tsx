import React, {useCallback, useEffect, useRef} from 'react'
import {
  Input,
  InputBase,
  InputBaseProps,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import {maxHeight, maxWidth, styled} from '@mui/system'

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
  fetchNextPage?: () => void
  isFetchingNextPage?: boolean
  hasNextPage?: boolean
  isLoading?: boolean
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
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
  isLoading,
}: Props) {
  const menuRef = useRef<HTMLUListElement | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      const target = event.target as HTMLElement
      const buffer = 100
      const bottom =
        target.scrollHeight - target.scrollTop <= target.clientHeight + buffer
      if (bottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage && fetchNextPage()
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  )

  useEffect(() => {
    // Reset scroll position when new options are loaded
    if (menuRef.current) {
      menuRef.current.scrollTop = 0
    }
  }, [options])

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
      '&:hover': {
        borderColor: theme.palette.primary,
      },
    },
  }))

  return (
    <div style={{paddingBottom: padding ? padding * 10 : 0}}>
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
        MenuProps={{
          PaperProps: {
            onScroll: handleScroll,
            ref: menuRef,
          },
        }}
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
        onOpen={() => setIsDropdownOpen(true)}
        onClose={() => setIsDropdownOpen(false)}
        open={isDropdownOpen}
      >
        {!!hasEmpty && (
          <MenuItem value={''}>
            <em>None</em>
          </MenuItem>
        )}
        {options?.map((option) => {
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          )
        })}
        {isFetchingNextPage && (
          <MenuItem disabled>
            <em>Loading...</em>
          </MenuItem>
        )}
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
