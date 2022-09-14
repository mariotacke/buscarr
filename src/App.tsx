import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { ThemeProvider } from '@mui/material/styles';

import * as api from './api';
import './App.css';
import { theme } from './theme';
import { imageBaseUrl } from './constants';

function LoadingContent() {
  return (
    <Box
      sx={{
        height: '100vh',
        padding: 2,
      }}
    >
      <Typography
        gutterBottom
        variant="body1"
      >
        Loading content from current page...
      </Typography>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
      }}>

        <CircularProgress />
      </Box>
    </Box>
  );
}

function Searching() {
  return (
    <Box
      sx={{
        height: '100vh',
        padding: 2,
      }}
    >
      <Typography
        gutterBottom
        variant="body1"
      >
        Searching...
      </Typography>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
      }}>

        <CircularProgress />
      </Box>
    </Box>
  );
}

type OmbiSearchResult = {
  approved: boolean;
  available: boolean;
  requested: boolean;
  backdropPath: string;
  posterPath: string;
  plexUrl: string;
  title: string;
  theMovieDbId: string;
  releaseDate: string;
}

function App() {
  const [loadingContent, setLoadingContent] = useState(false);
  const [content, setContent] = useState<{ title: string, year?: number } | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<OmbiSearchResult[]>([]);
  const [position, setPosition] = useState(0);
  const [requesting, setRequesting] = useState(false);

  async function handleRequestClick () {
    setRequesting(true);

    const item = searchResults[position];

    const response = await api.ombi.request(item.theMovieDbId);

    if (response.result) {
      setSearchResults([
        ...searchResults.slice(0, position),
        { ...item, requested: true },
        ...searchResults.slice(position + 1),
      ]);
    }

    setRequesting(false);
  }

  useEffect(() => {
    async function load(): Promise<void> {
      setLoadingContent(true);

      return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (result) => {
          const message = { from: 'popup', subject: 'info' };

          chrome.tabs.sendMessage(result[0].id!, message, async (data: any) => {
            setContent(data);
            setLoadingContent(false);

            return resolve();
          });
        });
      });
    }

    load();
  }, []);

  useEffect(() => {
    async function load(): Promise<void> {
      setSearching(true);

      console.log(`Searching for: "${content!.title}"`,)
      const result = await api.ombi.search(content!.title);

      if (!result.ok) {
        console.log(`Could not search for content. ${result.error}`);
      } else {
        setSearchResults(result.value);
      }

      setSearching(false);
    }

    if (content) {
      load();
    }
  }, [content]);

  const Page = ({ item }: { item: OmbiSearchResult }) => {
    return (
      <>
        <Box
          sx={{
            backgroundImage: `url('${imageBaseUrl}${item.posterPath}')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'norepeat',
            backgroundPosition: 'center center',
            position: 'fixed',
            left: 0,
            right: 0,
            height: 405,
            zIndex: -1,
            display: 'block',
            opacity: 0.2,
            filter: 'blur(3px)',
          }}
        />
        <Box
          sx={{
            height: '100vh',
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
          }}
        >
          <DialogContent>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 1,
                '.MuiIconButton-root:first-of-type': {
                  marginRight: 1,
                },
                '.MuiIconButton-root:last-child': {
                  marginLeft: 1,
                },
              }}
            >
              {searchResults.length > 1 && (
                <IconButton onClick={() => setPosition(position + 1 === searchResults.length ? 0 : position + 1)}>
                  <ChevronLeft fontSize="small" />
                </IconButton>
              )}

              <Paper
                elevation={8}
                sx={{
                  paddingTop: 1,
                  paddingBottom: 1,
                  backgroundImage: `url('${imageBaseUrl}${item.posterPath}')`,
                  width: 144,
                  height: 216,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'norepeat',
                  backgroundPosition: 'center center',
                  transition: 'transform .2s',
                  ':hover' : {
                    transform: 'scale(1.1)',
                  },
                }}
              >
              </Paper>

              {searchResults.length > 1 && (
                <IconButton onClick={() => setPosition(position - 1 < 0 ? searchResults.length - 1 : position - 1)}>
                  <ChevronRight fontSize="small" />
                </IconButton>
              )}
            </Box>
            <Box>
              <Typography variant="h6">
                {item.title} ({(new Date(item.releaseDate).getFullYear())})
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            {item.available || item.requested ?
              <Button variant="text"
                disabled={item.available || item.requested}
                color="primary"
              >
                {/* in some cases Ombi shows items as "approved" but not "requested" ¯\_(ツ)_/¯ */}
                {item.available ? 'Already owned' : (item.requested || item.approved) ? 'Already requested' : null}
              </Button> : null
            }

            {!item.available && !item.requested && (
                <LoadingButton
                  variant="outlined"
                  disabled={requesting}
                  loading={requesting}
                  color="primary"
                  autoFocus
                  onClick={handleRequestClick}
                >
                  {requesting ? 'Requesting' : 'Request'}
                </LoadingButton>
            )}
          </DialogActions>
        </Box>
      </>
    )
  }

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        {loadingContent && <LoadingContent />}
        {searching && <Searching />}
        {!loadingContent && !searching && searchResults.length && <Page item={searchResults[position]} />}
      </ThemeProvider>
    </>
  );
}

export default App;