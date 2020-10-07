import React from 'react'
import AcUnitIcon from '@material-ui/icons/AcUnit'
import UserListItem from './Item/UserListItem'
import {
  Avatar,
  ListItem,
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
  <div>{[1, 2, 4, 5].map((name) => UserListItem(name))}</div>
)

export function useSecondaryListItems() {
  const classes = useStyles()
  return (
    <div>
      <ListSubheader inset component="li">
        Tools
      </ListSubheader>
      <ListItem button>
        <ListItemIcon>
          <Avatar className={classes.pink}>
            <AcUnitIcon />
          </Avatar>
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItem>
    </div>
  )
}
