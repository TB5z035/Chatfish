import React from 'react'
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography,
  Avatar,
  Divider
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { setFocusUser } from '../../actions'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  listStyles: {
    width: '100%',
    maxWidth: '36ch',
    maxHeight: '60vh',
    overflow: 'hidden',
    overflowX: 'hidden',
    '&:hover': {
      overflow: 'auto',
      overflowX: 'hidden'
    },
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
      backgroundColor: '#203152'
    }
  },
  inline: {
    display: 'inline-block'
  }
}))

export default function FriendList() {
  const dispatch = useDispatch()
  const classes = useStyles()
  const friendList = useSelector((state) => state.messages)

  return friendList.length === 0 ? null : (
    <>
      <Divider />
      <List className={classes.listStyles}>
        {friendList.map((user) => (
          <ListItem
            button
            key={user.user}
            alignItems="flex-start"
            onClick={() => {
              dispatch(setFocusUser({ user: user.user, isGroup: user.isGroup }))
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
                      {user.message_list.length > 0 &&
                      user.message_list.slice(-1)[0].content
                        ? user.message_list.slice(-1)[0].content
                        : undefined}
                      {/* {user.recent ? user.recent : 'recent messages blah blah blah'} */}
                    </Typography>
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
      </List>
    </>
  )
}
