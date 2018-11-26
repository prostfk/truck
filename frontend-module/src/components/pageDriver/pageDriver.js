import React from "react";
import {Link} from 'react-router-dom'

class DriverOrderList extends React.Component {
    constructor(props) {
        super(props);
        this.getOrderList = this.getOrderList.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.state = {
            orders: []
        };
        document.title = "Заказы"
    }

    componentDidMount() {
        this.getOrderList().then(data => {
            this.setState({orders: data});
        });
    }

    /*get all company list*/
    getOrderList() {
        return fetch('http://localhost:8080/api/orders/getMyOrders', {headers: {'Auth-token': localStorage.getItem('Auth-token')}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            return result;
        }).catch((err) => {
            console.log(err);
        });
    }

    /*render row of table ( calls from html ) */

    renderTable(order){
        if(!order) return;
        return <div className = "row table_row order_row animated fadeInUp">
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
                <Link to={`/driver/consignment/${order.id}`} className="table_button bg-secondary text-white">Тов.
                    партия</Link>
            </div>
        </div>
    }


    render() {
        return <div class="row">
            <div class="offset-lg-2 col-lg-8 superuserform_companylist animated fadeIn">
                <div className="row table_header">
                    <div className="col-md-2">Название</div>
                    <div className="col-md-2">Откуда</div>
                    <div className="col-md-2">Куда</div>
                    <div className="col-md-2">Дата Отпр/Прибытия</div>
                    <div className="col-md-2">Открыть</div>
                    <div className="col-md-2">Открыть</div>
                </div>
                {
                    this.state.orders.map((element) => {
                        return this.renderTable(element);
                    })
                }
            </div>
        </div>
    }
}

export default DriverOrderList;