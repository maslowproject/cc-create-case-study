import React from 'react';
import { Route } from 'react-router-dom';
import GoogleMap from './GoogleMap';
import VectorMap from './VectorMap';
import SimpleMap from './SimpleMap';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    height: '600px'
  }
});

const MapsPage = ({ classes }) => (
  <div className="content">
    <Paper className={classes.root} elevation={1}>
      <SimpleMap className="" />
    </Paper>
  </div>
);

export default withStyles(styles)(MapsPage);