import * as React from 'react'
import {
  Paper,
  Grid,
  Button,
  ButtonGroup,
  Breadcrumbs,
  Link,
} from '@mui/material'
import PageTitle from '../../components/title/PageTitle'
import { useState, useEffect } from 'react'
import AxiosClient from '../../utils/axios'
import {
  useParams,
  useNavigate,
  useLocation,
  Link as ReactRouterLink,
} from 'react-router-dom'
import LoadingBar from '../../components/loading/LoadingBar'
import ErrorMessage from '../../utils/errorMessage'
import HttpErrorNotification from '../../components/notifications/HttpErrorNotification'
import HomeIcon from '@mui/icons-material/Home'

export default function DeleteCategory() {
  const nav = useNavigate()
  const params = useParams()
  const [sendRequest, setSendRequest] = useState(false)
  const [alert, setAlert] = useState({ state: false, message: '' })
  const search = useLocation().search
  const parent = new URLSearchParams(search).get('parent')
  const [title, setTitle] = useState('')
  const path = parent ? `/category/${parent}` : '/category'
  const cancelHandler = () => nav(path)

  const confirmHandler = async () => {
    try {
      await AxiosClient.delete(`/category/${params.categoryId}`)
      nav(path)
    } catch (error) {
      const message = ErrorMessage(error)
      setAlert({
        state: true,
        message,
      })
    }
  }

  const fetch = async () => {
    const result = await AxiosClient.get(`/category/${params.categoryId}`)
    return result.data.data.data
  }

  useEffect(() => {
    setSendRequest(true)
    fetch()
      .then(
        (data) => {
          setTitle(`${data.title.UZ} - ${data.title.RU}`)
        },
        (error) => {
          const message = ErrorMessage(error)
          setAlert({
            state: true,
            message,
          })
        },
      )
      .then(() => setSendRequest(false))
  }, [])

  return (
    <Paper sx={{ p: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <PageTitle title="Kategoriyani o'chirish" />
        </Grid>
        <Grid item xs={12}>
          "{title}" ni o'chirishni tasdiqlaysizmi?
        </Grid>

        <Grid item xs={12}>
          <ButtonGroup
            variant="contained"
            color="primary"
            aria-label="contained primary button group"
            sx={{ m: 0.5 }}
          >
            <Button onClick={confirmHandler}>O'chirish</Button>
            <Button onClick={cancelHandler}>Bekor qilish</Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={12}>
          {alert.state ? (
            <HttpErrorNotification message={alert.message} />
          ) : (
            <></>
          )}
        </Grid>

        {sendRequest ? <LoadingBar /> : <></>}
      </Grid>

      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link
          underline="hover"
          component={ReactRouterLink}
          key="1"
          color="inherit"
          to="/category"
        >
          <HomeIcon />
        </Link>
      </Breadcrumbs>
    </Paper>
  )
}
