import React, { useState } from 'react'
import { ListItem, Box, Paper, Avatar, ButtonBase, IconButton } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
export default class NotificationListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      notification: props.notification
    }
  }

  render() {
    return (
      <ListItem className={'root'} disableGutters>
        <Box flexDirection={this.state.direction} className={'listBox'}>

          <Box className={'paperBox'}>
            <Typography variant="h6" gutterBottom>
              {this.state.notification}
            </Typography>
            <IconButton>
              <CheckIcon></CheckIcon>
            </IconButton>
            <IconButton>
              <CloseIcon></CloseIcon>
            </IconButton>
          </Box>
        </Box>
      </ListItem>
    )
  }
}
