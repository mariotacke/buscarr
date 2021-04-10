import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import { theme } from '../../theme';
import api from '../../utils/api';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import green from '@material-ui/core/colors/green';
import { imageBaseUrl } from '../../utils/constants';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { getStoredValueAsync } from '../../utils/storage';
import InvalidOptionsMessage from '../Options/InvalidOptionsMessage';
import { MediaInformation } from '../Content/providers';

interface IOptions {
  hostname: string;
  apiKey: string;
  username: string;
  [key: string]: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: 300,
    height: 400,
  },
  page: {
    display: 'flex',
    height: '100%',
  },
  progress: {
    margin: theme.spacing(2),
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
    marginBottom: theme.spacing(1),
  },
  title: {
    fontSize: '1rem',
    color: theme.typography.h6.color,
    fontWeight: theme.typography.fontWeightMedium,
    fontFamily: theme.typography.fontFamily,
  },
  paper: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  wrapper: {
    position: 'relative',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

type OmbiSearchResult = {
  available: boolean;
  requested: boolean;
  backdropPath: string;
  posterPath: string;
  plexUrl: string;
  title: string;
  theMovieDbId: string;
  releaseDate: string;
}

type PopupState = {
  isAdding: boolean;
  isHovered: Boolean;
  isLoading: boolean;
  searchResults: OmbiSearchResult[];
  position: number;
  theMovieDbId: string | null;
}

const initialState: PopupState = {
  isAdding: false,
  isHovered: false,
  isLoading: false,
  searchResults: [],
  position: 0,
  theMovieDbId: null,
};

const Popup = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [showOptionsInvalid, setShowOptionsInvalid] = useState(false);
  const [state, setState] = useState(initialState);

  async function handleSearchTerm(searchTerm: MediaInformation | null) {
    if (!searchTerm) {
      console.debug('No results found for current page.');
      return;
    }

    const result = await api.ombi.search(searchTerm.title, searchTerm.year);

    setState({ ...state, searchResults: result });
  }

  async function handleAddClick() {
    const { position, searchResults } = state;
    const movie = searchResults[position];

    setState({ ...state, isAdding: true });

    const response = await api.ombi.request(movie.theMovieDbId);

    if (response.result) {
      setState({
        ...state,
        isAdding: false,
        searchResults: [
          ...state.searchResults.slice(0, position),
          { ...movie, requested: true },
          ...state.searchResults.slice(position + 1),
        ],
      });
    } else {
      setState({ ...state, isAdding: false });
    }
  }

  async function handlePreviousClick () {
    const { position, searchResults } = state;
    const previousPosition = position === 0 ? searchResults.length - 1 : position - 1;

    setState({ ...state, position: previousPosition });
  }

  async function handleNextClick () {
    const { position, searchResults } = state;
    const nextPosition = position === searchResults.length - 1 ? 0 : position + 1;

    setState({ ...state, position: nextPosition });
  }

  function handleHover(isHovered: Boolean) {
    setState(prev => ({ ...prev, isHovered }));
  }

  useEffect(() => {
    async function load() {
      setLoading(true);

      const options = await getStoredValueAsync<IOptions>('options');

      if (!options.hostname.length || !options.apiKey.length || !options.username) {
        setShowOptionsInvalid(true);
      }

      setLoading(false);
    }

    load();
  }, []);

  useEffect(() => {
    async function load(): Promise<void> {
      return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const message = { from: 'popup', subject: 'info' };

          chrome.tabs.sendMessage(tabs[0]?.id ?? -1, message, async (data: any) => {
            await handleSearchTerm(data);

            return resolve();
          })
        });
      });
    }

    if (!showOptionsInvalid) {
      load();
    }
  }, [showOptionsInvalid]);

  const movie = state.searchResults[state.position] || {};
  const hasMultipleResults = state.searchResults.length > 1;

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
    position: 'fixed' as 'fixed',
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
    <React.Fragment>
      <div style={backgroundStyle}></div>
      <div className={classes.container} style={{ display: 'flex' }}>
        <DialogContent>
          <div className={classes.carousel}>
            {hasMultipleResults ?
              <IconButton style={{ marginRight: 5 }} onClick={handlePreviousClick}>
                <ChevronLeft fontSize="small" />
              </IconButton> : null}

            <Paper
              elevation={8}
              className={classes.paper}
              style={{...imageStyle, ...(!state.isHovered || zoom)}}
              onMouseEnter={() => handleHover(true)}
              onMouseLeave={() => handleHover(false)}
            >
            </Paper>

            {hasMultipleResults ?
              <IconButton style={{ marginLeft: 5 }} onClick={handleNextClick}>
                <ChevronRight fontSize="small" />
              </IconButton> : null}
          </div>
          <div className={classes.title}>
            {movie.title} ({(new Date(movie.releaseDate).getFullYear())})
          </div>
        </DialogContent>
        <DialogActions>
          {movie.available || movie.requested ?
            <Button variant="text"
              disabled={movie.available || movie.requested}
              color="primary"
            >
              {movie.available ? 'Already Owned' : movie.requested ? 'Already Requested' : null}
            </Button> : null
          }

          {!movie.available && !movie.requested ?
            <div className={classes.wrapper}>
              <Button variant="outlined"
                disabled={state.isAdding}
                color="primary"
                autoFocus
                onClick={handleAddClick}
              >
                {state.isAdding ? 'Adding' : 'Add'}
              </Button>
              {state.isAdding && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div> : null
          }

        </DialogActions>
      </div>
    </React.Fragment>;

  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        {Boolean(showOptionsInvalid) && <InvalidOptionsMessage />}
        {!Boolean(showOptionsInvalid) &&
          <div className={classes.root}>
            <div className={classes.page}>
              <React.Fragment>
                {state.isLoading
                  ? progress
                  : state.searchResults.length
                    ? content
                    : null
                }
              </React.Fragment>
            </div>
          </div>
        }
      </ThemeProvider>
    </React.Fragment>
  );
};

export default Popup;