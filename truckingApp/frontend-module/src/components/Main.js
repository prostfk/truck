import React, { Component } from "react";
/*import axios from 'axios';*/

import { BrowserRouter as Router } from 'react-router-dom'
import { Route, Link } from 'react-router';

import LoginPage from './pageLogin/pageLogin';
import DispatcherCreateOrderPage from "./pageDispatcher/pageDispatcherCreateOrderPage";
import AdminPage from "./pageadmin/pageAdmin";
import SysAdminPage from "./pageSysAdmin/pageSysAdmin";

class MainController extends React.Component{
	constructor(props) {
	  super(props);
	  this.state = {ponged: 'Not Ponged'}
/*	  this.ping = this.ping.bind(this);*/
	}

	render() {
	  return (
          <Router>
              <div>
                  <Route path="/login" component={LoginPage} />
                  <Route path="/systemadmin" component={SysAdminPage} />
                  <Route path="/admin" component={AdminPage} />
                  <Route path="/dispatcher/createorder" component={DispatcherCreateOrderPage} />
              </div>
          </Router>
	  );
	}
}

export default MainController;