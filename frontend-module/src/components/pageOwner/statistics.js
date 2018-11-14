import React, {Component} from 'react';

import { Line } from 'react-chartjs-2';
import { Chart } from 'react-chartjs-2';
import { Container } from 'mdbreact';


export default class CompanyOwnerStatistics extends Component {

    constructor(props){
        super(props);
        this.getFullStatistics = this.getFullStatistics.bind(this);
        this.setCompanyWorkers = this.setCompanyWorkers.bind(this);
        this.state = {
            rolesAmmount:{}
        };
        document.title = "Статистика";
    }

    xlsSender = () => {
        fetch("http://localhost:8080/api/company/getFullStat",  {headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(response=>{
            return response.blob()
        }).then(blob=>{
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = `${localStorage.getItem('username')}.xls`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
    };
    componentDidMount(){
        this.getFullStatistics().then(data => {
          this.setState({
              rolesAmmount:data.workersAmmount
          })
        }).then(()=>{
            this.setCompanyWorkers();
        });
    }

    setCompanyWorkers(){
        var ctxB = document.getElementById("barChart").getContext('2d');
        new Chart(ctxB, {
            type: 'bar',
            data: {
                labels: ["Администраторы", "Диспетчеры", "Менеджеры", "Водители", "Владельцы"],
                datasets: [{
                    label: 'Количество',
                    data: [this.state.rolesAmmount.ROLE_ADMIN,
                        this.state.rolesAmmount.ROLE_DISPATCHER,
                        this.state.rolesAmmount.ROLE_MANAGER,
                        this.state.rolesAmmount.ROLE_DRIVER,
                        this.state.rolesAmmount.ROLE_COMP_OWNER],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    }

    getFullStatistics() {
        return fetch('http://localhost:8080/api/company/getFullStat', {method: "get", headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            return result;
        }).catch(err=>{
            throw new Error('Ошибка доступа')
        });
    }

    //todo statistics ui


    render() {
        const dataAccepted = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Принятые заказы',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: '#848484',
                    borderColor: '#848484',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: '#848484',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#848484',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [1, 2, 5, 4, 4, 2, 3]
                }
            ]
        };
        const dataExecuted = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Выполненные заказы',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: '#848484',
                    borderColor: '#848484',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: '#848484',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#848484',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [0, 2,4, 5, 3, 6, 9]
                }
            ]
        };

        return (
            <div>
                <div className="row">
                    <div className="offset-md-1 col-xl-10 superuserform_companylist">
                        <h2> Заказы:</h2>
                        <div className="row">
                            <div className="col-xl-6">
                                <Container>
                                    <Line data={dataAccepted} />
                                </Container>
                            </div>
                            <div className="col-xl-6">
                                <Container>
                                    <Line data={dataExecuted} />
                                </Container>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="offset-md-1 col-md-10 superuserform_companylist info-block">
                        <h2> Сотрудники:</h2>
                        <div className="row">
                            <div className="col-xl-6">
                                <Container>
                                    <canvas id="barChart"></canvas>
                                </Container>
                            </div>
                        </div>
                    </div>
                </div>
{/*                <div className="row">
                    <div className="offset-md-1 col-md-10 superuserform_companylist info-block">
                        <h2> Сотрудники:</h2>
                        <div className="row">
                            <div className="col-md-2">Администраторы: {this.state.rolesAmmount.ROLE_ADMIN}</div>
                            <div className="col-md-2">Диспетчеры:  {this.state.rolesAmmount.ROLE_DISPATCHER}</div>
                            <div className="col-md-2">Менеджеры:  {this.state.rolesAmmount.ROLE_MANAGER}</div>
                            <div className="col-md-2">Водители:  {this.state.rolesAmmount.ROLE_DRIVER}</div>
                            <div className="col-md-2">Владельцы:  {this.state.rolesAmmount.ROLE_COMP_OWNER}</div>
                        </div>
                    </div>
                </div>*/}
            </div>
        );
    }
}