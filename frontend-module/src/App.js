import React, {Component} from 'react';
import 'react-notifications/lib/notifications.css';
import './App.css';

/*import './source/js/jquery.js';*/
import './source/css/bootstrap.css';
import './source/css/bootstrap-grid.css';
import './source/css/bootstrap-reboot.min.css';
import './source/css/main.css';
import './source/css/animate.css'



/*import './source/js/bootstrap.bundle.min.js';
import './source/js/bootstrap.min.js';*/


import MainRouter from "./components/Main";
import ErrorUiHandler from "./components/errorWindows/errorHandler";
/*import {NotificationContainer} from "react-notifications";*/


class App extends Component {
    render() {
        return (
            <ErrorUiHandler>
                <MainRouter/>
            </ErrorUiHandler>
        );
    }
}

export default App;
