import { yupResolver } from '@hookform/resolvers/yup'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import HomeIcon from '@mui/icons-material/Home'
import {
  Breadcrumbs,
  Button,
  CardMedia,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import LoadingBar from '../../components/loading/LoadingBar'
import HttpErrorNotification from '../../components/notifications/HttpErrorNotification'
import PageTitle from '../../components/title/PageTitle'
import AxiosClient from '../../utils/axios'
import ErrorMessage from '../../utils/errorMessage'

export default function CreateProduct() {
  const navigate = useNavigate()
  const [sendRequest, setSendRequest] = useState(false)
  const [alert, setAlert] = useState({ state: false, message: '' })
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [subCategories, setSubCategories] = useState([])
  const [subCategory, setSubCategory] = useState('')
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [pictureUrl, setPictureUrl] = useState(null)

  const validationSchema = Yup.object().shape({
    titleUZ: Yup.string().required('Mahsulot nomini yozing'),
    titleRU: Yup.string().required('Mahsulot ruscha nomini yozing'),
    descriptionUZ: Yup.string(),
    descriptionRU: Yup.string(),
    price: Yup.number()
      .required('Narxni yozing')
      .min(1, "Narx musbat qiymat bo'lishi kerak")
      .integer("Narx butun qiymat bo'lishi kerak")
      .default(() => 1000),
    minimumOrder: Yup.number()
      .required('Minium buyurtma sonini kiriting')
      .min(0.1, "Kamida 0.1 bo'lish kerak"),
    maximumOrder: Yup.number().required('Maximum buyurtma sonini kiriting'),
  })
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })

  const handleFileChange = (e) => {
    setFileName(e.target.files[0].name)
    setFile(e.target.files[0])
    setPictureUrl(URL.createObjectURL(e.target.files[0]))
  }

  const onSubmit = async (body) => {
    try {
      setSendRequest(true)
      const formData = new FormData()
      formData.append('title[UZ]', body.titleUZ)
      formData.append('title[RU]', body.titleRU)
      formData.append('description[UZ]', body.descriptionUZ || '')
      formData.append('description[RU]', body.descriptionRU || '')
      formData.append('price', body.price)
      formData.append('parent', subCategory)
      formData.append('min_order', body.minimumOrder)
      formData.append('max_order', body.maximumOrder)
      formData.append('is_active', true)
      formData.append('image', file || null)

      await AxiosClient.post('/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      navigate(`/product`)
    } catch (error) {
      const message = ErrorMessage(error)
      setAlert({
        state: true,
        message,
      })
      setSendRequest(false)
    }
  }

  const fetch = async () => {
    let categories = []
    let subCategories = []
    const result = await AxiosClient.get(`/category`)
    categories = result.data.data
    if (categories.length === 0) {
      return { categories, subCategories }
    }

    const result2 = await AxiosClient.get(`/category/${categories[0]._id}`)
    subCategories = result2.data.data.categories
    return {
      categories,
      subCategories,
    }
  }

  useEffect(() => {
    fetch().then(
      (data) => {
        setCategories(data.categories)
        setSubCategories(data.subCategories)

        if (data.categories.length > 0 && data.subCategories.length > 0) {
          setCategory(data.categories[0]._id)
          setSubCategory(data.subCategories[0]._id)
        } else {
          setAlert({
            state: true,
            message: 'Kategoriya mavjud emas',
          })
        }
      },
      (error) => {
        const message = ErrorMessage(error)
        setAlert({
          state: true,
          message,
        })
      },
    )
  }, [])
  const handleCategoryChange = async (event) => {
    setCategory(event.target.value)
    const data = await AxiosClient.get(`/category/${event.target.value}`)
    setSubCategories(data.data.data.categories)
    if (data.data.data.categories.length > 0) {
      setSubCategory(data.data.data.categories[0]._id)
    } else {
      setAlert({
        state: true,
        message: 'Kategoriya mavjud emas',
      })
    }
  }
  const handleSubCategoryChange = (event) => setSubCategory(event.target.value)
  const copyTitle = () => {
    setValue('titleRU', getValues('titleUZ'))
  }
  return (
    <Paper sx={{ p: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <PageTitle title="Yangi mahsulot" />
        </Grid>
        <Grid item xs={6}>
          <FormControl>
            <InputLabel id="category-label">Kategoriya</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              value={category}
              label="Kategoriya"
              onChange={handleCategoryChange}
              autoWidth
            >
              {categories.map((category) => {
                return (
                  <MenuItem key={category._id} value={category._id}>
                    {category.title.UZ}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl>
            <InputLabel id="subCategory-label">Sub Kategoriya</InputLabel>
            <Select
              labelId="subCategory-label"
              id="subCategory"
              value={subCategory}
              label="Sub Kategoriya"
              onChange={handleSubCategoryChange}
              autoWidth
            >
              {subCategories.map((category) => {
                return (
                  <MenuItem key={category._id} value={category._id}>
                    {category.title.UZ}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <TextField
            required
            id="titleUZ"
            name="titleUZ"
            label="Mahsulot nomi"
            {...register('titleUZ')}
            error={errors.titleUZ ? true : false}
            margin="dense"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.titleUZ?.message}
          </Typography>
        </Grid>

        <Grid item xs={5}>
          <TextField
            required
            id="titleRU"
            name="titleRU"
            label="Mahsulot ruscha nomi"
            {...register('titleRU')}
            error={errors.titleRU ? true : false}
            margin="dense"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.titleRU?.message}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <IconButton aria-label="copy" onClick={copyTitle}>
            <ContentCopyIcon />
          </IconButton>
        </Grid>

        <Grid item xs={6}>
          <TextField
            required
            id="descriptionUZ"
            name="descriptionUZ"
            label="Izoh"
            {...register('descriptionUZ')}
            error={errors.descriptionUZ ? true : false}
            margin="dense"
            fullWidth
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.descriptionUZ?.message}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <TextField
            required
            id="descriptionRU"
            name="descriptionRU"
            label="Rucha izoh"
            {...register('descriptionRU')}
            error={errors.descriptionRU ? true : false}
            margin="dense"
            fullWidth
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.descriptionRU?.message}
          </Typography>
        </Grid>

        <Grid item xs={3}>
          <TextField
            required
            id="minimumOrder"
            name="minimumOrder"
            label="Minium buyurtma qilish soni"
            {...register('minimumOrder')}
            error={errors.minimumOrder ? true : false}
            type="number"
            defaultValue="1"
            margin="dense"
            fullWidth
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.minimumOrder?.message}
          </Typography>
        </Grid>

        <Grid item xs={3}>
          <TextField
            required
            id="maximumOrder"
            name="maximumOrder"
            label="Maximum buyurtma qilish soni"
            {...register('maximumOrder')}
            error={errors.maximumOrder ? true : false}
            type="number"
            defaultValue="100"
            margin="dense"
            fullWidth
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.maximumOrder?.message}
          </Typography>
        </Grid>

        <Grid item xs={3}>
          <TextField
            required
            id="price"
            name="price"
            label="Narx"
            {...register('price')}
            error={errors.price ? true : false}
            type="number"
            defaultValue="1000"
            margin="dense"
            fullWidth
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.price?.message}
          </Typography>
        </Grid>

        <Grid item xs={3}>
          <InputLabel>Rasm</InputLabel>
          <IconButton color="primary" component="label" size="small">
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
            <AttachFileIcon fontSize="medium" /> {fileName}
          </IconButton>
          {pictureUrl ? (
            <CardMedia component="img" image={pictureUrl} alt="Rasm" />
          ) : (
            <></>
          )}
        </Grid>

        <Grid
          item
          xs={12}
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          {alert.state ? (
            <></>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
            >
              Saqlash
            </Button>
          )}
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
