import React, { useState, useCallback } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import sha1 from 'crypto-js/sha1'

function Copyright () {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh'
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  forget: {
    '& > *': {
      margin: theme.spacing(1)
    }
  }
}))

export default function SignInSide () {
  const classes = useStyles()
  const [isSignIn, setIsSignIn] = useState(true)
  const history = useHistory()
  const [password, setPassword] = useState('')
  const [userName, setUserName] = useState('')

  const handleLogin = useCallback(async (e) => {
    e.preventDefault()
    const passwordSHA = sha1(password + 'iwantaplus').toString()

    const params = {
      username: userName,
      password: passwordSHA
    }

    fetch('/login', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()
      .catch(error => console.error('Error:', error))
      .then((data) => {
        if (data != null && Object.prototype.hasOwnProperty.call(data, 'state') &&
            data['state'] === 200) {
          history.push('/chat')
        } else alert('Wrong Password')
      }))
  }, [userName, password])

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        {isSignIn
          ? <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Sign in
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={userName}
                id="email"
                label="Email Address"
                name="email"
                onChange={(e) => setUserName(e.target.value)}
                autoComplete="email"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleLogin}
              >
              Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Button
                    color="primary"
                    size="small">
                  Forgot password?
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color="primary"
                    size="small"
                    onClick={() => setIsSignIn(false)}>
                    {"Don't have an account? Sign Up"}
                  </Button>
                </Grid>
              </Grid>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
          : <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign up
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="repeat_password"
                label="RepeatPassword"
                type="password"
                id="repeat_password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => alert('Sign up!')}
              >
                  Sign Up
              </Button>
              <Grid container>
                <Grid item xs>
                  <Button
                    color="primary"
                    size="small">
                      Forgot password?
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color="primary"
                    onClick={() => setIsSignIn(true)}
                    size="small">
                    {'Already have an account? Sign In'}
                  </Button>
                </Grid>
              </Grid>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>}
      </Grid>
    </Grid>
  )
}
