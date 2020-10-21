import React, { useEffect, useState, useCallback } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import { messageReceived, setMessageList, setSocket } from '../actions'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import NotificationsIcon from '@material-ui/icons/Notifications'
import { userList, useSecondaryListItems } from './Drawer/Drawerlist'
import Switch from '@material-ui/core/Switch'
import Avatar from '@material-ui/core/Avatar'
import {
  Menu,
  MenuItem,
  ThemeProvider,
  createMuiTheme,
  useMediaQuery
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import Chatroom from './Chatroom/Chatroom'
import Cookies from 'js-cookie'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Dialog from '@material-ui/core/Dialog'
import NotificationListItem from './NotificationListItem'
import {
  orange,
  lightBlue,
  deepPurple,
  deepOrange
} from '@material-ui/core/colors'

import { lightTheme, darkTheme } from '../themes'

// function Copyright() {
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       {'Copyright © '}
//       <Link
//         color="inherit"
//         href="https://gitlab.secoder.net/GoJellyfish/ChatFish"
//       >
//         FishChat
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   )
// }

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    background: theme.palette.primary.light,
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  appBarIcon: {
    padding: 5
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  title: {
    flexGrow: 1,
    color: theme.palette.text.primary
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(9),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'hidden'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  box: {
    padding: theme.spacing(4),
    minWidth: 300 // fixme: not working!
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    height: 240
  },
  listStyles: {
    width: '100%',
    maxWidth: '36ch',
    maxHeight: '60vh',
    overflow: 'hidden',
    overflowX: 'hidden',
    '&:hover': {
      overflow: 'auto',
      overflowX: 'hidden'
    },
    '&::-webkit-scrollbar-track': {
      padding: '2px',
      backgroundColor: '#e8e8e8'
    },
    '&::-webkit-scrollbar': {
      width: '3px'
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      // box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      backgroundColor: '#203152'
    }
  }
}))

export default function Dashboard() {
  const classes = useStyles()
  const history = useHistory()
  const [open, setOpen] = useState(false)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkState, setDarkState] = useState(prefersDarkMode)
  const theme = darkState ? darkTheme() : lightTheme()
  const [anchorMenu, setAnchorMenu] = useState(null)
  const friendList = useSelector((state) => state.messages)
  const dispatch = useDispatch()
  // const [currentChat, setCurrentChat] = useState(friendList[0])

  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false)
  const [friendToAddList, setFriendToAddList] = useState([
    'friesdfndA',
    'friendB',
    'frien22f2dC',
    'friendadsfasdfafD'
  ])

  // const [friendRequst, setFriendRequest] = useState('')
  let socket
  let username

  const handleRequireFriendList = useCallback(async () => {
    const params = {
      username: username
    }

    fetch('/?action=require_friend_list', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then((res) =>
      res
        .json()
        .catch((error) => console.error('Error:', error))
        .then((data) => {
          if (
            data != null &&
            Object.prototype.hasOwnProperty.call(data, 'state') &&
            data['state'] === 200
          ) {
            dispatch(setMessageList(data['message_list']))
          }
        })
    )
  }, [username, dispatch])

  const handleAddFriendRequest = useCallback(
    async (fiendName) => {
      const params = {
        username: username,
        friend_name: fiendName
      }

      fetch('/?action=agree_add_friend', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
      }).then((res) =>
        res
          .json()
          .catch((error) => console.error('Error:', error))
          .then((data) => {
            if (
              data != null &&
              Object.prototype.hasOwnProperty.call(data, 'state') &&
              data['state'] === 200
            ) {
              dispatch(
                setMessageList([
                  ...friendList,
                  { user: username, message_list: [] }
                ])
              )
            }
          })
      )
    },
    [username, friendList, dispatch]
  )
  const refuseAddRequest = (refusedUsername) => {
    const index = friendToAddList.indexOf(refusedUsername)
    const newArray = [...friendToAddList]
    newArray.splice(index, 1)
    setFriendToAddList(newArray)
  }
  const handleReply = async (message) => {
    const params = {
      response: message
    }

    fetch('/response', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const handleLogout = (e) => {
    e.preventDefault()
    Cookies.remove('token')
    history.push('/sign')
  }
  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  const handleAvatarClick = (event) => {
    setAnchorMenu(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorMenu(null)
  }
  // const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  useEffect(() => {
    const localCookie = Cookies.get('token')
    const nameCookie = Cookies.get('username')
    if (localCookie != null && nameCookie != null) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      socket = new WebSocket('wss://chatfish-gojellyfish.app.secoder.net/ws')
      // eslint-disable-next-line react-hooks/exhaustive-deps
      username = nameCookie

      // Connection opened
      socket.addEventListener('open', function (event) {
        handleRequireFriendList().then()
        dispatch(setSocket(socket))
      })

      // Listen for messages
      socket.addEventListener('message', function (event) {
        const receivedData = JSON.parse(event.data)
        if (
          receivedData != null &&
          Object.prototype.hasOwnProperty.call(receivedData, 'state') &&
          receivedData['state'] === 200
        ) {
          switch (receivedData['type']) {
            case 'MESSAGE_NOTIFY':
              handleReply('NOTIFY_MESSAGE_NOTIFY').then()
              dispatch(
                messageReceived(
                  receivedData['content'],
                  receivedData['friend_name']
                )
              )
              break
            case 'NEW_ADD_FRIEND':
              handleReply('NOTIFY_NEW_ADD_FRIEND').then()
              setFriendToAddList([
                ...friendToAddList,
                receivedData['friend_name']
              ])
              break
            case 'AGREE_ADD_FRIEND':
              handleReply('NOTIFY_AGREE_ADD_FRIEND').then()
              dispatch(
                setMessageList([
                  friendList,
                  { user: receivedData['friend_name'], message_list: [] }
                ])
              )
              break
            default:
              break
          }
        }
      })

      socket.onerror = function (event) {
        console.error('WebSocket error observed:', event)
        // history.push('/sign')
      }
    } else {
      // history.push('/sign')
    }
  }, [history])

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar id="toolbar" className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              component="h1"
              variant="h6"
              // color="inherit"
              noWrap
              className={classes.title}
            >
              Chat Fish
            </Typography>

            <div>
              <Switch
                name="checkedDarkTheme"
                checked={darkState}
                onChange={() => {
                  setDarkState(!darkState)
                  // dispatch(setTheme(event.target.checked ? darkTheme : lightTheme))
                }}
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </div>
            <div
              className={classes.appBarIcon}
              onClick={() => {
                setNotificationDialogOpen(true)
              }}
            >
              <IconButton color="inherit">
                {friendToAddList.length !== 0 ? (
                  <Badge
                    badgeContent={friendToAddList.length.toString()}
                    color="secondary"
                  >
                    <NotificationsIcon />
                  </Badge>
                ) : (
                  <NotificationsIcon />
                )}
              </IconButton>
            </div>

            <div className={classes.appBarIcon}>
              {/* user icon */}
              <IconButton onClick={handleAvatarClick}>
                <Avatar>S</Avatar>
              </IconButton>
            </div>
            <Menu
              id="simple-menu"
              anchorEl={anchorMenu}
              keepMounted
              open={Boolean(anchorMenu)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>My account</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <Typography>Friends</Typography>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List className={classes.listStyles}>{userList(friendList)}</List>
          <Divider />
          <List>{useSecondaryListItems()}</List>
        </Drawer>

        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Box display="flex" flexDirection="row" justifyContent="center">
            <Box className={classes.box}>
              {/* <Chatroom ref={chatBoxRef} usr={friendList[0]} /> fixme */}
              <Chatroom />
            </Box>
          </Box>
        </main>
        <Dialog
          open={notificationDialogOpen}
          onClose={() => {
            setNotificationDialogOpen(false)
          }}
        >
          <DialogTitle> Notifications </DialogTitle>
          <DialogContent>
            <DialogContentText>New friend requests</DialogContentText>
            <Box className={classes.notificationText}>
              <List className={classes.notificationList}>
                {friendToAddList.map((name) => (
                  <NotificationListItem
                    name={name}
                    refuse={refuseAddRequest}
                    accept={handleAddFriendRequest}
                    key={name}
                  />
                ))}
              </List>
            </Box>
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  )
}
