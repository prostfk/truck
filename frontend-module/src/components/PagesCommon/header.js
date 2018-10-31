import React from "react";
import {Link} from 'react-router-dom'

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
                        {sessionStorage.getItem('username')===null ? <Link to={`/auth`} className="nav-link">Авторизация</Link> : <Link to={'/orders'} className={'nav-link'}>{sessionStorage.getItem('username')}</Link>}
                    </li>
                    <li className="nav-item active">
                        <Link to={`/companyList`} className="nav-link">Список компаний</Link>
                    </li>
                    <li className="nav-item active">
                        <Link to={`/stocks`} className="nav-link">Склады</Link>
                    </li>
                    <li className="nav-item active">
                        <Link to={`/orders`} className="nav-link">Заказы</Link>
                    </li>
                    <li className="nav-item active">
                        <Link to={`/myorders`} className="nav-link">Водитель</Link>
                    </li>
                    <li className="nav-item active">
                        <Link to={`/owner/orders`} className="nav-link">Владелец</Link>
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