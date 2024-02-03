import * as React from 'react'
import {
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  Breadcrumbs,
  Link,
} from '@mui/material'
import PageTitle from '../../components/title/PageTitle'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useState } from 'react'
import AxiosClient from '../../utils/axios'
import {
  useNavigate,
  useLocation,
  Link as ReactRouterLink,
} from 'react-router-dom'
import LoadingBar from '../../components/loading/LoadingBar'
import ErrorMessage from '../../utils/errorMessage'
import HttpErrorNotification from '../../components/notifications/HttpErrorNotification'
import HomeIcon from '@mui/icons-material/Home'

export default function CreateCategory() {
  const navigate = useNavigate()
  const [sendRequest, setSendRequest] = useState(false)
  const [alert, setAlert] = useState({ state: false, message: '' })
  const search = useLocation().search
  const parent = new URLSearchParams(search).get('parent')

  const validationSchema = Yup.object().shape({
    titleUZ: Yup.string().required('Kategoriya nomini yozing'),
    titleRU: Yup.string().required('Kategoriya ruscha nomini yozing'),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })

  const onSubmit = async ({ titleUZ, titleRU }) => {
    try {
      await AxiosClient.post('/category', {
        title: {
          UZ: titleUZ,
          RU: titleRU,
        },
        description: {
          UZ: '',
          RU: '',
        },
        picture: {
          uuid: null,
        },
        parent,
      })
      const path = parent ? `/category/${parent}` : '/category'
      navigate(path)
    } catch (error) {
      const message = ErrorMessage(error)
      setAlert({
        state: true,
        message,
      })
      setSendRequest(false)
    }
  }
  return (
    <Paper sx={{ p: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <PageTitle title="Yangi kategoriya" />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="titleUZ"
            name="titleUZ"
            label="Kategoriya nomi"
            {...register('titleUZ')}
            error={errors.titleUZ ? true : false}
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.titleUZ?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="titleRU"
            name="titleRU"
            label="Kategoriya ruscha nomi"
            {...register('titleRU')}
            error={errors.titleRU ? true : false}
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.titleRU?.message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
          >
            Saqlash
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
