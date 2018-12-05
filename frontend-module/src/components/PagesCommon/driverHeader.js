import React, {Component} from 'react';
import {Link} from "react-router-dom";
import LogoutComponent from "../pageLogout/logoutComponent";
import SockJsClient from "react-stomp";
import {NotificationManager} from "react-notifications";
import connect from "react-redux/es/connect/connect";
import {ADD_ORDER,DELETE_ORDER} from "../../constants/driverActionTypes";


class DriverHeader extends Component {
    constructor(props) {
        super(props);
        this.handleMessage = this.handleMessage.bind(this);
    }

    handleMessage(msg) {
        if(msg.orderAdd==true){
            this.props.addOrder(msg.order);
        }
        else{
            this.props.deleteOrder(msg.orderId);
        }
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
                        </li>
                        <li className="nav-item active">
                            <Link to={`/myorders`} className="nav-link">Заказы</Link>
                        </li>
                    </ul>
                    <div className="active">
                        <span className={'nav-link user-role'}>Водитель</span>
                    </div>
                    <li className="navbar-text">
                        <LogoutComponent/>
                    </li>

                </div>
                <SockJsClient url='http://localhost:8080/stomp' topics={['/topic/'+localStorage.getItem("companyId")+'/changeWayBillStatus/'+localStorage.getItem("userId")]}
                              onMessage={(msg) => {
                                  this.handleMessage(msg);
                              }}
                              ref={ (client) => { this.clientRef = client }} />
            </nav>
        );
    }

}

const mapStateToProps = state => {
    return {
        orders: state.driverReducer
    }
};

const mapDispatchToProps = dispatch => {
    return ({
        addOrder: payload => { dispatch({type: ADD_ORDER, payload: payload})  },
        deleteOrder: payload => { dispatch({type: DELETE_ORDER, payload: payload})  }
    })
};

export default connect(mapStateToProps, mapDispatchToProps)(DriverHeader);