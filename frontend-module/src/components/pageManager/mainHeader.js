import React from "react";

class MainHeader extends React.Component {
    render() {
        return <nav className="navbar navbar-expand-lg navbar-dark bg-primary main_nav_bar" id="mainnavbar">
            <a className="navbar-brand" href="#">Trucking</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">

                </ul>
                <li className="navbar-text">
                    <a className="nav-link" href="#">Выйти</a>
                </li>
            </div>
        </nav>
    }
}

export default MainHeader;