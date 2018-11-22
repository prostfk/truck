import React from "react";
import CommonUtil from "../commonUtil/commontUtil";
import {Link} from "react-router-dom";


class OwnerWaybill extends React.Component {
    constructor(props) {
        super(props);

        this.initOrder = this.initOrder.bind(this);

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
            newConsignmentName: ""
        };
        this.initOrder();
    }

    initOrder() {
        let link = document.location.href.split("/");
        let id = link[link.length - 1];
        fetch(`/api/company/orders/${id}`, {headers: {'Auth-token': localStorage.getItem('Auth-token')}}).then(response => {
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
                orderId: data.id
            });
            document.getElementById('auto').innerHTML = `<option value="${this.state.order.waybill.auto.id}">${this.state.order.waybill.auto.name}</option>`;
            document.getElementById('driver').innerHTML = `<option value="${this.state.order.waybill.driver.id}">${this.state.order.waybill.driver.name}</option>`;
            document.getElementById('departure_stock').innerHTML = `<option value="${this.state.order.sender.id}">${this.state.order.sender.address}</option>`;
            document.getElementById('delivery_stock').innerHTML = `<option value="${this.state.order.receiver.id}">${this.state.order.receiver.address}</option>`;
            document.getElementById('client_id').innerHTML = `<option value="${this.state.order.company.id}">${this.state.order.company.name}</option>`;

            document.getElementById('status').innerHTML = `<option>${this.state.status}</option>`;
            document.getElementById('waybill_status').innerHTML = `<option>${this.state.waybill_status}</option>`;
            console.log(this.state);
            // this.setValuesFromJson()
            console.log(this.state.consignment);
        }).catch(err => {
            throw new Error(err);
        });

    }

    render() {
        return (<div>
            <div className="row" id={'order-form'}>
                <div className="offset-md-3 col-md-6 superuserform_companylist">
                    <div className="row">
                        <div className="col-md-6">
                            <h3>Основное</h3>
                            <small className="form-text text-muted">Наименование товара</small>
                            <input value={this.state.name} type="text"
                                   className="form-control" id="name" placeholder="Наименование товара"
                                   disabled={true}/>

                            <small className="form-text text-muted">Компания- заказчик перевозки</small>
                            <input value={this.state.companyNameForSearch}
                                   type="text"
                                   className="form-control" id="companyNameForSearch" placeholder="Заказчик"
                                   disabled={true}/>


                            <select className={'form-control'} value={this.state.client_id}
                                    onClick={this.setCustomerCompany}
                                /*style={}*/ name="client_id" id="client_id" disabled={true}>
                            </select>

                            <small className="form-text text-muted">Адрес Отправления</small>
                            <select value={this.state.departure_stock}
                                    className="form-control" id="departure_stock" placeholder="Откуда" disabled={true}/>


                            <small className="form-text text-muted">Адрес Доставки</small>
                            <select value={this.state.delivery_stock}
                                    className="form-control"
                                    id="delivery_stock" placeholder="Куда" disabled={true}>
                            </select>

                            <div className="form-group">
                                <small className="form-text text-muted">Сатус заказа</small>
                                <select value={this.state.status}
                                        className="form-control"
                                        id="status" disabled={true}>
                                    {/*<option selected disabled>Статус</option>
                                    <option>Принят</option>
                                    <option>Отклонен</option>
                                    <option>Выполен</option>
                                    <option>Не выполнен</option>*/}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h3>ТТН</h3>

                            <small className="form-text text-muted">Статус</small>
                            <select value={this.state.waybill_status}
                                    className="form-control"
                                    id="waybill_status" disabled={true}>
                                {/*<option selected disabled>Статус</option>
                                <option>Оформлен</option>
                                <option>Проверка завершена</option>
                                <option>Доставлен</option>*/}
                            </select>


                            <small className="form-text text-muted">Дата отправления</small>
                            <input value={this.state.date_departure} type="text"
                                   className="form-control" id="date_departure" placeholder="14.10.2015"
                                   disabled={true}/>

                            <small className="form-text text-muted">Дата прибытия</small>
                            <input value={this.state.date_arrival} type="text"
                                   className="form-control" id="date_arrival" placeholder="15.10.2016" disabled={true}/>

                            <small className="form-text text-muted">Водитель</small>
                            <select value={this.state.driver} className="form-control"
                                    id="driver" disabled={true}>
                                <option selected disabled>Водитель</option>

                            </select>

                            <small className="form-text text-muted">Автомобиль</small>
                            <select value={this.state.auto} className="form-control"
                                    id="auto" disabled={true}>
                                <option selected disabled>Авто</option>

                            </select>

                        </div>
                    </div>
                </div>
                {/*<div className="offset-md-2 col-md-8 form_clear">
                    <a onClick={this.showConsignment} className="btn btn-success btn_fullsize">Продолжить</a>
                </div>*/}

            </div>
            <div className={'pb-3'} /*style={}*/ id={'consignment-form'}>
                {/*<div className="d-flex justify-content-center align-items-center" >
                    <form className="form-inline align-content-center" onSubmit={(e) => {e.preventDefault()}}>
                        <div className="form-group">
                            <label htmlFor="consignment">Название товара</label>
                            <input type="text" id="newConsignmentName" value={this.state.newConsignmentName}
                                   onChange={this.changeInput} className="form-control mx-sm-3"/>
                            <button type={'button'} className="btn btn-info"
                                    onClick={this.addConsignment}>Добавить
                            </button>
                        </div>
                    </form>
                </div>*/}
                <div className="">
                    <ul id='lis' className="list-group">
                        {
                            /*this.state.consignment.map((item, index) =>
                                <li className={'list-group-item list-group-item-secondary text-center'} key={index}>{item}   -
                                    <span aria-hidden="true">&times;</span>
                                </li>

                            )*/
                        }
                    </ul>
                </div>
            </div>
            <div className="offset-md-2 col-md-8 form_clear"
                 id={'sendOrderRequestButton'} /*style={customerCompanyStyle}*/>
                <Link to={`/owner/orders`} className="btn btn-success btn_fullsize">Вернуться</Link>
            </div>
        </div>);
    }
}

export default OwnerWaybill;