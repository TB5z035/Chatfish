import React, { useCallback, useState } from 'react'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import ForumIcon from '@material-ui/icons/Forum'
import {
  List,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { green, pink, yellow } from '@material-ui/core/colors'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Cookies from 'js-cookie'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { useDispatch, useSelector } from 'react-redux'
import { addGroup, addMessage } from '../../actions'
import { useSnackbar } from 'notistack'
import { postAddFriend } from '../../fetch/friend/addFriend'
import { postAddGroup } from '../../fetch/friend/addGroup'
import { postUploadMessage } from '../../fetch/message/uploadMessage'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  pink: {
    color: '#fff',
    backgroundColor: pink[600]
  },
  yellow: {
    color: '#fff',
    backgroundColor: yellow[800]
  },
  green: {
    color: '#fff',
    backgroundColor: green[600]
  }
}))

export default function SecondaryList() {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const webSocket = useSelector((state) => state.socket)
  const dispatch = useDispatch()
  const myName = useSelector((state) => state.myName)
  const friendList = useSelector((state) => state.messages.messageList)

  const [addFriendDialogOpen, setAddFriendDialogOpen] = useState(false)
  const [friendToAdd, setFriendToAdd] = useState('')
  const [groupName, setGroupName] = useState('')
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false)
  const [selectState, setSelectState] = React.useState({})
  const [message, setMessage] = useState('')
  const [massSendDialogOpen, setMassSendDialogOpen] = useState(false)
  const handleAddFriend = useCallback(async () => {
    setAddFriendDialogOpen(false)
    const username = Cookies.get('username')

    if (
      friendList
        .map((user) => {
          if (user.isGroup === 0) {
            return user.user
          } else return ''
        })
        .includes(friendToAdd)
    ) {
      enqueueSnackbar('You are already friend with ' + friendToAdd, {
        variant: 'warning'
      })
    } else if (username === friendToAdd) {
      enqueueSnackbar('You cannot add yourself as a friend', {
        variant: 'warning'
      })
    } else {
      postAddFriend(username, friendToAdd).then()
    }
  }, [friendToAdd, enqueueSnackbar, friendList])

  const onKeyPressAddFriend = useCallback(
    async (e) => {
      if (e.key === 'Enter') {
        await handleAddFriend()
      }
    },
    [handleAddFriend]
  )

  const handleCreateGroup = useCallback(async () => {
    setCreateGroupDialogOpen(false)
    const friends = []
    Object.getOwnPropertyNames(selectState).forEach(function (key) {
      if (selectState[key]) {
        friends.push(key)
      }
    })
    setSelectState({})
    const trueName = groupName === '' ? myName.username + '创建的群聊' : groupName
    setGroupName('')
    postAddGroup(0, myName.username, friends, trueName).then((res) =>
      res
        .json()
        .catch((error) => console.error('Error:', error))
        .then((data) => {
          if (
            data != null &&
                  Object.prototype.hasOwnProperty.call(data, 'state') &&
                  data['state'] === 200
          ) {
            dispatch(addGroup(data['userInfo']['username'], data['userInfo']))
            enqueueSnackbar('Successful create group: ' + trueName, {
              variant: 'success'
            })
          } else {
            enqueueSnackbar(
              'Fail to create group: ' + trueName,
              {
                variant: 'error'
              }
            )
          }
        })
    )
  }, [selectState, groupName, myName, dispatch, enqueueSnackbar])

  const handleMassSend = useCallback(async () => {
    setMassSendDialogOpen(false)
    let userName = Cookies.get('username')
    if (userName == null) {
      userName = 'Unknown'
    }
    Object.getOwnPropertyNames(selectState).forEach(function (key) {
      if (selectState[key]) {
        if (message !== '') {
          if (webSocket !== null) {
            const params = {
              content: message,
              userName: userName,
              friend_name: key,
              is_group: 0,
              mtype: 'normal',
              userInfo: myName
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
                    dispatch(addMessage(message, userName, key, 0, 'normal', myName, data['id']))
                  }
                })
            )
          }
        }
      }
    })
    setMessage('')
    setSelectState({})
  }, [message, webSocket, dispatch, selectState, myName])

  const handleChange = (event) => {
    setSelectState({
      ...selectState,
      [event.target.name]: event.target.checked
    })
  }

  return (
    <>
      {/* <ListSubheader inset component="li">
        Tools
      </ListSubheader> */}
      <Divider />
      <List>
        <ListItem
          button
          onClick={() => {
            setAddFriendDialogOpen(true)
          }}
        >
          <ListItemAvatar>
            <Avatar className={classes.green}>
              <PersonAddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Add Friends" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            setCreateGroupDialogOpen(true)
          }}
        >
          <ListItemAvatar>
            <Avatar className={classes.pink}>
              <GroupAddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Create Groups" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            setMassSendDialogOpen(true)
          }}
        >
          <ListItemAvatar>
            <Avatar className={classes.yellow}>
              <ForumIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Mass Send" />
        </ListItem>
        {/* <ListItem button>
          <ListItemAvatar>
            <Avatar className={classes.pink}>
              <SettingsIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Settings" />
        </ListItem> */}
        <Dialog
          open={addFriendDialogOpen}
          onClose={() => {
            setAddFriendDialogOpen(false)
          }}
        >
          <DialogTitle> Send Friend Request</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the username of a user.
            </DialogContentText>
            <TextField
              label="Username"
              autoFocus
              fullWidth
              onKeyPress={onKeyPressAddFriend}
              onChange={(e) => {
                setFriendToAdd(e.target.value)
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleAddFriend}>
              Send
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={createGroupDialogOpen}
          onClose={() => {
            setCreateGroupDialogOpen(false)
          }}
        >
          <DialogTitle> Create New Group</DialogTitle>
          <DialogContent>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">
                Invite your friends into group:
              </FormLabel>
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
            <TextField
              label="Group Name"
              autoFocus
              fullWidth
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value)
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleCreateGroup}>
              Create
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={massSendDialogOpen}
          onClose={() => {
            setMassSendDialogOpen(false)
          }}
        >
          <DialogTitle> Mass Sending</DialogTitle>
          <DialogContent>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Select friends:</FormLabel>
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
            <TextField
              label="Message"
              autoFocus
              fullWidth
              onChange={(e) => {
                setMessage(e.target.value)
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleMassSend}>
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </List>
    </>
  )
}
