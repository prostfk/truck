import {Component} from 'react'
import React from "react";
import CommonUtil from '../commonUtil/commontUtil'
import {Link} from "react-router-dom";

class OwnerCancelAct extends Component{
    constructor(props) {
        super(props);
        this.renderTable = this.renderTable.bind(this);
        this.state = {
            //cancelAct: ""
        }
    }

    componentDidMount(props) {
        this.getCancelAct().then(data => {
            this.setState({cancelAct:data});
        });
    }

    getCancelAct() {
        let link = document.location.href.split("/");
        let id = link[link.length - 1];
        return fetch(`/api/company/cancelAct/${id}`, {
            method: "GET",
            headers: {'Auth-token': localStorage.getItem("Auth-token")}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            return result;
        });
    }

    renderTable(cancelAct){
        if(!cancelAct) return;
        return <div className={"row table_row"}>
            <div className={"col-md-1"}>{cancelAct.id}</div>
            <div className={"offset-md-1 col-md-1"}>{cancelAct.amount}</div>
            <div className={"offset-md-1 col-md-3"}>{cancelAct.price}</div>
            <div className={"offset-md-1 col-md-3"}>{CommonUtil.getCorrectDateFromLong(cancelAct.date)}</div>
        </div>
    }

    render() {
        return <div className="row">
            <div className="offset-md-2 col-md-8 superuserform_companylist">
                <div className="row table_header">
                    <div className="col-md-1">ID</div>
                    <div className="offset-md-1 col-md-1">Количество</div>
                    <div className="offset-md-1 col-md-3">Цена</div>
                    <div className="offset-md-1 col-md-3">Дата</div>
                </div>
                {
                    this.renderTable(this.state.cancelAct)
                }

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

            <div className="offset-md-2 col-md-8 form_clear"
                 id={'sendOrderRequestButton'} /*style={customerCompanyStyle}*/>
                <Link to={`/owner/orders`} className="btn btn-success btn_fullsize">Вернуться</Link>
            </div>
        </div>
    }
}

export default OwnerCancelAct;