import React from "react";
import {Link} from 'react-router-dom'
import {NotificationManager} from 'react-notifications';
import connect from "react-redux/es/connect/connect";
import {UPLOAD_ORDERS} from "../../constants/driverActionTypes";

class DriverOrderList extends React.Component {
    constructor(props) {
        super(props);
        this.getOrderList = this.getOrderList.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.updateOrderStatus = this.updateOrderStatus.bind(this);
        this.updateWayBill = this.updateWayBill.bind(this);
        this.state = {
            orders: []
        };
        document.title = "Заказы"
    }


    updateWayBill(newWayBill){
        if(!newWayBill) {
            NotificationManager.error("Возможно вы не прошли все контрольные точки","Ошибка");
            return;
        }
        let oldWayBills = this.state.orders;

        let newArray = oldWayBills.map(function(element) {
            if(element.waybill.id===newWayBill.id) {
                element.waybill = newWayBill;
                return element;
            }
            else return element;
        });
        this.setState({orders:newArray});
        NotificationManager.success("Вы успешно закончили поездку!");
    }

    componentDidMount() {
        let refThis = this;
        this.getOrderList().then(data => {
            refThis.setState({orders: data});
            refThis.props.setOrders(data);
/*            let newElem = {"id":1,"name":"Тестовый","status":1,"dateAccepted":[2018,12,5],"dateExecuted":[2018,12,4],"waybill":{"id":2,"status":2,"dateDeparture":[2018,12,20],"dateArrival":[2018,12,22],"driver":null,"auto":null,"routeListList":null},"sender":{"id":2,"address":"Неманская 56","name":"Неманская 56","active":true,"lat":53.9231175,"lng":27.429209600000036,"company":null,"stockSenderOrders":null,"stockReceiverOrders":null},"receiver":{"id":1,"address":"Революционная 15","name":"Революционная 14","active":true,"lat":53.9017861,"lng":27.550358200000005,"company":null,"stockSenderOrders":null,"stockReceiverOrders":null},"company":null,"client":{"id":2,"name":"Евроопт Гродно","type":"default","company":null,"clientOrders":null},"consignment":null};
            refThis.props.addOrder(newElem);*/
        });
    }

    /*get all company list*/
    getOrderList() {
        return fetch('/api/orders/getMyOrders', {headers: {'authorization': localStorage.getItem('authorization')}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            return result;
        }).catch(() => {
            NotificationManager.error("Ошибка", 'Попробуйте позже');
        });
    }

    updateOrderStatus(orderId,status){
        if(status!==2 && status!==3) return;
        let refThis = this;
        /*/orders/getMyOrders/{orderId}/setNewStatus*/
        fetch('/api/orders/getMyOrders/'+orderId+'/setNewStatus', {
            method: "PUT",
            headers: {'authorization': localStorage.getItem('authorization')},
            body:status
        }
           ).then(function (response) {
            return response.json();
        }).then(function (result) {
            if(!result) {
                return;
            }
            refThis.updateWayBill(result);
            return result;
        }).catch((err) => {
            NotificationManager.error("Возможно вы не проехали все точки, или заказ уже закрыт","Ошибка");
        });
    }


    /*render row of table ( calls from html ) */

    renderTable(order, index) {
        if (!order) return;
        let buttonAction = order.waybill.status===2?
            <a onClick={()=>{this.updateOrderStatus(order.id,3)}} className="table_button bg-secondary text-white">Завершить заказ</a>:"Заказ завершен"

        return <div key={index} className="row table_row order_row animated fadeInUp">
            <div className="col-md-2">{order.name}</div>
            <div className="col-md-2" title={order.sender.name}>{order.sender.address}</div>
            <div className="col-md-2" title={order.receiver.name}>{order.receiver.address}</div>
            <div
                className="col-md-2">{new Date(order.waybill.dateDeparture).toLocaleDateString()}<br></br>{new Date(order.waybill.dateArrival).toLocaleDateString()}
            </div>
            <div className="col-md-2">
                <Link to={`/myorders/routelist/${order.id}`} className="table_button bg-secondary text-white">Путевой
                    лист</Link>
            </div>
            <div className="col-md-2">
                {buttonAction}
            </div>
        </div>
    }


    render() {
        return <div className="row">
            <div className="offset-lg-2 col-lg-8 superuserform_companylist animated fadeIn">
                <div className="row table_header">
                    <div className="col-md-2">Название</div>
                    <div className="col-md-2">Откуда</div>
                    <div className="col-md-2">Куда</div>
                    <div className="col-md-2">Дата Отпр/Прибытия</div>
                    <div className="col-md-2">Открыть</div>
                    <div className="col-md-2">Путь</div>
                </div>
                {
                    this.props.orders.map((element, index) => {
                        return this.renderTable(element, index);
                    })
                }
            </div>
        </div>
    }
}

const mapStateToProps = state => {
    return {
        orders: state.driverReducer
    }
};

const mapDispatchToProps = dispatch => {
    return ({
        setOrders: payload => { dispatch({type: UPLOAD_ORDERS, payload: payload})  }
    })
};

export default connect(mapStateToProps, mapDispatchToProps)(DriverOrderList);