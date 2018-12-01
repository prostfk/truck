import React, {Component} from "react";
import {Link} from "react-router-dom";
import Pagination from "react-js-pagination";

class pageManagerOrders extends Component {

    constructor(props) {
        super(props);
        this.getOrderList = this.getOrderList.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.removeDoneOrder = this.removeDoneOrder.bind(this);
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
        let isDelivered = false;
        if (order.waybill.status === 2)
            isDone = true;
        if (order.waybill.status === 3)
            isDelivered = true;

        return <div className="row table_row animated fadeInUp">
            <div className="col-lg-1">{order.name}</div>
            <div className="col-lg-1">{order.client.name}</div>
            <div className="col-lg-2">{order.sender.name}</div>
            <div className="col-lg-1">{order.receiver.address}</div>
            <div className="col-lg-2">{new Date(order.waybill.dateDeparture).toLocaleDateString()}</div>
            <div className="col-lg-1">{new Date(order.waybill.dateArrival).toLocaleDateString()}</div>
            <div className="col-lg-4">
                <div className="row">
                    <div className="col-lg-5" style={{display: isDone ? 'none' : 'block'}}>
                        <Link to={`/manager/edit/consignment/${order.id}`}
                              className="table_button bg-secondary text-white">Тов.
                            партия</Link>
                    </div>
                    <div className="col-lg-4" style={{display: isDone || isDelivered ? 'none' : 'block'}}>
                        <Link to={`/manager/edit/routelist/${order.id}`}
                              className="table_button bg-secondary text-white">Пут.
                            лист</Link>
                    </div>
                    <div className="col-lg-3" style={{display: isDone || isDelivered ? 'none' : 'block'}}><a
                        onClick={this.finishCheck.bind(this, order.id)}
                        className="table_button bg-secondary text-white">Проверен</a></div>
                    <div className="col-lg-7" style={{display: isDone ? 'block' : 'none'}}>
                        <div className="table_button bg-secondary text-white"
                             onClick={this.cancelCheckingWaybill.bind(this, order.id)}>Отменить проверку
                        </div>
                    </div>
                    <div className="col-lg-5" style={{display: isDone ? 'block' : 'none'}}>
                        <b>Проверка завершена</b>
                    </div>
                    <div className="col-lg-7" style={{display: isDelivered ? 'block' : 'none'}}>
                        <a className="table_button bg-secondary text-white"
                             onClick={this.finishOrder.bind(this, order.id)}>Завершить заказ
                        </a>
                    </div>
                </div>
            </div>
        </div>
    }

    cancelCheckingWaybill(orderId) {
        console.log(orderId);
        const ref = this;
        fetch(`http://localhost:8080/api/manager/cancelChecking/${orderId}`, {
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

    finishOrder(orderId) {
        const ref = this;
        console.log(orderId);
        fetch(`http://localhost:8080/api/manager/finishOrder/${orderId}`, {
            method: "GET",
            headers: {'Auth-token': localStorage.getItem("Auth-token")}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            ref.removeDoneOrder(result);
            return result;
        }).catch((err) => {
            console.log(err);
        });
    }

    removeDoneOrder(order) {
        const ref = this;

        ref.state.orders.find((element, index) => {
            if (element.id === order.id) {
                const newOrders = ref.state.orders;
                newOrders.splice(index, 1);
                ref.setState({orders: newOrders});
            }
        });
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-12 superuserform_companylist">
                    <div className="container-fluid">
                        <div className="row table_header animated fadeIn">
                            <div className="col-lg-1"><b>Заказ</b></div>
                            <div className="col-lg-1"><b>Клиент</b></div>
                            <div className="col-lg-2"><b>Название склада (отправитель)</b></div>
                            <div className="col-lg-1"><b>Название склада (получатель)</b></div>
                            <div className="col-lg-2"><b>Дата отправления</b></div>
                            <div className="col-lg-1"><b>Дата получения</b></div>
                            <div className="col-lg-1"><b/></div>
                            <div className="col-lg-2"><b/></div>
                            <div className="col-lg-1"><b/></div>
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