import * as React from 'react'
import { Paper, Grid, Button, Breadcrumbs, Link } from '@mui/material'
import PageTitle from '../../components/title/PageTitle'
import { useState, useEffect } from 'react'
import AxiosClient from '../../utils/axios'
import {
  useParams,
  useNavigate,
  Link as ReactRouterLink,
} from 'react-router-dom'
import LoadingBar from '../../components/loading/LoadingBar'
import ErrorMessage from '../../utils/errorMessage'
import HttpErrorNotification from '../../components/notifications/HttpErrorNotification'
import HomeIcon from '@mui/icons-material/Home'

export default function DeleteProduct() {
  const nav = useNavigate()
  const params = useParams()
  const [sendRequest, setSendRequest] = useState(false)
  const [alert, setAlert] = useState({ state: false, message: '' })
  const [title, setTitle] = useState('')
  const cancelHandler = () => nav('/product')

  const confirmHandler = async () => {
    try {
      await AxiosClient.delete(`/product/${params.productId}`)
      nav('/product')
    } catch (error) {
      const message = ErrorMessage(error)
      setAlert({
        state: true,
        message,
      })
    }
  }

  const fetch = async () => {
    const result = await AxiosClient.get(`/product/${params.productId}`)
    return result.data.data
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
          <PageTitle title="Mahsulotni o'chirish" />
        </Grid>
        <Grid item xs={12}>
          "{title}" ni o'chirishni tasdiqlaysizmi?
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="error" onClick={confirmHandler}>
            O'chirish
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ ml: 2 }}
            onClick={cancelHandler}
          >
            Bekor qilish
          </Button>
        </Grid>
        <Grid item xs={12}>
          {alert.state ? (
            <HttpErrorNotification message={alert.message} />
          ) : (
            <></>
          )}
        </Grid>

        {sendRequest ? <LoadingBar /> : <></>}
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link
            underline="hover"
            component={ReactRouterLink}
            key="1"
            color="inherit"
            to="/product"
          >
            <HomeIcon />
          </Link>
        </Breadcrumbs>
      </Grid>
    </Paper>
  )
}
