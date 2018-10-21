import '/static/js/'

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
