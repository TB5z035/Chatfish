import React from 'react'
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography,
  Avatar
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'
import { setFocusUser } from '../../actions'

export default function UserListItem(user, setChat) {
  const dispatch = useDispatch()
  const classes = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1)
      }
    },
    inline: {
      display: 'inline-block'
    }
  }))

  return (
    <div>
      <ListItem
        button
        alignItems="flex-start"
        onClick={() => {
          dispatch(setFocusUser(user.user))
          console.log(user.user)
        }}
      >
        <ListItemAvatar>
          <Avatar> {user.user.toString()[0]} </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={user.user}
          secondary={
            <React.Fragment>
              <Typography
                component="div"
                variant="body2"
                className={classes.inline}
                noWrap
              >
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                  noWrap
                >
                  {user.time ? user.time : 'time'} -
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  color="textSecondary"
                  noWrap
                >
                  {user.recent ? user.recent : 'recent messages blah blah blah'}
                </Typography>
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
    </div>
  )
}
