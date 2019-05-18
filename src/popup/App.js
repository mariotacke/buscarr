import React, { Component, Fragment } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import Options from './components/options';
import Search from './components/search';
import Tabs from './components/tabs';
import { isChromeExtension } from './lib/utils';

const theme = createMuiTheme({
  palette: {
    primary: blueGrey,
    secondary: blueGrey,
    tonalOffset: 0.2,
  },
});

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      page: 'search',
    };
  }

  navigate (page = 'search') {
    this.setState({ page });
    console.log(this.state);
  }

  render () {
    const navigate = this.navigate.bind(this);

    const style = {
      // during development, show popup border
      border: !isChromeExtension ? '1px solid black' : null,
    };

    const searchStyle = {
      display: this.state.page === 'search' ? undefined : 'none',
    };

    return (
      <Fragment>
        <CssBaseline />
        <MuiThemeProvider theme={theme}>
          <div className="container" style={style}>
            <div className="page">
              <Search navigate={navigate} style={searchStyle} />
              {this.state.page === 'options' ? <Options navigate={navigate} /> : null}
            </div>
            <Tabs />
          </div>
        </MuiThemeProvider>
      </Fragment>
    );
  }
}

export default App;