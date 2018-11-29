import React from "react";

import {BrowserRouter as Router} from 'react-router-dom'
import {Route} from 'react-router';
import DispatcherCreateOrderPage from "./pageDispatcher/pageDispatcherCreateOrderPage";
import DispatcherOrderList from "./pageDispatcher/pageDispatcherOrderList"
import CompanyListPage from "./pageSysAdmin/pageCompanyList";
import pageUserLogin from "./pageUserLogin/pageUserLogin";
import EditConsignment from "./pageDispatcher/pageDispatcherEditConsigment";
import HeaderElement from "./PagesCommon/header";
import registration from "./registration/registration";
import DriverOrderList from "./pageDriver/pageDriver";
import PageSysAdminStatistics from "./pageSysAdmin/pageSysAdminStatistics";
import PageOwnerClientStats from "./pageOwner/pageOwnerClientStat";

import DriverRouterListNew from "./pageDriver/pageRouterListNew";
//import DriverRouteList from "./pageDriver/pageRouteList";
import DispatcherEditOrder from "./pageDispatcher/pageDispatcherEditOrder";
import OwnerOrderList from "./pageOwner/pageOwnerOrderList.js";
import OwnerRouteList from "./pageOwner/pageOwnerRouteList.js";
import pageManagerOrders from "./pageManager/pageManagerOrders";
//import ManagerHeader from "./pageManager/managerHeader";
import ManagerConsignment from "./pageManager/pageManagerConsignment";
import ManagerCancelletion from "./pageManager/pageManagerCancelletionAct";
import ManagerRouteList from "./pageManager/pageManagerRouteList";
/*import MainHeader from "./pageManager/mainHeader";
import IndexComponent from './indexComponent/indexComponent'*/
import UsersList from "./pageAdmin/pageUsersList";
import CompanyOwnerStatistics from "./pageOwner/statistics";
import AutoList from "./pageAdmin/pageAutoList";
import pageDispatcherOrderListOnCalendar from "./pageDispatcher/pageDispatcherOrderListOnCalendar";
// import EditUser from "./pageSysAdmin/pageEditUser";
import OwnerWaybill from "./pageOwner/pageOwnerWaybill";
import CancellationAct from "./pageOwner/pageOwnerCancellationAct";
import EditUser from "./pageAdmin/pageEditUser";
import SendEmail from "./pageAdmin/emailSendPage";
/*import DriverConsignment from "./pageDriver/pageConsignment";*/
import OwnerCompanyClients from "./pageOwner/pageOwnerCompanyClients";
import OwnerUsersList from "./pageOwner/pageOwnerUsersList";
import OwnerStockList from "./pageOwner/pageOwnerStockList";
//import TestComponent from "./testComponent/testComponent";
import PageStockListNew from "./pageAdmin/pageStocksListNew";
import CreateStockModal from "./pageAdmin/modalComponentCreateStock";
import NotificationsErrorHandler from "./errorWindows/notificationErrorHandler";
import WelcomePage from "./PagesCommon/welcomePages/welcomePage";

class MainController extends React.Component {

    render() {
        return (
            <Router>
                <div>
                    <Route path="/*" component={HeaderElement}/>
                    <Route path="/*" component={NotificationsErrorHandler}/>
                    <Route exact path="/" component={WelcomePage}/>
                    <Route exact path="/registration" component={registration}/>
                    <Route exact path="/usersList" component={UsersList}/>
                    <Route exact path="/user/:userId/edit" component={EditUser}/>
                    <Route exact path="/sendEmail" component={SendEmail}/>
                    <Route exact path="/auth" component={pageUserLogin}/>
                    <Route exact path="/test" component={CreateStockModal}/>{/*ADD STOCKS IN THIS PATH*/}
                    <Route exact path="/statistics" component={PageSysAdminStatistics}/>
                    <Route exact path="/companyList" component={CompanyListPage}/> {/*list of companies for sysadmin*/}
                    {/*<Route exact path="/stocks" component={PageStockList}/> /!* stock list for admin *!/*/}
                    <Route exact path="/stocks" component={PageStockListNew}/> {/* stock list for admin */}
                    <Route exact path="/autos" component={AutoList}/> {/* auto list for admin */}
                    <Route exact path="/orders/" component={DispatcherOrderList}/>
                    <Route exact path="/ordersCalendar/" component={pageDispatcherOrderListOnCalendar}/>
                    <Route exact path="/orders/:orderId/edit"
                           component={DispatcherEditOrder}/> {/*edit waybill(ttn) and order*/}
                    <Route exact path="/orders/createOrder" component={DispatcherCreateOrderPage}/>
                    <Route exact path="/orders/createOrder/:consignmentId" component={EditConsignment}/>
                    <Route exact path="/myorders/" component={DriverOrderList}/> {/*driver*/}
                    <Route exact path="/myorders/routelist/:orderrouteListId" component={DriverRouterListNew}/> {/*driver*/}
                    {/*<Route exact path="/driver/consignment/:consignmentId" component={DriverConsignment}/>*/} {/*driver*/}
                    <Route exact path="/manager/orders" component={pageManagerOrders}/>
                    {/*<Route path="/manager/edit/*" component={ManagerHeader}/>*/}
                    <Route exact path="/manager/edit/consignment/:orderId" component={ManagerConsignment}/>
                    <Route exact path="/manager/edit/cancelletion" component={ManagerCancelletion}/>
                    <Route exact path="/manager/edit/routelist/:orderId" component={ManagerRouteList}/>
                    <Route exact path="/owner/orders" component={OwnerOrderList} /> {/*owner*/}
                    <Route exact path="/owner/routList/:orderId" component={OwnerRouteList} /> {/*owner*/}
                    <Route exact path="/owner/waybill/:orderId" component={OwnerWaybill} /> {/*owner*/}
                    <Route exact path="/owner/cancelAct/:orderId" component={CancellationAct} /> {/*owner*/}
                    <Route exact path="/owner/statistics" component={CompanyOwnerStatistics}/>
                    <Route exact path="/owner/usersList" component={OwnerUsersList}/>
                    <Route exact path="/owner/stocks" component={OwnerStockList}/>
                    <Route exact path="/owner/clients" component={OwnerCompanyClients}/>
                    <Route exact path="/owner/client/:clientId" component={PageOwnerClientStats}/>

                </div>


            </Router>
        );
    }
}

export default MainController;