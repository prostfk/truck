import React, {Component} from 'react';

import { Chart } from 'react-chartjs-2';
import { Container } from 'mdbreact';

import Icon from 'react-icons-kit';
import {user} from 'react-icons-kit/fa/user';
import {bank} from 'react-icons-kit/fa/bank';
import {automobile} from 'react-icons-kit/fa/automobile';


export default class PageSysAdminStatistics extends Component {
    constructor(props){
        super(props);
        this.getFullStatistics = this.getFullStatistics.bind(this);
        this.updateData = this.updateData.bind(this);
        this.createCompanyStatistics = this.createCompanyStatistics.bind(this);
        this.createUserRoleStatistics = this.createUserRoleStatistics.bind(this);
        this.createAutoStatistics = this.createAutoStatistics.bind(this);
        this.state = {
          workers:[],
            workersAmmount:0,
          workersHeaders:[],

          companies:[],
            companiesAmmount:0,
          companiesHeaders:[],

          autoArray:[],
            autoAmmount:0,
          autoArrayHeader:[]
        };
        document.title = "Статистика";
    }

    updateData(data){
        let workersAmmount = this.state.workersAmmount;
        let companiesAmmount = this.state.companiesAmmount;
        let autoAmmount = this.state.autoAmmount;

        let autoArray=[];
        let autoArrayHeader=[];
        data.autoStatisticsDtos.forEach(function(element) {
            autoArrayHeader.push(element.isActive==true?"В эксплуатации":"Списаны");
            autoArray.push(element.ammount);
            autoAmmount+=element.ammount;
        });

        let companies = [];
        let companiesHeaders = [];
        data.companyStatisticsDtos.forEach(function(element) {
            companiesHeaders.push(element.isBlocked==0?"Заблокированные":"Активные");
            companies.push(element.count);
            companiesAmmount+=element.count;
        });

        let workers = [];
        let workersHeaders = [];
        data.userStatisticsDtos.forEach(function(element) {
            let header;
            switch (element.userRole) {
                case "ROLE_SYS_ADMIN": header = "Системный администратор";
                    break;
                case "ROLE_COMP_OWNER": header = "Владельцы компаний";
                    break;
                case "ROLE_ADMIN": header = "Администраторы";
                    break;
                case "ROLE_DISPATCHER": header = "Диспетчеры";
                    break;
                case "ROLE_MANAGER": header = "Менеджеры";
                    break;
                case "ROLE_DRIVER": header = "Водители";
                    break;
                case "ROLE_USER": header = "Без роли";
                    break;
                case "ROLE_ANONYMOUS": header = "Анонимные";
                    break;
            }
            workersHeaders.push(header);
            workers.push(element.count);
            workersAmmount+=element.count;
        });

        this.setState({
            workers:workers,
            workersHeaders:workersHeaders,
            companies:companies,
            companiesHeaders:companiesHeaders,
            autoArray:autoArray,
            autoArrayHeader:autoArrayHeader,
            workersAmmount:workersAmmount,
            companiesAmmount:companiesAmmount,
            autoAmmount:autoAmmount
        });
    }

    componentDidMount(){
        this.getFullStatistics().then(data => {
            this.updateData(data)
        }).then(()=>{
            this.createCompanyStatistics();
            this.createUserRoleStatistics();
            this.createAutoStatistics();
        }).catch(err=>{
            console.log(err);
        })
    }

    createCompanyStatistics(){
        var ctxP = document.getElementById("pieChart").getContext('2d');
        new Chart(ctxP, {
            type: 'pie',
            data: {
                labels: this.state.companiesHeaders,
                datasets: [
                    {
                        data: this.state.companies,
                        backgroundColor: ["#5e8fe0", "#204c84"],

                    }
                ]
            },
            options: {
                responsive: true
            }
        });
    }

    createAutoStatistics(){
        var ctxP = document.getElementById("pieChartAutos").getContext('2d');

        new Chart(ctxP, {
            type: 'pie',
            data: {
                labels: this.state.autoArrayHeader,
                datasets: [
                    {
                        data: this.state.autoArray,
                        backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
                        hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]
                    }
                ]
            },
            options: {
                responsive: true
            }
        });
    }

    createUserRoleStatistics(){
        var ctxD = document.getElementById("doughnutChart").getContext('2d');
        new Chart(ctxD, {
            type: 'doughnut',
            data: {
                labels: this.state.workersHeaders,
                datasets: [
                    {
                        data: this.state.workers,
                        backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
                        hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]
                    }
                ]
            },
            options: {
                responsive: true
            }
        });
    }

    getFullStatistics() {
        return fetch('/api/statistics/getFull', {method: "get", headers: {'authorization': localStorage.getItem("authorization")}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            return result;
        }).catch(err=>{
            throw new Error('Ошибка доступа')
        });
    }

    render(){
        return (
            <div className="row">
                <div className="offset-xl-1 col-xl-10 superuserform_companylist">
                    <div className="row">
                        <div className="offset-xl-1 col-xl-5 stat_container">
                            <div className="stat_container_header"> Компании </div>
                            <Container>
                                <canvas id="pieChart"></canvas>
                            </Container>
                        </div>
                        <div className="offset-xl-1 col-xl-5">
                            <div className="col-md-12 statblock color_orange"><Icon icon={user}/>Пользователей: {this.state.workersAmmount}</div>
                            <div className="col-md-12 statblock"><Icon icon={bank}/>Компаний: {this.state.companiesAmmount}</div>
                            <div className="col-md-12 statblock color_red"><Icon icon={automobile}/>Автомобилей: {this.state.autoAmmount}</div>
                        </div>

                    </div>
                    <div className="row superuserform_companylist">
                        <div className="offset-xl-1 col-xl-5 stat_container">
                            <div className="stat_container_header">
                                Пользователи
                            </div>
                            <Container>
                                <canvas id="doughnutChart"></canvas>
                            </Container>
                        </div>
                        <div className="offset-xl-1 col-xl-5 stat_container">
                            <div className="stat_container_header"> Автомобили </div>
                            <Container>
                                <canvas id="pieChartAutos"></canvas>
                            </Container>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}