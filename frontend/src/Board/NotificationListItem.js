import React from 'react'
import { ListItem, Box, IconButton, Avatar } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import PropTypes from 'prop-types'
import './NotificationListItem.css'

export default class NotificationListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: props.name
    }
  }

  render() {
    return (
      <>
        <ListItem className={'root'} disableGutters>
          <Box className={'listBox'}>
            <Box marginRight={2}>
              <Avatar>
                {this.props.name ? this.props.name[0] : undefined}
              </Avatar>
            </Box>
            <Box flexGrow={1}>
              <Typography variant="h6">{this.state.name}</Typography>
            </Box>
            <IconButton
              onClick={() => {
                this.props.accept(this.props.name)
                this.props.refuse(this.props.name)
              }}
            >
              <CheckIcon/>
            </IconButton>
            <IconButton
              onClick={() => {
                this.props.refuse(this.props.name)
              }}
            >
              <CloseIcon/>
            </IconButton>
          </Box>
        </ListItem>
      </>
    )
  }
}

NotificationListItem.propTypes = {
  name: PropTypes.string,
  refuse: PropTypes.func,
  accept: PropTypes.func
}
