import React, { useCallback, useState } from 'react'
import SettingsIcon from '@material-ui/icons/Settings'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import UserListItem from './UserListItem'
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Typography
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

// export const userList = (
//   <div>
//     {[1, 2, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6].map((name) =>
//       UserListItem(name)
//     )}
//   </div>
// )

export function userList(users, setChat) {
  return <>{users.map((user) => UserListItem(user, setChat))}</>
}

export function useSecondaryListItems() {
  const classes = useStyles()
  const [addFriendDialogOpen, setAddFriendDialogOpen] = useState(false)
  const [friendToAdd, setFriendToAdd] = useState('')
  const myName = useSelector((state) => state.myName)
  const [groupName, setGroupName] = useState('')
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false)
  const friendList = useSelector((state) => state.messages)
  const [selectState, setSelectState] = React.useState({})
  const dispatch = useDispatch()
  const handleAddFriend = useCallback(async () => {
    setAddFriendDialogOpen(false)
    const username = Cookies.get('username')
    const params = {
      username: username,
      friend_name: friendToAdd
    }

    fetch('/?action=add_friend', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then()
  }, [friendToAdd])

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

    const params = {
      username: myName,
      groupName_name: groupName,
      friend_list: friendList
    }
    fetch('/?action=add_group', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then()
    dispatch(addGroup(groupName))
    setSelectState({})
  }, [selectState, groupName, myName, dispatch])

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
    </>
  )
}
