import React, {Component} from "react";
import {Link} from "react-router-dom";
import LogoutComponent from "../pageLogout/logoutComponent";
import SockJsClient from 'react-stomp';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class ManagerHeader extends Component {
    constructor(props) {
        super(props);
        this.handleMessage = this.handleMessage.bind(this);
        this.handleMessageEditOrder = this.handleMessageEditOrder.bind(this);
        this.handleMessageCreateOrder = this.handleMessageCreateOrder.bind(this);
    }

    handleMessage(msg) {
        NotificationManager.info(msg.message,'Информация ( '+ msg.userName+' )');
    }
    handleMessageEditOrder(msg) {
        NotificationManager.info(msg.message,'Информация ( '+ msg.userName+' )');
    }
    handleMessageCreateOrder(msg) {
        NotificationManager.info(msg.message,'Информация ( '+ msg.userName+' )');
    }

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
                            <Link to={`/manager/orders`} className="nav-link">Заказы</Link>
                        </li>
                    </ul>
                    <div className="active">
                        <span className={'nav-link user-role'}>Менеджер</span>
                    </div>
                    <li className="navbar-text">
                        <LogoutComponent/>
                    </li>
                </div>
                <SockJsClient url='http://192.168.1.116:8080/stomp' topics={['/topic/'+localStorage.getItem("companyId")+'/markPoint/']}
                              onMessage={(msg) => {
                                  this.handleMessage(msg);
                              }}
                              ref={ (client) => { this.clientRef = client }} />
                <SockJsClient url='http://192.168.1.116:8080/stomp' topics={['/topic/'+localStorage.getItem("companyId")+'/editOrder/']}
                              onMessage={(msg) => {
                                  this.handleMessageEditOrder(msg);
                              }}
                              ref={ (client) => { this.clientRef = client }} />
                <SockJsClient url='http://192.168.1.116:8080/stomp' topics={['/topic/'+localStorage.getItem("companyId")+'/createOrder/']}
                              onMessage={(msg) => {
                                  this.handleMessageCreateOrder(msg);
                              }}
                              ref={ (client) => { this.clientRef = client }} />
            </nav>

        );

    }
}