import React, {useState, useCallback, useEffect, useRef} from 'react'
import {
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  CircularProgress, // Added for loading indicators
  Typography, // Added for helper/error text styling
} from '@mui/material'
import {styled, alpha, createTheme} from '@mui/system' // Added createTheme for default theme access

// --- Interfaces and Types ---

// Define the Option interface
interface Option {
  label: string
  value: string
}

// Define the Padding type
type Padding = 1 | 2 | 3 | 4 | 5

// Define the component props interface (using CustomSelectProps for clarity)
interface CustomSelectProps {
  label?: string
  placeholder?: string
  className?: string
  inputProps?: object
  // Use specific MUI event type for better type safety
  onChange?: (event: SelectChangeEvent<any>, child: React.ReactNode) => void
  name?: string // Important for distinguishing selects if multiple are used with one handler
  padding?: Padding
  id?: string
  helperText?: string
  error?: string // Should be string for error message
  options?: Array<Option>
  hasEmpty?: boolean
  value?: any // Can be string or string[] - parent component must manage type correctly
  multiple?: boolean
  fetchNextPage?: () => void
  isFetchingNextPage?: boolean
  hasNextPage?: boolean
  isLoading?: boolean // For initial loading state
}

// --- Styled Components ---

// Custom styled InputBase component using MUI's styled utility
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

// Get the default theme object to access palette colors outside styled components if needed
const defaultTheme = createTheme()

export default function CustomSelect({
  label,
  placeholder,
  value,
  inputProps,
  className,
  onChange,
  name, // Pass this down to the Select component
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
}: CustomSelectProps) {
  // Ref for the dropdown menu's paper element to control scroll
  const menuRef = useRef<HTMLUListElement | null>(null)
  // State to manage whether the dropdown is open or closed
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Memoized scroll handler for infinite loading feature
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      const target = event.target as HTMLElement
      const buffer = 100 // Pixel threshold from the bottom
      // Check if user scrolled close to the bottom
      const bottom =
        target.scrollHeight - target.scrollTop <= target.clientHeight + buffer

      // If conditions met, call fetchNextPage passed via props
      if (bottom && hasNextPage && !isFetchingNextPage && fetchNextPage) {
        fetchNextPage()
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage], // Dependencies for useCallback
  )

  // Effect to reset scroll position to top when options change *while* dropdown is open
  useEffect(() => {
    // Check if dropdown is open and the menu ref is available
    if (isDropdownOpen && menuRef.current) {
      // FIX: Delay scroll reset using setTimeout to prevent race conditions with render
      const timerId = setTimeout(() => {
        if (menuRef.current) {
          // Double-check ref exists inside timeout
          menuRef.current.scrollTop = 0
        }
      }, 0) // 0ms delay pushes execution after current stack

      // Cleanup function to clear timeout if effect re-runs or component unmounts
      return () => clearTimeout(timerId)
    }
    // This effect depends on the options array and the dropdown open state
  }, [options, isDropdownOpen])

  // Renders the display value inside the Select input based on the selected value(s)
  const renderSelectedValue = (selected: any) => {
    // Handle multiple selections
    if (multiple) {
      // Ensure 'selected' is treated as an array. Default to empty array if not.
      const selectedArray = Array.isArray(selected) ? selected : []
      // If array is empty, show placeholder if available
      if (selectedArray.length === 0) {
        return placeholder ? <em style={{opacity: 0.6}}>{placeholder}</em> : ''
      }
      // Map selected values to their labels, fallback to value if label not found
      return selectedArray
        .map((val) => options?.find((opt) => opt?.value === val)?.label ?? val)
        .filter(Boolean) // Remove any null/undefined entries
        .join(', ') // Join labels with comma and space
    }

    // Handle single selection
    const foundOption = options?.find((opt) => opt?.value === selected)
    if (foundOption) return foundOption.label // Return label if option found
    // If no value selected, show placeholder if available
    if (!selected && placeholder)
      return <em style={{opacity: 0.6}}>{placeholder}</em>
    // Fallback: show the raw selected value if no label or placeholder applies
    return selected
  }

  return (
    // Apply padding to the bottom of the component wrapper if specified
    <div style={{paddingBottom: padding ? padding * 10 : 0}}>
      {/* Render the InputLabel if provided */}
      {label && (
        <InputLabel error={!!error} shrink htmlFor={id} sx={{mb: 0.5}}>
          {label}
        </InputLabel>
      )}
      {/* The main MUI Select component */}
      <Select
        fullWidth // Make the select component take the full width of its container
        input={<BootstrapInput />} // Use the custom styled input
        id={id}
        name={name} // Pass the name prop for form handling or identification in events
        inputProps={inputProps} // Pass any additional input props
        className={className} // Pass className for external styling
        // CRITICAL FIX: Ensure value is correct type based on 'multiple' prop.
        // If multiple, ensure value is an array (default to [] if not).
        // If single, ensure value is not null/undefined (default to '').
        value={multiple ? (Array.isArray(value) ? value : []) : value ?? ''}
        displayEmpty // Allows renderValue to display placeholder when value is empty
        onChange={onChange} // Pass the onChange handler from props
        multiple={multiple} // Set multiple selection mode
        // Props passed to the Menu component (the dropdown)
        MenuProps={{
          PaperProps: {
            // Props passed to the Paper component wrapping the menu items
            onScroll: handleScroll, // Attach scroll handler
            ref: menuRef, // Attach ref to access the scrollable element
            style: {maxHeight: 250}, // Set a max height for the dropdown
          },
        }}
        renderValue={renderSelectedValue} // Use custom function to render the selected value display
        // Control the open/close state using local state
        onOpen={() => setIsDropdownOpen(true)}
        onClose={() => setIsDropdownOpen(false)}
        open={isDropdownOpen}
        error={!!error} // Apply error styling if error prop is true
      >
        {/* Render a "None" option for single selects if hasEmpty is true */}
        {!!hasEmpty && !multiple && (
          <MenuItem value={''}>
            <em>None</em>
          </MenuItem>
        )}
        {/* Show loading indicator if isLoading is true and no options are loaded yet */}
        {isLoading && !options?.length && (
          <MenuItem disabled sx={{justifyContent: 'center', py: 2}}>
            <CircularProgress size={20} />
          </MenuItem>
        )}
        {/* Map the options array to MenuItem components */}
        {options?.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
        {/* Show loading indicator at the bottom when fetching next page */}
        {isFetchingNextPage && (
          <MenuItem disabled sx={{justifyContent: 'center', py: 1}}>
            <CircularProgress size={16} />
            <em style={{marginLeft: 8}}>Loading...</em>
          </MenuItem>
        )}
        {/* Show message if no options are available and not currently loading */}
        {!isLoading && !options?.length && !hasEmpty && !isFetchingNextPage && (
          <MenuItem disabled>
            <em>No options available</em>
          </MenuItem>
        )}
      </Select>
      {/* Render helper text or error message below the select */}
      {(error || helperText) && (
        <Typography
          variant="caption"
          sx={{
            pl: '12px', // Padding left to align with input text
            pt: '4px', // Padding top for spacing
            // Use error color from theme if error exists, otherwise secondary text color
            color: error ? defaultTheme.palette.error.main : 'text.secondary',
            display: 'block', // Ensure it takes up block space
          }}
        >
          {error ? error : helperText}
        </Typography>
      )}
    </div>
  )
}
