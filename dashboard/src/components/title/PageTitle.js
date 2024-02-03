import Typography from '@mui/material/Typography'
import * as React from 'react'

export default function PageTitle(prop) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {prop.title}
    </Typography>
  )
}
