// import {Box} from '@mui/system'
import Box from '@mui/material/Box'
import React from 'react'

type Type = 'primary' | 'secondary'
type Padding = 1 | 2 | 3 | 4 | 5
type Size = 'normal' | 'bigTitle' | 'caption'
interface Props {
  children: any
  type?: Type
  padding?: Padding
  size?: Size
  className?: string
}

export default function CustomLabel({
  children,
  type,
  padding,
  size,
  className,
}: Props) {
  const sizeMapper = {
    normal: '14px',
    bigTitle: '24px',
    caption: '12px',
  }

  return (
    <Box
      sx={{
        color: type !== 'secondary' ? 'text.primary' : 'text.secondary',
        pb: padding,
        //@ts-ignore
        fontSize: sizeMapper[size],
        letterSpacing: 0.4,
      }}
      className={
        size == 'bigTitle' ? 'font-semibold' : 'font-regular ' + className
      }
    >
      {children}
    </Box>
  )
}
