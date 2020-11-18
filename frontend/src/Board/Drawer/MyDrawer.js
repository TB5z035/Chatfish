import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import { setDrawerOpen } from '../../actions'
import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import SecondaryList from './SecondaryList'
import FriendList from './FriendList'
const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(9),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9)
    }
  }
}))

export default function MyDrawer() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const open = useSelector((state) => state.drawerOpen)

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
      }}
      open={open}
    >
      {/* Drawer Title */}
      <div className={classes.toolbarIcon}>
        <Typography>Chats</Typography>
        <IconButton
          onClick={() => {
            dispatch(setDrawerOpen(false))
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </div>

      {/* Friends list */}
      <FriendList />

      {/* Additional options in Drawer */}
      <SecondaryList />
    </Drawer>
  )
}
