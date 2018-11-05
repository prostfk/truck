import React, {Component} from "react";
import {Link} from "react-router-dom";

class ManagerConsignment extends Component {

    constructor(props) {
        super(props);
        this.getProductList = this.getProductList.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.state = {
            products: []
        };
        document.title = "Товарная партия"
    }

    componentDidMount() {
        this.getProductList().then(data => {
             this.setState({products:data});
         });
    }

    /*get active orders*/
    getProductList() {
        let split = document.location.href.split('/');
        let id = split[split.length - 1];
        console.log(id);
        return fetch(`http://localhost:8080/api/manager/products/${id}`, {method: "get",headers: {'Auth-token': sessionStorage.getItem('Auth-token')}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            return result;
        });
    }

    /*render row of table ( calls from html ) */
    renderTable(product) {
        if (!product) return;

        let status;
        if(product.status==="") status="Не выбран";
        else if(product.status==="ACCEPTED") status="Принят";
        else if(product.status==="CHECK_DONE") status="Проверен";
        else if(product.status==="DELIVERED") status="Доставлен";
        else if(product.status==="LOST") status="Утерян";

        return <div className="row table_row manager_orders">
            <div className="col-md-4">{product.name}</div>
            <div className="col-md-4">
                <select className="form-control" defaultValue={status} onChange = {this.changeProductStatus.bind(this, product.id)}>
                    <option>Принят</option>
                    <option>Доставлен</option>
                    <option>Утерян</option>
                    <option>Проверен</option>
                </select>
            </div>
            <div className="col-md-4">{product.description}</div>
        </div>
    }

    changeProductStatus(productId, event) {
        let status;
        if(event.target.value==="Принят") status="ACCEPTED";
        else if(event.target.value==="Проверен") status="CHECK_DONE";
        else if(event.target.value==="Доставлен") status="DELIVERED";
        else if(event.target.value==="Утерян") status="LOST";

        fetch(`http://localhost:8080/api/manager/upsateproductstatus/${productId}`, {method: "POST", body: status,headers: {'Auth-token': sessionStorage.getItem('Auth-token')}})
            .then(function(response) {
                return response.json();
            }).then(function(result) {
                console.log(result);
        }).catch((err) => {
            console.log(err);
        });
    }
    render() {
        return (
            <div className="row">
                <div className="offset-md-1 col-md-6 form_clear">
                    <h3>Товарная партия</h3>
                    <div className="row table_header">
                        <div className="col-md-4">Наименование</div>
                        <div className="col-md-4">Состоние</div>
                        <div className="col-md-4">Описание</div>
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
                                    <a className="page-link" href="#1" tabIndex="-1">1</a>
                                </li>
                                <li className="page-item"><a className="page-link" href="#2">2</a></li>
                                <li className="page-item"><a className="page-link" href="#3">3</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div className="offset-md-1 col-md-3">
                    <form className="manager_createcancelletionact grey_form">
                        <h5>Акт списания</h5>
                        <Link to={`/manager/edit/cancelletion`} className="btn btn-success btn_fullsize">Создать</Link>
                    </form>
                </div>
            </div>
        );
    }
}

export default ManagerConsignment;