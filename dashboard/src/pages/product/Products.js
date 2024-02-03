import * as React from 'react'
import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import AxiosClient from '../../utils/axios'
import ErrorMessage from '../../utils/errorMessage'
import HttpErrorNotification from '../../components/notifications/HttpErrorNotification'
import PageTitle from '../../components/title/PageTitle'
import EditIcon from '@mui/icons-material/Edit'
import { Button, Paper, Grid, Breadcrumbs, Link } from '@mui/material'
import { useNavigate, Link as ReactRouterLink } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import DeleteIcon from '@mui/icons-material/Delete'

export default function Products() {
  const nav = useNavigate()
  const [alert, setAlert] = useState({ state: false, message: '' })
  const editHandler = (id) => nav(`/product/${id}/edit`)
  const createHandler = () => nav(`/product/create`)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [rowSelectionModel, setRowSelectionModel] = useState([])
  const [rows, setRows] = useState([])
  const deleteHandler = (id) => nav(`/product/${id}/delete`)

  async function loadServerRows(page) {
    try {
      const result = await AxiosClient.get(`product`, {
        params: { page: page + 1 },
      })
      setTotal(result.data.data.total)
      return result.data.data.products
    } catch (error) {
      const message = ErrorMessage(error)
      setAlert({
        state: true,
        message,
      })
      return []
    }
  }

  useEffect(() => {
    let active = true

    ;(async () => {
      setLoading(true)
      const newRows = await loadServerRows(paginationModel.page)

      if (!active) {
        return
      }

      setRows(newRows)
      setLoading(false)
    })()

    return () => {
      active = false
    }
  }, [paginationModel.page])

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
      field: 'price',
      headerName: 'Narx',
      sortable: false,
      editable: false,
      valueGetter: (params) => `${params.row.price.toLocaleString('ru-RU')}`,
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
      headerName: '',
      minWidth: 200,
      renderCell: (params) => {
        return (
          <Grid container justifyContent="flex-end">
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
          <PageTitle title="Mahsulot" />
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
          rows={rows}
          pagination
          paginationModel={paginationModel}
          pageSizeOptions={[10]}
          columns={columns}
          rowCount={total}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel)
          }}
          rowSelectionModel={rowSelectionModel}
          loading={loading}
          keepNonExistentRowsSelected
          density="compact"
          disableRowSelectionOnClick
        />
      </div>
      {alert.state ? <HttpErrorNotification message={alert.message} /> : <></>}

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
    </Paper>
  )
}
