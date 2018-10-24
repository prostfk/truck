import React from "react";
import {Link} from 'react-router-dom'

class DispatcherOrderList extends React.Component{
    constructor(props) {
        super(props);
        this.getOrderList = this.getOrderList.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.state = {
            orders:[]
        };
        document.title = "Заказы"
    }
    componentDidMount(){
        this.getOrderList().then(data => {
            this.setState({orders:data});
        });
    }

    /*get all company list*/
    getOrderList() {
        return fetch('http://localhost:8080/api/orders/', {method: "get"}).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            return result;
        });
    }

    /*render row of table ( calls from html ) */
    renderTable(order){
        if(!order) return;
        return <div className = "row table_row order_row">
            <div className="col-md-2">{order.client.name}</div>
            <div className="col-md-2" title={order.sender.address}>{order.sender.name}</div>
            <div className="col-md-2" title={order.receiver.address}>{order.receiver.name}</div>
            <div className="col-md-2">{new Date(order.waybill.dateDeparture).toLocaleDateString()}</div>
            <div className="col-md-2">{new Date(order.waybill.dateArrival).toLocaleDateString()}</div>
            <div className="col-md-2">
                <Link to={`/orders/${order.id}`}>Редактировать</Link>
            </div>
        </div>
    }


    render(){
        return  <div class="row">
            <div class="offset-md-1 col-md-7 superuserform_companylist">
                <div className = "row table_header">
                    <div className="col-md-2">Клиент</div>
                    <div className="col-md-2">Название склада (отправитель)</div>
                    <div className="col-md-2">Название склада (получатель)</div>
                    <div className="col-md-2">Дата отправления</div>
                    <div className="col-md-2">Дата получения</div>
                    <div className="col-md-2">Заказ</div>
                </div>
                {
                    this.state.orders.map((element)=>{
                        return this.renderTable(element);
                    })
                }
            </div>
            <div class="offset-md-1 col-md-2">
                <form class="superuserform_newaccountform grey_form">
                    <h5>Добавление заказа</h5>
                    <Link to={`/orders/createorder`} className="btn btn-success btn_fullsize">Создать</Link>
                </form>
            </div>
        </div>
    }
}

export default DispatcherOrderList;