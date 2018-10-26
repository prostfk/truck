import React from "react";

class DispatcherCreateOrderPage extends React.Component {
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
            date_departure: "14/07/2018",
            date_arrival: "01/01/2019",
            company: "",

        };
        document.title = "Создать заказ";
        this.fetchToSenderStocks(1);//это заглушка. Тут вместо 1 должен генериться id компании автоматически
        this.findAutos();
        this.findDrivers();
    }

    changeInput(event) {
        this.setState({
            [event.target.id]: [event.target.value]
        });
    }

    saveBtnClick(event) {
        let formData = new FormData();
        // let time = this.state.date_departure.join('');
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
        formData.forEach((v,k) =>{
            console.log(`${v} - ${k}`);
        });
        fetch('http://localhost:8080/api/orders/createOrder', {method: "POST", body: formData}).then(response => {
            response.json().then(data=>{

            })
        }, err => console.log(err));
    }

    fetchToCompany(event) {
        this.setState({
            companyNameForSearch: [event.target.value]
        });
        if (event.target.value!==''){
            fetch(`http://localhost:8080/api/companies/findCompaniesByNameLike?name=${this.state.companyNameForSearch}`, {headers: {'Auth-token': sessionStorage.getItem("Auth-token")}})
                .then(response => {
                    return response.json()
                }).then(data => {
                this.addCompaniesInSelect(data);
            });
            document.getElementById('client_id').style.display = '';
        }else{
            document.getElementById('client_id').style.display = 'none';
        }

    }

    fetchToStocks(id){
        fetch(`http://localhost:8080/api/companies/${id}/stocks`).then(response=>response.json()).then(data=>{
            let html = '';
            if (data.status === 404) return;
            data.map(stock=>{
                html += `<option value="${stock.id}">${stock.address}</option>`
            });
            document.getElementById('delivery_stock').innerHTML = html;
            this.setDefault();
        })
    }

    fetchToSenderStocks(id){
        fetch(`http://localhost:8080/api/companies/${id}/stocks`).then(response=>response.json()).then(data=>{
            let html = '';
            if (data.status === 404) return;
            data.map(stock=>{
                html += `<option value="${stock.id}">${stock.address}</option>`;
            });
            document.getElementById('departure_stock').innerHTML = html;
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

    setCustomerCompany(event){
        this.setState({
            client_id: event.target.value
        });
        this.fetchToStocks(event.target.value)
    }

    findAutos(){
        fetch('http://localhost:8080/api/orders/createOrder/getAutos').then(response=>response.json().then(data=>{
            let autoHtml = '';
            data.map(auto=>{
                autoHtml += `<option value=${auto.id}>${auto.name}</option>`;
                console.log(auto.id)
            });
            document.getElementById('auto').innerHTML = autoHtml;
            this.setDefault();

        }))
    }

    findDrivers(){
        fetch('http://localhost:8080/api/orders/createOrder/getDrivers').then(response=>response.json()).then(data=>{
            let driverHtml = '';
            data.map(driver => {
                driverHtml += `<option value=${driver.id}>${driver.name}</option>`
            });
            document.getElementById('driver').innerHTML = driverHtml;
            this.setDefault();

        });
    }

    setDefault(){
        this.setState({departure_stock: document.getElementById('departure_stock').value});
        this.setState({delivery_stock: document.getElementById('delivery_stock').value});
        this.setState({status: document.getElementById('status').value});
        this.setState({waybill_status: document.getElementById('waybill_status').value});
        this.setState({driver: document.getElementById('driver').value});
        this.setState({auto: document.getElementById('auto').value});
    }

    render() {

        let customerCompanyStyle = {
            display: 'none'
        };
        return <div className="row">
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


                        <select className={'form-control'} value={this.state.client_id} onClick={this.setCustomerCompany} onChange={this.changeInput} style={customerCompanyStyle}  name="client_id" id="client_id">
                        </select>

                        <small className="form-text text-muted">Адрес Отправления</small>
                        <select value={this.state.departure_stock} onChange={this.changeInput}
                               className="form-control" id="departure_stock" placeholder="Откуда"/>


                        <small className="form-text text-muted">Адрес Доставки</small>
                        <select value={this.state.delivery_stock} onChange={this.changeInput} className="form-control" id="delivery_stock" placeholder="Куда">
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
                        <select onChange={this.changeInput} value={this.state.waybill_status} className="form-control"
                                id="waybill_status">
                            <option selected disabled>Статус</option>
                            <option>Оформлен</option>
                            <option>Проверка завершена</option>
                            <option>Доставлен</option>
                        </select>


                        <small className="form-text text-muted">Дата отправления</small>
                        <input value={this.state.date_departure} onChange={this.changeInput} type="text"
                               className="form-control"  id="date_departure" placeholder="14.10.2015"/>

                        <small className="form-text text-muted">Дата прибытия</small>
                        <input value={this.state.date_arrival} onChange={this.changeInput} type="text"
                               className="form-control" id="date_arrival" placeholder="15.10.2016"/>

                        <small className="form-text text-muted">Водитель</small>
                        <select onChange={this.changeInput} value={this.state.driver} className="form-control"
                                id="driver">
                            <option selected disabled>Водитель</option>

                        </select>

                        <small className="form-text text-muted">Автомобиль</small>
                        <select onChange={this.changeInput} value={this.state.auto} className="form-control" id="auto">
                            <option selected disabled>Авто</option>

                        </select>

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