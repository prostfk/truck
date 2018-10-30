import React, {Component} from "react";
import {render} from 'react-dom'
import {Link} from "react-router-dom";

class pageManagerOrders extends Component {

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
             this.setState({orders:data});
         });
    }

    /*get active orders*/
    getOrderList() {
        return fetch('http://localhost:8080/api/manager/orders', {method: "get"}).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            return result;
        });
    }

    /*render row of table ( calls from html ) */
    renderTable(order) {
        if (!order) return;
        return <div className="row table_row">
            <div className="col-md-2">{order.client.name}</div>
            <div className="col-md-2">{order.sender.name}</div>
            <div className="col-md-2">{order.receiver.address}</div>
            <div className="col-md-2">{new Date(order.waybill.dateDeparture).toLocaleDateString()}</div>
            <div className="col-md-1">{new Date(order.waybill.dateArrival).toLocaleDateString()}</div>
            <div className="col-md-2">
                <Link to={`/manager/edit/consignment/${order.id}`} className="manager_ref">Товарная партия</Link>
            </div>
            <div className="col-md-1">
                <Link to={`/manager/edit/routelist/${order.id}`} className="manager_ref">Путевой лист</Link>
            </div>
        </div>
    }

    render() {
        return (
            <div className="row">
                <div className="offset-md-1 col-md-10 superuserform_companylist">
                    <div className="container">
                        <div className="row table_header">
                            <div className="col-md-2"><b>Клиент</b></div>
                            <div className="col-md-2"><b>Название склада (отправитель)</b></div>
                            <div className="col-md-2"><b>Название склада (получатель)</b></div>
                            <div className="col-md-2"><b>Дата отправления</b></div>
                            <div className="col-md-1"><b>Дата получения</b></div>
                            <div className="col-md-2"><b/></div>
                            <div className="col-md-1"><b/></div>
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