import React, { Component, Fragment } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
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
  }

  render () {
    const navigate = this.navigate.bind(this);

    const style = {
      // during development, show popup border
      border: !isChromeExtension ? '1px solid black' : null,
    };

    return (
      <Fragment>
        <CssBaseline />
        <MuiThemeProvider theme={theme}>
          <div className="container" style={style}>
            <div className="page">
              <Search navigate={navigate} style={{ display: `${this.state.page === 'search' ? 'flex' : 'none'}`}} />
              <Options navigate={navigate} style={{ display: `${this.state.page === 'options' ? 'flex' : 'none'}` }} />
            </div>
            <Tabs />
          </div>
        </MuiThemeProvider>
      </Fragment>
    );
  }
}

export default App;