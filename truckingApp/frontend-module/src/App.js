import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

/*import './source/js/jquery.js';*/
import './source/css/bootstrap.min.css';
import './source/css/bootstrap-grid.min.css';
import './source/css/bootstrap-reboot.min.css';
import './source/css/main.css';

/*import './source/js/bootstrap.bundle.min.js';
import './source/js/bootstrap.min.js';*/


import MainController from "./components/Main";


class App extends Component {
  render() {
    return (
      <MainController />
    );
  }
}

export default App;
