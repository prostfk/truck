import React from "react";

class DispatcherEditOrderPage extends React.Component {
    constructor(props) {
        super(props);
        this.changeInput = this.changeInput.bind(this);
        this.saveBtnClick = this.saveBtnClick.bind(this);
        this.getCurrentOrder = this.getCurrentOrder.bind(this);
        // this.setValueInSelect = this.setValueInSelect.bind(this);
        DispatcherEditOrderPage.findFreeAutos = DispatcherEditOrderPage.findFreeAutos.bind(this);
        DispatcherEditOrderPage.findFreeDrivers = DispatcherEditOrderPage.findFreeDrivers.bind(this);
        const {match: {params}} = this.props;
        this.state = {
            order: {
                client:{},
                id: 0,
                name: '',
                status: '',
                sender: {},
                receiver: {},
                dateAccepted: '',
                dateExecuted: '',
                waybill: {auto:{},driver:{}},
                company: {}
            },
            freeAuto:[],
            freeDrivers:[]
        };
        document.title = "Заказ"

    }

    changeInput(event) {
        console.log(event.target.id + " " + event.target.value );
        console.log(this.state);
        this.setState({
            [event.target.id]: [event.target.value]
        });
    }


    componentDidMount() {
        this.getCurrentOrder().then(data => {
            this.setState({order:data});
            console.log(this.state.order);
        });
        DispatcherEditOrderPage.findFreeAutos().then(data=>{
            this.setState({freeAuto: data});
            console.log(this.state.freeAuto);
        });
        DispatcherEditOrderPage.findFreeDrivers().then(data=>{
            this.setState({freeDrivers: data});
            console.log(this.state.freeDrivers);
        });
    }

    getCurrentOrder() {//load order from server
        let split = document.location.href.split('/');
        let id = split[split.length - 1];
        return fetch(`http://localhost:8080/api/orders/${id}`, {method: "get"}).then(function (response) {
            return response.json();
        }).then(function (result) {
            // console.log(result);
            return result;
        });
    }

    static findFreeAutos(){
        return fetch('http://localhost:8080/api/orders/createOrder/getAutos').then(response=>response.json().then(data=>{
            // console.log(data);
            return data;
        }))
    }

    static findFreeDrivers(){
        return fetch('http://localhost:8080/api/orders/createOrder/getDrivers').then(response=>response.json()).then(data=>{return data});
    }


    saveBtnClick(event) { //send edited order
                let formData = new FormData();
                formData.append("id",this.state.order.id);
                formData.append("name",this.state.order.name);
                formData.append("client",this.state.order.client);
                formData.append("status",this.state.order.status);
                formData.append("sender",this.state.order.sender);
                formData.append("receiver",this.state.order.receiver);
                formData.append("dateAccepted",this.state.order.dateAccepted);
                formData.append("dateExecuted",this.state.order.dateExecuted);
                formData.append("company",this.state.order.company);
                console.log(formData.forEach(s => console.log(s)));
                fetch('http://localhost:8080/api/orders/createOrder', {method: "POST",body: formData}).then(response => {
                    response.json().then(data => console.log(data))
                }, err => console.log(err));
    }

    render() {

        return <div className="row">
            <div className="offset-md-1 col-md-6 superuserform_companylist">
                <div className="row">
                    <div className="col-md-6">
                        <h3>Основное</h3>
                        <small className="form-text text-muted">Компания- заказчик перевозки</small>
                        <input value={this.state.order.company.name} onChange={this.changeInput} type="text"
                               className="form-control" id="client_id" placeholder="Заказчик"/>

                        <small className="form-text text-muted">Адрес Отправления</small>
                        <input value={this.state.order.sender.address} onChange={this.changeInput} type="text"
                               className="form-control" id="sender" placeholder="Откуда"/>

                        <small className="form-text text-muted">Адрес доставки</small>
                        <input value={this.state.order.receiver.address} onChange={this.changeInput} type="text"
                               className="form-control" id="receiver" placeholder="Куда"/>

                        <div className="form-group">
                            <small className="form-text text-muted">Сатус заказа</small>
                            <select onChange={this.changeInput} value={this.state.order.status} className="form-control" id="status">
                                <option selected disabled>Статус</option>
                                <option value={'Принят'}>Принят</option>
                                <option value={'Отклонен'}>Отклонен</option>
                                <option value={'Выполнен'}>Выполен</option>
                                <option value={'Не выполнен'}>Не выполнен</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h3>ТТН</h3>

                        <small className="form-text text-muted">Статус</small>
                        <select onChange={this.changeInput} value={this.state.order.waybill.status} className="form-control" id="waybill_status">
                            <option selected disabled>Статус</option>
                            <option value={'Оформлен'}>Оформлен</option>
                            <option value={'Проверка завершена'}>Проверка завершена</option>
                            <option value={'Доставлен'}>Доставлен</option>
                        </select>

                        <small className="form-text text-muted">Водитель</small>
                        {/*todo rest req for drivers*/}
                        <select onChange={this.changeInput} value={this.state.order.waybill.driver} className="form-control" id="driver">
                            <option selected disabled>Водитель</option>
                            <option value={this.state.order.waybill.driver.id}>{this.state.order.waybill.driver.name}</option>
                            {
                                this.state.freeDrivers.map(driver=>{
                                    return <option value={driver.id}>{driver.name}</option>
                                })
                            }
                        </select>
                        {/*todo rest req for cars*/}
                        <small className="form-text text-muted">Автомобиль</small>
                        {/*<input onChange={this.setAuto} type="text" className="form-control" id={'auto'} value={this.state.order.waybill.auto.name}/>*/}

                        <select onChange={this.changeInput} value={this.state.order.waybill.auto} className="form-control" id="auto">
                            <option selected disabled>Авто</option>
                            {
                                this.state.freeAuto.map(auto=>{
                                    return <option value={auto.id}>{auto.name}</option>
                                })
                            }
                        </select>

                        <small className="form-text text-muted">Дата отправления</small>
                        <input value={new Date(this.state.order.dateExecuted).toLocaleDateString()} onChange={this.changeInput} type="text"
                               className="form-control" id="date_departure" placeholder="14.10.2015"/>

                        <small className="form-text text-muted">Дата прибытия</small>
                        <input value={new Date(this.state.order.dateAccepted).toLocaleDateString()} onChange={this.changeInput} type="text"
                               className="form-control" id="date_arrival" placeholder="15.10.2016"/>

                    </div>
                </div>
            </div>
            <div className="offset-md-2 col-md-8 form_clear">
                <a onClick={this.saveBtnClick} className="btn btn-success btn_fullsize">Сохранить</a>
            </div>
        </div>
    }
}

export default DispatcherEditOrderPage;