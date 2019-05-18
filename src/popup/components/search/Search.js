import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
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
    zIndex: 2,
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
  paper: {
    // ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
});

class Search extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isHovered: false,
      isLoading: false,
      searchResults: [],
      position: 0,
      available: false,
      requested: false,
      theMovieDbId: null,
      selectedMovie: {},
    };

    this.handleHover = this.handleHover.bind(this);
    this.handleDOMContentLoaded = this.handleDOMContentLoaded.bind(this);
    this.handleSearchResult = this.handleSearchResult.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
  }

  componentDidMount () {
    window.addEventListener('DOMContentLoaded', this.handleDOMContentLoaded);
    window.addEventListener('search-result', this.handleSearchResult);
  }

  componentWillUnmount () {
    window.removeEventListener('DOMContentLoaded', this.handleDOMContentLoaded);
    window.removeEventListener('search-result', this.handleSearchResult);
  }

  async handleDOMContentLoaded () {
    this.setState({ isLoading: true });

    await events.queryTab();
  }

  async handleSearchResult ({ detail: searchResults }) {
    console.log(searchResults);

    this.setState({
      searchResults,
      position: 0,
    });

    if (searchResults.length) {
      const selectedMovie = await api.info(searchResults[0].theMovieDbId);

      console.log(selectedMovie);

      this.setState({
        selectedMovie,
      });
    }

    this.setState({
      isLoading: false,
    });
  }

  async handleNextClick () {
    const { position, searchResults } = this.state;
    const nextPosition = position === searchResults.length - 1 ? 0 : position + 1;

    this.setState({
      position: nextPosition,
      isLoading: true,
    });

    const selectedMovie = await api.info(searchResults[nextPosition].theMovieDbId);

    this.setState({
      selectedMovie,
      isLoading: false,
    });
  }

  async handlePreviousClick () {
    const { position, searchResults } = this.state;
    const previousPosition = position === 0 ? searchResults.length - 1 : position - 1;

    this.setState({
      position: previousPosition,
      isLoading: true,
    });

    const selectedMovie = await api.info(searchResults[previousPosition].theMovieDbId);

    this.setState({
      selectedMovie,
      isLoading: false,
    });
  }

  async handleAddClick () {
    const { position, searchResults } = this.state;

    const result = await api.request(searchResults[position].theMovieDbId);

    console.log(result);
  }

  handleHover (isHovered) {
    this.setState({ isHovered });
  }

  render () {
    const { classes, navigate, style } = this.props;
    const { searchResults, selectedMovie, isHovered } = this.state;

    const movie = selectedMovie || {};
    const hasMultipleResults = searchResults.length > 1;

    const progress =
      <div className={classes.progressContainer}>
        <CircularProgress className={classes.progress} />
      </div>;

    const imageStyle = {
      backgroundImage: `url('${imageBaseUrl}${movie.posterPath}')`,
      width: 144,
      height: 216,
      backgroundSize: 'cover',
      backgroundRepeat: 'norepeat',
      backgroundPosition: 'center center',
      transition: 'transform .2s',
    };

    const backgroundStyle = {
      backgroundImage: `url('${imageBaseUrl}${movie.posterPath}')`,
      backgroundSize: 'cover',
      backgroundRepeat: 'norepeat',
      backgroundPosition: 'center center',
      position: 'fixed',
      left: 0,
      right: 0,
      height: 405,
      zIndex: 1,
      display: 'block',
      opacity: 0.2,
      filter: 'blur(3px)',
    };

    const zoom = { transform: 'scale(1.1)' };

    const content =
      <Fragment>
        <div style={backgroundStyle}></div>
        <div className={classes.container}>
          <DialogContent>
            <div className={classes.carousel}>
              {hasMultipleResults ?
                <IconButton style={{ marginRight: 5 }} onClick={this.handlePreviousClick}>
                  <ChevronLeft fontSize="small" />
                </IconButton> : null}

              <Paper
                elevation={8}
                className={classes.paper}
                style={{...imageStyle, ...(!isHovered || zoom)}}
                onMouseEnter={() => this.handleHover(true)}
                onMouseLeave={() => this.handleHover(false)}
              >
              </Paper>

              {hasMultipleResults ?
                <IconButton style={{ marginLeft: 5 }} onClick={this.handleNextClick}>
                  <ChevronRight fontSize="small" />
                </IconButton> : null}
            </div>
            <div className={classes.title}>
              {movie.title} ({getYearFromUtcString(movie.releaseDate)})
            </div>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined"
              color="secondary"
              onClick={() => navigate('options')}
              >
              Options
            </Button>
            <Button variant={movie.available || movie.requested ? "text" : "outlined"}
              disabled={movie.available || movie.requested}
              color="primary"
              autoFocus
              onClick={this.handleAddClick}
            >
              {movie.available ? 'Already Owned' : movie.requested ? 'Already Requested' : 'Add'}
            </Button>
          </DialogActions>
        </div>
      </Fragment>;

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