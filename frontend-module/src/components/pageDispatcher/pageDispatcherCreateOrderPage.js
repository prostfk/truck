import React, { Component } from "react";

class DispatcherCreateOrderPage extends React.Component{
    constructor(props) {
        super(props);
        this.changeInput = this.changeInput.bind(this);
        this.savebtnClick = this.savebtnClick.bind(this);
        this.state = {
            client_id:"",
            sender:"",
            receiver:"",
            status:"",
            waybill_status:"",
            driver:"",
            auto:"",
            date_departure:"",
            date_arrival:"",
        };
    }
    changeInput(event){
        this.setState({
            [event.target.id]: [event.target.value]
        });
    }
    savebtnClick(event){
        console.log(this.state);
    }

    render(){
        return <div class="row">
            <div class="offset-md-2 col-md-8 form_clear">
                <div class="row">
                    <div class="col-md-6">
                        <h3>Основное</h3>
                        <small class="form-text text-muted">Компания- заказчик перевозки</small>
                        <input value={this.state.client_id} onChange={this.changeInput} type="text" class="form-control" id="client_id" placeholder="Заказчик"/>

                        <small class="form-text text-muted">Адрес Отправления</small>
                        <input value={this.state.sender} onChange={this.changeInput} type="text" class="form-control" id="sender" placeholder="Откуда"/>

                        <small class="form-text text-muted">Адрес доставки</small>
                        <input value={this.state.receiver} onChange={this.changeInput} type="text" class="form-control" id="receiver" placeholder="Куда"/>

                        <div class="form-group">
                            <small class="form-text text-muted">Сатус заказа</small>
                            <select onChange={this.changeInput} class="form-control" id="status">
                                <option selected disabled>Статус</option>
                                <option>Принят</option>
                                <option>Отклонен</option>
                                <option>Выполен</option>
                                <option>Не выполнен</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h3>ТТН</h3>

                        <small class="form-text text-muted">Статус</small>
                        <select onChange={this.changeInput} class="form-control" id="waybill_status">
                            <option selected disabled>Статус</option>
                            <option>Оформлен</option>
                            <option>Проверка завершена</option>
                            <option>Доставлен</option>
                        </select>

                        <small class="form-text text-muted">Водитель</small>

                        <select onChange={this.changeInput} class="form-control" id="driver">
                            <option selected disabled>Водитель</option>
                            <option>Иванов</option>
                            <option>Петров</option>
                            <option>Тучкин</option>
                        </select>

                        <small class="form-text text-muted">Автомобиль</small>
                        <select onChange={this.changeInput} class="form-control" id="auto">
                            <option selected disabled>Авто</option>
                            <option >Volvo 10</option>
                            <option>BMW 44-10</option>
                            <option>BusCry 22-13</option>
                        </select>
                        <small class="form-text text-muted">Дата отправления</small>
                        <input value={this.state.date_departure} onChange={this.changeInput} type="text" class="form-control" id="date_departure" placeholder="14.10.2015"/>

                        <small class="form-text text-muted">Дата прибытия</small>
                        <input value={this.state.date_arrival} onChange={this.changeInput} type="text" class="form-control" id="date_arrival" placeholder="15.10.2016"/>

                    </div>
                </div>
            </div>
            <div class="offset-md-2 col-md-8 form_clear">
                <a onClick={this.savebtnClick} class="btn btn-success btn_fullsize">Сохранить</a>
            </div>
        </div>
    }
}

export default DispatcherCreateOrderPage;