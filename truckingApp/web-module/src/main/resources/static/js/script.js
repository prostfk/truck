import { Router, hashHistory } from 'react-router';
import { Link } from 'react-router';
import LoginPage from 'pageLogin.js';

ReactDOM.render(React.createElement(
    Provider,
    { store: store },
    React.createElement(
        Router,
        { history: hashHistory },
        React.createElement(Route, { path: '/', component: LoginPage }),
        React.createElement(Route, { path: '/auth', component: LoginPage })
    )
), document.getElementById("LoginPage"));
