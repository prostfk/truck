import React, {Component} from "react";
import {render} from 'react-dom'
import {Link} from "react-router-dom";

class pageManagerOrders extends Component {

    constructor(props) {
        super(props);
        this.getOrderList = this.getOrderList.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.state = {
            orders: []
        };
        document.title = "Заказы"
    }

    componentDidMount() {
         this.getOrderList().then(data => {
             this.setState({orders:data});
         });
    }

    forceUpdateHandler(order) {
        console.log(order);
        const ref = this;
        ref.state.orders.find((element, index)=>{
            if(element.id===order.id){
                const newOrders = ref.state.orders;
                newOrders[index] = order;
                ref.setState({orders:newOrders});
            }
        });
    }
    /*get active orders*/
    getOrderList() {
        return fetch('http://localhost:8080/api/manager/orders', {method: "get", headers: {'Auth-token': sessionStorage.getItem("Auth-token")}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            return result;
        });
    }

    /*render row of table ( calls from html ) */
    renderTable(order) {
        if (!order) return;

        let isDone = false;
        if(order.waybill.status === "DONE")
            isDone = true;
        return <div className="row table_row">
            <div className="col-md-2">{order.client.name}</div>
            <div className="col-md-2">{order.sender.name}</div>
            <div className="col-md-2">{order.receiver.address}</div>
            <div className="col-md-1">{new Date(order.waybill.dateDeparture).toLocaleDateString()}</div>
            <div className="col-md-1">{new Date(order.waybill.dateArrival).toLocaleDateString()}</div>
            <div className="col-md-4" style={{display: isDone ? 'block' : 'none'}}>Проверка завершена</div>
            <div className="col-md-2" style={{display: isDone ? 'none' : 'block'}}>
                <Link to={`/manager/edit/consignment/${order.id}`} className="table_button bg-secondary text-white">Товарная партия</Link>
            </div>
            <div className="col-md-1" style={{display: isDone ? 'none' : 'block'}}>
                <Link to={`/manager/edit/routelist/${order.id}`} className="table_button bg-secondary text-white">Путевой лист</Link>
            </div>
            <div className="col-md-1" style={{display: isDone ? 'none' : 'block'}}><a onClick={this.finishCheck.bind(this, order.id)} className="table_button bg-secondary text-white">Проверен</a></div>
        </div>
    }

    finishCheck(orderId) {
        const ref = this;
        console.log(orderId);
        fetch(`http://localhost:8080/api/manager/finishChecking/${orderId}`, {method: "GET", headers: {'Auth-token': sessionStorage.getItem("Auth-token")}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            ref.forceUpdateHandler(result);
            return result;
        }).catch((err) => {
            console.log(err);
        });
    }
    render() {
        return (
            <div className="row">
                <div className=" col-md-10 superuserform_companylist">
                    <div className="container">
                        <div className="row table_header">
                            <div className="col-md-2"><b>Клиент</b></div>
                            <div className="col-md-2"><b>Название склада (отправитель)</b></div>
                            <div className="col-md-2"><b>Название склада (получатель)</b></div>
                            <div className="col-md-1"><b>Дата отправления</b></div>
                            <div className="col-md-1"><b>Дата получения</b></div>
                            <div className="col-md-2"><b></b></div>
                            <div className="col-md-1"><b></b></div>
                            <div className="col-md-1"><b></b></div>
                        </div>
                        {
                            this.state.orders.map((element)=>{
                                return this.renderTable(element);
                            })
                        }
                        <div className="table_footer">
                            <nav aria-label="...">
                                <ul className="pagination pagination-sm">
                                    <li className="page-item disabled">
                                        <a className="page-link" href="#" tabIndex="-1">1</a>
                                    </li>
                                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>

                </div>

            </div>

        );
    }
}

export default pageManagerOrders;