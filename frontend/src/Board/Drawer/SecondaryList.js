import React, { useCallback, useState } from 'react'
import SettingsIcon from '@material-ui/icons/Settings'
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
import { green, pink } from '@material-ui/core/colors'
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
import yellow from '@material-ui/core/colors/yellow'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  pink: {
    color: '#fff',
    backgroundColor: pink[500]
  },
  yellow: {
    color: '#fff',
    backgroundColor: yellow[500]
  },
  green: {
    color: '#fff',
    backgroundColor: green[500]
  }
}))

export default function SecondaryList() {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const webSocket = useSelector((state) => state.socket)
  const dispatch = useDispatch()
  const myName = useSelector((state) => state.myName)
  const friendList = useSelector((state) => state.messages)

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
    if (
      friendList
        .map((user) => {
          return user.isGroup === 1 ? user.user : null
        })
        .includes(groupName)
    ) {
      enqueueSnackbar('You are already in group :' + groupName, {
        variant: 'warning'
      })
    } else {
      postAddGroup(0, myName.username, friends, groupName).then((res) =>
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
              enqueueSnackbar('Successful create group: ' + groupName, {
                variant: 'success'
              })
            } else {
              enqueueSnackbar(
                'The name of group already exists: ' + groupName,
                {
                  variant: 'error'
                }
              )
            }
          })
      )
    }
  }, [selectState, groupName, myName, friendList, dispatch, enqueueSnackbar])

  const handleMassSend = useCallback(async () => {
    setMassSendDialogOpen(false)
    let userName = Cookies.get('username')
    if (userName == null) {
      userName = 'Unknown'
    }
    Object.getOwnPropertyNames(selectState).forEach(function (key) {
      if (selectState[key]) {
        if (message !== '') {
          dispatch(addMessage(message, userName, key, 0, 'normal'))

          if (webSocket !== null) {
            const params = {
              type: 'MESSAGE_UPLOAD',
              content: message,
              userName: userName,
              friend_name: key,
              is_group: 0,
              mtype: 'normal',
              userInfo: myName
            }
            webSocket.send(JSON.stringify(params))
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
            <Avatar className={classes.green}>
              <GroupAddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Add Groups" />
        </ListItem>
        <ListItem button
          onClick={() => {
            setMassSendDialogOpen(true)
          }}>
          <ListItemAvatar>
            <Avatar className={classes.yellow}>
              <ForumIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="MassSend" />
        </ListItem>
        <ListItem button>
          <ListItemAvatar>
            <Avatar className={classes.pink}>
              <SettingsIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Settings" />
        </ListItem>
        <Dialog
          open={addFriendDialogOpen}
          onClose={() => {
            setAddFriendDialogOpen(false)
          }}
        >
          <DialogTitle> Add new friend</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter username of new friend</DialogContentText>
            <TextField
              label="username"
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
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={createGroupDialogOpen}
          onClose={() => {
            setCreateGroupDialogOpen(false)
          }}
        >
          <DialogTitle> Creat new group</DialogTitle>
          <DialogContent>
            <TextField
              label="Group Name"
              autoFocus
              fullWidth
              onChange={(e) => {
                setGroupName(e.target.value)
              }}
            />
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
              Creat
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={massSendDialogOpen}
          onClose={() => {
            setMassSendDialogOpen(false)
          }}
        >
          <DialogTitle> Mass sending</DialogTitle>
          <DialogContent>
            <TextField
              label="Message"
              autoFocus
              fullWidth
              onChange={(e) => {
                setMessage(e.target.value)
              }}
            />
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
            <Button color="primary" onClick={handleMassSend}>
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </List>
    </>
  )
}
