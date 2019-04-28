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
import optionsService from '../../services/options-service';

const styles = (theme) => ({

});

class Options extends Component {
  constructor (props) {
    super(props);

    this.state = {
      hostname: '',
      password: '',
      showPassword: false,
    };
  }

  async componentWillMount () {
    const { hostname, password } = await optionsService.get();

    this.setState({
      hostname,
      password,
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
      password: this.state.password,
    });
  }

  render () {
    return (
      <div>
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
            value={this.state.password}
            onChange={this.handleChange('password').bind(this)}
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
        <Button
          color="primary"
          onClick={this.handleSave.bind(this)}
        >
          Save
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(Options);