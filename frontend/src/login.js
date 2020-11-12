import React, { useState, useCallback } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import sha1 from 'crypto-js/sha1'
import Cookies from 'js-cookie'

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
  const [newUserName, setNewUserName] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatNewPassword, setRepeatNewPassword] = useState('')
  const [newPasswordValid, setNewPasswordValid] = useState(false)
  const [newUserNameValid, setNewUserNameValid] = useState(false)
  const [emailValid, setEmailValid] = useState(false)
  const [nicknameValid, setNicknameValid] = useState(false)
  const [emailInit, setEmailInit] = useState(false)
  const [nicknameInit, setNicknameInit] = useState(false)
  const [repeatNewPasswordValid, setRepeatNewPasswordValid] = useState(false)
  const [newUserNameInit, setNewUserNameInit] = useState(false)
  const [newPasswordInit, setNewPasswordInit] = useState(false)
  const [repeatNewUserNameInit, setRepeatNewPasswordInit] = useState(false)
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const handleLogin = useCallback(async (e) => {
    e.preventDefault()

    const passwordSHA = sha1(password + 'iwantaplus').toString()

    const params = {
      username: userName,
      password: passwordSHA
    }

    Cookies.set('username', userName, { expires: 1 })
    fetch('/?action=login', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()
      .catch(error => console.error('Error:', error))
      .then((data) => {
        if (data != null && Object.prototype.hasOwnProperty.call(data, 'state') &&
            data['state'] === 200) {
          Cookies.set('token', data['token'], { expires: 1 })
          history.push('/')
        } else alert('Wrong Password')
      }))
  }, [userName, password, history])

  const handleSignUp = useCallback(async (e) => {
    e.preventDefault()
    const newPasswordSHA = sha1(newPassword + 'iwantaplus').toString()

    const params = {
      username: newUserName,
      password: newPasswordSHA,
      email: email,
      nickname: nickname
    }

    fetch('/?action=register', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()
      .catch(error => console.error('Error:', error))
      .then((data) => {
        if (data != null && Object.prototype.hasOwnProperty.call(data, 'state') &&
              data['state'] === 200) {
          alert('Successfully register!You can sign in with the new account now!')
          setIsSignIn(true)
        } else alert('Fail to register!')
      }))
  }, [newUserName, newPassword, email, nickname])

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
                id="UserName"
                label="UserName"
                name="UserName"
                onChange={(e) => setUserName(e.target.value)}
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
                    onClick={() => {
                      setIsSignIn(false)
                    }}>
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
                id="newUserName"
                label="UserName"
                error={!newUserNameValid && newUserNameInit}
                helperText="4-12 characters including numbers and letters"
                value={newUserName}
                onChange={(e) => {
                  setNewUserName(e.target.value)
                  setNewUserNameInit(true)
                  if (/^[A-Za-z0-9]{4,12}$/.test(e.target.value)) {
                    setNewUserNameValid(true)
                  } else {
                    setNewUserNameValid(false)
                  }
                }}
                name="newUserName"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                error={!nicknameValid && nicknameInit}
                helperText="1-10 chars"
                onChange={(e) => {
                  setNickname(e.target.value)
                  setNicknameInit(true)
                  if (/^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/.test(e.target.value)) {
                    setNicknameValid(true)
                  } else {
                    setNicknameValid(false)
                  }
                }}
                required
                fullWidth
                value={nickname}
                name="Nickname"
                label="Nickname"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={email}
                name="Email"
                label="Email"
                error={!emailValid && emailInit}
                helperText="your email"
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailInit(true)
                  if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/.test(e.target.value)) {
                    setEmailValid(true)
                  } else {
                    setEmailValid(false)
                  }
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                error={!newPasswordValid && newPasswordInit}
                helperText="8-16 characters including numbers and letters"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  setNewPasswordInit(true)
                  if (/^[A-Za-z0-9]{8,16}$/.test(e.target.value)) {
                    setNewPasswordValid(true)
                  } else {
                    setNewPasswordValid(false)
                  }
                  if (e.target.value !== repeatNewPassword) {
                    setRepeatNewPasswordValid(false)
                  } else setRepeatNewPasswordValid(true)
                }}
                type="password"
                id="password"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                error={!repeatNewPasswordValid && repeatNewUserNameInit}
                helperText="RepeatPassword must be the same as the Password"
                name="repeat_password"
                label="RepeatPassword"
                type="password"
                value={repeatNewPassword}
                onChange={(e) => {
                  setRepeatNewPassword(e.target.value)
                  setRepeatNewPasswordInit(true)
                  if (e.target.value !== newPassword) {
                    setRepeatNewPasswordValid(false)
                  } else setRepeatNewPasswordValid(true)
                }}
                id="repeat_password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={!(newPasswordValid &&
                    newUserNameValid && repeatNewPasswordValid && emailValid && nicknameValid)}
                className={classes.submit}
                onClick={handleSignUp}
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
