import React from 'react'
import {Box, Card, CardMedia} from '@mui/material'

interface CustomImageProps {
  src: string
  alt?: string
  height?: number
  width?: number
}

const CustomImage: React.FC<CustomImageProps> = ({
  src,
  alt,
  height = 400,
  width = 400,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: 3,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 6,
        },
      }}
    >
      <img src={src} alt={alt} style={{width, height, borderRadius: '8px'}} />
    </Box>
  )
}

export default CustomImage
