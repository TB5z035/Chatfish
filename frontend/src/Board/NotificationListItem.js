import React from 'react'
import { ListItem, Box, IconButton } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import PropTypes from 'prop-types'
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
            <IconButton onClick={() => {
              this.props.accept(this.props.notification)
              this.props.refuse(this.props.notification)
            }}>
              <CheckIcon></CheckIcon>
            </IconButton>
            <IconButton onClick={() => { this.props.refuse(this.props.notification) }}>
              <CloseIcon></CloseIcon>
            </IconButton>
          </Box>
        </Box>
      </ListItem>
    )
  }
}

NotificationListItem.propTypes = {
  notification: PropTypes.string,
  refuse: PropTypes.func,
  accept: PropTypes.func
}
