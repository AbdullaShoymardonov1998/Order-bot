import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import {
  Button,
  Grid,
  Paper,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
  CardMedia,
  Chip,
  IconButton,
} from '@mui/material'
import AxiosClient from '../../utils/axios'

const ThumbnailForm = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [subcategories, setSubcategories] = useState([])
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [selectedProducts, setSelectedProducts] = useState([])
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [picture, setPicture] = useState(null)
  const [pictureName, setPictureName] = useState('')
  const [pictureUrl, setPictureUrl] = useState(null)
  const [sendRequest, setSendRequest] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await AxiosClient.get(`/category`)
        const categories = response.data.data.map((category) => ({
          id: category._id,
          name: category.title.UZ,
        }))
        setCategories(categories)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!selectedCategory) return
      try {
        const response = await AxiosClient.get(`/category/${selectedCategory}`)
        const subcategories = response.data.data.categories.map(
          (subcategory) => ({
            id: subcategory._id,
            name: subcategory.title.UZ,
          }),
        )
        setSubcategories(subcategories)
      } catch (error) {
        console.error('Failed to fetch subcategories:', error)
      }
    }

    fetchSubcategories()
  }, [selectedCategory])

  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedSubcategory) return
      try {
        const response = await AxiosClient.get(`/product?page=${currentPage}`)
        if (Array.isArray(response.data.data.products)) {
          const filteredProducts = response.data.data.products
            .filter((product) => product.parent === selectedSubcategory)
            .filter(
              (product) =>
                !selectedProducts.find(
                  (selected) => selected.id === product._id,
                ),
            )
            .map((product) => ({
              id: product._id,
              name: product.title.UZ,
            }))

          setProducts((prevProducts) => [...prevProducts, ...filteredProducts])
        } else {
          console.error(
            'Products data is not an array:',
            response.data.products,
          )
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }

    fetchProducts()
  }, [selectedSubcategory])
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value)
    setSubcategories([])
    setSelectedSubcategory('')
    setProducts([])
    setSelectedProducts([])
  }

  const handleSubcategoryChange = (event) => {
    setSelectedSubcategory(event.target.value)
    setProducts([])
    setSelectedProducts([])
    setCurrentPage(1)
  }
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1)
  }

  const handlePreviousPage = () => {
    setCurrentPage(Math.max(1, currentPage - 1))
  }

  const handleFileChange = async (e) => {
    const formData = new FormData()
    formData.append('image', e.target.files[0])

    const response = await AxiosClient.post('/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    setPicture(response.data.data.fileId)
    setPictureName(e.target.files[0].name)
    setPictureUrl(URL.createObjectURL(e.target.files[0]))
    setSendRequest(true)
    setSendRequest(false)
  }

  const handleProductChange = (event) => {
    const newSelection = event.target.value
    setSelectedProducts((prevSelected) => [
      ...prevSelected,
      products.find((product) => product.id === newSelection),
    ])

    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== newSelection),
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData()
    formData.append('picture', picture)
    formData.append(
      'products',
      JSON.stringify(selectedProducts.map((product) => product.id)),
    )

    try {
      await AxiosClient.post('/thumbnail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Paper style={{ padding: 20 }}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Upload Thumbnail
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Choose Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                labelId="categories-label"
                label="Choose Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="subcategory-label">Choose subcategory</InputLabel>
              <Select
                value={selectedSubcategory}
                onChange={handleSubcategoryChange}
                labelId="subcategory-label"
                label="Choose subcategory"
              >
                {subcategories.map((subcategory) => (
                  <MenuItem key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Select
                value=""
                onChange={handleProductChange}
                displayEmpty
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <em>Choose a product</em>
                  }
                  return selected
                }}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom margin={1}>
                Chosen Products
              </Typography>
              <div>
                {selectedProducts.map((selectedProduct) => (
                  <Chip
                    key={selectedProduct.id}
                    label={selectedProduct.name}
                    style={{ margin: '2px' }}
                  />
                ))}
              </div>
            </Grid>
            <Grid item xs={12} container justifyContent="space-between">
              <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous Page
              </Button>
              <Button onClick={handleNextPage}>Next Page</Button>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <InputLabel
              sx={{
                fontSize: '1.2rem',
                paddingLeft: '1rem',
                color: (theme) => theme.palette.primary.main,
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              Thumbnail image
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
            {pictureName}
            {pictureUrl ? (
              <CardMedia
                sx={{
                  padding: '8px',
                  borderRadius: '8px',
                  width: '150px',
                  height: '150px',
                  border: '2px solid #ddd',
                }}
                component="img"
                image={pictureUrl}
                alt="Rasm"
              />
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
        <Grid container item xs={12} justifyContent="flex-end">
          <Button type="submit" variant="contained" color="primary">
            Upload
          </Button>
        </Grid>
      </form>
    </Paper>
  )
}

export default ThumbnailForm
