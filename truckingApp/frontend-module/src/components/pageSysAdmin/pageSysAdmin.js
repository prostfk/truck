import React, { Component } from "react";
import { Link } from 'react-router-dom'
import ReactDOM from "react";

class SysAdminPage extends React.Component{
    constructor(props) {
        super(props);
        this.getCompanyList = this.getCompanyList.bind(this);
        this.state = {
            companies:[]
        };
    }
    componentDidMount(){
        this.getCompanyList().then(data => {
            this.setState({companies:data});
        });

    }
    getCompanyList() {
        var myres = fetch('http://localhost:8080/api/companys', {method: "get"}).then(function (response) {
            return response.json();
        }).then(function (result) {
            return result;
        })
        return myres;
    }
    rendertable(company){
        if(!company) return;
        const isActive =  company.active?"Active":"Locked";
        return <div className={"row table_row"}>
            <div className={"col-md-1"}>{company.id}</div>
            <div className={"col-md-5"}>{company.name}</div>
            <div className={"col-md-3"}>{isActive}</div>
            <div className={"col-md-3"}>
                <Link to={`/edit/${company.id}`} activeClassName="active">Редактировать</Link>
            </div>
        </div>
    }

    render(){
        /*this.state.companies.map((company) => {
            this.rendertable(company);
        });*/
        return <div class="row">
            <div class="offset-md-1 col-md-6 superuserform_companylist">
                <div className="row table_header">
                    <div className="col-md-1">ID</div>
                    <div className="col-md-5">Название компании</div>
                    <div className="col-md-3">Статус</div>
                    <div className="col-md-3">Действие</div>
                </div>
                    {
                    this.state.companies.map((element)=>{
                        return this.rendertable(element);
                    })
                    }
                <div className="row">
                    <nav aria-label="...">
                        <ul class="pagination pagination-sm">
                            <li class="page-item disabled">
                                <a class="page-link" href="#" tabindex="-1">1</a>
                            </li>
                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                            <li class="page-item"><a class="page-link" href="#">3</a></li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div class="offset-md-1 col-md-3">
                <form class="superuserform_newaccountform grey_form">
                    <h5>Регистрация новой компании</h5>
                    <div class="form-group">
                        <input type="text" class="form-control" id="inputEmail" placeholder="newUser@mail.com" required=""></input>
                    </div>
                    <button class="btn btn-success btn_fullsize">Отправить</button>
                </form>
            </div>

        </div>
    }
}

export default SysAdminPage;