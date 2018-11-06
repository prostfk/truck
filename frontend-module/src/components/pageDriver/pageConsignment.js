import React, {Component} from "react";
import {Link} from "react-router-dom";

class DriverConsignment extends Component {

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
        let orderId = split[split.length - 1];
        return fetch(`http://localhost:8080/api/orders/getMyOrders/${orderId}/consignment`, {method: "get", headers: {'Auth-token': sessionStorage.getItem("Auth-token")}}).then(function (response) {
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
        if(product.status===1) status="Принят";
        else if(product.status===2) status="Проверен";
        else if(product.status===3) status="Доставлен";
        else if(product.status===4) status="Утерян";

        let isLost=false;
        if(status === "Утерян")
            isLost = true;

        return <div className="row table_row manager_orders">
            <div className="col-md-3">{product.name}</div>
            <div className="col-md-2" >{status}</div>
            <div className="col-md-3">{product.description}</div>
            <div className="col-md-2">{product.price}</div>
            <div className="col-md-2"><a className="table_button bg-secondary text-white" style={{display:isLost?"none":"block"}} onClick={this.setLostState.bind(this, product.id)}>Списать</a></div>
        </div>
    }

    setLostState(productId) {
        let split = document.location.href.split('/');
        let orderId = split[split.length - 1];
        const ref = this;
        fetch(`http://localhost:8080/api/orders/getMyOrders/cancelProduct/${productId}`, {method: "GET", headers: {'Auth-token': sessionStorage.getItem("Auth-token")}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            ref.forceUpdateHandler(result);
            return result;
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

export default DriverConsignment;