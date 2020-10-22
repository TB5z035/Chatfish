import React, { useCallback, useState } from 'react'
import SettingsIcon from '@material-ui/icons/Settings'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import UserListItem from './UserListItem'
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader
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

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  pink: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: theme.palette.random,
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
    })
  }, [friendToAdd])

  const onKeyPressAddFriend = useCallback(
    async (e) => {
      if (e.key === 'Enter') {
        await handleAddFriend()
      }
    },
    [handleAddFriend]
  )

  return (
    <>
      <ListSubheader inset component="li">
        Tools
      </ListSubheader>
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
    </>
  )
}
