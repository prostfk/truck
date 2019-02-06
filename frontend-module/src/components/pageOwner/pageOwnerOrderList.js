import React from "react";
import {Link} from 'react-router-dom'
import CommonUtil from "../commonUtil/commontUtil";
import {NotificationManager} from "react-notifications";

class OwnerOrderList extends React.Component {
    constructor(props) {
        super(props);
        this.getOrderList = this.getOrderList.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.state = {
            orders: []
        };
        document.title = "Заказы"
    }

    componentDidMount() {
        this.getOrderList().then(data => {
            this.setState({orders: data});
            console.log(data);
        });
    }

    /*get all orders list for current company*/
    getOrderList() {
        return fetch('/api/company/orders/', {
            method: "GET",
            headers: {'authorization': localStorage.getItem("authorization")}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            return result;
        }).catch(()=>{
            NotificationManager.error('Ошибка');
        });
    }

    /*render row of table ( calls from html ) */
    renderTable(order, index) {
        if (!order) return;
        return <div key={index} className="row table_row order_row animated fadeInUp">
            <div className="col-md-1">{order.client.name}</div>
            <div className="col-md-2" title={order.sender.address}>{order.sender.name}</div>
            <div className="col-md-2" title={order.receiver.address}>{order.receiver.name}</div>
            <div className="col-md-2">{CommonUtil.getCorrectDateFromLong(order.waybill.dateDeparture)}</div>
            <div className="col-md-2">{CommonUtil.getCorrectDateFromLong(order.waybill.dateArrival)}</div>
            <div className="col-md-1">
                <Link to={`/owner/waybill/${order.id}`} className="table_button bg-secondary text-white">Перейти</Link>
            </div>
            <div className="col-md-1">
                <Link to={`/owner/routList/${order.id}`} className="table_button bg-secondary text-white">Перейти</Link>
            </div>
            <div className="col-md-1">
                <Link to={`/owner/cancelAct/${order.id}`}
                      className="table_button bg-secondary text-white">Перейти</Link>
            </div>
        </div>
    }


    render() {
        return <div className="row">
            <div className="offset-md-1 col-md-10 superuserform_companylist">
                <div className="row table_header animated fadeIn">
                    <div className="col-md-1">Клиент</div>
                    <div className="col-md-2">Название склада (отправитель)</div>
                    <div className="col-md-2">Название склада (получатель)</div>
                    <div className="col-md-2">Дата отправления</div>
                    <div className="col-md-2">Дата получения</div>
                    <div className="col-md-1">Накладная</div>
                    <div className="col-md-1">Путевый лист</div>
                    <div className="col-md-1">Акт списания</div>
                </div>
                {
                    this.state.orders.map((element, index) => {
                        return this.renderTable(element, index);
                    })
                }
            </div>
        </div>
    }
}

export default OwnerOrderList;