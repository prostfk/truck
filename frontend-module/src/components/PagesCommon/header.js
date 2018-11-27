import React from "react";
import CompanyOwnerHeader from "./companyOwnerHeader";
import AdminHeader from "./adminHeader";
import ManagerHeader from "./manageHeader";
import DriverHeader from "./driverHeader";
import AnonHeader from "./anonHeader";
import DispatcherHeader from "./dispatcherHeader";
import SysAdminHeader from "./sysAdminHeader";

class HeaderElement extends React.Component {

    // ROLE_USER,

    render() {
        switch (localStorage.getItem('role')) {
            case "ROLE_COMP_OWNER":
                return <CompanyOwnerHeader/>;
            case "ROLE_ADMIN":
                return <AdminHeader/>;
            case "ROLE_MANAGER":
                return <ManagerHeader/>;
            case "ROLE_DRIVER":
                return <DriverHeader/>;
            case "ROLE_DISPATCHER":
                return <DispatcherHeader/>;
            case "ROLE_SYS_ADMIN":
                return <SysAdminHeader/>;
            default:
                return <AnonHeader/>
        }
    }
}

export default HeaderElement;