import React from "react";

import {BrowserRouter as Router} from 'react-router-dom'
import {Route} from 'react-router';
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
import DispatcherEditOrder from "./pageDispatcher/pageDispatcherEditOrder";
import OwnerOrderList from "./pageOwner/pageOwnerOrderList.js";
import OwnerRouteList from "./pageOwner/pageOwnerRouteList.js";
import pageManagerOrders from "./pageManager/pageManagerOrders";
import ManagerHeader from "./pageManager/managerHeader";
import ManagerConsignment from "./pageManager/pageManagerConsignment";
import ManagerCancelletion from "./pageManager/pageManagerCancelletionAct";
import ManagerRouteList from "./pageManager/pageManagerRouteList";
import MainHeader from "./pageManager/mainHeader";
import IndexComponent from './indexComponent/indexComponent'
import UsersList from "./pageAdmin/pageUsersList";
import CompanyOwnerStatistics from "./pageOwner/statistics";
// import EditUser from "./pageSysAdmin/pageEditUser";
import OwnerWaybill from "./pageOwner/pageOwnerWaybill";
import CancellationAct from "./pageOwner/pageOwnerCancellationAct";
import EditUser from "./pageAdmin/pageEditUser";
import SendEmail from "./pageAdmin/emailSendPage";
import DriverConsignment from "./pageDriver/pageConsignment";
import OwnerUsersList from "./pageOwner/pageOwnerUsersList";

class MainController extends React.Component {

    render() {
        return (
            <Router>
                <div>
                    <Route path="/*" component={HeaderElement}/>
                    <Route path="/" component={IndexComponent}/>
                    <Route path="/registration" component={registration}/>
                    <Route path="/usersList" component={UsersList}/>
                    <Route path="/user/:userId/edit" component={EditUser}/>
                    <Route exact path="/sendEmail" component={SendEmail}/>
                    <Route exact path="/auth" component={pageUserLogin}/>
                    <Route exact path="/test" component={testComponent}/>
                    <Route exact path="/companyList" component={CompanyListPage}/> {/*list of companies for sysadmin*/}
                    <Route exact path="/stocks" component={PageStockList}/> {/* stock list for admin */}
                    <Route exact path="/orders/" component={DispatcherOrderList}/>
                    <Route exact path="/orders/:orderId/edit"
                           component={DispatcherEditOrder}/> {/*edit waybill(ttn) and order*/}
                    <Route exact path="/orders/createOrder" component={DispatcherCreateOrderPage}/>
                    <Route exact path="/orders/createOrder/:consignmentId" component={EditConsignment}/>
                    <Route exact path="/myorders/" component={DriverOrderList}/> {/*driver*/}
                    <Route exact path="/myorders/routelist/:orderrouteListId" component={DriverRouteList}/> {/*driver*/}
                    <Route exact path="/driver/consignment/:consignmentId" component={DriverConsignment}/> {/*driver*/}
                    <Route exact path="/manager/orders" component={pageManagerOrders}/>
                    {/*<Route path="/manager/edit/*" component={ManagerHeader}/>*/}
                    <Route exact path="/manager/edit/consignment/:orderId" component={ManagerConsignment}/>
                    <Route exact path="/manager/edit/cancelletion" component={ManagerCancelletion}/>
                    <Route exact path="/manager/edit/routelist/:orderId" component={ManagerRouteList}/>
                    <Route exact path="/owner/orders" component={OwnerOrderList} /> {/*owner*/}
                    <Route exact path="/owner/routList/:orderrouteListId" component={OwnerRouteList} /> {/*owner*/}
                    <Route exact path="/owner/waybill/:orderId" component={OwnerWaybill} /> {/*owner*/}
                    <Route exact path="/owner/cancelAct/:orderId" component={CancellationAct} /> {/*owner*/}
                    <Route exact path="/statistics" component={CompanyOwnerStatistics}/>
                    <Route exact path="/owner/usersList" component={OwnerUsersList}/>

                </div>


            </Router>
        );
    }
}

export default MainController;