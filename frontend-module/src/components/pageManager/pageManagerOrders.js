import React, {Component} from "react";
import {Link} from "react-router-dom";
import ModalChooseWaybillStatus from "./modalChooseWaybillStatus";
import Pagination from "react-js-pagination";

class pageManagerOrders extends Component {

    constructor(props) {
        super(props);
        this.getOrderList = this.getOrderList.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.changeWaybillStatus = this.changeWaybillStatus.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.state = {
            orders: [],
            totalElements: 0,
            currentPage: 1
        };
        document.title = "Заказы"
    }

    componentDidMount() {
        this.getOrderList().then(data => {
            this.setState({
                orders: data.content,
                totalElements: data.totalElements,
                currentPage: ++data.number
            });
        });
    }

    forceUpdateHandler(order) {
        console.log(order);
        const ref = this;
        ref.state.orders.find((element, index) => {
            if (element.id === order.id) {
                const newOrders = ref.state.orders;
                newOrders[index] = order;
                ref.setState({orders: newOrders});
            }
        });
    }

    /*get active orders*/
    getOrderList(pageid = 1) {
        return fetch('http://localhost:8080/api/manager/orders?page=' + pageid, {
            method: "get",
            headers: {'Auth-token': localStorage.getItem("Auth-token")}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            return result;
        });
    }

    handlePageChange(pageNumber) {
        this.getOrderList(pageNumber).then(data => {
            this.setState({
                orders: data.content,
                totalElements: data.totalElements,
                currentPage: ++data.number
            });
        });
        this.setState({currentPage: pageNumber});
    }

    /*render row of table ( calls from html ) */
    renderTable(order) {
        if (!order) return;

        let isDone = false;
        if (order.waybill.status === 2)
            isDone = true;
        return <div className="row table_row">
            <div className="col-md-1">{order.client.name}</div>
            <div className="col-md-2">{order.sender.name}</div>
            <div className="col-md-1">{order.receiver.address}</div>
            <div className="col-md-2">{new Date(order.waybill.dateDeparture).toLocaleDateString()}</div>
            <div className="col-md-1">{new Date(order.waybill.dateArrival).toLocaleDateString()}</div>
            <div className="col-md-3" style={{display: isDone ? 'block' : 'none'}}>
                <div className="row">
                    <div className="col-md-9">
                        <ModalChooseWaybillStatus className={"table_button bg-secondary text-white"}
                                                  clickfunc={this.changeWaybillStatus} orderId={order.id}
                                                  waybillStatus={order.waybill.status}></ModalChooseWaybillStatus>
                    </div>
                    <div className="col-md-3"><b>Проверка завершена</b></div>
                </div>
            </div>
            <div className="col-md-2" style={{display: isDone ? 'none' : 'block'}}>
                <Link to={`/manager/edit/consignment/${order.id}`} className="table_button bg-secondary text-white">Товарная
                    партия</Link>
            </div>
            <div className="col-md-2" style={{display: isDone ? 'none' : 'block'}}>
                <Link to={`/manager/edit/routelist/${order.id}`} className="table_button bg-secondary text-white">Путевой
                    лист</Link>
            </div>
            <div className="col-md-1" style={{display: isDone ? 'none' : 'block'}}><a
                onClick={this.finishCheck.bind(this, order.id)}
                className="table_button bg-secondary text-white">Проверен</a></div>
        </div>
    }

    changeWaybillStatus(orderId, waybillStatus) {
        console.log(orderId);
        console.log(waybillStatus);
        const ref = this;
        fetch(`http://localhost:8080/api/manager/cancelChecking/${orderId}/?status=${waybillStatus}`, {
            method: 'GET',
            headers: {'Auth-token': localStorage.getItem("Auth-token")}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            if (result) {
                ref.forceUpdateHandler(result);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    finishCheck(orderId) {
        const ref = this;
        console.log(orderId);
        fetch(`http://localhost:8080/api/manager/finishChecking/${orderId}`, {
            method: "GET",
            headers: {'Auth-token': localStorage.getItem("Auth-token")}
        }).then(function (response) {
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
                <div className="offset-md-1 col-md-10 superuserform_companylist">
                    <div className="container-fluid">
                        <div className="row table_header">
                            <div className="col-md-1"><b>Клиент</b></div>
                            <div className="col-md-2"><b>Название склада (отправитель)</b></div>
                            <div className="col-md-1"><b>Название склада (получатель)</b></div>
                            <div className="col-md-2"><b>Дата отправления</b></div>
                            <div className="col-md-1"><b>Дата получения</b></div>
                            <div className="col-md-2"><b></b></div>
                            <div className="col-md-2"><b></b></div>
                            <div className="col-md-1"><b></b></div>
                        </div>
                        {
                            this.state.orders.map((element) => {
                                return this.renderTable(element);
                            })
                        }
                        <div className="table_footer">
                            <Pagination
                                activePage={this.state.currentPage}
                                totalItemsCount={this.state.totalElements}
                                itemsCountPerPage={5}
                                pageRangeDisplayed={5}
                                hideDisabled={true}
                                itemClass={"page-item"}
                                linkClass={"page-link"}
                                activeClass={"activePage"}
                                onChange={this.handlePageChange}
                            />
                        </div>
                    </div>

                </div>

            </div>

        );
    }
}

export default pageManagerOrders;