import AttachFileIcon from '@mui/icons-material/AttachFile'
import HomeIcon from '@mui/icons-material/Home'
import {
  Breadcrumbs,
  Button,
  CardMedia,
  Grid,
  IconButton,
  InputLabel,
  Link,
  Paper,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import * as React from 'react'
import { useEffect, useState } from 'react'
import {
  Link as ReactRouterLink,
  useNavigate,
  useParams,
} from 'react-router-dom'
import HttpErrorNotification from '../../components/notifications/HttpErrorNotification'
import PageTitle from '../../components/title/PageTitle'
import AxiosClient from '../../utils/axios'
import ErrorMessage from '../../utils/errorMessage'
import LoadingBar from '../../components/loading/LoadingBar'
export default function Thumbnail() {
  const nav = useNavigate()
  const params = useParams()
  const [alert, setAlert] = useState({ state: false, message: '' })
  const createHandler = () => nav(`/product/create`)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 6,
  })
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [rowSelectionModel, setRowSelectionModel] = useState([])
  const [rows, setRows] = useState([])
  const [fileName, setFileName] = useState('')
  const [oldPictureUrl, setOldPictureUrl] = useState(null)
  const [productIds, setProductIds] = useState([])
  const [sendRequest, setSendRequest] = useState(false)

  async function loadServerRows(page) {
    try {
      const result = await AxiosClient.post(`product/thumbnail`, {
        parent: `${params.categoryId}`,
        page: paginationModel.page + 1,
        limit: 6,
      })
      if (result.data.data.product.list.length > 0) {
        setOldPictureUrl(
          result.data.data.product?.list[0]?.thumbnail?.picture?.url,
        )
      }
      setTotal(result.data.data.product.total)
      setProductIds(result.data.data.product.list.map((product) => product.id))
      return result.data.data.product.list
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
  ]

  const handleFileChange = async (e) => {
    setSendRequest(true)
    const formData = new FormData()
    formData.append('image', e.target.files[0])

    const response = await AxiosClient.post('/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    await AxiosClient.post('/thumbnail', {
      picture: {
        uuid: response.data.data.fileId,
      },
      products: productIds,
    })

    setFileName(e.target.files[0].name)
    setOldPictureUrl(URL.createObjectURL(e.target.files[0]))
    setSendRequest(false)
  }

  return (
    <Paper sx={{ p: 1 }}>
      <Grid container sx={{ p: 1 }}>
        <Grid item xs={10}>
          <PageTitle title="Mahsulot" />
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
      <Grid
        item
        xs={4}
        sx={{
          backgroundColor: '#fff',
        }}
      >
        <InputLabel
          sx={{
            fontSize: '1.2rem',
            paddingLeft: '1rem',
            color: (theme) => theme.palette.primary.main,
            fontWeight: 'bold',
            marginBottom: '8px',
          }}
        >
          Mahsulot rasmi
        </InputLabel>
        <IconButton color="primary" component="label" size="small">
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
          <AttachFileIcon fontSize="medium" />
        </IconButton>
        {oldPictureUrl ? (
          <CardMedia
            sx={{ width: '15rem', height: '15rem' }}
            component="img"
            image={oldPictureUrl}
            alt="Rasm"
          />
        ) : (
          <></>
        )}
      </Grid>
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
      {sendRequest ? <LoadingBar /> : <></>}
    </Paper>
  )
}
