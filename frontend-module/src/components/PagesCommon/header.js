import React, { Component } from "react";
import testComponent from "../testComponent/testComponent";
import {BrowserRouter, Link} from "react-router-dom";

class HeaderElement extends React.Component{
    render(){
        return <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="#">Trucking</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"/>
        </button>
        {/*<BrowserRouter>*/}
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <a className="nav-link" href="#">Список компаний <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                        {/*<Link className="nav-link" to='/test'>Тест</Link>*/}
                        <a className="nav-link" href="/test">Test</a>
                    </li>
                    <li className="nav-item">
                        {/*<Link className="nav-link" to='/orders'>Заказы</Link>*/}
                        <a className="nav-link" href="/orders">Заказы</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Новая компания</a>
                    </li>
                </ul>
                <li className="navbar-text">
                    <a className="nav-link" href="#">Выйти</a>
                </li>
            </div>
        {/*</BrowserRouter>*/}
    </nav>
    }
}

export default HeaderElement;