import React, { Component } from "react";
import ReactDOM from "react";

class SysAdminPage extends React.Component{
    constructor(props) {
        super(props);
        this.getCompanyList = this.getCompanyList.bind(this);
        this.state = {
            companies:[]
        };
        this.getCompanyList();
    }
    getCompanyList() {
        var myres = fetch('http://localhost:8080/api/companys', {method: "get"}).then(function (response) {
            return response.json();
        }).then(function (result) {
          /*  ReactDOM.render(<div> {result.get(1)} </div>, document.getElementById('test'));*/
            result.forEach(function(item, i, result) {
                console.log(item);
            });
        })
    }

    render(){
        return <div class="row">
            <div class="offset-md-1 col-md-6 superuserform_companylist">
                <table class="table">
                    <thead class="thead">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Название компании</th>
                        <th scope="col">Статус</th>
                        <th scope="col">Дата регистрации</th>
                        <th scope="col"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td id="test">PoliExpress</td>
                        <td>Active</td>
                        <td>01.02.2013</td>
                        <td><a href="edit">редактировать</a></td>
                    </tr>
                    </tbody>
                </table>
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

            <div class="offset-md-1 col-md-3">
                <form class="superuserform_newaccountform">
                    <h5>Регистрация новой компании</h5>
                    <div class="form-group">
                        <input type="text" class="form-control" id="inputEmail" placeholder="newUser@mail.com" required=""></input>
                    </div>
                    <button class="btn btn-success">Отправить приглашение</button>
                </form>
            </div>

        </div>
    }
}

export default SysAdminPage;