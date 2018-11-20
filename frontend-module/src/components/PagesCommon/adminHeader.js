import React, {Component} from 'react';
import {Link} from "react-router-dom";
import LogoutComponent from "../pageLogout/logoutComponent";
import ModalComponentEditCompany from "../pageAdmin/modalComponentEditCompany";

export default class AdminHeader extends Component {

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark" style={{backgroundColor: '#4e4e4e'}}>
                <Link to={`/`} className="navbar-brand">Trucking</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <Link to={`/usersList`} className="nav-link">Список пользователей компании</Link>
                        </li>
                        <li className="nav-item active">
                            <Link to={`/stocks`} className="nav-link">Склады</Link>
                        </li>
                        <li className="nav-item active">
                            <Link to={`/autos`} className="nav-link">Автомобили</Link>
                        </li>
                        <li className="nav-item active">
                            <ModalComponentEditCompany className="nav-link" text={"Редактировать компанию"}/>
                        </li>
                    </ul>
                    <div className="active">
                        <span className={'nav-link user-role'}>Администратор</span>
                    </div>
                    <li className="navbar-text">
                        <LogoutComponent/>
                    </li>

                </div>
            </nav>
        );
    }

}