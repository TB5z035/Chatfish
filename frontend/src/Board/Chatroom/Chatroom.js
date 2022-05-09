import React, { useCallback, useEffect, useRef, useState } from 'react'
import './Chatroom.css'
import {
  Avatar,
  Box,
  Divider,
  Fade,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  makeStyles,
  Paper,
  TextField,
  CircularProgress,
  MenuItem
} from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Message from './Message'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, deleteFriend, deleteGroup, recallMessage } from '../../actions'
import Cookies from 'js-cookie'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import { postAddGroup } from '../../fetch/friend/addGroup'
import { postDeleteFriend } from '../../fetch/friend/deleteFriend'
import { postLeaveGroup } from '../../fetch/friend/leaveGroup'
import { useSnackbar } from 'notistack'
import md5 from 'crypto-js/md5'
import images from './Images'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import { fetchGroupMember } from '../../fetch/message/fetchGroupMember'
import { postUploadMessage } from '../../fetch/message/uploadMessage'
import { postRecallMessage } from '../../fetch/message/recallMessage'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    maxWidth: '75vw',
    height: '100%',
    maxHeight: '85vh',
    zIndex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: theme.spacing(0.5),
    margin: theme.spacing(1),
    background: theme.palette.chatboxBackground
  },
  titleBox: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    maxWidth: '100%',
    margin: theme.spacing(0.5)
  },
  nameBox: {
    display: 'flex',
    flexGrow: 10,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontSize: '250%',
    fontFamily: 'Goudy Old Style',
    fontWeight: 'bolder',
    maxWidth: '100%',
    textAlign: 'left'
  },
  chatBox: {
    display: 'flex',
    flexGrow: 10,
    // minHeight: 100,
    // maxHeight: 400,
    height: '70%',
    margin: theme.spacing(0.5),
    background: theme.palette.background.default
  },
  sendBox: {
    display: 'flex',
    flexGrow: 1,
    maxHeight: '10vh',
    margin: theme.spacing(0.5),
    padding: theme.spacing(1),
    background: theme.palette.background.default
  },
  inputBox: {
    outlineStyle: 'none',
    border: '1px solid #ccc',
    borderRadius: '10px'
  },
  textList: {
    overflow: 'hidden',
    scrollBehavior: 'smooth',
    // marginRight: '3px',
    '&:hover': {
      overflow: 'overlay'
      // marginRight: '1px',
    },
    width: '100%',
    height: '100%',
    '&::-webkit-scrollbar-track': {
      padding: '2px',
      backgroundColor: '#e8e8e8'
    },
    '&::-webkit-scrollbar': {
      width: '10px'
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      // box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      backgroundColor: '#dddddd'
    }
  },
  viewStickers: {
    display: 'flex',
    height: '100px',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  imgSticker: {
    width: '80px',
    height: '80px',
    objectFit: 'contain'
  },
  inputText: {
    overflow: 'show',
    scrollBehavior: 'smooth',
    width: '100%',
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
      backgroundColor: '#444444'
    }
  }
}))

export default function Chatroom() {
  // * Style sheet
  const classes = useStyles()
  // const [isShowSticker, setIsShowSticker] = useState(false)
  // * Redux state and reducers
  const dispatch = useDispatch()
  const user = useSelector((state) => state.messages.focusUser)
  const friendList = useSelector((state) => state.messages.messageList)
  const webSocket = useSelector((state) => state.socket)
  const myName = useSelector((state) => state.myName)
  const { enqueueSnackbar } = useSnackbar()
  // * Component references
  const listRef = useRef(null)
  const inputRef = useRef(null)
  // * Local states
  const [text, setText] = useState('')
  const [userInfo, setUserInfo] = useState({ user: null, message_list: [] })
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false)
  const [selectState, setSelectState] = React.useState({})
  const [groupMemberDialogOpen, setGroupMemberDialogOpen] = useState(false)
  const [groupMember, setGroupMember] = useState([])
  const [uploading, setUploading] = useState(false)
  const [anchorMimiPanel, setAnchorMimiPanel] = useState(null)
  // const ossClient = useSelector((state) => state.ossClient)

  // * Called when a message is meant to be sent
  // ?? Unconditionally add message to global state
  const handleDelete = useCallback(async () => {
    if (user.isGroup === 0) {
      if (await postDeleteFriend(myName.username, userInfo.user)) {
        dispatch(deleteFriend(user.user))
        setUserInfo({ user: null, message_list: [] })
        enqueueSnackbar('Delete friend: ' + user.userInfo.nickname, {
          variant: 'success'
        })
      }
    } else {
      if (await postLeaveGroup(myName.username, user.user)) {
        dispatch(deleteGroup(user.user))
        enqueueSnackbar('Leave group: ' + user.userInfo.nickname, {
          variant: 'success'
        })
      }
    }
  }, [dispatch, myName, user, enqueueSnackbar, userInfo])

  const handleFetchGroupMember = useCallback(async () => {
    if (userInfo.isGroup === 1) {
      fetchGroupMember(userInfo.user, myName.username).then((res) =>
        res
          .json()
          .catch((error) => console.error('Error:', error))
          .then((data) => {
            if (
              data != null &&
              Object.prototype.hasOwnProperty.call(data, 'state') &&
              data['state'] === 200
            ) {
              setGroupMember(data['group_member'])
              setGroupMemberDialogOpen(true)
            }
          })
      )
    }
  }, [myName, userInfo])

  const handleSendEmoji = useCallback(
    async (id) => {
      setAnchorMimiPanel(null)

      let userName = Cookies.get('username')
      if (userName == null) {
        userName = 'Unknown'
      }

      if (webSocket !== null) {
        const params = {
          content: id,
          userName: userName,
          friend_name: user.user,
          is_group: userInfo.isGroup,
          mtype: 'emoji'
        }
        postUploadMessage(params).then((res) =>
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
                  addMessage(id, userName, user.user, userInfo.isGroup, 'emoji', myName, data['id'])
                )
              }
            })
        )
      }
    },
    [dispatch, user, webSocket, userInfo.isGroup, myName]
  )

  const handleSendPhoto = useCallback(
    async (e) => {
      const file = e.target.files[0]
      console.log(file)
      if (file !== undefined) {
        if (file.size > 20971520) {
          enqueueSnackbar("Can't send file larger than 20M", {
            variant: 'error'
          })
          return
        }
        setUploading(true)
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = async function (e) {
          const res = e.target.result
          try {
            const OSS = require('ali-oss')
            const client = new OSS({
              region: '*',
              accessKeyId: '*',
              accessKeySecret: '*',
              bucket: '*'
            })
            const result = await client.put(
              'ChatFish/image/' + new Date().getTime() + '/' + file.name,
              Buffer.from(res)
            )
            let userName = Cookies.get('username')
            if (userName == null) {
              userName = 'Unknown'
            }
            setUploading(false)

            if (webSocket !== null) {
              const params = {
                content: result.url,
                userName: userName,
                friend_name: user.user,
                is_group: userInfo.isGroup,
                mtype: 'media'
              }
              postUploadMessage(params).then((res) =>
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
                        addMessage(
                          result.url,
                          userName,
                          user.user,
                          userInfo.isGroup,
                          'media',
                          myName,
                          data['id']
                        )
                      )
                    }
                  })
              )
            }
          } catch (e) {
            console.log(e)
          }
        }
      }
    },
    [dispatch, user, webSocket, userInfo.isGroup, myName, enqueueSnackbar]
  )

  const handleSend = useCallback(() => {
    if (text !== '') {
      let userName = Cookies.get('username')
      if (userName == null) {
        userName = 'Unknown'
      }

      if (webSocket !== null) {
        const params = {
          content: text,
          userName: userName,
          friend_name: user.user,
          is_group: userInfo.isGroup,
          mtype: 'normal'
        }
        postUploadMessage(params).then((res) =>
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
                  addMessage(
                    text,
                    userName,
                    user.user,
                    userInfo.isGroup,
                    'normal',
                    myName,
                    data['id']
                  )
                )
              }
            })
        )
      }
    }
    setText('')
  }, [text, dispatch, user, webSocket, userInfo.isGroup, myName])

  // * Called when inviting someone else to current group
  const handleCreateGroup = useCallback(async () => {
    setCreateGroupDialogOpen(false)

    const friendList = []
    Object.getOwnPropertyNames(selectState).forEach(function (key) {
      if (selectState[key]) {
        friendList.push(key)
      }
    })
    setSelectState({})
    await postAddGroup(1, myName.username, friendList, user.user)
  }, [selectState, user, myName])

  const handleChange = (event) => {
    setSelectState({
      ...selectState,
      [event.target.name]: event.target.checked
    })
  }

  // * Called when enterkey is pressed in input box
  const onKeyPressSend = useCallback(
    async (e) => {
      if (e.key === 'Enter') {
        inputRef.current.blur()
        handleSend()
      }
    },
    [handleSend]
  )

  useEffect(() => {
    if (user === null) {
      setUserInfo({
        user: null,
        message_list: [],
        isGroup: 0,
        userInfo: { username: '', nickname: '', email: '' }
      })
    }
    const len = friendList.length
    for (let j = 0; j < len; j++) {
      if (
        user !== null &&
        friendList[j].user === user.user &&
        friendList[j].isGroup === user.isGroup
      ) {
        setUserInfo(friendList[j])
        break
      }
    }
  }, [friendList, user])

  useEffect(() => {
    // dispatch(setFocusUser({ user: userInfo.username, isGroup: userInfo.isGroup }))
    if (listRef.current != null) {
      listRef.current.scrollIntoView(false)
      setTimeout(
        function () {
          inputRef.current.focus()
        },
        userInfo.message_list.length * 50 > 1000
          ? userInfo.message_list.length * 50
          : 1000
      )
    }
  }, [userInfo, userInfo.message_list.length])

  const handleRecallMessage = useCallback(
    async (isGroup, id) => {
      postRecallMessage(
        userInfo.user, isGroup, id)
      dispatch(recallMessage(userInfo.user, isGroup, id))
    }
    , [dispatch, userInfo])

  return userInfo.user ? (
    <>
      <Paper className={classes.root}>
        <Box className={classes.titleBox}>
          <IconButton onClick={handleFetchGroupMember}>
            <Avatar
              src={
                userInfo.isGroup === 1
                  ? null
                  : 'https://www.gravatar.com/avatar/' +
                    md5(userInfo.userInfo.email).toString() +
                    '?d=robohash'
              }
            >
              {userInfo.isGroup === 1 ? userInfo.user[0] : null}
            </Avatar>
          </IconButton>
          <Box className={classes.nameBox}>{userInfo.userInfo.nickname}</Box>
          {userInfo.isGroup === 1 ? (
            // <Grid item>
            <IconButton
              onClick={() => {
                setCreateGroupDialogOpen(true)
              }}
            >
              <AddCircleIcon />
            </IconButton>
          ) : null}
          {/* Remove friends not supported yet */}
          <Box xs={false}>
            <IconButton onClick={handleDelete}>
              <RemoveCircleIcon />
            </IconButton>
          </Box>
        </Box>

        <Paper className={classes.chatBox}>
          <List className={classes.textList}>
            {userInfo.message_list.map((message) => (
              <Message
                message={message}
                isRead={!(userInfo.friend_offline_ids.includes(message.id) ||
                        message.isRead === false)}
                isGroup={userInfo.isGroup}
                key={message.content + message.time + message.from}
                isShow={!userInfo.hidden_ids.includes(message.id)}
                recall={handleRecallMessage}
              />
            ))}
            <div ref={listRef}/>
          </List>
        </Paper>

        <Paper className={classes.sendBox}>
          <Grid container justify="center" alignItems="center" spacing={0}>
            <Grid item xs={5}>
              <TextField
                id="input-text"
                onKeyPress={onKeyPressSend}
                fullWidth
                inputRef={inputRef}
                inputProps={{ className: classes.inputText }}
                rowsMax={5}
                multiline
                onChange={(e) => {
                  setText(e.target.value)
                }}
                value={text}
              />
            </Grid>
            <Grid item xs={false}>
              <IconButton onClick={handleSend}>
                <SendIcon />
              </IconButton>
            </Grid>
            <Grid item xs={false}>
              <input
                style={{ display: 'none' }}
                id="contained-button-file"
                onChange={handleSendPhoto}
                type="file"
              />
              <label htmlFor="contained-button-file">
                <IconButton component="span" disabled={uploading}>
                  <AttachFileIcon />
                </IconButton>
              </label>
            </Grid>
            <Grid item xs={false}>
              {uploading && (
                <CircularProgress size={24} className={classes.fabProgress} />
              )}
            </Grid>
            <Grid item xs={false}>
              <IconButton
                onClick={(e) => {
                  setAnchorMimiPanel(e.currentTarget)
                }}
              >
                <InsertEmoticonIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      </Paper>
      <Dialog
        open={createGroupDialogOpen}
        onClose={() => {
          setCreateGroupDialogOpen(false)
        }}
      >
        <DialogTitle>Invite friends to the group</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Select friends</FormLabel>
            <FormGroup>
              {friendList.map((user) =>
                user.isGroup === 0 ? (
                  <FormControlLabel
                    control={
                      <Checkbox onChange={handleChange} name={user.user} />
                    }
                    label={user.user}
                    key={user.user}
                  />
                ) : null
              )}
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleCreateGroup}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={groupMemberDialogOpen}
        onClose={() => {
          setGroupMemberDialogOpen(false)
        }}
      >
        <DialogTitle>Group Member</DialogTitle>
        <DialogContent>
          <>
            <Divider />
            <List className={classes.listStyles}>
              {groupMember.map((user) => (
                <ListItem button key={user} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      src={
                        'https://www.gravatar.com/avatar/' +
                        md5(user.email).toString() +
                        '?d=robohash'
                      }
                    />
                  </ListItemAvatar>
                  <ListItemText primary={user.nickname} />
                </ListItem>
              ))}
            </List>
          </>
        </DialogContent>
      </Dialog>
      <Menu
        open={Boolean(anchorMimiPanel)}
        onClose={() => {
          setAnchorMimiPanel(null)
        }}
        anchorEl={anchorMimiPanel}
        TransitionComponent={Fade}
      >
        <MenuItem selected={false} disableRipple>
          <div className={classes.viewStickers}>
            <img
              className={classes.imgSticker}
              src={images.mimi1}
              alt="sticker"
              onClick={() => handleSendEmoji('mimi1')}
            />
            <img
              className={classes.imgSticker}
              src={images.mimi2}
              alt="sticker"
              onClick={() => handleSendEmoji('mimi2')}
            />
            <img
              className={classes.imgSticker}
              src={images.mimi3}
              alt="sticker"
              onClick={() => handleSendEmoji('mimi3')}
            />
            <img
              className={classes.imgSticker}
              src={images.mimi4}
              alt="sticker"
              onClick={() => handleSendEmoji('mimi4')}
            />
            <img
              className={classes.imgSticker}
              src={images.mimi5}
              alt="sticker"
              onClick={() => handleSendEmoji('mimi5')}
            />
            <img
              className={classes.imgSticker}
              src={images.mimi6}
              alt="sticker"
              onClick={() => handleSendEmoji('mimi6')}
            />
            <img
              className={classes.imgSticker}
              src={images.mimi7}
              alt="sticker"
              onClick={() => handleSendEmoji('mimi7')}
            />
            <img
              className={classes.imgSticker}
              src={images.mimi8}
              alt="sticker"
              onClick={() => handleSendEmoji('mimi8')}
            />
            <img
              className={classes.imgSticker}
              src={images.mimi9}
              alt="sticker"
              onClick={() => handleSendEmoji('mimi9')}
            />
          </div>
        </MenuItem>
      </Menu>
    </>
  ) : (
    <></>
  )
}
