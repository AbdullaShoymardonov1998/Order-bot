import { Alert, AlertTitle } from '@mui/material'
import * as React from 'react'

export default function HttpErrorNotification(prop) {
  return (
    <Alert severity="error" sx={{ mt: 2 }}>
      <AlertTitle>Xatolik</AlertTitle>
      {prop.message}
      {`, ${new Date().toLocaleString()}`}
    </Alert>
  )
}
