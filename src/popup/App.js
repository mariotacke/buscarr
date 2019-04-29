import React, { Component, Fragment } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Options from './components/options';
import Search from './components/search';
import Tabs from './components/tabs';
import { isChromeExtension } from './lib/utils';

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      page: 'search',
    };
  }

  render () {
    const style = {
      // during development, show popup border
      border: !isChromeExtension ? '1px solid black' : null,
    }

    return (
      <Fragment>
        <CssBaseline />
        <div className="container" style={style}>
          <div className="page">
            {this.state.page === 'search' ? <Search /> : null}
            {this.state.page === 'options' ? <Options /> : null}
          </div>
          <Tabs />
        </div>
      </Fragment>
    );
  }
}

export default App;