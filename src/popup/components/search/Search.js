import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { getYearFromUtcString, imageBaseUrl } from '../../lib/utils';
import events from '../../services/events-service';
import api from '../../services/api-service';

const styles = (theme) => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  poster: {
    width: 160,
  },
  carousel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.unit,
  },
  title: {
    fontSize: '1rem',
    color: theme.typography.h6.color,
    fontWeight: theme.typography.fontWeightMedium,
    fontFamily: theme.typography.fontFamily,
  },
});

class Search extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isLoading: false,
      searchResults: [],
      position: 0,
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
      searchResults: detail,
      position: 0,
    });

    console.log(detail);
  }

  handleNextClick () {
    const { position, searchResults } = this.state;

    this.setState({
      position: position === searchResults.length - 1 ? 0 : position + 1,
    });
  }

  handlePreviousClick () {
    const { position, searchResults } = this.state;

    this.setState({
      position: position === 0 ? searchResults.length - 1 : position - 1,
    });
  }

  async handleAddClick () {
    const { position, searchResults } = this.state;

    const result = await api.request(searchResults[position].theMovieDbId);

    console.log(result);
  }

  render () {
    const { classes, navigate, style } = this.props;
    const { position, searchResults } = this.state;

    const movie = searchResults[position] || {};
    const hasMultipleResults = searchResults.length > 1;

    const progress =
      <div className={classes.progressContainer}>
        <CircularProgress className={classes.progress} />
      </div>;

    const content =
      <div className={classes.container} style={style}>
        <DialogContent>
          <div className={classes.carousel}>
            {hasMultipleResults ?
              <IconButton style={{ marginRight: 5 }} onClick={this.handlePreviousClick.bind(this)}>
                <ChevronLeft fontSize="small" />
              </IconButton> : null}
            <img src={imageBaseUrl + movie.posterPath} className={classes.poster} />
            {hasMultipleResults ?
              <IconButton style={{ marginLeft: 5 }} onClick={this.handleNextClick.bind(this)}>
                <ChevronRight fontSize="small" />
              </IconButton> : null}
          </div>
          <div className={classes.title}>
            {movie.title} ({getYearFromUtcString(movie.releaseDate)})
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={() => navigate('options')}
            >
            Options
          </Button>
          <Button
            disabled={movie.available || movie.requested}
            color="primary"
            autoFocus
            onClick={this.handleAddClick.bind(this)}
          >
            {movie.available ? 'Already Owned' : movie.requested ? 'Already Requested' : 'Add'}
          </Button>
        </DialogActions>
      </div>

    return (
      <Fragment>
        {this.state.isLoading
          ? progress
          : searchResults.length
            ? content
            : null
        }
      </Fragment>
    );
  }
}

export default withStyles(styles)(Search);