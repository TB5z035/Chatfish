import React, { useEffect, useState, useCallback } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import {
  messageReceived,
  setMyName,
  setMessageList,
  setSocket,
  addFriend,
  setTheme,
  setFocusUser,
  addGroup,
  setDrawerOpen,
  addRequest,
  deleteRequest,
  setRequestList,
  deleteFriend,
  setAlreadyRead
} from '../actions'
import CssBaseline from '@material-ui/core/CssBaseline'
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import MenuIcon from '@material-ui/icons/Menu'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Switch from '@material-ui/core/Switch'
import Avatar from '@material-ui/core/Avatar'
import {
  DialogActions,
  Button,
  Grid,
  // CircularProgress,
  Menu,
  MenuItem,
  TextField
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import Chatroom from './Chatroom/Chatroom'
import Cookies from 'js-cookie'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Dialog from '@material-ui/core/Dialog'
import { useSnackbar } from 'notistack'
import NotificationListItem from './NotificationListItem'
import PaletteIcon from '@material-ui/icons/Palette'
import { themesAvailable, themeLightDefault, themeDarkDefault } from '../themes'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { postAgreeAddFriend } from '../fetch/friend/agreeAddFriend'
import MyDrawer from './Drawer/MyDrawer'
import { postAgreeAddGroup } from '../fetch/friend/agreeAddGroup'
import { requireFriendList } from '../fetch/message/requireFriendList'
import { postDisagreeAddFriend } from '../fetch/friend/refuseFriend'
import { postDisagreeAddGroup } from '../fetch/friend/refuseGroup'
import { postModifyInfo } from '../fetch/info/modifyInfo'
import md5 from 'crypto-js/md5'
import sha1 from 'crypto-js/sha1'

// import socket from '../reducers/socket'

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
    display: 'flex',
    background: theme.palette.test
  },
  toolbar: {
    background: theme.palette.toolbarBackground
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
    padding: theme.spacing(1)
  },
  themeSwitch: {
    padding: theme.spacing(1)
  },
  menuButton: {
    marginRight: theme.spacing(1)
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
    // padding: theme.spacing(4),
    margin: theme.spacing(4)
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
  infoBox: {
    // minHeight: '30vh',
    minWidth: '20vw'
  },
  menuItemInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'strech',
    minHeight: '5vh',
    minWidth: '10vw',
    maxWidth: '20vw'
  },
  menuItemInfoAvatar: {},
  menuItemInfoNames: {
    maxWidth: '85%',
    marginLeft: '1vw',
    marginRight: '1vw',
    display: 'flex',
    flexDirection: 'column'
  },
  menuItemInfoNickname: {
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  menuItemInfoUsername: {
    color: theme.palette.text.secondary,
    fontSize: 'small',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
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
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()

  const open = useSelector((state) => state.drawerOpen)
  const friendList = useSelector((state) => state.messages.messageList)
  const myName = useSelector((state) => state.myName)
  const webSocket = useSelector((state) => state.socket)
  const requestList = useSelector((state) => state.requests)

  const [darkState, setDarkState] = useState(false)
  const [anchorMenu, setAnchorMenu] = useState(null)
  const [anchorThemeMenu, setAnchorThemeMenu] = useState(null)
  const [previousDarkTheme, setPreviousDarkTheme] = useState(themeDarkDefault)
  const [previousLightTheme, setPreviousLightTheme] = useState(
    themeLightDefault
  )
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false)
  const [infoDialogOpen, setInfoDialogOpen] = useState(false)
  const [accountDialogOpen, setAccountDialogOpen] = useState(false)
  const [friendToAddList, setFriendToAddList] = useState([])
  const [groupToAddList, setGroupToAddList] = useState([])
  const [initWebSocket, setInitWebSocket] = useState(false)
  const [infoNewNickname, setInfoNewNickname] = useState(
    myName ? myName.nickname : null
  )
  const [infoCurrentPassword, setInfoCurrentPassword] = useState()
  const [infoNewEmail, setInfoNewEmail] = useState()
  const [infoNewPassword, setInfoNewPassword] = useState()
  const [infoNewPasswordComfirm, setInfoNewPasswordComfirm] = useState()
  const [nicknameValid, setNicknameValid] = useState(true)
  const [emailValid, setEmailValid] = useState(true)
  const [newPasswordValid, setNewPasswordValid] = useState(true)
  const [passwordSame, setPasswordSame] = useState(true)
  // const [online, setOnline] = useState(false)

  useEffect(() => {
    const friends = []
    const groups = []

    requestList.forEach((item) => {
      const request = item
      const tempItem = {
        groupName: request.user,
        friendName: request.friend_name
      }
      if (request.isGroup === 0 && !friends.includes(request.user)) {
        friends.push(request.user)
      } else if (request.isGroup === 1 && !groups.includes(tempItem)) {
        groups.push(tempItem)
      }
    })
    setFriendToAddList(friends)
    setGroupToAddList(groups)
  }, [requestList, setGroupToAddList, setFriendToAddList])

  const handleAddFriendRequest = useCallback(
    async (fName, inviter) => {
      const friendName = fName.split('@')[1]
      if (myName === friendName) {
        enqueueSnackbar('You cannot accept yourself as a friend', {
          variant: 'warning'
        })
      } else if (
        friendList
          .map((user) => {
            return user.isGroup === 0 ? user.user : null
          })
          .includes(friendName)
      ) {
        enqueueSnackbar('You are already friend with ' + friendName, {
          variant: 'warning'
        })
      } else {
        await postAgreeAddFriend(myName.username, friendName).then((res) =>
          res
            .json()
            .catch((error) => console.error('Error:', error))
            .then((data) => {
              if (
                data != null &&
                Object.prototype.hasOwnProperty.call(data, 'state') &&
                data['state'] === 200
              ) {
                dispatch(addFriend(friendName, data['userInfo']))
                dispatch(deleteRequest(0, fName))
                enqueueSnackbar('Successful add friend: ' + friendName, {
                  variant: 'success'
                })
              }
            })
        )
      }
    },
    [myName, dispatch, enqueueSnackbar, friendList]
  )

  const handleAddGroupRequest = useCallback(
    async (gName, fName) => {
      const groupName = gName.split('@')[1]
      const friendName = fName.split('@')[1]
      if (
        friendList
          .map((user) => {
            return user.isGroup === 1 ? user.user : null
          })
          .includes(groupName)
      ) {
        enqueueSnackbar('You are already in the group ' + groupName, {
          variant: 'warning'
        })
      } else {
        postAgreeAddGroup(myName.username, groupName, friendName).then((res) =>
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
                  addGroup(data['userInfo']['username'], data['userInfo'])
                )
                dispatch(deleteRequest(1, gName))
                enqueueSnackbar('Successful add group: ' + groupName, {
                  variant: 'success'
                })
              }
            })
        )
      }
    },
    [myName, dispatch, enqueueSnackbar, friendList]
  )

  const handleNicknameChange = () => {
    const passwordSHA = sha1(infoCurrentPassword + 'iwantaplus').toString()
    postModifyInfo(myName.username, passwordSHA, {
      nickname: infoNewNickname
    }).then((res) =>
      res
        .json()
        .catch((error) => console.error('Error:', error))
        .then((data) => {
          if (
            data != null &&
            Object.prototype.hasOwnProperty.call(data, 'state')
          ) {
            if (data['state'] === 200) {
              dispatch(setMyName({ ...myName, nickname: infoNewNickname }))
              setInfoNewNickname(infoNewNickname)
              enqueueSnackbar(
                'Successfully changed nickname: ' + infoNewNickname,
                {
                  variant: 'success'
                }
              )
            } else if (data['state'] === 405) {
              setInfoNewNickname(myName.nickname)
              enqueueSnackbar('Wrong password!', {
                variant: 'error'
              })
            }
          }
        })
    )
    setInfoCurrentPassword()
    setInfoDialogOpen(false)
  }

  const handleInfoChange = () => {
    const passwordSHA = sha1(infoCurrentPassword + 'iwantaplus').toString()
    var params = {}
    console.log('new email:' + infoNewEmail)
    if (infoNewEmail != null) {
      console.log('yes')
      params.email = infoNewEmail
    }
    console.log('new email:' + infoNewPassword)
    if (infoNewPassword != null) {
      console.log('yes2')
      params.new_password = sha1(infoNewPassword + 'iwantaplus').toString()
    }
    if (params !== {}) {
      postModifyInfo(myName.username, passwordSHA, params).then((res) =>
        res
          .json()
          .catch((error) => console.error('Error:', error))
          .then((data) => {
            if (
              data != null &&
              Object.prototype.hasOwnProperty.call(data, 'state')
            ) {
              if (data['state'] === 200) {
                dispatch(setMyName({ ...myName, email: infoNewEmail }))
                enqueueSnackbar('Successfully changed user info.', {
                  variant: 'success'
                })
              } else if (data['state'] === 405) {
                enqueueSnackbar('Wrong password!', {
                  variant: 'error'
                })
              }
            }
          })
      )
    }
    setAccountDialogOpen(false)
    setInfoCurrentPassword()
    setInfoNewEmail()
    setInfoNewPassword()
    setInfoNewPasswordComfirm()
  }

  const refuseAddFriendRequest = useCallback(
    async (refusedUsername, friendName) => {
      if (
        await postDisagreeAddFriend(
          myName.username,
          refusedUsername.split('@')[1]
        )
      ) {
        dispatch(deleteRequest(0, refusedUsername))
      }
    },
    [myName, dispatch]
  )

  const refuseAddGroupRequest = useCallback(
    async (refusedGroupName, friendName) => {
      if (
        await postDisagreeAddGroup(
          myName.username,
          refusedGroupName.split('@')[1],
          friendName.split('@')[1]
        )
      ) {
        dispatch(deleteRequest(1, refusedGroupName))
      }
    },
    [dispatch, myName]
  )

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
    dispatch(setMessageList([]))
    dispatch(setFocusUser(null))
    dispatch(setSocket(null))
    dispatch(setMyName(null))
    webSocket.close()
    setInitWebSocket(false)
    history.push('/sign')
  }
  const handleDrawerOpen = () => {
    dispatch(setDrawerOpen(true))
  }

  const handleThemeIconClick = (event) => {
    setAnchorThemeMenu(event.currentTarget)
  }

  const handleThemeMenuClose = () => {
    setAnchorThemeMenu(null)
  }

  // const handleOnlineIconClick = () => {
  //   setOnline(!online)
  // }

  const handleReceiveMessage = useCallback(async (receivedData) => {
    if (receivedData['is_group'] === 1) {
      dispatch(
        messageReceived(
          receivedData['content'],
          receivedData['friend_name'],
          receivedData['username'],
          1,
          receivedData['mtype'],
          receivedData['userInfo'],
          receivedData['id']
        )
      )
    } else {
      dispatch(
        messageReceived(
          receivedData['content'],
          receivedData['friend_name'],
          null,
          0,
          receivedData['mtype'],
          receivedData['userInfo'],
          receivedData['id']
        )
      )
    }
  },
  [dispatch]
  )

  const handleAvatarClick = (event) => {
    setAnchorMenu(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorMenu(null)
  }
  // const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  useEffect(() => {
    // * Set default theme
    dispatch(setTheme(darkState ? themeDarkDefault : themeLightDefault))

    // * Set up WebSocket
    async function setWebSocket() {
      // const OSS = require('ali-oss')
      // const client = new OSS({
      //   region: 'oss-cn-hangzhou',
      //   accessKeyId: 'LTAIBMLqLQSqvsin',
      //   accessKeySecret: '2nbRh2PdprS5Lvn1AMjeVuBgvkN0zi',
      //   bucket: 'wzf2000-1'
      // })
      // dispatch(setOSSClient(client))

      const localCookie = Cookies.get('token')
      const nameCookie = Cookies.get('username')
      if (localCookie != null && nameCookie != null) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const socket = new ReconnectingWebSocket(
          'wss://' + window.location.host + '/ws'
          // 'ws://' + window.location.host + '/ws' // fixme: for local debug only!!
        )

        // Connection opened
        socket.addEventListener('open', function (event) {
          dispatch(setSocket(socket))
          // setOnline(true)
          setInitWebSocket(true)

          requireFriendList(nameCookie).then((res) =>
            res
              .json()
              .catch((error) => console.error('Error:', error))
              .then((data) => {
                if (
                  data != null &&
                  Object.prototype.hasOwnProperty.call(data, 'state') &&
                  data['state'] === 200
                ) {
                  dispatch(setMyName(data['userInfo']))
                  dispatch(setMessageList(data['message_list']))
                  dispatch(setRequestList(data['request_list']))
                }
              })
          )
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
              case 'READSTATE_NOTIFY':
                dispatch(setAlreadyRead(
                  { user: receivedData['is_group'] === 0
                    ? receivedData['friend_name'] : receivedData['group_name'],
                  isGroup: receivedData['is_group'] }))
                break
              case 'MESSAGE_NOTIFY':
                handleReply('NOTIFY_MESSAGE_NOTIFY').then()
                handleReceiveMessage(receivedData)
                break
              case 'NEW_ADD_FRIEND':
                handleReply('NOTIFY_NEW_ADD_FRIEND').then()
                dispatch(
                  addRequest(
                    0,
                    receivedData['friend_name'],
                    receivedData['friend_name']
                  )
                )
                break
              case 'NEW_ADD_GROUP':
                handleReply('NOTIFY_NEW_ADD_GROUP').then()
                dispatch(
                  addRequest(
                    1,
                    receivedData['group_name'],
                    receivedData['friend_name']
                  )
                )
                break
              case 'FRIEND_DELETED':
                dispatch(deleteFriend(receivedData['friend_name']))
                break
              case 'AGREE_ADD_FRIEND':
                handleReply('NOTIFY_AGREE_ADD_FRIEND').then()
                dispatch(
                  addFriend(
                    receivedData['friend_name'],
                    receivedData['userInfo']
                  )
                )
                enqueueSnackbar(
                  'Successful add friend: ' + receivedData['friend_name'],
                  { variant: 'success' }
                )
                break
              default:
                break
            }
          }
        })
        socket.onerror = function (event) {
          console.error('WebSocket error observed:', event)
          if (!initWebSocket) {
            history.push('/sign')
          }
          // setOnline(false)
        }
        socket.onclose = (event) => {
          // setOnline(false)
        }
      } else {
        // history.push('/sign')
      }
    }
    setWebSocket().then()
    // eslint-disable-next-line
  }, [])

  return (
    <div className={classes.root}>
      <CssBaseline />

      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar id="toolbar" className={classes.toolbar}>
          <IconButton
            edge="start"
            // color="inherit"
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
            noWrap
            className={classes.title}
          >
            Chat Fish
          </Typography>
          <div className={classes.themeSwitch}>
            <Switch
              name="checkedDarkTheme"
              checked={darkState}
              onChange={() => {
                setDarkState(!darkState)
                dispatch(
                  setTheme(!darkState ? previousDarkTheme : previousLightTheme)
                )
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
            <IconButton>
              {requestList.length !== 0 ? (
                <Badge
                  badgeContent={requestList.length.toString()}
                  color="secondary"
                >
                  <NotificationsIcon />
                </Badge>
              ) : (
                <NotificationsIcon />
              )}
            </IconButton>
          </div>
          <div className={classes.appBarIcon} onClick={handleThemeIconClick}>
            <IconButton>
              <PaletteIcon></PaletteIcon>
            </IconButton>
          </div>
          <Menu
            id="theme-menu"
            anchorEl={anchorThemeMenu}
            keepMounted
            open={Boolean(anchorThemeMenu)}
            onClose={handleThemeMenuClose}
          >
            {themesAvailable.map((theme) => (
              <MenuItem
                key={theme.name}
                onClick={() => {
                  handleThemeMenuClose()
                  dispatch(setTheme(theme))
                  theme.type === 'light'
                    ? setPreviousLightTheme(theme)
                    : setPreviousDarkTheme(theme)
                  setDarkState(theme.type === 'dark')
                }}
              >
                {theme.name}
              </MenuItem>
            ))}
          </Menu>
          <IconButton
            className={classes.appBarIcon}
            onClick={handleAvatarClick}
          >
            <Avatar
              src={
                myName === null
                  ? 'https://www.gravatar.com/avatar/' +
                    'dce3adc8812d921a8af8963d3cc413b7?d=robohash'
                  : 'https://www.gravatar.com/avatar/' +
                    md5(myName.email).toString() +
                    '?d=robohash'
              }
            />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorMenu}
            keepMounted
            open={Boolean(anchorMenu)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose()
                setInfoNewNickname(myName.nickname)
                setInfoCurrentPassword()
                setInfoDialogOpen(true)
                setNicknameValid(true)
              }}
            >
              <Box className={classes.menuItemInfo}>
                <Box className={classes.menuItemInfoAvatar}>
                  <Avatar
                    src={
                      myName === null
                        ? 'https://www.gravatar.com/avatar/' +
                          'dce3adc8812d921a8af8963d3cc413b7?d=robohash'
                        : 'https://www.gravatar.com/avatar/' +
                          md5(myName.email).toString() +
                          '?d=robohash'
                    }
                  />
                </Box>
                <Box className={classes.menuItemInfoNames}>
                  <Box className={classes.menuItemInfoNickname}>
                    {myName ? myName.nickname : null}
                  </Box>
                  <Box className={classes.menuItemInfoUsername}>
                    {'@' + (myName ? myName.username : null)}
                  </Box>
                </Box>
              </Box>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose()
                setAccountDialogOpen(true)
                setInfoCurrentPassword()
                setInfoNewEmail()
                setInfoNewPassword()
                setInfoNewPasswordComfirm()
                setEmailValid(true)
                setNewPasswordValid(true)
                setPasswordSame(true)
              }}
            >
              Account Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <MyDrawer></MyDrawer>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          marginTop={1}
          height="80%"
        >
          {/* <Chatroom />
          <Chatroom />
          <Chatroom />
          <Chatroom /> */}
          <Chatroom />
        </Box>
      </main>
      <Dialog
        open={infoDialogOpen}
        onClose={() => {
          setInfoDialogOpen(false)
        }}
      >
        <Box className={classes.infoBox}>
          <DialogTitle>Choose a nickname</DialogTitle>
          <DialogContent>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item>
                <Avatar
                  src={
                    myName === null
                      ? 'https://www.gravatar.com/avatar/' +
                        'dce3adc8812d921a8af8963d3cc413b7?d=robohash'
                      : 'https://www.gravatar.com/avatar/' +
                        md5(myName.email).toString() +
                        '?d=robohash'
                  }
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  error={!nicknameValid}
                  label="New Nickname"
                  value={infoNewNickname}
                  helperText={
                    !nicknameValid ? 'Invalid nickname' : '1-10 characters'
                  }
                  onChange={(e) => {
                    setInfoNewNickname(e.target.value)
                    if (
                      /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/.test(e.target.value)
                    ) {
                      setNicknameValid(true)
                    } else {
                      setNicknameValid(false)
                    }
                  }}
                ></TextField>
              </Grid>
            </Grid>
            <Box marginTop={1}>
              <TextField
                fullWidth
                label="Current Password"
                value={infoCurrentPassword}
                onChange={(e) => {
                  setInfoCurrentPassword(e.target.value)
                }}
                type="password"
              ></TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button disabled={!nicknameValid} onClick={handleNicknameChange}>
              Submit
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Dialog
        open={accountDialogOpen}
        onClose={() => {
          setAccountDialogOpen(false)
        }}
      >
        <Box className={classes.infoBox}>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You can modify your email address and password here.
            </DialogContentText>
            <TextField
              fullWidth
              label="Current Password"
              value={infoCurrentPassword}
              onChange={(e) => {
                setInfoCurrentPassword(e.target.value)
              }}
              type="password"
            ></TextField>
            <TextField
              fullWidth
              error={!emailValid}
              label="New Email Address"
              value={infoNewEmail}
              helperText={
                emailValid ? 'new email address' : 'Invalid email address'
              }
              onChange={(e) => {
                setInfoNewEmail(e.target.value)
                if (
                  /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/.test(
                    e.target.value
                  )
                ) {
                  setEmailValid(true)
                } else if (e.target.value === '' || !e.target.value) {
                  setEmailValid(true)
                } else {
                  setEmailValid(false)
                }
              }}
            ></TextField>
            <TextField
              fullWidth
              error={!newPasswordValid}
              helperText={
                newPasswordValid
                  ? '8-16 characters including numbers and letters'
                  : 'Invalid password'
              }
              label="New Password"
              value={infoNewPassword}
              onChange={(e) => {
                setInfoNewPassword(e.target.value)
                if (/^[A-Za-z0-9]{8,16}$/.test(e.target.value)) {
                  setNewPasswordValid(true)
                } else if (e.target.value === '' || !e.target.value) {
                  setNewPasswordValid(true)
                } else {
                  setNewPasswordValid(false)
                }
                setPasswordSame(
                  e.target.value === infoNewPasswordComfirm ||
                    ((infoNewPasswordComfirm === '' ||
                      !infoNewPasswordComfirm) &&
                      (e.target.value === '' || !e.target.value))
                )
              }}
              type="password"
            ></TextField>
            <TextField
              fullWidth
              error={!passwordSame}
              helperText="repeat the new password"
              label="New Password Comfirm"
              value={infoNewPasswordComfirm}
              onChange={(e) => {
                setInfoNewPasswordComfirm(e.target.value)
                setPasswordSame(
                  e.target.value === infoNewPassword ||
                    ((infoNewPassword === '' || !infoNewPassword) &&
                      (e.target.value === '' || !e.target.value))
                )
              }}
              type="password"
            ></TextField>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={!(emailValid && newPasswordValid && passwordSame)}
              onClick={handleInfoChange}
            >
              Submit
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Dialog
        open={notificationDialogOpen}
        onClose={() => {
          setNotificationDialogOpen(false)
        }}
      >
        <Box style={{ minWidth: '20rem' }}>
          <DialogTitle> Notifications </DialogTitle>
          {friendToAddList.length === 0 && groupToAddList.length === 0 ? (
            <DialogContent>
              <Typography color="textsecondary" align="center">
                No notification for now{' '}
                <span role="img" aria-label="smile">
                  😀
                </span>
              </Typography>
            </DialogContent>
          ) : (
            <></>
          )}
          <DialogContent>
            {friendToAddList.length !== 0 ? (
              <>
                <DialogContentText>New Friend Requests</DialogContentText>
                <Box minWidth="20rem">
                  <List>
                    {friendToAddList.map((name) => (
                      <NotificationListItem
                        name={name}
                        isGroup={false}
                        friendName={''}
                        refuse={refuseAddFriendRequest}
                        accept={handleAddFriendRequest}
                        key={name}
                      />
                    ))}
                  </List>
                </Box>
              </>
            ) : (
              <></>
            )}
            {groupToAddList.length !== 0 ? (
              <>
                <DialogContentText>New Group Requests</DialogContentText>
                <Box minWidth="20rem">
                  <List>
                    {groupToAddList.map((note) => (
                      <NotificationListItem
                        name={note.groupName}
                        isGroup={true}
                        friendName={note.friendName}
                        refuse={refuseAddGroupRequest}
                        accept={handleAddGroupRequest}
                        key={note.groupName + '$' + note.friendName}
                      />
                    ))}
                  </List>
                </Box>
              </>
            ) : (
              <></>
            )}
          </DialogContent>
        </Box>
      </Dialog>
    </div>
  )
}
