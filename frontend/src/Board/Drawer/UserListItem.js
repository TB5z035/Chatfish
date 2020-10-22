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

export default function UserListItem(user) {
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
    <ListItem
      button
      key={user.user}
      alignItems="flex-start"
      onClick={() => {
        dispatch(setFocusUser(user.user))
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
              {/* <Typography */}
              {/*  component="span" */}
              {/*  variant="body2" */}
              {/*  color="textPrimary" */}
              {/*  noWrap */}
              {/* > */}
              {/*  {user.message_list.length > 0 && user.message_list.slice(-1)[0].time */}
              {/*    ? new Date( */}
              {/*      user.message_list.slice(-1)[0].time */}
              {/*    ).toLocaleTimeString() + ' - ' */}
              {/*    : undefined } */}
              {/* </Typography> */}
              <Typography
                component="span"
                variant="body2"
                color="textSecondary"
                noWrap
              >
                {user.message_list.length > 0 && user.message_list.slice(-1)[0].content
                  ? user.message_list.slice(-1)[0].content
                  : undefined}
                {/* {user.recent ? user.recent : 'recent messages blah blah blah'} */}
              </Typography>
            </Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  )
}
