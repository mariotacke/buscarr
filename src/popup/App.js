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

  navigate (page = 'search') {
    this.setState({ page });
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
        <div className="container" style={style}>
          <div className="page">
            <Search navigate={navigate} style={searchStyle} />
            {this.state.page === 'options' ? <Options navigate={navigate} /> : null}
          </div>
          <Tabs />
        </div>
      </Fragment>
    );
  }
}

export default App;