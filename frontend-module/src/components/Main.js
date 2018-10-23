import React, { Component } from "react";
/*import axios from 'axios';*/

import { BrowserRouter as Router } from 'react-router-dom'
import { Route, Link } from 'react-router';

import LoginPage from './pageLogin/pageLogin';
import DispatcherCreateOrderPage from "./pageDispatcher/pageDispatcherCreateOrderPage";
import DispatcherOrderList from "./pageDispatcher/pageDispatcherOrderList"
import CompanyListPage from "./pageSysAdmin/pageCompanyList";
import pageUserLogin from "./pageUserLogin/pageUserLogin";
import PageStockList from "./pageAdmin/pageStockList";
import EditConsigment from "./pageDispatcher/pageDispatcherEditConsigment";
import DispatcherEditOrderPage from "./pageDispatcher/pageDispatcherEditOrderPage";
import testComponent from "./testComponent/testComponent";

class MainController extends React.Component{
	constructor(props) {
	  super(props);
	}

	render() {
	  return (
          <Router>
              <div>
                  <Route exact path="/auth" component={pageUserLogin} />
                  <Route exact path="/test" component={testComponent} />
                  <Route exact path="/companylist" component={CompanyListPage} /> {/*list of companies for sysadmin*/}
                  <Route exact path="/stocks" component={PageStockList} /> {/* stock list for admin */}
                  <Route exact path="/orders/" component={DispatcherOrderList} />
                  <Route exact path="/orders/:orderId" component={DispatcherEditOrderPage} /> {/*edit waybill(ttn) and order*/}
                  <Route exact path="/orders/createOrder" component={DispatcherCreateOrderPage} />
                  <Route exact path="/orders/createOrder/:consigmentId" component={EditConsigment} />
              </div>
          </Router>
	  );
	}
}

export default MainController;