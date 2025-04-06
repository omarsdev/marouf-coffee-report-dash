import React from 'react'
import {Box, Tooltip} from '@mui/material'

const TruncatedText = ({text}: {text: string}) => {
  return (
    <Tooltip
      title={text}
      arrow
      children={
        <Box
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          children={text.length > 40 ? text.slice(0, 40) + '...' : text}
        />
      }
    />
  )
}

export default TruncatedText
