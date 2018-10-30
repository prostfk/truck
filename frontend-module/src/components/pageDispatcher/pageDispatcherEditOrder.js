import {Component} from 'react'
import React from "react";
import CommonUtil from '../commonUtil/commontUtil'


class DispatcherEditOrder extends Component {

    constructor(props) {
        super(props);
        this.changeInput = this.changeInput.bind(this);
        this.initOrder = this.initOrder.bind(this);
        this.sendInfoToServer = this.sendInfoToServer.bind(this);
        this.setValuesFromJson = this.setValuesFromJson.bind(this);
        this.changeDate = this.changeDate.bind(this);
        // this.fetchToCompany = this.fetchToCompany.bind(this);
        this.state = {
            companyNameForSearch: "",
            name: "",
            stocksAddressForSearch: "",
            companyName: "",
            client_id: "",
            departure_stock: "",
            delivery_stock: "",
            status: "",
            waybill_status: "",
            driver: "",
            auto: "",
            date_departure: "14/07/2018",
            date_arrival: "01/01/2019",
            company: "",
            order: {},
            client: {},
            companyObj: {},
            receiver: {},
            sender: {},
            waybill: {},
            consignment: []
        };
        this.initOrder();
    }

    sendInfoToServer() {
        console.log(this.state.order);
        this.setState({
            companyObj: {
                name: this.state.company
            },
            receiver: {
                address: this.state.delivery_stock
            },
            sender: {
                address: this.state.departure_stock,
                company: this.state.company
            },
            waybill: {
                status: this.state.waybill_status,
                auto: this.state.auto,
                driver: this.state.driver,
                dateArrival: this.state.date_arrival,
                dateDeparture: this.state.date_departure
            },
            order: {
                dateAccepted: this.state.date_departure,
                dateExecuted: this.state.date_arrival,
                id: this.state.order.id,
                name: this.state.name
            }
        });
        let formData = new FormData();
        formData.append("clientId", this.state.client_id);
        formData.append("name", this.state.name);
        formData.append("status", this.state.status);
        formData.append("departureStock", this.state.departure_stock);
        formData.append("deliveryStock", this.state.delivery_stock);
        formData.append("dateArrival", this.state.date_departure);
        formData.append("dateDeparture", this.state.date_arrival);
        formData.append("waybillStatus", this.state.waybill_status);
        formData.append("autoId", this.state.auto);
        formData.append("driverId", this.state.driver);
        formData.append("orderId", this.state.order.id);
        formData.append("waybillId", this.state.order.waybill.id);
        console.log(this.state);
        formData.forEach((v, k) => {
            console.log(`${v} - ${k}`);
        });
        fetch('http://localhost:8080/api/companies/orders/edit', {
            method: 'POST',
            headers: {'Auth-token': sessionStorage.getItem('Auth-token')},
            body: formData
        }).then(response => {
            return response.json()
        }).then(data => {
            if (data.error === undefined){
                this.showConsignmentHideOrder();
                document.getElementById('success-order-span').innerText = 'Изменено';

            }
        })
    }

    setValuesFromJson() {

    }

    initOrder() {
        let link = document.location.href.split("/");
        let id = link[link.length - 2];
        fetch(`http://localhost:8080/api/orders/${id}`, {headers: {'Auth-token': sessionStorage.getItem('Auth-token')}}).then(response => {
            return response.json()
        }).then(data => {
            console.log(data);
            this.setState({
                order: data,
                date_departure: CommonUtil.getCorrectDateFromLong(data.dateAccepted),
                date_arrival: CommonUtil.getCorrectDateFromLong(data.dateExecuted),
                status: data.status,
                name: data.name,
                companyNameForSearch: data.client.name,
                auto: data.waybill.auto.id,
                driver: data.waybill.driver.id,
                departure_stock: data.sender.id,
                delivery_stock: data.receiver.id,
                company: data.company.id,
                client_id: data.client.id,
                waybill_status: data.waybill.status,
            });
            document.getElementById('auto').innerHTML = `<option value="${this.state.order.waybill.auto.id}">${this.state.order.waybill.auto.name}</option>`;
            document.getElementById('driver').innerHTML = `<option value="${this.state.order.waybill.driver.id}">${this.state.order.waybill.driver.name}</option>`;
            document.getElementById('departure_stock').innerHTML = `<option value="${this.state.order.sender.id}">${this.state.order.sender.address}</option>`;
            document.getElementById('delivery_stock').innerHTML = `<option value="${this.state.order.receiver.id}">${this.state.order.receiver.address}</option>`;
            document.getElementById('client_id').innerHTML = `<option value="${this.state.order.company.id}">${this.state.order.company.name}</option>`;
            console.log(this.state);
            // this.setValuesFromJson()
        });

    }

    changeInput(event) {
        this.setState({
            [event.target.id]: [event.target.value]
        });
    }

    changeCompany = (event) => {
        this.setState({
            [event.target.id]: [event.target.value]
        });
        console.log("CHANGE COMPANY");
        this.fetchToUserStocks();
        this.fetchToStocks(this.state.client_id);
    };

    changeDate(event) {
        if (CommonUtil.isDateCorrect(event.target.value)) {
            this.setState({
                [event.target.id]: [event.target.value]
            })
        }
    }

    fetchToCompany = (event) => {
        this.setState({
            companyNameForSearch: [event.target.value]
        });
        if (event.target.value !== '') {
            fetch(`http://localhost:8080/api/clients/findClientsByNameLike?name=${this.state.companyNameForSearch}`, {headers: {'Auth-token': sessionStorage.getItem("Auth-token")}})
                .then(response => {
                    return response.json()
                }).then(data => {
                this.addCompaniesInSelect(data);
            });
            document.getElementById('client_id').style.display = '';
        } else {
            document.getElementById('client_id').style.display = 'none';
        }
        this.fetchToUserStocks();
        this.fetchToStocks(this.state.client_id);

    };

    fetchToUserStocks = () => {
        // fetch(`http://localhost:8080/api/companies/${companyId}/stocks`, {headers: {'Auth-token': sessionStorage.getItem("Auth-token")}}).then(response => response.json()).then(data => {
        fetch(`http://localhost:8080/api/companies/findStocksByUsername`, {headers: {'Auth-token': sessionStorage.getItem("Auth-token")}}).then(response => response.json()).then(data => {
            let html = '';
            if (data.status === 404) return;
            console.log(data);
            data.map(stock => {
                html += `<option value="${stock.id}">${stock.address}</option>`
            });
            document.getElementById('departure_stock').innerHTML = html;
            this.setState({
                departure_stock: this.state.order.sender.id
            })
        })
    };

    fetchToStocks = (id) => {
        fetch(`http://localhost:8080/api/companies/${id}/stocks`, {headers: {'Auth-token': sessionStorage.getItem("Auth-token")}}).then(response => response.json()).then(data => {
            let html = '';
            if (data.status === 404) return;
            console.log(data);
            data.map(stock => {
                html += `<option value="${stock.id}">${stock.address}</option>`
            });
            document.getElementById('delivery_stock').innerHTML = html;
            this.setState({
                departure_stock: this.state.order.sender.id
            })
        })
    };

    addCompaniesInSelect(companies) {
        let html = '';
        if (companies.length === 0) return;
        companies.map(client => {
            html += `<option value=${client.id}>${client.name}</option>`
        });
        document.getElementById('client_id').innerHTML = html;
        this.state.client_id = this.state.order.client.id;
    }

    showOrderHideConsignment = () => {
        document.getElementById('order-form').style.display = '';
        document.getElementById('consignment-form').style.display = 'none';
    };

    showConsignmentHideOrder = () => {
        document.getElementById('order-form').style.display = 'none';
        document.getElementById('consignment-form').style.display = '';
    };

    render() {
        let none = {
            display: 'none'
        };
        let green = {
            color: 'green'
        };
        return (
            <div>
                <span className="text-center" style={green} id={'success-order-span'}/>
                <div className="row" id={'order-form'}>
                    <div className="offset-md-1 col-md-6 superuserform_companylist">
                        <div className="row">
                            <div className="col-md-6">
                                <h3>Основное</h3>
                                <small className="form-text text-muted">Наименование товара</small>
                                <input value={this.state.name} onChange={this.changeInput} type="text"
                                       className="form-control" id="name" placeholder="Наименование товара"/>

                                <small className="form-text text-muted">Компания- заказчик перевозки</small>
                                <input value={this.state.companyNameForSearch} onChange={this.fetchToCompany} type="text"
                                       className="form-control" id="companyNameForSearch" placeholder="Заказчик"/>


                                <select className={'form-control'} value={this.state.client_id}
                                        onClick={this.setCustomerCompany} onChange={this.changeCompany}
                                        name="client_id" id="client_id">
                                </select>

                                <small className="form-text text-muted">Адрес Отправления</small>
                                <select value={this.state.departure_stock} onChange={this.changeInput}
                                        className="form-control" id="departure_stock" placeholder="Откуда"/>


                                <small className="form-text text-muted">Адрес Доставки</small>
                                <select value={this.state.delivery_stock} onChange={this.changeInput}
                                        className="form-control" id="delivery_stock" placeholder="Куда">
                                </select>

                                <div className="form-group">
                                    <small className="form-text text-muted">Сатус заказа</small>
                                    <select onChange={this.changeInput} value={this.state.status} className="form-control"
                                            id="status">
                                        <option selected disabled>Статус</option>
                                        <option>Принят</option>
                                        <option>Отклонен</option>
                                        <option>Выполен</option>
                                        <option>Не выполнен</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <h3>ТТН</h3>

                                <small className="form-text text-muted">Статус</small>
                                <select onChange={this.changeInput} value={this.state.waybill_status}
                                        className="form-control"
                                        id="waybill_status">
                                    <option selected disabled>Статус</option>
                                    <option>Оформлен</option>
                                    <option>Проверка завершена</option>
                                    <option>Доставлен</option>
                                </select>


                                <small className="form-text text-muted">Дата отправления</small>
                                <input value={this.state.date_departure} onChange={this.changeInput} type="text"
                                       className="form-control" id="date_departure" placeholder="14.10.2015"/>
                                <span className={'error-span'} id={'error-span-date_departure'}/>

                                <small className="form-text text-muted">Дата прибытия</small>
                                <input value={this.state.date_arrival} onChange={this.changeInput} type="text"
                                       className="form-control" id="date_arrival" placeholder="15.10.2016"/>
                                <span className={'error-span'} id={'error-span-date_arrival'}/>


                                <small className="form-text text-muted">Водитель</small>
                                <select onChange={this.changeInput} value={this.state.driver} className="form-control"
                                        id="driver">
                                    <option selected disabled>Водитель</option>

                                </select>

                                <small className="form-text text-muted">Автомобиль</small>
                                <select onChange={this.changeInput} value={this.state.auto} className="form-control"
                                        id="auto">
                                    <option selected disabled>Авто</option>
                                </select>

                            </div>
                        </div>
                    </div>
                    <div className="offset-md-2 col-md-8 form_clear">
                        <a onClick={this.sendInfoToServer} id={'order-submit-button'} className="btn btn-success btn_fullsize">Сохранить</a>
                    </div>
                </div>
                <div style={none} id={'consignment-form'}>
                    <div className="d-flex justify-content-center align-items-center">
                        <form className="form-inline align-content-center" onSubmit={(e) => {e.preventDefault()}}>
                            <button className={'btn btn-secondary'} onClick={this.showOrderHideConsignment}>Вернуться к заказу</button>
                            <div className="form-group">
                                <label htmlFor="consignment">Название товара</label>
                                <input type="text" id="newConsignmentName" value={this.state.newConsignmentName}
                                       onChange={this.changeInput} className="form-control mx-sm-3"/>
                                <button type={'button'} className="btn btn-success"
                                        onClick={this.addConsignment}>Добавить
                                </button>
                                <button type={'button'} className="btn btn-primary"
                                        onClick={this.sendConsignment}>Отправить
                                </button>

                            </div>
                        </form>
                    </div>
                    <div className="">
                        <ul id='lis' className="list-group">
                            {
                                this.state.consignment.map((item, index) =>
                                    <li className={'list-group-item list-group-item-secondary text-center'} key={index}>{item}   -
                                        <span aria-hidden="true">&times;</span>
                                    </li>

                                )
                            }
                        </ul>
                    </div>
                </div>
            </div>
        );
    }


}

export default DispatcherEditOrder;
