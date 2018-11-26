import React from "react";
import ManagerWelcomePage from "./managerWelcomePage";
import DriverWelcomePage from "./driverWelcomePage";
import DispatcherWelcomePage from "./dispatcherWelcomePage";
import CompanyOwnerWelcomePage from "./companyOwnerWelcomePage";
import AdminWelcomePage from "./adminWelcomePage";
import SysAdminWelcomePage from "./sysAdminWelcomePage";
import AnonWelcomePage from "./anonWelcomePage";

export default class WelcomePage extends React.Component {

    render() {
        switch (localStorage.getItem('role')) {
            case "ROLE_COMP_OWNER":
                return <CompanyOwnerWelcomePage/>;
            case "ROLE_ADMIN":
                return <AdminWelcomePage/>;
            case "ROLE_MANAGER":
                return <ManagerWelcomePage/>;
            case "ROLE_DRIVER":
                return <DriverWelcomePage/>;
            case "ROLE_DISPATCHER":
                return <DispatcherWelcomePage/>;
            case "ROLE_SYS_ADMIN":
                return <SysAdminWelcomePage/>;
            default:
                return <AnonWelcomePage/>
        }
    }
}