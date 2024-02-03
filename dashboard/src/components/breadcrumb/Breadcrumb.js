import * as React from 'react'
import { Stack, Breadcrumbs, Link } from '@mui/material'
import { Link as ReactRouterLink } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'

export default function Breadcrumb() {
  return (
    <Stack spacing={2} sx={{ mt: 2, ml: 1 }}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link
          underline="hover"
          component={ReactRouterLink}
          key="1"
          color="inherit"
          to="/"
        >
          <HomeIcon />
        </Link>
      </Breadcrumbs>
    </Stack>
  )
}
