import * as React from 'react'
import Paper from '@mui/material/Paper'
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material'
import exitImage from '../../assets/exit.jpg'
import categoryImage from '../../assets/category.jpg'
import productImage from '../../assets/product.jpg'
import thumbnailImage from '../../assets/user.jpg'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <Paper sx={{ p: 1, mt: 2 }}>
      <Grid container spacing={2} direction="row">
        <Grid item xs={12} md={4}>
          <Card>
            <Link to="/category">
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image={categoryImage}
                  alt="Kategoriya"
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    Kategoriya
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Link>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <Link to="/product">
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image={productImage}
                  alt="Kategoriya"
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    Mahsulot
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Link>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <Link to="/logout">
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image={exitImage}
                  alt="Chiqish"
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    Chiqish
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Link>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  )
}
