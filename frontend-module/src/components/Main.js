import React   from "react";

import { BrowserRouter as Router } from 'react-router-dom'
import { Route} from 'react-router';
import DispatcherCreateOrderPage from "./pageDispatcher/pageDispatcherCreateOrderPage";
import DispatcherOrderList from "./pageDispatcher/pageDispatcherOrderList"
import CompanyListPage from "./pageSysAdmin/pageCompanyList";
import pageUserLogin from "./pageUserLogin/pageUserLogin";
import PageStockList from "./pageAdmin/pageStockList";
import EditConsignment from "./pageDispatcher/pageDispatcherEditConsigment";
import testComponent from "./testComponent/testComponent";
import HeaderElement from "./PagesCommon/header";
import registration from "./registration/registration";
import DriverOrderList from "./pageDriver/pageDriver";
import DriverRouteList from "./pageDriver/pageRouteList";


class MainController extends React.Component{

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
                  {/*<Route exact path="/orders/:orderId/edit" component={DispatcherEditOrder} /> /!*edit waybill(ttn) and order*!/*/}
                  <Route exact path="/orders/createOrder" component={DispatcherCreateOrderPage} />
                  <Route exact path="/orders/createOrder/:consignmentId" component={EditConsignment} />
                  <Route exact path="/myorders/" component={DriverOrderList} /> {/*driver*/}
                  <Route exact path="/myorders/routelist/:orderrouteListId" component={DriverRouteList} /> {/*driver*/}
              </div>
          </Router>
	  );
	}
}

export default MainController;