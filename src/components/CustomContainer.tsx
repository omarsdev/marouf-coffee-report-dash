import {Box, useTheme} from '@mui/system'
import {ColorModeContext} from 'pages/_app'
import React from 'react'
import {Style} from 'util'

type Type = 'primary' | 'secondary'
type Padding = 1 | 2 | 3 | 4 | 5
type Radius = 'full' | 'medium' | 'small'
interface Props {
  children: any
  type?: Type
  padding?: Padding
  className?: any
  style?: any
  radius?: Radius
  noShadow?: Boolean
  margin?: Padding
}

export default function CustomContainer({
  children,
  className,
  type,
  padding,
  style,
  radius,
  noShadow,
  margin,
}: Props) {
  const theme = useTheme()
  return (
    <Box
      sx={[
        {
          bgcolor:
            type == 'primary' ? 'background.default' : 'background.paper',
          color: 'text.primary',
          p: !!padding ? padding : 0,
          m: 0,
          mb: margin ? margin : 0,
          borderRadius: radius == 'full' ? 100 : radius == 'medium' ? 2 : 0,
          boxShadow: !noShadow
            ? theme.palette.mode === 'dark'
              ? '11px 4px 39px #1e1e1e'
              : '11px 4px 39px #dee0e5'
            : 'none',
        },
        !!style ? style : {},
      ]}
      className={className}
    >
      {children}
    </Box>
  )
}
