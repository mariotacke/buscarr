import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = (theme) => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

class Search extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isLoading: false,
    };
  }

  render () {
    const { classes } = this.props;

    const progress =
      <div>
        <CircularProgress className={classes.progress} />
      </div>;

    return (
      <div className={classes.container}>
        {this.state.isLoading
          ? progress
          : null
        }
      </div>
    );
  }
}

export default withStyles(styles)(Search);