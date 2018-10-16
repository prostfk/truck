import {Router,hashHistory} from 'react-router';
import {Link} from 'react-router';
import LoginPage from 'pageAdmin.js';

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={LoginPage}/>
            <Route path="/auth" component={LoginPage}/>
        </Router>
    </Provider>,
    document.getElementById("LoginPage")
);