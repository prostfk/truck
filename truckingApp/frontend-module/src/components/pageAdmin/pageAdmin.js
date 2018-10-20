import React, { Component } from "react";

class AdminPage extends React.Component{
    render(){
        return <div class="row">
            <div class="offset-md-1 col-md-6 superuserform_companylist">
                <table class="table">
                    <thead class="thead">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Название Склада</th>
                        <th scope="col">Адрес</th>
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row">7</th>
                        <td>Склад ISO</td>
                        <td>Ул. Павлова 12</td>
                        <td><a href="edit">редактировать</a></td>
                        <td><a href="edit">Удалить</a></td>
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
                    <h5>Добавить склад</h5>
                    <div class="form-group">
                        <input type="text" class="form-control" id="inputname" placeholder="Склад #201" required=""></input>
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control" id="inputadres" placeholder="Адрес" required=""></input>
                    </div>
                    <button class="btn btn-success">Добавить склад</button>
                </form>
            </div>

        </div>
    }
}

export default AdminPage;