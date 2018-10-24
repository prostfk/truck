import React, { Component } from "react";
/*import axios from 'axios';*/

import { BrowserRouter as Router } from 'react-router-dom'
import { Route, Link } from 'react-router';
import DispatcherCreateOrderPage from "./pageDispatcher/pageDispatcherCreateOrderPage";
import DispatcherOrderList from "./pageDispatcher/pageDispatcherOrderList"
import CompanyListPage from "./pageSysAdmin/pageCompanyList";
import pageUserLogin from "./pageUserLogin/pageUserLogin";
import PageStockList from "./pageAdmin/pageStockList";
import EditConsignment from "./pageDispatcher/pageDispatcherEditConsigment";
import DispatcherEditOrderPage from "./pageDispatcher/pageDispatcherEditOrderPage";
import testComponent from "./testComponent/testComponent";
import HeaderElement from "./PagesCommon/header";
import registration from "./registration/registration";

class MainController extends React.Component{
	constructor(props) {
	  super(props);
	}

	render() {
	  return (
          <Router>
              <div>
                  <Route path="/*" component={HeaderElement} />
                  <Route path="/registration" component={registration} />
                  <Route exact path="/auth" component={pageUserLogin} />
                  <Route exact path="/test" component={testComponent} />
                  <Route exact path="/companyList" component={CompanyListPage} /> {/*list of companies for sysadmin*/}
                  <Route exact path="/stocks" component={PageStockList} /> {/* stock list for admin */}
                  <Route exact path="/orders/" component={DispatcherOrderList} />
                  <Route exact path="/orders/:orderId" component={DispatcherEditOrderPage} /> {/*edit waybill(ttn) and order*/}
                  <Route exact path="/orders/createOrder" component={DispatcherCreateOrderPage} />
                  <Route exact path="/orders/createOrder/:consignmentId" component={EditConsignment} />
              </div>
          </Router>
	  );
	}
}

export default MainController;