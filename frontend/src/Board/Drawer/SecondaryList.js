import React, { useCallback, useState } from 'react'
import SettingsIcon from '@material-ui/icons/Settings'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
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
import { addGroup } from '../../actions'
import { useSnackbar } from 'notistack'
import { postAddFriend } from '../../fetch/friend/addFriend'
import { postAddGroup } from '../../fetch/friend/addGroup'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  pink: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: theme.palette.random
  },
  green: {
    color: '#fff',
    backgroundColor: green[500]
  }
}))

export default function SecondaryList() {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  const dispatch = useDispatch()
  const myName = useSelector((state) => state.myName)
  const friendList = useSelector((state) => state.messages)

  const [addFriendDialogOpen, setAddFriendDialogOpen] = useState(false)
  const [friendToAdd, setFriendToAdd] = useState('')
  const [groupName, setGroupName] = useState('')
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false)
  const [selectState, setSelectState] = React.useState({})

  const handleAddFriend = useCallback(async () => {
    setAddFriendDialogOpen(false)
    const username = Cookies.get('username')

    if (
      friendList
        .map((user) => {
          if (user.isGroup === 0) { return user.user } else return ''
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
    const friendList = []
    Object.getOwnPropertyNames(selectState).forEach(function (key) {
      if (selectState[key]) {
        friendList.push(key)
      }
    })
    setSelectState({})
    postAddGroup(0, myName, friendList, groupName)
      .then((res) =>
        res
          .json()
          .catch((error) => console.error('Error:', error))
          .then((data) => {
            if (
              data != null &&
                  Object.prototype.hasOwnProperty.call(data, 'state') &&
                  data['state'] === 200
            ) {
              dispatch(addGroup(groupName))
              enqueueSnackbar('Successful create group: ' + groupName, {
                variant: 'success'
              })
            } else {
              enqueueSnackbar('The name of group already exists: ' + groupName, {
                variant: 'error'
              })
            }
          })
      )
  }, [selectState, groupName, myName, dispatch, enqueueSnackbar])

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
      </List>
    </>
  )
}
