import * as React from 'react'
import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import AxiosClient from '../../utils/axios'
import ErrorMessage from '../../utils/errorMessage'
import LoadingBar from '../../components/loading/LoadingBar'
import HttpErrorNotification from '../../components/notifications/HttpErrorNotification'
import PageTitle from '../../components/title/PageTitle'
import EditIcon from '@mui/icons-material/Edit'
import {
  Button,
  Paper,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
} from '@mui/material'
import {
  useNavigate,
  useParams,
  Link as ReactRouterLink,
} from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
import HomeIcon from '@mui/icons-material/Home'

export default function Category() {
  const nav = useNavigate()
  const params = useParams()
  const [categories, setCategories] = useState([])
  const [alert, setAlert] = useState({ state: false, message: '' })
  const [title, setTitle] = useState('')
  const [sendRequest, setSendRequest] = useState(true)

  const editHandler = (id) =>
    nav(`/category/${id}/edit?parent=${params.categoryId}`)
  const deleteHandler = (id) =>
    nav(`/category/${id}/delete?parent=${params.categoryId}`)
  const createHandler = () =>
    nav(`/category/create?parent=${params.categoryId}`)
  const fetch = async () => {
    const result = await AxiosClient.get(`/category/${params.categoryId}`)
    setTitle(`${result.data.data.data.title.UZ}`)
    return result.data.data.categories
  }

  useEffect(() => {
    fetch()
      .then(setCategories, (error) => {
        const message = ErrorMessage(error)
        setAlert({
          state: true,
          message,
        })
      })
      .finally(() => setSendRequest(false))
  }, [])

  const columns = [
    {
      field: 'nameUZ',
      headerName: 'Ismi',
      sortable: false,
      editable: false,
      flex: 0.4,
      valueGetter: (params) => `${params.row.title.UZ}`,
    },
    {
      field: 'nameRU',
      headerName: 'Имя',
      sortable: false,
      editable: false,
      flex: 0.4,
      valueGetter: (params) => `${params.row.title.RU}`,
    },
    {
      field: 'created_at',
      headerName: 'Yangilandi',
      sortable: false,
      editable: false,
      minWidth: 200,
      valueGetter: (params) =>
        `${new Date(params.row.updated_at).toLocaleString('ru-RU')}`,
    },
    {
      field: 'action',
      headerName: 'Boshqaruv',
      minWidth: 200,
      renderCell: (params) => {
        return (
          <Grid container>
            <Button onClick={editHandler.bind(this, params.id)}>
              <EditIcon />
            </Button>
            <Button onClick={deleteHandler.bind(this, params.id)}>
              <DeleteIcon />
            </Button>
          </Grid>
        )
      },
    },
  ]

  return (
    <Paper sx={{ p: 1 }}>
      <Grid container sx={{ p: 1 }}>
        <Grid item xs={10}>
          <PageTitle title={`${title}`} />
        </Grid>
        <Grid item xs={2}>
          <Grid container justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={createHandler}>
              +
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <div style={{ width: '100%' }}>
        <DataGrid
          rows={categories}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10]}
          getRowId={(row) => row._id}
          disableRowSelectionOnClick
        />
      </div>
      {alert.state ? <HttpErrorNotification message={alert.message} /> : <></>}
      {sendRequest ? <LoadingBar /> : <></>}

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
        <Typography key="2" color="text.primary">
          {title}
        </Typography>
      </Breadcrumbs>
    </Paper>
  )
}
