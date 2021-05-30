import React, { useEffect, useState } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import { getStoredValueAsync, setStoredValueAsync } from '../../utils/storage';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

interface IOptions {
  hostname: string;
  apiKey: string;
  username: string;
  [key: string]: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(1),
    '& .MuiFormControl-root': {
      padding: theme.spacing(1, 0),
    }
  },
}));

const initialValues: IOptions = {
  hostname: '',
  apiKey: '',
  username: '',
};

const OptionsForm: React.FC = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState<IOptions>(initialValues);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const options = await getStoredValueAsync<IOptions>('options');

      if (options) {
        setState(options);
      }

      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return <></>;
  }

  function handleShowApiKeyClick() {
    setShowPassword(state => !state);
  }

  const handleShowApiKeyMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  function handleHostnameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setState(options => ({ ...options, hostname: event.target.value }));
  }

  function handleApiKeyChange(event: React.ChangeEvent<HTMLInputElement>) {
    setState(options => ({ ...options, apiKey: event.target.value }));
  }
  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setState(options => ({ ...options, username: event.target.value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    await setStoredValueAsync<IOptions>('options', state);
  }

  return (
    <form noValidate autoComplete="off" onSubmit={handleSubmit} className={classes.root}>
      <FormControl fullWidth>
        <InputLabel htmlFor="hostname">Ombi Hostname</InputLabel>
        <Input
          id="hostname"
          value={state.hostname}
          onChange={handleHostnameChange}
        />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel htmlFor="username">Ombi Username</InputLabel>
        <Input
          id="username"
          value={state.username}
          onChange={handleUsernameChange}
        />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel htmlFor="api-key">Ombi API Key</InputLabel>
        <Input
          id="api-key"
          type={showPassword ? 'text' : 'password'}
          value={state.apiKey}
          onChange={handleApiKeyChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle api-key visibility"
                onClick={handleShowApiKeyClick}
                onMouseDown={handleShowApiKeyMouseDown}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
      </FormControl>
    </form>
  );
};

export default OptionsForm;