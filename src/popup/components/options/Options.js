import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import optionsService from '../../services/options-service';

const styles = (theme) => ({
  contentContainer: {
    margin: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
});

class Options extends Component {
  constructor (props) {
    super(props);

    this.state = {
      hostname: '',
      apiKey: '',
      username: '',
      showPassword: false,
    };
  }

  async componentWillMount () {
    const { hostname, apiKey, username } = await optionsService.get();

    this.setState({
      hostname,
      apiKey,
      username,
    });
  }

  handleChange (property) {
    return (event) => this.setState({ [property]: event.target.value });
  }

  handleToggleShowPassword () {
    this.setState(state => ({ showPassword: !state.showPassword }));
  }

  async handleSave () {
    await optionsService.set({
      hostname: this.state.hostname,
      apiKey: this.state.apiKey,
      username: this.state.username,
    });
  }

  render () {
    const { classes, navigate } = this.props;

    return (
      <div className={classes.contentContainer}>
        <FormControl>
          <InputLabel htmlFor="ombi-api-hostname">API Hostname</InputLabel>
          <Input
            id="ombi-api-hostname"
            type="text"
            value={this.state.hostname}
            onChange={this.handleChange('hostname').bind(this)}
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="ombi-api-key">API Key</InputLabel>
          <Input
            id="ombi-api-key"
            type={this.state.showPassword ? 'text' : 'password'}
            value={this.state.apiKey}
            onChange={this.handleChange('apiKey').bind(this)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={this.handleToggleShowPassword.bind(this)}
                >
                  {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="ombi-api-username">API Username</InputLabel>
          <Input
            id="ombi-api-username"
            type="text"
            placeholder="Optional"
            value={this.state.username}
            onChange={this.handleChange('username').bind(this)}
          />
        </FormControl>
        <DialogActions>
          <Button
            color="secondary"
            onClick={() => navigate('search')}
          >
            Back
        </Button>
          <Button
            color="primary"
            onClick={this.handleSave.bind(this)}
          >
            Save
        </Button>
        </DialogActions>
      </div>
    );
  }
}

export default withStyles(styles)(Options);