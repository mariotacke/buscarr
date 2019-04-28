import React, { Component, Fragment } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Options from './components/options';
import Search from './components/search';
import Tabs from './components/tabs';
import api from './services/api-service';

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      page: 'search',
      posterPath: null,
    };
  }

  componentDidMount () {
    window.addEventListener('DOMContentLoaded', this.handleDomContentLoaded.bind(this));
  }

  componentWillUnmount () {
    window.removeEventListener('DOMContentLoaded', this.handleDomContentLoaded.bind(this));
  }

  handleDomContentLoaded () {
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   chrome.tabs.sendMessage(tabs[0].id, { from: 'popup', subject: 'info' }, async ({ movie }) => {
    //     const result = await search(movie);
    //     const imageBaseUrl = 'https://image.tmdb.org/t/p/w200';

    //     this.setState({ posterPath: imageBaseUrl + result[0].posterPath });
    //   });
    // });
  }

  render () {
    return (
      <Fragment>
        <CssBaseline />
        <div className="container">
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