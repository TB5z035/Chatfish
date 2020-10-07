import React from 'react'
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography,
  Avatar,
} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles'

export default function UserListItem(name, time, recent) {

  const classes = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    inline: {
      display: 'inline-block',
    },
  }))

  return (
    <div>
      <ListItem button alignItems="flex-start">
        <ListItemAvatar>
          <Avatar > {name.toString()[0]} </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={name}
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
                  {time ? time : "time"} -
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  color="textSecondary"
                  noWrap
                >
                  {recent ? recent : "recent messages blah blah blah"}
                </Typography>
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
    </div>
  )
}