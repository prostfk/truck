import React, { Component } from "react";
/*import axios from 'axios';*/

import { BrowserRouter as Router } from 'react-router-dom'
import { Route, Link } from 'react-router';

import LoginPage from './pageLogin/pageLogin';
import DispatcherCreateOrderPage from "./pageDispatcher/pageDispatcherCreateOrderPage";
import CompanyListPage from "./pageSysAdmin/pageCompanyList";
import EditCompanyPage from "./pageSysAdmin/pageEditCompany";
import pageUserLogin from "./pageUserLogin/pageUserLogin";
import PageStockList from "./pageAdmin/pageStockList";
import EditConsigment from "./pageDispatcher/pageDispatcherEditConsigment";

class MainController extends React.Component{
	constructor(props) {
	  super(props);
	}

	render() {
	  return (
          <Router>
              <div>
                  <Route path="/login" component={pageUserLogin} />
                  <Route exact path="/companylist" component={CompanyListPage} /> {/*list of companies for sysadmin*/}
                  <Route exact path="/stocks" component={PageStockList} /> {/* stock list for admin */}
{/*                  <Route exact path="/stocks/:stockId" component={EditCompanyPage} /> edit company for sysadmin*/}
                  <Route exact path="/dispatcher/createorder" component={DispatcherCreateOrderPage} />
                  <Route exact path="/dispatcher/createorder/:consigmentId" component={EditConsigment} />
              </div>
          </Router>
	  );
	}
}

export default MainController;