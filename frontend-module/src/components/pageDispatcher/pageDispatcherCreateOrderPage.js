import React from "react";

class DispatcherCreateOrderPage extends React.Component{
    constructor(props) {
        super(props);
        this.changeInput = this.changeInput.bind(this);
        this.saveBtnClick = this.saveBtnClick.bind(this);
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
    saveBtnClick(event){
/*        let formData = new FormData();
        formData.append("id",this.state.client_id);
        formData.append("name",this.state.client_id);
        formData.append("client",this.state.client_id);
        formData.append("status",this.state.client_id);
        formData.append("sender",this.state.client_id);
        formData.append("receiver",this.state.client_id);
        formData.append("dateAccepted",this.state.client_id);
        formData.append("dateExecuted",this.state.client_id);
        formData.append("company",this.state.client_id);



        fetch('http://localhost:8080/api/orders/createOrder', {method: "POST",body: formData}).then(response => {
            response.json().then(data => console.log(data))
        }, err => console.log(err));*/
    }

    render(){

        return <div className="row">
            <div className="offset-md-1 col-md-6 superuserform_companylist">
                <div className="row">
                    <div className="col-md-6">
                        <h3>Основное</h3>
                        <small className="form-text text-muted">Компания- заказчик перевозки</small>
                        <input value={this.state.client_id} onChange={this.changeInput} type="text" className="form-control" id="client_id" placeholder="Заказчик"/>

                        <small className="form-text text-muted">Адрес Отправления</small>
                        <input value={this.state.sender} onChange={this.changeInput} type="text" className="form-control" id="sender" placeholder="Откуда"/>

                        <small className="form-text text-muted">Адрес доставки</small>
                        <input value={this.state.receiver} onChange={this.changeInput} type="text" className="form-control" id="receiver" placeholder="Куда"/>

                        <div className="form-group">
                            <small className="form-text text-muted">Сатус заказа</small>
                            <select onChange={this.changeInput} className="form-control" id="status">
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
                        <select onChange={this.changeInput} className="form-control" id="waybill_status">
                            <option selected disabled>Статус</option>
                            <option>Оформлен</option>
                            <option>Проверка завершена</option>
                            <option>Доставлен</option>
                        </select>

                        <small className="form-text text-muted">Водитель</small>

                        <select onChange={this.changeInput} className="form-control" id="driver">
                            <option selected disabled>Водитель</option>
                            <option>Иванов</option>
                            <option>Петров</option>
                            <option>Тучкин</option>
                        </select>

                        <small className="form-text text-muted">Автомобиль</small>
                        <select onChange={this.changeInput} className="form-control" id="auto">
                            <option selected disabled>Авто</option>
                            <option >Volvo 10</option>
                            <option>BMW 44-10</option>
                            <option>BusCry 22-13</option>
                        </select>
                        <small className="form-text text-muted">Дата отправления</small>
                        <input value={this.state.date_departure} onChange={this.changeInput} type="text" className="form-control" id="date_departure" placeholder="14.10.2015"/>

                        <small className="form-text text-muted">Дата прибытия</small>
                        <input value={this.state.date_arrival} onChange={this.changeInput} type="text" className="form-control" id="date_arrival" placeholder="15.10.2016"/>

                    </div>
                </div>
            </div>
            <div className="offset-md-2 col-md-8 form_clear">
                <a onClick={this.saveBtnClick} className="btn btn-success btn_fullsize">Сохранить</a>
            </div>
        </div>
    }
}

export default DispatcherCreateOrderPage;