import * as React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/auth/Login'
import Home from './pages/home/Home'
import DashboardLayout from './components/layouts/DashboardLayout'
import './App.css'
import PageNotFound from './pages/404/PageNotFound'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ProtectRoutes } from './utils/ProtectRoutes'
import Logout from './pages/auth/Logout'
import Categories from './pages/category/Categories'
import Category from './pages/category/Category'
import CreateCategory from './pages/category/CreateCategory'
import EditCategory from './pages/category/EditCategory'
import DeleteCategory from './pages/category/DeleteCategory'
import Products from './pages/product/Products'
import CreateProduct from './pages/product/CreateProduct'
import EditProduct from './pages/product/EditProduct'
import DeleteProduct from './pages/product/DeleteProduct'
import ThumbnailForm from './pages/thumbnail/createThumbnail'

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route element={<ProtectRoutes />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Home />} />
            </Route>

            <Route path="/category" element={<DashboardLayout />}>
              <Route index element={<Categories />} />
              <Route path="create" element={<CreateCategory />} />
              <Route path=":categoryId" element={<Category />} />
              <Route path=":categoryId/edit" element={<EditCategory />} />
              <Route path=":categoryId/delete" element={<DeleteCategory />} />
            </Route>

            <Route path="product" element={<DashboardLayout />}>
              <Route index element={<Products />} />
              <Route path="create" element={<CreateProduct />} />
              <Route path=":productId/edit" element={<EditProduct />} />
              <Route path=":productId/delete" element={<DeleteProduct />} />
            </Route>

            <Route path="thumbnail" element={<DashboardLayout />}>
              <Route index element={<ThumbnailForm />} />
            </Route>
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </LocalizationProvider>
  )
}
