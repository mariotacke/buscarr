import React, { Component } from 'react';

const { search } = require('../lib/api');

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      posterPath: null,
    };
  }

  componentDidMount () {
    window.addEventListener('DOMContentLoaded', this.handleDomContentLoaded.bind(this));
  }

  handleDomContentLoaded () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { from: 'popup', subject: 'info' }, async ({ movie }) => {
        const result = await search(movie);
        const imageBaseUrl = 'https://image.tmdb.org/t/p/w200';

        this.setState({ posterPath: imageBaseUrl + result[0].posterPath });
      });
    });
  }

  render () {
    return (
      <div>
        <img src={this.state.posterPath}></img>
      </div>
    );
  }
}

export default App;