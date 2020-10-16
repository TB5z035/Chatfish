import React from 'react'
import SettingsIcon from '@material-ui/icons/Settings';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import UserListItem from './UserListItem'
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { green, pink } from '@material-ui/core/colors'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  pink: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: pink[500]
  },
  green: {
    color: '#fff',
    backgroundColor: green[500]
  }
}))

export const userList = (
  <div>
    {[1, 2, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6].map((name) =>
      UserListItem(name)
    )}
  </div>
)

export function useSecondaryListItems() {
  const classes = useStyles()
  return (
    <>
      <ListSubheader inset component="li">
        Tools
      </ListSubheader>
      <ListItem button>
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
    </>
  )
}
