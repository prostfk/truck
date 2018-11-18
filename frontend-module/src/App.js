import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

/*import './source/js/jquery.js';*/
import './source/css/bootstrap.css';
import './source/css/bootstrap-grid.css';
import './source/css/bootstrap-reboot.min.css';
import './source/css/main.css';



/*import './source/js/bootstrap.bundle.min.js';
import './source/js/bootstrap.min.js';*/


import MainController from "./components/Main";
import ErrorUiHandler from "./components/errorWindows/errorHandler";


class App extends Component {
    render() {
        return (
            <ErrorUiHandler>
                <MainController/>
            </ErrorUiHandler>

        );
    }
}

export default App;
