import {Component} from 'react'
import React from "react";
import CommonUtil from '../commonUtil/commontUtil'
import ValidationUtil from "../commonUtil/validationUtil";


export default class DispatcherEditOrder extends Component {

    constructor(props) {
        super(props);
        this.changeInput = this.changeInput.bind(this);
        this.initOrder = this.initOrder.bind(this);
        this.sendInfoToServer = this.sendInfoToServer.bind(this);
        this.changeDate = this.changeDate.bind(this);
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
            date_departure: CommonUtil.getCorrectDateFromLong(new Date(new Date().getTime() + 86400000)),
            date_arrival: CommonUtil.getCorrectDateFromLong(new Date(new Date().getTime() + 86400000)),
            company: "",
            orderId: '',
            order: {},
            client: {},
            companyObj: {},
            receiver: {},
            sender: {},
            waybill: {},
            consignment: [],
            newConsignmentName: "",
            newOrderId: "",
            newProductName: "",
            newProductStatus: ["1"],
            newProductDescription: "",
            newProductPrice: "",
            newProductCount: "",
            newProduct: {},
            consignmentId: ""
        };

        this.initOrder();

    }

    validateOrderForm = () => {
        let clientIdValidation = ValidationUtil.validateForNumber(this.state.client_id);
        let nameValidation = ValidationUtil.validateStringForLength(typeof this.state.name === "string" ? this.state.name : this.state.name.join(''), 3, 20);
        let dateArrivalValidation = ValidationUtil.validateDateToPattern(this.state.date_arrival);
        let dateDepartureValidation = ValidationUtil.validateDateToPattern(this.state.date_departure);
        let validateAuto = ValidationUtil.validateForNumber(this.state.auto);
        let validateDriver = ValidationUtil.validateForNumber(this.state.driver);
        if (!clientIdValidation) {
            document.getElementById('client-error-span').innerText = "Неправильные данные";
        } else {
            document.getElementById('client-error-span').innerText = "";
        }
        if (!nameValidation) {
            document.getElementById('name-error-span').innerText = `Неправильное название ${this.state.name}`;
        }else{
            document.getElementById('name-error-span').innerText = "";
        }
        if (!dateArrivalValidation || !dateDepartureValidation) {
            document.getElementById('date-error-span').innerText = "Неправильная дата";
        }else{
            document.getElementById('date-error-span').innerText = "";
        }
        if (!validateAuto){
            document.getElementById('auto-error-span').innerText = 'Неправильное значение';
        }else{
            document.getElementById('auto-error-span').innerText = '';
        }
        if (!validateDriver){
            document.getElementById('driver-error-span').innerText = 'Неправильное значение';
        }else{
            document.getElementById('driver-error-span').innerText = '';
        }
        return clientIdValidation && nameValidation && dateArrivalValidation && dateDepartureValidation && validateAuto && validateDriver;
    };

    sendInfoToServer() {
        if (this.validateOrderForm()){
            let formData = new FormData();
            formData.append("orderId", this.state.order.id);
            formData.append("clientId", this.state.client_id);
            formData.append("name", this.state.name);
            formData.append("status", this.state.status);
            formData.append("departureStock", this.state.departure_stock);
            formData.append("deliveryStock", this.state.delivery_stock);
            formData.append("dateArrival", this.state.date_arrival);
            formData.append("dateDeparture", this.date_departure);
            formData.append("waybillStatus", this.state.waybill_status);
            formData.append("autoId", this.state.auto);
            formData.append("driverId", this.state.driver);
            formData.append("waybillId", this.state.order.waybill.id);
            formData.append("consignmentId", this.state.consignmentId);
            formData.append("consignment", JSON.stringify(this.state.consignment));
            fetch('http://localhost:8080/api/companies/orders/edit', {
                method: 'POST',
                headers: {'Auth-token': localStorage.getItem('Auth-token')},
                body: formData
            }).then(response => {
                return response.json()
            }).then(data => {
                if (data.error === undefined) {
                    this.props.history.push('/orders');
                }
            })
        }
    }

    initOrder() {
        let link = document.location.href.split("/");
        let id = link[link.length - 2];
        fetch(`http://localhost:8080/api/orders/${id}`, {headers: {'Auth-token': localStorage.getItem('Auth-token')}}).then(response => {
            return response.json()
        }).then(data => {
            console.log(data);
            this.setState({
                order: data,
                date_departure: CommonUtil.getCorrectDateFromLong(data.dateExecuted),
                date_arrival: CommonUtil.getCorrectDateFromLong(data.dateAccepted),
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
                orderId: data.id,
                consignmentId: data.consignment.id
            });
            document.getElementById('auto').innerHTML = `<option value="${this.state.order.waybill.auto.id}">${this.state.order.waybill.auto.name}</option>`;
            document.getElementById('driver').innerHTML = `<option value="${this.state.order.waybill.driver.id}">${this.state.order.waybill.driver.name}</option>`;
            document.getElementById('departure_stock').innerHTML = `<option value="${this.state.order.sender.id}">${this.state.order.sender.address}</option>`;
            document.getElementById('delivery_stock').innerHTML = `<option value="${this.state.order.receiver.id}">${this.state.order.receiver.address}</option>`;
            document.getElementById('client_id').innerHTML = `<option value="${this.state.order.client.id}">${this.state.order.client.name}</option>`;
            this.fetchToUserStocks();
            console.log(this.state);
            console.log(this.state.consignment);
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
    };

    changeDate(event) {
        if (CommonUtil.isDateCorrect(event.target.value)) {
            this.setState({
                [event.target.id]: [event.target.value]
            });
            this.findAutos();
            this.findDrivers();
        }
    }

    fetchToCompany = (event) => {
        this.setState({
            companyNameForSearch: [event.target.value]
        });
        if (event.target.value !== '') {
            fetch(`http://localhost:8080/api/clients/findClientsByNameLike?name=${this.state.companyNameForSearch}`, {headers: {'Auth-token': localStorage.getItem("Auth-token")}})
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
    };

    fetchToUserStocks = () => {
        fetch(`http://localhost:8080/api/companies/findStocksByUsername`, {headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(response => response.json()).then(data => {
            let html = '';
            if (data.status === 404) return;
            console.log(data);
            data.map(stock => {
                html += `<option value="${stock.id}">${stock.address}</option>`
            });
            document.getElementById('departure_stock').innerHTML = html;
            document.getElementById('delivery_stock').innerHTML = html;
            this.setState({
                departure_stock: this.state.order.sender.id,
                delivery_stock: this.state.order.receiver.id
            })
        })
    };

    findAutos() {
        let dd = this.state.date_departure;
        let da = this.state.date_arrival;
        fetch(`http://localhost:8080/api/company/findFreeAutos?dateFrom=${dd}&dateTo=${da}`, {headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(response => response.json().then(data => {
            let autoHtml = '';
            console.log(data);
            data.map(auto => {
                autoHtml += `<option value=${auto.id}>${auto.name}</option>`;
            });
            document.getElementById('auto').innerHTML = autoHtml;
            // this.setDefault();
        })).catch(err=>{
            throw new Error('Нет доступа к свободным авто');
        })
    }

    findDrivers() {
        let dd = this.state.date_departure;
        let da = this.state.date_arrival;
        fetch(`http://localhost:8080/api/company/findFreeDrivers?dateFrom=${dd}&dateTo=${da}`, {headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(response => response.json()).then(data => {
            console.log(data);
            let driverHtml = '';
            data.map(driver => {
                driverHtml += `<option value=${driver.id}>${driver.name}</option>`
            });
            document.getElementById('driver').innerHTML = driverHtml;
            // this.setDefault();
        }).catch(err=>{
            throw new Error('Нет доступа к свободным водителям');
        })
    }

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
        if (this.validateOrderForm()){
            document.getElementById('order-form').style.display = 'none';
            document.getElementById('consignment-form').style.display = '';
            document.getElementById('sendOrderRequestButton').style.display = '';
            if (this.state.consignment.length === 0){
                fetch(`http://localhost:8080/api/orders/${this.state.orderId}/consignment`,{headers: {'Auth-token': localStorage.getItem('Auth-token')}}).then(response => {
                    return response.json();
                }).then(data => {
                    console.log(this.state);
                    console.log(data);
                    if (data.error === undefined) {
                        let array = [];
                        for (let i = 0; i < data.productList.length; i++) {
                            array.push(data.productList[i]);
                        }
                        this.setState({
                            consignment: array
                        });
                        console.log(array);
                        console.log(this.state);
                    }
                })
            }
        }
    };

    addProduct = (event) => {
        event.preventDefault();
        let product = {
            name: this.state.newProductName.join(''),
            status: Array.isArray(this.state.newProductStatus) ? this.state.newProductStatus.join('') : this.state.newProductStatus,
            description: this.state.newProductDescription.join(''),
            price: this.state.newProductPrice.join(''),
            count: this.state.newProductCount.join('')
        };
        this.setState({
            consignment: [...this.state.consignment, product],
            newConsignmentName: ''
        });
        console.log(product);
        document.getElementById('newProductName').focus();
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
                    <div className="offset-md-2 col-md-8 superuserform_companylist">
                        <div className="row">
                            <div className="col-md-6">
                                <h3>Основное</h3>
                                <small className="form-text text-muted">Наименование Заказа</small>
                                <input value={this.state.name} onChange={this.changeInput} type="text"
                                       className="form-control" id="name" placeholder="Наименование заказа"/>
                                <span id="name-error-span" className={'error-span'}/>

                                <small className="form-text text-muted">Компания- заказчик перевозки</small>
                                <input value={this.state.companyNameForSearch} onChange={this.fetchToCompany}
                                       type="text"
                                       className="form-control" id="companyNameForSearch" placeholder="Заказчик"/>


                                <select className={'form-control'} value={this.state.client_id}
                                        onClick={this.setCustomerCompany} onChange={this.changeCompany}
                                        name="client_id" id="client_id">
                                </select>
                                <span id="client-error-span" className={'error-span'}/>


                                <small className="form-text text-muted">Адрес Отправления</small>
                                <select value={this.state.departure_stock} onChange={this.changeInput}
                                        className="form-control" id="departure_stock" placeholder="Откуда"/>


                                <small className="form-text text-muted">Адрес Доставки</small>
                                <select value={this.state.delivery_stock} onChange={this.changeInput}
                                        className="form-control" id="delivery_stock" placeholder="Куда">
                                </select>

                                <div className="form-group">
                                    <small className="form-text text-muted">Сатус заказа</small>
                                    <select onChange={this.changeInput} value={this.state.status}
                                            className="form-control"
                                            id="status">
                                        <option selected disabled>Статус</option>
                                        <option value={'1'}>Принят</option>
                                        <option value={'2'}>Отклонен</option>
                                        <option value={'3'}>Выполен</option>
                                        <option value={'4'}>Не выполнен</option>
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
                                    <option value={'1'}>Оформлен</option>
                                    <option value={'2'}>Проверка завершена</option>
                                    <option value={'3'}>Доставлен</option>
                                </select>


                                <small className="form-text text-muted">Дата отправления</small>
                                <input value={this.state.date_departure} onChange={this.changeDate} type="text"
                                       className="form-control" id="date_departure" placeholder="14.10.2015"/>

                                <small className="form-text text-muted">Дата прибытия</small>
                                <input value={this.state.date_arrival} onChange={this.changeDate} type="text"
                                       className="form-control" id="date_arrival" placeholder="15.10.2016"/>
                                <span id="date-error-span" className={'error-span'}/>


                                <small className="form-text text-muted">Водитель</small>
                                <select onChange={this.changeInput} value={this.state.driver} className="form-control"
                                        id="driver">
                                    <option selected disabled>Водитель</option>

                                </select>
                                <span id="driver-error-span" className={'error-span'}/>


                                <small className="form-text text-muted">Автомобиль</small>
                                <select onChange={this.changeInput} value={this.state.auto} className="form-control"
                                        id="auto">
                                    <option selected disabled>Авто</option>
                                </select>
                                <span id="auto-error-span" className={'error-span'}/>


                            </div>
                        </div>
                    </div>
                    <div className="offset-md-2 col-md-8 form_clear">
                        <a onClick={this.showConsignmentHideOrder} id={'order-submit-button'}
                           className="btn btn-success btn_fullsize">Продолжить</a>
                    </div>
                </div>
                <div style={none} id={'consignment-form'}>
                    <div className="offset-md-2 col-md-8 form_clear">
                        <form className="align-content-center" onSubmit={(e) => {e.preventDefault()}}>
                            <button className="btn btn-light" onClick={this.showOrderHideConsignment}>Вернуться к заказу</button>
                            <h3>Товарная партия</h3>
                            <div className="row">
                                <div className="col-md-3">
                                    <input type="text" id="newProductName" value={this.state.newProductName}
                                           onChange={this.changeInput} className="form-control" placeholder={"Название"}/>
                                </div>
                                <div className="col-md-2">
                                    <select className="custom-select" onChange={this.changeInput} value={this.state.newProductStatus} id="newProductStatus">
                                        <option value={'1'}>Принят</option>
                                        <option value={'2'}>Проверка завершена</option>
                                        <option value={'3'}>Доставлен</option>
                                        <option value={'4'}>Утерян</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <input type="text" id="newProductDescription" value={this.state.newProductDescription}
                                           onChange={this.changeInput} className="form-control" placeholder={"Описание"}/>

                                </div>
                                <div className="col-md-2">
                                    <input type="number" id="newProductCount" value={this.state.newProductCount}
                                           onChange={this.changeInput} className="form-control"
                                           placeholder={"Количество"}/>

                                </div>
                                <div className="col-md-2">
                                    <input type="number" id="newProductPrice" value={this.state.newProductPrice}
                                           onChange={this.changeInput} className="form-control" placeholder={"Цена"}/>

                                </div>
                                <div className="col-md-2">
                                    <button type={'button'} className="btn btn-info btn_fullsize"
                                            onClick={this.addProduct}>Добавить
                                    </button>
                                </div>

                            </div>
                            {
                                this.state.consignment.map((item, index) =>
                                    {
                                        return <div className={"row table_row"}>
                                            <div className="col-md-3">{item.name}</div>
                                            <div className="col-md-2">{item.status}</div>
                                            <div className="col-md-3">{item.description}</div>
                                            <div className="col-md-2">{item.count}</div>
                                            <div className="col-md-2">{item.price}</div>
                                            {/*<div className="col-md-2"><a href="" class="btn-sm btn-dark">Удалить</a></div>*/}
                                        </div>
                                    }
                                )
                            }
                        </form>
                    </div>
                    <div className="offset-md-2 col-md-8 form_clear" id={'sendOrderRequestButton'} style={none}>
                        <a onClick={this.sendInfoToServer} className="btn btn-success btn_fullsize">Сохранить</a>
                    </div>
                </div>
            </div>
        );
    }


}