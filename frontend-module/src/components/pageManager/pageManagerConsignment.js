﻿import React, {Component} from "react";
import {Link} from "react-router-dom";

class ManagerConsignment extends Component {

    constructor(props) {
        super(props);
        this.getProductList = this.getProductList.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.state = {
            products: [],
            isLost: false
        };
        document.title = "Товарная партия"
    }

    componentDidMount() {
        this.getProductList().then(data => {
             this.setState({products:data});
         });
    }

    forceUpdateHandler(product) {
        console.log(product);
        const ref = this;
        ref.state.products.find((element, index)=>{
            if(element.id===product.id){
                const newProducts = ref.state.products;
                newProducts[index] = product;
                ref.setState({products:newProducts});
            }
        });
    }
    /*get active orders*/
    getProductList() {
        let split = document.location.href.split('/');
        let id = split[split.length - 1];
        console.log(id);
        return fetch(`http://localhost:8080/api/manager/products/${id}`, {method: "get", headers: {'Auth-token': sessionStorage.getItem("Auth-token")}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            return result;
        }).catch((err) => {
            console.log(err);
        });
    }

    /*render row of table ( calls from html ) */
    renderTable(product) {
        console.log(product);
        if (!product) return;

        let status;
        if(product.status==="") status="Не выбран";
        else if(product.status==="ACCEPTED") status="Принят";
        else if(product.status==="CHECK_DONE") status="Проверен";
        else if(product.status==="DELIVERED") status="Доставлен";
        else if(product.status==="LOST") status="Утерян";

        let isLost=false;
        if(status === "Утерян")
            isLost = true;

        return <div className="row table_row manager_orders">
            <div className="col-md-3">{product.name}</div>
            <div className="col-md-2" style={{display: isLost ? 'block' : 'none' }}>Утерян</div>
            <div className="col-md-2" style={{display: isLost ? 'none' : 'block' }}>
                <select className="form-control" defaultValue={status} onChange = {this.changeProductStatus.bind(this, product.id)}>
                    <option>Принят</option>
                    <option>Доставлен</option>
                    <option>Проверен</option>
                </select>
            </div>
            <div className="col-md-3">{product.description}</div>
            <div className="col-md-2">{product.price}</div>
            <div className="col-md-2"><a className="table_button bg-secondary text-white" onClick={this.setLostState.bind(this, product.id, isLost)}>{isLost?"Восстановить":"Списать"}</a></div>

        </div>
    }

    setLostState(productId, status) {
        let isLost = !status;
        console.log(isLost);
        let split = document.location.href.split('/');
        let orderId = split[split.length - 1];
        console.log(orderId);
        const ref = this;

        let formData = new FormData();
        formData.append("orderId", orderId);
        formData.append("isLost", isLost);
        fetch(`http://localhost:8080/api/manager/${productId}/cancelProduct`, {method: "POST", body:formData, headers: {'Auth-token': sessionStorage.getItem("Auth-token")}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            ref.forceUpdateHandler(result);
            return result;
        }).catch((err) => {
            console.log(err);
        });
    }
    changeProductStatus(productId, event) {
        let status;
        let ref = this;
        if(event.target.value==="Принят") status="ACCEPTED";
        else if(event.target.value==="Проверен") status="CHECK_DONE";
        else if(event.target.value==="Доставлен") status="DELIVERED";
        else if(event.target.value==="Утерян") status="LOST";

        fetch(`http://localhost:8080/api/manager/updateProductStatus/${productId}/?status=${status}`, {method: "GET", headers: {'Auth-token': sessionStorage.getItem("Auth-token")}})
            .then(function(response) {
                return response.json();
            }).then(function(result) {
                if(result !== undefined) {
                   ref.forceUpdateHandler(result);
                }
                console.log(result);
        }).catch((err) => {
            console.log(err);
        });
    }
    render() {
        return (
            <div className="row">
                <div className="offset-md-1 col-md-8 form_clear">
                    <h3>Товарная партия</h3>
                    <div className="row table_header">
                        <div className="col-md-3">Наименование</div>
                        <div className="col-md-2">Состоние</div>
                        <div className="col-md-3">Описание</div>
                        <div className="col-md-2">Цена</div>
                        <div className="col-md-2"></div>
                    </div>
                    {
                        this.state.products.map((element) => {
                            return this.renderTable(element);
                        })
                    }
                    <div className="table_footer">
                        <nav aria-label="...">
                            <ul className="pagination pagination-sm">
                                <li className="page-item disabled">
                                    <a className="page-link" href="#" tabIndex="-1">1</a>
                                </li>
                                <li className="page-item"><a className="page-link" href="#">2</a></li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        );
    }
}

export default ManagerConsignment;