import {Button, ButtonProps} from '@mui/material'
import {styled} from '@mui/system'
import React from 'react'

interface Props {
  onClick?: (event: any) => void
  title: String
  mainButton?: Boolean
  startIcon?: any
  padding?: number
  width?: string
  fullWidth?: Boolean
  disabled?: boolean
}

export default function CustomButton(props: Props) {
  const ColorButton = styled(Button)<ButtonProps>(({theme}) => ({
    color: theme.palette.text.primary,
    borderRadius: 7,
    height: 50,
    textTransform: 'capitalize',
    borderColor: theme.palette.divider,
    backgroundColor: props.mainButton
      ? theme.palette.mode == 'dark'
        ? 'transparent'
        : theme.palette.background.default
      : 'transparent',
    '&:hover': {
      borderColor: theme.palette.text.primary,
      color: theme.palette.text.primary,
    },
  }))

  return (
    <ColorButton
      startIcon={props.startIcon}
      onClick={props.onClick}
      sx={{
        ml: props.padding,
        width: props.width,
      }}
      //@ts-ignore
      fullWidth={!!props.fullWidth}
      className="font-bold "
      disabled={!!props?.disabled}
      // size='large'
      variant="outlined"
    >
      {props.title}
    </ColorButton>
  )
}
