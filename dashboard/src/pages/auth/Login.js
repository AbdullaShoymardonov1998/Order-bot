import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useState } from 'react'
import AxiosClient from '../../utils/axios'
import { useNavigate } from 'react-router-dom'
import { Grid, CardMedia } from '@mui/material'
import LoadingBar from '../../components/loading/LoadingBar'
import HttpErrorNotification from '../../components/notifications/HttpErrorNotification'
import logo from '../../assets/logo.jpg'

const theme = createTheme()

export default function SignIn() {
  const navigate = useNavigate()
  const [username, setUsername] = useState({
    value: '',
    error: false,
    message: '',
  })
  const [password, setPassword] = useState({
    value: '',
    error: false,
    message: '',
  })
  const [alert, setAlert] = useState({ state: false, message: '' })
  const [sendRequest, setSendRequest] = useState(false)

  const validateFields = () => {
    let existingError = false
    if (username.value.length === 0) {
      setUsername({
        ...username,
        error: true,
        message: "Belgilar [1-65] oralig'ida bo'lish kerak",
      })
      existingError = true
    } else {
      setUsername({ ...username, error: false, message: '' })
    }

    if (password.value.length === 0) {
      setPassword({
        ...password,
        error: true,
        message: "Belgilar [1-65] oralig'ida bo'lish kerak",
      })
      existingError = true
    } else {
      setPassword({ ...password, error: false, message: '' })
    }

    return existingError
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (validateFields()) return
    setSendRequest(true)
    try {
      const { data } = await AxiosClient.post('/account/login', {
        username: username.value,
        password: password.value,
      })
      localStorage.setItem('token', data.data.token)
      navigate('/')
    } catch (error) {
      setSendRequest(false)
      if (
        error?.response?.data?.message.includes(
          'Username or password is incorrect',
        )
      ) {
        setAlert({
          state: true,
          message: 'Login yoki parol xato',
        })
      } else {
        setAlert({
          state: true,
          message: error.message,
        })
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1 }}>
            <CardMedia component="img" image={logo} alt="Logo" />
          </Avatar>
          <Typography component="h1" variant="h5">
            Haoomas
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              fullWidth
              id="username"
              label="Login"
              name="username"
              autoComplete="username"
              onChange={(e) =>
                setUsername({ ...username, value: e.target.value })
              }
              value={username.value}
              required={true}
              helperText={username.message}
              error={username.error}
              autoFocus
            />
            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="Parol"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) =>
                setPassword({ ...password, value: e.target.value })
              }
              value={password.value}
              required={true}
              helperText={password.message}
              error={password.error}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Kirish
            </Button>
          </Box>
          {sendRequest ? <LoadingBar /> : <></>}
          <Grid item xs={12}>
            {alert.state ? (
              <HttpErrorNotification message={alert.message} />
            ) : (
              <></>
            )}
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
