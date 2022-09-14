import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { ThemeProvider } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { theme } from './theme';
import { getStoredValueAsync, setStoredValueAsync } from './storage';

interface IOmbiOptions {
  hostname: string;
  apiKey: string;
  username: string;
  [key: string]: any;
}

function OptionsPage () {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [options, setOptions] = useState<IOmbiOptions | null>(null);

  useEffect(() => {
    async function load (): Promise<void> {
      const value = await getStoredValueAsync<IOmbiOptions>('options');

      setOptions(value);
      setLoading(false);
    }

    load();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    try {
      setSaving(true);

      await setStoredValueAsync<IOmbiOptions>('options', {
        hostname: data.get('hostname')?.toString() || '',
        apiKey: data.get('apikey')?.toString() || '',
        username: data.get('username')?.toString() || '',
      });
    } catch (error) {

    } finally {
      setSaving(false);
    }
  }

  const handleClickShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  const handleMouseDownApiKey = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Container maxWidth="md" sx={{ padding: 1 }}>
          <Paper sx={{ padding: 1 }}>
            <Typography variant="h4" component="h1">¡Buscarr! Options</Typography>

            {loading
              ? <>Loading</>
              : (
                <Box
                  component="form"
                  autoComplete="off"
                  sx={{
                    mt: 2,
                  }}
                  onSubmit={handleSubmit}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h5" component="h2">
                        Ombi
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="hostname"
                        name="hostname"
                        label="Ombi Hostname"
                        type="text"
                        disabled={saving}
                        fullWidth
                        required
                        defaultValue={options?.hostname}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="username"
                        name="username"
                        label="Ombi Username"
                        type="text"
                        disabled={saving}
                        fullWidth
                        defaultValue={options?.username}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="apikey"
                        name="apikey"
                        label="Ombi API Key"
                        disabled={saving}
                        fullWidth
                        defaultValue={options?.apiKey}
                        type={showApiKey ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle api-key visibility"
                                onClick={handleClickShowApiKey}
                                onMouseDown={handleMouseDownApiKey}
                              >
                                {showApiKey ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'end',
                        gap: 1,
                      }}>
                        <LoadingButton
                          disabled={saving}
                          loading={saving}
                          type="submit"
                          endIcon={<SaveIcon />}
                        >
                          Save
                        </LoadingButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )
            }
          </Paper>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default OptionsPage;