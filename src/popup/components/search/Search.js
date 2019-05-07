import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { getYearFromUtcString, imageBaseUrl } from '../../lib/utils';
import events from '../../services/events-service';
import api from '../../services/api-service';

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit * 2,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  contentContainer: {
    margin: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
});

class Search extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isLoading: false,
      posterPath: '',
      title: '',
      releaseDate: '',
      available: false,
      requested: false,
      theMovieDbId: null,
    };
  }

  componentDidMount () {
    window.addEventListener('DOMContentLoaded', this.handleDOMContentLoaded.bind(this));
    window.addEventListener('search-result', this.handleSearchResult.bind(this));
  }

  componentWillUnmount () {
    window.removeEventListener('DOMContentLoaded', this.handleDOMContentLoaded.bind(this));
    window.removeEventListener('search-result', this.handleSearchResult.bind(this));
  }

  async handleDOMContentLoaded () {
    this.setState({ isLoading: true });

    await events.queryTab();
  }

  handleSearchResult ({ detail }) {
    this.setState({
      isLoading: false,
      posterPath: imageBaseUrl + detail[0].posterPath,
      title: detail[0].title,
      releaseDate: detail[0].releaseDate,
      available: detail[0].available,
      requested: detail[0].requested,
      theMovieDbId: detail[0].theMovieDbId,
    });
  }

  async handleAddClick () {
    const result = await api.request(this.state.theMovieDbId);

    console.log(result);
  }

  render () {
    const { classes, navigate, style } = this.props;

    const progress =
      <div className={classes.progressContainer}>
        <CircularProgress className={classes.progress} />
      </div>;

    const content =
      <div className={classes.contentContainer} style={style}>
        <div>
          <img src={this.state.posterPath} />
        </div>
        <Typography variant="h6" gutterBottom>
          {this.state.title} ({getYearFromUtcString(this.state.releaseDate)})
        </Typography>
        <DialogActions>
          <Button
            color="secondary"
            onClick={() => navigate('options')}
          >
            Options
          </Button>
          <Button
            color="primary"
            autoFocus
            onClick={this.handleAddClick.bind(this)}
          >
            Add
          </Button>
        </DialogActions>
      </div>

    return (
      <Fragment>
        {this.state.isLoading
          ? progress
          : content
        }
      </Fragment>
    );
  }
}

export default withStyles(styles)(Search);