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
            client:{},
            companyObj: {},
            receiver: {},
            sender: {},
            waybill:{}
        };
        this.initOrder();
    }

    sendInfoToServer() {
        console.log(this.state.order);
        this.setState({
            companyObj:{
                name: this.state.company
            },
            receiver:{
                address: this.state.delivery_stock
            },
            sender:{
                address: this.state.departure_stock,
                company: this.state.company
            },
            waybill:{
                status: this.state.waybill_status,
                auto: this.state.auto,
                driver: this.state.driver,
                dateArrival: this.state.date_arrival,
                dateDeparture: this.state.date_departure
            },
            order:{
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
        formData.forEach((v,k) =>{
            console.log(`${v} - ${k}`);
        });
        fetch('http://localhost:8080/api/companies/orders/edit', {method: 'POST', headers: {'Auth-token': sessionStorage.getItem('Auth-token')}, body: formData}).then(response=>{
            return response.json()
        }).then(data=>{
            console.log(data)
        })
    }

    setValuesFromJson() {
        this.setState({
            date_departure: CommonUtil.getCorrectDateFromLong(this.state.order.dateAccepted),
            date_arrival: CommonUtil.getCorrectDateFromLong(this.state.order.dateExecuted),
            status: this.state.order.status,
            name: this.state.order.name,
            companyNameForSearch: this.state.order.client.name,
            auto: this.state.order.waybill.auto.id,
            driver: this.state.order.waybill.driver.id,
            departure_stock: this.state.order.sender.id,
            delivery_stock: this.state.order.receiver.id,
            company: this.state.order.company.id,
            client_id: this.state.order.client.id,
            waybill_status: this.state.order.waybill.status
        });
        document.getElementById('auto').innerHTML = `<option value="${this.state.order.waybill.auto.id}">${this.state.order.waybill.auto.name}</option>`
        document.getElementById('driver').innerHTML = `<option value="${this.state.order.waybill.driver.id}">${this.state.order.waybill.driver.name}</option>`
        document.getElementById('departure_stock').innerHTML = `<option value="${this.state.order.sender.id}">${this.state.order.sender.address}</option>`
        document.getElementById('delivery_stock').innerHTML = `<option value="${this.state.order.receiver.id}">${this.state.order.receiver.address}</option>`
        document.getElementById('client_id').innerHTML = `<option value="${this.state.order.company.id}">${this.state.order.company.name}</option>`

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
                client: data.client,
                receiver: data.receiver.id,
                sender: data.sender.id,
                waybill: data.waybill,
                companyNameForSearch: data.client.name
            });
            this.setValuesFromJson()
        });
    }

    changeInput(event) {
        this.setState({
            [event.target.id]: [event.target.value]
        });
    }

    changeCompany = (event) =>{
        this.setState({
            [event.target.id]: [event.target.value]
        });
        console.log("CHANGE COMPANY");
        this.fetchToUserStocks();
        this.fetchToStocks(this.state.client_id);
    };

    changeDate(event){
        if (CommonUtil.isDateCorrect(event.target.value)){
            this.setState({
                [event.target.id]: [event.target.value]
            })
        }
    }

    fetchToCompany = (event) => {
        this.setState({
            companyNameForSearch: [event.target.value]
        });
        if (event.target.value!==''){
            fetch(`http://localhost:8080/api/clients/findClientsByNameLike?name=${this.state.companyNameForSearch}`, {headers: {'Auth-token': sessionStorage.getItem("Auth-token")}})
                .then(response => {
                    return response.json()
                }).then(data => {
                this.addCompaniesInSelect(data);
            });
            document.getElementById('client_id').style.display = '';
        }else{
            document.getElementById('client_id').style.display = 'none';
        }
        this.fetchToUserStocks();
        this.fetchToStocks(this.state.client_id);

    };

    fetchToUserStocks = () =>{
        // let companyId = sessionStorage.getItem('companyId');
        let companyId = 3;//заглушка
        fetch(`http://localhost:8080/api/companies/${companyId}/stocks`,{headers: {'Auth-token': sessionStorage.getItem("Auth-token")}}).then(response=>response.json()).then(data=>{
            let html = '';
            if (data.status === 404) return;
            console.log(data);
            data.map(stock=>{
                html += `<option value="${stock.id}">${stock.address}</option>`
            });
            document.getElementById('departure_stock').innerHTML = html;
            this.setState({
                departure_stock: this.state.order.sender.id
            })
        })
    };

    fetchToStocks = (id) =>{
        fetch(`http://localhost:8080/api/companies/${id}/stocks`,{headers: {'Auth-token': sessionStorage.getItem("Auth-token")}}).then(response=>response.json()).then(data=>{
            let html = '';
            if (data.status === 404) return;
            console.log(data);
            data.map(stock=>{
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


    render() {
        return (
            <div className="row">
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
                    <a onClick={this.sendInfoToServer} className="btn btn-success btn_fullsize">Сохранить</a>
                </div>
            </div>
        );
    }


}

export default DispatcherEditOrder;
