import React, {Component} from 'react';
import {Link} from "react-router-dom";
import LogoutComponent from "../pageLogout/logoutComponent";

export default class SysAdminHeader extends Component {

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <Link to={`/`} className="navbar-brand">Trucking</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className={'nav-link'}>{localStorage.getItem('username')}</a>
                        </li>
                        <li className="nav-item active">
                            <Link to={`/companyList`} className="nav-link">Список компаний</Link>
                        </li>
                        <li className="nav-item active">
                            <Link to={`/statistics`} className="nav-link">Статистика</Link>
                        </li>
                    </ul>
                    <li className="navbar-text">
                        <LogoutComponent/>
                    </li>

                </div>
            </nav>
        );
    }


}
