import { yupResolver } from '@hookform/resolvers/yup'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import HomeIcon from '@mui/icons-material/Home'
import AddIcon from '@mui/icons-material/Add'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Breadcrumbs,
  Button,
  CardMedia,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
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
import {
  Link as ReactRouterLink,
  useNavigate,
  useParams,
} from 'react-router-dom'
import * as Yup from 'yup'
import LoadingBar from '../../components/loading/LoadingBar'
import HttpErrorNotification from '../../components/notifications/HttpErrorNotification'
import PageTitle from '../../components/title/PageTitle'
import AxiosClient from '../../utils/axios'
import ErrorMessage from '../../utils/errorMessage'

export default function EditProduct() {
  const navigate = useNavigate()
  const params = useParams()
  const [sendRequest, setSendRequest] = useState(false)
  const [alert, setAlert] = useState({ state: false, message: '' })
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [subCategories, setSubCategories] = useState([])
  const [subCategory, setSubCategory] = useState('')
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [oldPictureUrl, setOldPictureUrl] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [colors, setColors] = useState([])
  const [sizes, setSizes] = useState([])

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
      console.log(JSON.stringify(body))
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
      formData.append('is_active', isActive)
      formData.append('image', file || null)
      sizes.forEach((size, index) => {
        formData.append(`sizes[${index}][name]`, body.sizes.name)
      })

      colors.forEach((color, index) => {
        formData.append(`colors[${index}][name]`, body.colors.name)
        if (body.colors.picture) {
          formData.append(
            `colors[${index}][picture]`,
            body.colors.name,
            body.colors.picture,
          )
        }
      })
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
        setValue('sizes', data.product.sizes)
        setValue('colors', data.product.colors)
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
  const handleAddSize = () => {
    setSizes([...sizes, { name: '', quantity: 0 }])
  }

  const handleRemoveSize = (index) => {
    const newSizes = [...sizes]
    newSizes.splice(index, 1)
    setSizes(newSizes)
  }

  const handleSizeChange = (index, event) => {
    const newSizes = [...sizes]
    newSizes[index].name = event.target.value
    setSizes(newSizes)
  }

  const handleAddColor = () => {
    setColors([...colors, { name: '', picture: null }])
  }

  const handleRemoveColor = (index) => {
    const newColors = [...colors]
    newColors.splice(index, 1)
    setColors(newColors)
  }

  const handleColorChange = (index, event) => {
    const newColors = [...colors]
    newColors[index].name = event.target.value
    setColors(newColors)
  }

  const handleColorPictureChange = (index, e) => {
    const file = e.target.files[0]
    if (file) {
      const pictureUrl = URL.createObjectURL(file)
      const updatedColors = colors.map((color, colorIndex) => {
        if (index === colorIndex) {
          return { ...color, name: file.name, picture: pictureUrl }
        }
        return color
      })
      setColors(updatedColors)
    }
  }
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
        <InputLabel
          sx={{
            fontSize: '1.2rem',
            paddingLeft: '1rem',
            paddingTop: '1.5rem',
            color: (theme) => theme.palette.primary.main,
            fontWeight: 'bold',
            marginBottom: '8px',
          }}
        >
          Mahsulot alohida belgilari
        </InputLabel>
        <Grid
          container
          spacing={3}
          sx={{
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            margin: '20px',
          }}
        >
          <Grid item xs={4}>
            <InputLabel
              sx={{
                fontSize: '1.2rem',
                color: (theme) => theme.palette.primary.main,
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              Mahsulot razmeri
            </InputLabel>
            <Typography variant="inherit" color="textSecondary">
              {errors.size?.message}
            </Typography>
            {sizes.map((size, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={8} sx={{ my: 1 }}>
                  <TextField
                    fullWidth
                    label="Razmeri"
                    value={size.name}
                    onChange={(e) => handleSizeChange(index, e)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <IconButton
                    sx={{
                      padding: '10px',
                      fontSize: '2rem',
                      my: 1,
                    }}
                    onClick={() => handleRemoveSize(index)}
                  >
                    <DeleteIcon fontSize="medium" />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddSize}
              sx={{ my: 2 }}
            >
              <AddIcon />
            </Button>
          </Grid>
          <Grid item xs={4}>
            <InputLabel
              sx={{
                fontSize: '1.2rem',
                color: (theme) => theme.palette.primary.main,
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              Mahsulot Rangi
            </InputLabel>
            <Typography variant="inherit" color="textSecondary">
              {errors.color?.message}
            </Typography>
            {colors.map((color, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={6} sx={{ my: 1 }}>
                  <TextField
                    fullWidth
                    label="Rangi"
                    onChange={(e) => handleColorChange(index, e)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <IconButton
                    sx={{
                      padding: '10px',
                      fontSize: '2rem',
                      my: 1,
                    }}
                    onClick={() => handleRemoveColor(index)}
                  >
                    <DeleteIcon fontSize="medium" />
                  </IconButton>
                </Grid>
                <Grid item xs={12} container alignItems="center" spacing={2}>
                  <Grid item>
                    <InputLabel>Rang uchun rasm</InputLabel>
                  </Grid>

                  <Grid item>
                    <IconButton color="primary" component="label" size="small">
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleColorPictureChange(index, e)}
                      />
                      <AddPhotoAlternateIcon
                        fontSize="medium"
                        color="success"
                      />
                    </IconButton>
                  </Grid>

                  {color.picture && (
                    <Grid item>
                      <CardMedia
                        sx={{ width: '10rem', height: '10rem' }}
                        component="img"
                        image={color.picture}
                        alt="Rangli rasm"
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            ))}
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddColor}
              sx={{ my: 2 }}
            >
              <AddIcon />
            </Button>
          </Grid>

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
              <AttachFileIcon fontSize="medium" /> {fileName}
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
        <Grid
          item
          xs={12}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                underline="hover"
                component={ReactRouterLink}
                key="1"
                color="inherit"
                to="/product"
              >
                <HomeIcon fontSize="medium" />
              </Link>
            </Breadcrumbs>
          </div>
          {alert.state ? null : (
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
      </Grid>
    </Paper>
  )
}
