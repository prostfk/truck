import React from "react";
import CommonUtil from "../commonUtil/commontUtil";
import ValidationUtil from "../commonUtil/validationUtil";

export default class DispatcherCreateOrderPage extends React.Component {
    constructor(props) {
        super(props);
        this.findAutos = this.findAutos.bind(this);
        this.findDrivers = this.findDrivers.bind(this);
        this.changeInput = this.changeInput.bind(this);
        this.saveBtnClick = this.saveBtnClick.bind(this);
        this.fetchToCompany = this.fetchToCompany.bind(this);
        this.addCompaniesInSelect = this.addCompaniesInSelect.bind(this);
        this.setCustomerCompany = this.setCustomerCompany.bind(this);
        this.fetchToSenderStocks = this.fetchToSenderStocks.bind(this);
        this.setDefault = this.setDefault.bind(this);
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
            date_departure: CommonUtil.getCorrectDateFromLong(new Date().getTime()),
            date_arrival: CommonUtil.getCorrectDateFromLong(new Date(new Date().getTime() + 86400000)),
            company: "",
            consignment: [],
            newConsignmentName: "",
            newOrderId: "",
            newProductName: "",
            newProductStatus: ["1"],
            newProductDescription: "",
            newProductPrice: "",
            newProductCount: 1,
            newProduct: {}
        };
        document.title = "Создать заказ";
        this.fetchToSenderStocks();
        this.findAutos();
        this.findDrivers();
    }

    changeInput(event) {
        this.setState({
            [event.target.id]: [event.target.value]
        });
    }

    validateOrderForm = () => {
        let clientIdValidation = ValidationUtil.validateForNumber(this.state.client_id);
        let nameValidation = ValidationUtil.validateStringForLength(Array.isArray(this.state.name) ? this.state.name.join('') : this.state.name, 3, 20);
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

    saveBtnClick() {
        if (this.validateOrderForm()) {
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
            formData.append("consignment", JSON.stringify(this.state.consignment));
            formData.forEach((v, k) => {
                console.log(`${v} - ${k}`);
            });

            fetch('http://localhost:8080/api/orders/createOrder', {
                method: "POST",
                body: formData,
                headers: {'Auth-token': localStorage.getItem("Auth-token")}
            }).then(response => {
                return response.json()
            }).then(data => {
                if (data.error === undefined) {
                    document.getElementById('order-form').style.display = 'none';
                    document.getElementById('consignment-form').style.display = 'none';
                    this.props.history.push('/orders/');
                }
            });
        } else {
            this.showOrderHideConsignment();
        }

    }

    fetchToCompany(event) {
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

    }

    fetchToSenderStocks() {
        // fetch(`http://localhost:8080/api/companies/${id}/stocks`, {headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(response => response.json()).then(data => {
        fetch(`http://localhost:8080/api/companies/findStocksByUsername`, {headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(response => response.json()).then(data => {
            let html = '';
            if (data.status === 404) return;
            data.map(stock => {
                html += `<option value="${stock.id}">${stock.address}</option>`;
            });
            document.getElementById('departure_stock').innerHTML = html;
            document.getElementById('delivery_stock').innerHTML = html;
            this.setDefault();
        })
    }

    addCompaniesInSelect(companies) {
        let html = '';
        if (companies.length === 0) return;
        companies.map(company => {
            html += `<option value=${company.id}>${company.name}</option>`
        });
        document.getElementById('client_id').innerHTML = html;
        this.setDefault();

    }

    setCustomerCompany(event) {
        this.setState({
            client_id: event.target.value
        });
        // this.fetchToStocks(event.target.value)
    }

    findAutos() {
        let dd = this.state.date_departure;
        let da = this.state.date_arrival;
        fetch(`http://localhost:8080/api/company/findFreeAutos?dateFrom=${dd}&dateTo=${da}`, {headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(response => response.json().then(data => {
            let autoHtml = '';
            data.map(auto => {
                autoHtml += `<option value=${auto.id}>${auto.name}</option>`;
            });
            document.getElementById('auto').innerHTML = autoHtml;
            this.setDefault();
        })).catch(err => {
            throw new Error('Нет доступа к свободным авто');
        })
    }

    findDrivers() {
        let dd = this.state.date_departure;
        let da = this.state.date_arrival;
        fetch(`http://localhost:8080/api/company/findFreeDrivers?dateFrom=${dd}&dateTo=${da}`, {headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(response => response.json()).then(data => {
            let driverHtml = '';
            data.map(driver => {
                driverHtml += `<option value=${driver.id}>${driver.name}</option>`
            });
            document.getElementById('driver').innerHTML = driverHtml;
            this.setDefault();
        }).catch(err => {
            throw new Error('Нет доступа к свободным водителям');
        })
    }

    setDefault() {
        this.setState({
            departure_stock: document.getElementById('departure_stock').value,
            delivery_stock: document.getElementById('delivery_stock').value,
            status: document.getElementById('status').value,
            waybill_status: document.getElementById('waybill_status').value,
            driver: document.getElementById('driver').value,
            auto: document.getElementById('auto').value,
            client_id: document.getElementById('client_id').value
        });
    }

    changeDate = () => {
        this.findAutos();
        this.findDrivers();
    };

    //Consignment

    addProduct = (event) => {
        event.preventDefault();
        let product = {
            name: this.state.newProductName.join(''),
            status: this.state.newProductStatus.join(''),
            description: this.state.newProductDescription.join(''),
            count: this.state.newProductCount.join(''),
            price: this.state.newProductPrice.join('')
        };
        this.setState({
            consignment: [...this.state.consignment, product],
            newConsignmentName: ''
        });
        document.getElementById('newProductName').focus();
    };

    //trbl
    removeProduct = (name) => {
        let tmp = this.state.consignment;
        let index = tmp.indexOf(name);
        tmp.splice(index, 1);
        this.setState({
            consignment: tmp
        })
    };

    showOrderHideConsignment = () => {
        document.getElementById('order-form').style.display = '';
        document.getElementById('consignment-form').style.display = 'none';
    };

    showConsignment = () => {
        if (this.validateOrderForm()) {
            document.getElementById('order-form').style.display = 'none';
            document.getElementById('consignment-form').style.display = '';
            document.getElementById('sendOrderRequestButton').style.display = '';
        }
        // this.setState({newProductStatus: 'ACCEPTED'})
    };

    render() {

        let customerCompanyStyle = {
            display: 'none'
        };
        let marginTop = {
            marginTop: '2%'
        };
        return (
            <div>
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
                                        style={customerCompanyStyle} name="client_id" id="client_id">
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
                <div className={'pb-3 container'} style={customerCompanyStyle} id={'consignment-form'}>
                    <div className="d-flex justify-content-center align-items-center" style={marginTop}>
                        <form className="align-content-center" onSubmit={(e) => {
                            e.preventDefault()
                        }}>
                            <button className="btn btn-light" onClick={this.showOrderHideConsignment}>Вернуться к
                                заказу
                            </button>
                            <h3>Товарная партия</h3>
                            <div className="row">
                                <div className="col-md-3">
                                    <input type="text" id="newProductName" value={this.state.newProductName}
                                           onChange={this.changeInput} className="form-control"
                                           placeholder={"Название"}/>
                                </div>
                                <div className="col-md-2">
                                    <select className="custom-select" onChange={this.changeInput}
                                            value={this.state.newProductStatus} id="newProductStatus">
                                        <option value={'1'}>Принят</option>
                                        <option value={'2'}>Проверка завершена</option>
                                        <option value={'3'}>Доставлен</option>
                                        <option value={'4'}>Утерян</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <input type="text" id="newProductDescription"
                                           value={this.state.newProductDescription}
                                           onChange={this.changeInput} className="form-control"
                                           placeholder={"Описание"}/>

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
                                this.state.consignment.map((item, index) => {
                                        return <div className={"row table_row"}>
                                            <div className="col-md-3">{item.name}</div>
                                            <div className="col-md-2">{item.status}</div>
                                            <div className="col-md-3">{item.description}</div>
                                            <div className="col-md-2">{item.count}</div>
                                            <div className="col-md-2">{item.price}</div>
                                            <div className="col-md-2"><a onClick={this.removeProduct(item.name)} id={`item-${item.name}`} className="btn-sm btn-dark">Удалить</a></div>
                                        </div>
                                    }
                                )
                            }
                        </form>
                    </div>
                    <div className="offset-md-2 col-md-8 form_clear" id={'sendOrderRequestButton'}
                         style={customerCompanyStyle}>
                        <a onClick={this.saveBtnClick} className="btn btn-success btn_fullsize">Сохранить</a>
                    </div>
                </div>

            </div>);
    }
}

