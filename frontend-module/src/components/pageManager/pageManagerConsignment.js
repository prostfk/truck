import React, {Component} from "react";
import {Link} from "react-router-dom";
import Pagination from "react-js-pagination";

class ManagerConsignment extends Component {

    constructor(props) {
        super(props);
        this.getProductList = this.getProductList.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.state = {
            products: [],
            isLost: false,
        };
        document.title = "Товарная партия"
    }

    componentDidMount() {
        this.getProductList().then(data => {
             this.setState({products:data.content,
                 totalElements:data.totalElements,
                 currentPage:++data.number});
         });
    }

    handlePageChange(pageNumber) {
        this.getProductList(pageNumber).then(data => {
            this.setState({products:data.content,
                totalElements:data.totalElements,
                currentPage:++data.number});
        });
        this.setState({currentPage: pageNumber});
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
    getProductList(pageid=1) {
        let split = document.location.href.split('/');
        let id = split[split.length - 1];
        console.log(id);
        return fetch(`http://localhost:8080/api/manager/products/${id}?page=${pageid}`, {method: "get", headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(function (response) {
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
            <div className="col-md-2" style={{display: isLost ? 'block' : 'none' }}>Утерян</div>
            <div className="col-md-2" style={{display: isLost ? 'none' : 'block' }}>
                <select className="form-control" value={status} onChange = {this.changeProductStatus.bind(this, product.id)}>
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
        fetch(`http://localhost:8080/api/manager/${productId}/cancelProduct/${orderId}/?isLost=${isLost}`, {method: "GET", headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(function (response) {
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
        if(event.target.value==="Принят") status=1;
        else if(event.target.value==="Проверен") status=2;
        else if(event.target.value==="Доставлен") status=3;
        else if(event.target.value==="Утерян") status=4;

        fetch(`http://localhost:8080/api/manager/updateProductStatus/${productId}`, {method: "POST", body:status, headers: {'Auth-token': localStorage.getItem("Auth-token")}})
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
                        <div>
                            <Pagination
                                activePage={this.state.currentPage}
                                totalItemsCount={this.state.totalElements}
                                itemsCountPerPage={5}
                                pageRangeDisplayed={5}
                                hideDisabled={true}
                                itemClass={"page-item"}
                                linkClass={"page-link"}
                                activeClass={"activePage"}
                                onChange={this.handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ManagerConsignment;