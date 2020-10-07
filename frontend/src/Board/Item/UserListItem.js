import React from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Typography,
  Card,
  Box
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssignmentIcon from '@material-ui/icons/Assignment';


export default function UserListItem() {

  const classes = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: '36ch',
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
  }));

  return (
    <div>
      <Card rasied>
        <ListItem button alignItems="flex-start">
          <ListItemAvatar>

          </ListItemAvatar>
          <ListItemText
            primary={"Brunch this weekend?"}
            secondary={
              <Box>
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    Ali Connors
                </Typography>
                  {" — I'll be in your neighborhood doing errands this…"}
                </React.Fragment>
              </Box>
            }
          />
        </ListItem>
      </Card>
    </div>
  )
}


// export default UserListItem;