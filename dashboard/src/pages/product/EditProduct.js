import * as React from 'react'
import {
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  FormControl,
  Breadcrumbs,
  CardMedia,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Link,
} from '@mui/material'
import PageTitle from '../../components/title/PageTitle'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useState, useEffect } from 'react'
import AxiosClient from '../../utils/axios'
import {
  useNavigate,
  useParams,
  Link as ReactRouterLink,
} from 'react-router-dom'
import LoadingBar from '../../components/loading/LoadingBar'
import ErrorMessage from '../../utils/errorMessage'
import HttpErrorNotification from '../../components/notifications/HttpErrorNotification'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import HomeIcon from '@mui/icons-material/Home'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { UNITS, ORDER_DIFFERENCE } from '../../utils/const'

export default function EditProduct() {
  const navigate = useNavigate()
  const params = useParams()
  const [sendRequest, setSendRequest] = useState(false)
  const [alert, setAlert] = useState({ state: false, message: '' })
  const [unit, setUnit] = useState('QUANTITY')
  const [orderDifference, setOrderDifference] = useState(1)
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [subCategories, setSubCategories] = useState([])
  const [subCategory, setSubCategory] = useState('')
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [oldPictureUrl, setOldPictureUrl] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const handleUnitChange = (event) => setUnit(event.target.value)
  const handleDifferenceChange = (event) =>
    setOrderDifference(event.target.value)
  const handleIsActive = (event) => setIsActive(event.target.checked)

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
    setOldPictureUrl(URL.createObjectURL(e.target.files[0]))
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
      formData.append('unit', unit)
      formData.append('min_order', body.minimumOrder)
      formData.append('max_order', body.maximumOrder)
      formData.append('order_difference', orderDifference)
      formData.append('is_active', isActive)
      formData.append('image', file || null)

      await AxiosClient.put(`/product/${params.productId}`, formData, {
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

    const product = await AxiosClient.get(`/product/${params.productId}`)

    return {
      categories,
      subCategories,
      product: product.data.data,
    }
  }

  useEffect(() => {
    fetch().then(
      async (data) => {
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

        setValue('titleUZ', data.product.title.UZ)
        setValue('titleRU', data.product.title.RU)
        setValue('descriptionUZ', data.product.description.UZ)
        setValue('descriptionRU', data.product.description.RU)
        setValue('price', data.product.price)
        setValue('minimumOrder', data.product.min_order)
        setValue('maximumOrder', data.product.max_order)
        setOrderDifference(data.product.order_difference)
        setUnit(data.product.unit)
        setCategory(data.product.parent.parent)
        setSubCategory(data.product.parent._id)
        setOldPictureUrl(data.product.picture.url)
        setIsActive(data.product.is_active)
        const newSubCategories = await AxiosClient.get(
          `/category/${data.product.parent.parent}`,
        )
        setSubCategories(newSubCategories.data.data.categories)
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
  const copyTitle = () => setValue('titleRU', getValues('titleUZ'))
  return (
    <Paper sx={{ p: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <PageTitle title="Mahsulotni o'zgartirish" />
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
            InputLabelProps={{ shrink: true }}
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
            InputLabelProps={{ shrink: true }}
          />
          <Typography variant="inherit" color="textSecondary">
            {errors.descriptionRU?.message}
          </Typography>
        </Grid>

        <Grid item xs={4}>
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

        <Grid item xs={4}>
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

        <Grid item xs={4}>
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

        <Grid item xs={4}>
          <InputLabel id="unit-label">O'lchov birligi</InputLabel>
          <Select
            labelId="unit-label"
            id="unit"
            value={unit}
            label="O'lchov birligi"
            onChange={handleUnitChange}
          >
            {UNITS.map((category, index) => {
              return (
                <MenuItem key={index} value={category.value}>
                  {category.name}
                </MenuItem>
              )
            })}
          </Select>
        </Grid>

        <Grid item xs={4}>
          <InputLabel id="orderDifference-label">
            Buyurtmalar qilish farqi
          </InputLabel>
          <Select
            labelId="unit-label"
            id="orderDifference"
            value={orderDifference}
            label="Buyurtmalar qilish farqi"
            onChange={handleDifferenceChange}
          >
            {ORDER_DIFFERENCE.map((value, index) => {
              return (
                <MenuItem key={index} value={value.value}>
                  {value.name}
                </MenuItem>
              )
            })}
          </Select>
        </Grid>

        <Grid item xs={4}>
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
          {oldPictureUrl ? (
            <CardMedia component="img" image={oldPictureUrl} alt="Rasm" />
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isActive}
                  onChange={handleIsActive}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="Faol"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
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
