import {Component} from 'react'
import React from "react";
import CommonUtil from '../commonUtil/commontUtil'
import ValidationUtil from "../commonUtil/validationUtil";
import {NotificationManager} from "react-notifications";


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

        this.findDrivers();
        this.findAutos();
        this.initOrder();

    }

    validateOrderForm = () => {
        let clientIdValidation = ValidationUtil.validateForNumber(this.state.client_id);
        let nameValidation = ValidationUtil.validateStringForLength(Array.isArray(this.state.name) ? this.state.name.join('') : this.state.name, 3, 20);
        let dateArrivalValidation = ValidationUtil.validateDateToPattern(this.state.date_arrival);
        let dateDepartureValidation = ValidationUtil.validateDateToPattern(this.state.date_departure);
        let stocksVal = this.state.departure_stock !== this.state.delivery_stock;
        let validateAuto = ValidationUtil.validateForNumber(this.state.auto);
        let validateDriver = ValidationUtil.validateForNumber(this.state.driver);
        if (!clientIdValidation) {
            document.getElementById('client-error-span').innerText = "Неправильные данные";
        } else {
            document.getElementById('client-error-span').innerText = "";
        }
        if (!nameValidation) {
            document.getElementById('name-error-span').innerText = `Неправильное название ${this.state.name}`;
        } else {
            document.getElementById('name-error-span').innerText = "";
        }
        if (!dateArrivalValidation || !dateDepartureValidation) {
            document.getElementById('date-error-span').innerText = "Неправильная дата";
        } else {
            document.getElementById('date-error-span').innerText = "";
        }
        if (!validateAuto) {
            document.getElementById('auto-error-span').innerText = 'Неправильное значение';
        } else {
            document.getElementById('auto-error-span').innerText = '';
        }
        if (!validateDriver) {
            document.getElementById('driver-error-span').innerText = 'Неправильное значение';
        } else {
            document.getElementById('driver-error-span').innerText = '';
        }
        if (!stocksVal){
            document.getElementById('stocks-error-span').innerText = 'Выберите разные склады';
        }else{
            document.getElementById('stocks-error-span').innerText = '';
        }
        return clientIdValidation && nameValidation && dateArrivalValidation && dateDepartureValidation && validateAuto && validateDriver;
    };

    validateProduct = () => {
        try{
            let nameVal = ValidationUtil.getStringFromUnnownObject(this.state.newProductName)!== '';
            let statusVal = ValidationUtil.getStringFromUnnownObject(this.state.newProductStatus)!== '';
            let descVal = ValidationUtil.getStringFromUnnownObject(this.state.newProductDescription)!== '';
            let priceVal = ValidationUtil.getStringFromUnnownObject(this.state.newProductPrice)!== '';
            let countVal = ValidationUtil.getStringFromUnnownObject(this.state.newProductCount)!== '';
            if (!nameVal){
                document.getElementById('prodName-error-span').innerText = 'Название не может быть пустым';
            }else{
                document.getElementById('prodName-error-span').innerText = '';
            }
            if (!statusVal){
                document.getElementById('prodStatus-error-span').innerText = 'Статус не может быть пустым';
            }else{
                document.getElementById('prodStatus-error-span').innerText = '';
            }
            if (!descVal){
                document.getElementById('prodDescription-error-span').innerText = 'Описание не может быть пустым';
            }else{
                document.getElementById('prodDescription-error-span').innerText = '';
            }
            if (!priceVal){
                document.getElementById('prodPrice-error-span').innerText = 'Цена должна быть указана';
            }else{
                document.getElementById('prodPrice-error-span').innerText = '';
            }
            if (!countVal){
                document.getElementById('prodCount-error-span').innerText = 'Количество не может быть пустым';
            }else{
                document.getElementById('prodCount-error-span').innerText = '';
            }
            document.getElementById('prodForm-error-span').innerText = '';
            return nameVal && statusVal && descVal && priceVal && countVal;
        }catch (e) {
            document.getElementById('prodForm-error-span').innerText = 'Проверьте правильность ваших данных';
            return false;
        }
    };

    sendInfoToServer() {
        if (this.validateOrderForm()) {
            let formData = new FormData();
            formData.append("orderId", this.state.order.id);
            formData.append("consignmentId", this.state.consignmentId);
            formData.append("waybillId", this.state.order.waybill.id);
            formData.append("clientId", ValidationUtil.getStringFromUnnownObject(this.state.client_id));
            formData.append("name", ValidationUtil.getStringFromUnnownObject(this.state.name));
            formData.append("status", ValidationUtil.getStringFromUnnownObject(this.state.status));
            formData.append("departureStock", ValidationUtil.getStringFromUnnownObject(this.state.departure_stock));
            formData.append("deliveryStock", ValidationUtil.getStringFromUnnownObject(this.state.delivery_stock));
            formData.append("dateArrival", ValidationUtil.getStringFromUnnownObject(this.state.date_departure));
            formData.append("dateDeparture", ValidationUtil.getStringFromUnnownObject(this.state.date_arrival));
            formData.append("waybillStatus", ValidationUtil.getStringFromUnnownObject(this.state.waybill_status));
            formData.append("autoId", ValidationUtil.getStringFromUnnownObject(this.state.auto));
            formData.append("driverId", ValidationUtil.getStringFromUnnownObject(this.state.driver));
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
            }).catch(() => {
                NotificationManager.error('Ошибка доступа');
            });
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
        }).catch(() => {
            NotificationManager.error('Ошибка');
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
            fetch(`/api/clients/findClientsByNameLike?name=${this.state.companyNameForSearch}`, {headers: {'Auth-token': localStorage.getItem("Auth-token")}})
                .then(response => {
                    return response.json()
                }).then(data => {
                this.addCompaniesInSelect(data);
            }).catch(() => {
                NotificationManager.error('Ошибка');
            });
            document.getElementById('client_id').style.display = '';
        } else {
            document.getElementById('client_id').style.display = 'none';
        }
        this.fetchToUserStocks();
    };

    fetchToUserStocks = () => {
        fetch(`/api/companies/findStocksByUsername`, {headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(response => response.json()).then(data => {
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
        }).catch(() => {
            NotificationManager.error('Ошибка');
        });
    };

    findAutos() {
        let dd = this.state.date_departure;
        let da = this.state.date_arrival;
        fetch(`/api/company/findFreeAutos?dateFrom=${dd}&dateTo=${da}`, {headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(response => response.json().then(data => {
            let autoHtml = '';
            console.log(data);
            data.map(auto => {
                autoHtml += `<option value=${auto.id}>${auto.name}</option>`;
            });
            document.getElementById('auto').innerHTML = autoHtml;
            // this.setDefault();
        })).catch(() => {
            NotificationManager.error('Ошибка');
        });
    }

    findDrivers() {
        let dd = this.state.date_departure;
        let da = this.state.date_arrival;
        fetch(`/api/company/findFreeDrivers?dateFrom=${dd}&dateTo=${da}`, {headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(response => response.json()).then(data => {
            console.log(data);
            let driverHtml = '';
            data.map(driver => {
                driverHtml += `<option value=${driver.id}>${driver.name}</option>`
            });
            document.getElementById('driver').innerHTML = driverHtml;
            // this.setDefault();
        }).catch(() => {
            NotificationManager.error('Ошибка');
        });
    }

    addCompaniesInSelect(companies) {
        let html = '';
        if (companies.length === 0) return;
        companies.map(client => {
            html += `<option value=${client.id}>${client.name}</option>`
        });
        document.getElementById('client_id').innerHTML = html;
        /*this.state.client_id = this.state.order.client.id;*/
        this.setState({
            client_id: this.state.order.client.id,
        })
    }

    showOrderHideConsignment = () => {
        document.getElementById('order-form').style.display = '';
        document.getElementById('consignment-form').style.display = 'none';
    };

    showConsignment = () => {
        if (this.validateOrderForm()){
            document.getElementById('order-form').style.display = 'none';
            document.getElementById('consignment-form').style.display = '';
            document.getElementById('sendOrderRequestButton').style.display = '';
            if (this.state.consignment.length === 0) {
                fetch(`http://localhost:8080/api/orders/${this.state.orderId}/consignment`, {headers: {'Auth-token': localStorage.getItem('Auth-token')}}).then(response => {
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
                }).catch(()=>{
                    NotificationManager.error('Ошибка');
                });
            }
        }
    };

    addProduct = (event) => {
        if (this.validateProduct()){
            event.preventDefault();
            let product = {
                name: ValidationUtil.getStringFromUnnownObject(this.state.newProductName),
                status: ValidationUtil.getStringFromUnnownObject(this.state.newProductStatus),
                description: ValidationUtil.getStringFromUnnownObject(this.state.newProductDescription),
                count: ValidationUtil.getStringFromUnnownObject(this.state.newProductCount),
                price: ValidationUtil.getStringFromUnnownObject(this.state.newProductPrice)
            };
            this.setState({
                consignment: [...this.state.consignment, product],
                newConsignmentName: ''
            });
            document.getElementById('newProductName').focus();
        }
    };

    deleteProduct(index) {
        const newConsignment = [...this.state.consignment];
        if (index !== -1) {
            newConsignment.splice(index, 1);
            this.setState({consignment: newConsignment});
        }
    };

    processSelect = () => {
        if (ValidationUtil.getStringFromUnnownObject(this.state.waybill_status)===1){
            return <select onChange={this.changeInput} value={this.state.waybill_status}
                           className="form-control"
                           id="waybill_status">
                <option selected disabled>Статус</option>
                <option value={'1'}>Оформлен</option>
                <option value={'2'}>Проверка завершена</option>
                <option value={'3'}>Доставлен</option>
            </select>
        }else {
            return <select onChange={this.changeInput} value={this.state.waybill_status}
                           className="form-control"
                           id="waybill_status" disabled={'disabled'}>
                <option selected disabled>Статус</option>
                <option value={'1'}>Оформлен</option>
                <option value={'2'}>Проверка завершена</option>
                <option value={'3'}>Доставлен</option>
            </select>
        }
    };

    render() {
        let green = {
            color: 'green'
        };
        return (
            <div className={'animated fadeIn'}>
                <span className="text-center" style={green} id={'success-order-span'}/>
                <div className="row" id={'order-form'}>
                    <div className="offset-md-2 col-md-8 superuserform_companylist">
                        <div className="row">
                            <div className="col-md-6">
                                <h3>Основное</h3>
                                <small className="form-text text-muted">Наименование заказа</small>
                                <input value={this.state.name} onChange={this.changeInput} type="text"
                                       className="form-control" id="name" placeholder="Наименование заказа"/>
                                <span id="name-error-span" className={'error-span'}/>

                                <small className="form-text text-muted">Компания- заказчик перевозки</small>
                                <input value={this.state.companyNameForSearch} onChange={this.fetchToCompany}
                                       type="text"
                                       className="form-control" id="companyNameForSearch" placeholder="Заказчик"/>


                                <select className={'form-control'} value={this.state.client_id}
                                        onClick={this.setCustomerCompany} onChange={this.changeInput}
                                        style={{display: 'none'}} name="client_id" id="client_id">
                                </select>
                                <span id="client-error-span" className={'error-span'}/>

                                <small className="form-text text-muted">Адрес Отправления</small>
                                <select value={this.state.departure_stock} onChange={this.changeInput}
                                        className="form-control" id="departure_stock" placeholder="Откуда"/>


                                <small className="form-text text-muted">Адрес Доставки</small>
                                <select value={this.state.delivery_stock} onChange={this.changeInput}
                                        className="form-control"
                                        id="delivery_stock" placeholder="Куда">
                                </select>
                                <span id="stocks-error-span" className={'error-span'}/>

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
                                {
                                    this.processSelect()
                                }
                                {/*<select onChange={this.changeInput} value={this.state.waybill_status}*/}
                                {/*className="form-control"*/}
                                {/*id="waybill_status">*/}
                                {/*<option selected disabled>Статус</option>*/}
                                {/*<option value={'1'}>Оформлен</option>*/}
                                {/*<option value={'2'}>Проверка завершена</option>*/}
                                {/*<option value={'3'}>Доставлен</option>*/}
                                {/*</select>*/}


                                <small className="form-text text-muted">Дата отправления</small>
                                <input value={this.state.date_departure} onBlur={this.changeDate}
                                       onChange={this.changeInput} type="text"
                                       className="form-control" id="date_departure" placeholder="14.10.2015"/>

                                <small className="form-text text-muted">Дата прибытия</small>
                                <input value={this.state.date_arrival} onBlur={this.changeDate}
                                       onChange={this.changeInput} type="text"
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
                        <a onClick={this.showConsignment} className="btn btn-success btn_fullsize">Продолжить</a>
                    </div>

                </div>
                <div className={'pb-3 container'} style={{display: 'none'}} id={'consignment-form'}>
                    <div className="d-flex justify-content-center align-items-center" style={{marginTop: '2%'}}>
                        <form className="align-content-center" onSubmit={(e) => {
                            e.preventDefault()
                        }}>
                            <button className="btn btn-light" onClick={this.showOrderHideConsignment}>Вернуться к
                                заказу
                            </button>
                            <h3>Товарная партия</h3>
                            <span className="error-span" id="prodForm-error-span"/>
                            <div className="row">
                                <div className="col-md-2">
                                    <input type="text" id="newProductName" value={this.state.newProductName}
                                           onChange={this.changeInput} className="form-control"
                                           placeholder={"Название"}/>
                                    <span className="error-span" id="prodName-error-span"/>
                                </div>
                                <div className="col-md-2">
                                    <select className="custom-select" onChange={this.changeInput}
                                            value={this.state.newProductStatus} id="newProductStatus">
                                        <option value={'1'}>Принят</option>
                                        <option value={'2'}>Проверка завершена</option>
                                        <option value={'3'}>Доставлен</option>
                                        <option value={'4'}>Утерян</option>
                                    </select>
                                    <span className="error-span" id="prodStatus-error-span"/>

                                </div>
                                <div className="col-md-2">
                                    <input type="text" id="newProductDescription"
                                           value={this.state.newProductDescription}
                                           onChange={this.changeInput} className="form-control"
                                           placeholder={"Описание"}/>
                                    <span className="error-span" id="prodDescription-error-span"/>
                                </div>
                                <div className="col-md-2">
                                    <input type="number" id="newProductCount" value={this.state.newProductCount}
                                           onChange={this.changeInput} className="form-control"
                                           placeholder={"Количество"}/>
                                    <span className="error-span" id="prodCount-error-span"/>

                                </div>
                                <div className="col-md-2">
                                    <input type="number" id="newProductPrice" value={this.state.newProductPrice}
                                           onChange={this.changeInput} className="form-control" placeholder={"Цена"}/>
                                    <span className="error-span" id="prodPrice-error-span"/>

                                </div>
                                <div className="col-md-2">
                                    <button type={'button'} className="btn btn-info btn_fullsize"
                                            onClick={this.addProduct}>Добавить
                                    </button>
                                </div>

                            </div>
                            {
                                this.state.consignment.map((item, index) => {
                                        return <div className={"row table_row animated fadeInUp"}>
                                            <div className="col-md-2">{item.name}</div>
                                            <div className="col-md-2">{item.status}</div>
                                            <div className="col-md-2">{item.description}</div>
                                            <div className="col-md-2">{item.count}</div>
                                            <div className="col-md-2">{item.price}</div>
                                            <div className="col-md-2">
                                                <div className="table_button bg-secondary text-white" onClick={this.deleteProduct.bind(this, index)}>удалить</div>
                                            </div>
                                            {/*<div className="col-md-2"><a onClick={this.removeProduct(item.name)} id={`item-${item.name}`} className="btn-sm btn-dark">Удалить</a></div>*/}
                                        </div>
                                    }
                                )
                            }
                        </form>
                    </div>
                    <div className="offset-md-2 col-md-8 form_clear" id={'sendOrderRequestButton'}
                         style={{display: 'none'}}>
                        <a onClick={this.sendInfoToServer} className="btn btn-success btn_fullsize">Сохранить</a>
                    </div>
                </div>
            </div>
        );
    }

}