import React, { Component } from "react";
import {Link} from "react-router-dom";

class ManagerHeader extends Component {
    render() {
        return <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <a className="navbar-brand" href="#">Trucking</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto" id="manager_nav_bar">
                    <li className="nav-item">
                    </li>
                    <li className="nav-item">
                    </li>
                </ul>
                <li className="navbar-text" id="show_backtoorderlist">
                    <Link to={'/manager/orders'} className="nav-link manager_form_nav_buttons active">Вернуться к списку заказов</Link>
                </li>
            </div>
        </nav>

    }
}

export default ManagerHeader;