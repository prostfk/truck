import React, {Component} from 'react';

import { Line } from 'react-chartjs-2';
import { Chart } from 'react-chartjs-2';
import { Container } from 'mdbreact';


export default class CompanyOwnerStatistics extends Component {

    constructor(props){
        super(props);
        this.getFullStatistics = this.getFullStatistics.bind(this);
        this.setCompanyWorkers = this.setCompanyWorkers.bind(this);
        this.generateAcceptedTable = this.generateAcceptedTable.bind(this);
        this.state = {
            rolesAmmount:{},
            acceptedAmmount:{},
            executedAmmount:{},
            acceptedAmmounthMonthNames:[],
            acceptedAmmountMonthValues:[]
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
                rolesAmmount:data.workersAmmount,
                acceptedAmmount:data.acceptedAmmount,
                executedAmmount:data.executedAmmount
            })
        }).then(()=>{
            this.setCompanyWorkers();
            for (var k in this.state.acceptedAmmount){

                let newarr = this.state.acceptedAmmounthMonthNames;
                let newArrOfVals = this.state.acceptedAmmountMonthValues;

                newarr.push(this.getMonthName(k));
                newArrOfVals.push(this.state.acceptedAmmount[k]);

                this.setState({
                    acceptedAmmounthMonthNames:newarr,
                    acceptedAmmountMonthValues:newArrOfVals
                })
                console.log(this.state);
            }
        });
    }

    getMonthName(k){
        let b = "";
        switch(k){
            case "1": b = "January";
                break;
            case "2": b = "February";
                break;
            case "3": b = "March";
                break;
            case "4": b = "April";
                break;
            case "5": b = "May";
                break;
            case "6": b = "June";
                break;
            case "7": b = "July";
                break;
            case "8": b = "August";
                break;
            case "9": b = "September";
                break;
            case "10": b = "October";
                break;
            case "11": b = "November";
                break;
            case "12": b = "December";
                break;
        }
        return b;
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
    generateAcceptedTable(data){
        if(data.length<6) return;
        let newarr = this.state.acceptedAmmounthMonthNames;
        console.log(newarr);
        let dataAccepted = {
            labels: newarr,
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
                    data: this.state.acceptedAmmountMonthValues
                }
            ]
        };
        return <Container>
            <Line data={dataAccepted} />
        </Container>
    }

    //todo statistics ui


    render() {

        return (
            <div>
                <div className="row">
                    <div className="offset-md-1 col-xl-10 superuserform_companylist">
                        <h2> Заказы:</h2>
                        <div className="row">
                            <div className="col-xl-6">
                                {
                                    this.generateAcceptedTable(this.state.acceptedAmmounthMonthNames)
                                }
                            </div>
                            <div className="col-xl-6">
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