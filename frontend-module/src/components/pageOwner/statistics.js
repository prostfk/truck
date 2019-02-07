import React, {Component} from 'react';

import {Line} from 'react-chartjs-2';
import {Chart} from 'react-chartjs-2';
import {Container} from 'mdbreact';
import driverIcon from './img/driver-icon.png'
import statsIcon from './img/stats-icon.png'
import {NotificationManager} from "react-notifications";
import apiRequest from "../../util/ApiRequest";
import domtoimage from "dom-to-image";
import { saveAs } from 'file-saver';

export default class CompanyOwnerStatistics extends Component {

    constructor(props){
        super(props);
        this.getFullStatistics = this.getFullStatistics.bind(this);
        this.setCompanyWorkers = this.setCompanyWorkers.bind(this);
        this.generateAcceptedTable = this.generateAcceptedTable.bind(this);
        this.xlsFullStat = this.xlsFullStat.bind(this);
        this.state = {
            rolesAmmount:{},
            acceptedAmmount:{},
            executedAmmount:{},
            mmonthNames:[],
            acceptedAmmountMonthValues:[],
            executedAmmountMonthValues:[],
            totalItemsFailed :0,
            totalPricaeFaile : 0,
            productAmount : [],
            productPrice : []
        };
        document.title = "Статистика";
    }

    xlsCompanyInfo = () => {
        fetch("/api/company/statistics",  {headers: {'authorization': localStorage.getItem("authorization")}}).then(response=>{
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
    xlsFullStat = () => {
        fetch("/api/company/fullStatistics",  {headers: {'authorization': localStorage.getItem("authorization")}}).then(response=>{
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
                executedAmmount:data.executedAmmount,
                totalItemsFailed :data.totalItemsFailed,
                totalPricaeFaile:data.totalPricaeFaile

            });
            console.log(data.cancellationActAmmount);

            for (var k in data.cancellationActAmmount){
                let newArrOfValsproductAmmount = this.state.productAmount;
                newArrOfValsproductAmmount.push(data.cancellationActAmmount[k].productAmmount);

                let newArrOfValsproductPrice = this.state.productPrice;
                newArrOfValsproductPrice.push(data.cancellationActAmmount[k].productPrice);

                this.setState({
                    productAmount:newArrOfValsproductAmmount,
                    productPrice:newArrOfValsproductPrice
                })
            }

        }).then(()=>{
            console.log(this.state.productAmount);
            console.log(this.state.productPrice);

            this.setCompanyWorkers();
            for (var k in this.state.acceptedAmmount){

                let newarr = this.state.mmonthNames;
                let newArrOfVals = this.state.acceptedAmmountMonthValues;

                newarr.push(this.getMonthName(k));
                newArrOfVals.push(this.state.acceptedAmmount[k]);

                this.setState({
                    mmonthNames:newarr,
                    acceptedAmmountMonthValues:newArrOfVals
                })
            }
            for (let k in this.state.executedAmmount) {
                let newArrOfVals = this.state.executedAmmountMonthValues;
                newArrOfVals.push(this.state.executedAmmount[k]);
                this.setState({
                    executedAmmountMonthValues:newArrOfVals
                })
            }
            console.log(this.state)

        }).catch(()=>{
            NotificationManager.error('Ошибка');
        });
    }

    getMonthName(k){
        let b = "";
        switch(k){
            case "1": b = "Январь";
                break;
            case "2": b = "Февраль";
                break;
            case "3": b = "Март";
                break;
            case "4": b = "Апрель";
                break;
            case "5": b = "Май";
                break;
            case "6": b = "Июнь";
                break;
            case "7": b = "Июль";
                break;
            case "8": b = "Август";
                break;
            case "9": b = "Сентябрь";
                break;
            case "10": b = "Октябрь";
                break;
            case "11": b = "Ноябрь";
                break;
            case "12": b = "Декабрь";
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
        return fetch('/api/company/getFullStat', {method: "get", headers: {'authorization': localStorage.getItem("authorization")}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            return result;
        }).catch(err=>{
            NotificationManager.error('Ошибка');
        });
    };

    generateAcceptedTable(data,mmonthNames){
        if(data.length<6 || mmonthNames.length<6) return;
        let newarr = this.state.mmonthNames;
        let dataAccepted = {
            labels: newarr,
            datasets: [
                {
                    label: 'Принятые заказы',
                    fill: true,
                    lineTension: 0.4,
                    backgroundColor: '#426bff4a',
                    borderColor: '#5a6384',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: '#56845c',
                    pointBackgroundColor: '#adc6ff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#4e5784',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 5,
                    pointHitRadius: 10,
                    data: this.state.acceptedAmmountMonthValues
                },
            ]
        };
        return <Container>
            <Line data={dataAccepted} />
        </Container>
    }

    generateExecutedTable(data,mmonthNames){
        if(data.length<6 || mmonthNames.length<6) return;
        let newarr = this.state.mmonthNames;
        let dataAccepted = {
            labels: newarr,
            datasets: [
                {
                    label: 'Выполненные заказы',
                    fill: true,
                    lineTension: 0.4,
                    backgroundColor: '#23b39b42',
                    borderColor: '#568481',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: '#848484',
                    pointBackgroundColor: '#b9ffa9',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#498456',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 5,
                    pointHitRadius: 10,
                    data: this.state.executedAmmountMonthValues
                }
            ]
        };
        return <Container>
            <Line data={dataAccepted} />
        </Container>
    }

    generateFailedTableProducts(data,mmonthNames){
        if(data.length<6 || mmonthNames.length<6) return;
        let newarr = this.state.mmonthNames;
        let dataAccepted = {
            labels: newarr,
            datasets: [
                {
                    label: 'Списано товаров',
                    fill: false,
                    lineTension: 0.4,
                    backgroundColor: '#ffb7c6',
                    borderColor: '#ffb7c6',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: '#848484',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor:  '#ff818f',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 5,
                    pointHitRadius: 10,
                    data: this.state.productAmount
                }
            ]
        };
        return <Container>
            <Line data={dataAccepted} />
        </Container>
    }
    generateFailedTablePrices(data,mmonthNames){
        if(data.length<6 || mmonthNames.length<6) return;
        let newarr = this.state.mmonthNames;
        let dataAccepted = {
            labels: newarr,
            datasets: [
                {
                    label: 'Сумма списания',
                    fill: false,
                    lineTension: 0.4,
                    backgroundColor: '#ffb7c6',
                    borderColor: '#ffb7c6',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: '#848484',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor:  '#ff818f',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 5,
                    pointHitRadius: 10,
                    data: this.state.productPrice
                }
            ]
        };
        return <Container>
            <Line data={dataAccepted} />
        </Container>
    }



    render() {

        return (
            <div style={{backgroundColor: '#f3f3f3'}}>
                <div className="row animated fadeIn">
                    <div className="offset-md-1 col-xl-10 superuserform_companylist">
                        <h2> Скачать статистику</h2>
                        <div className="row">
                            <div onClick={this.xlsCompanyInfo} className="col-xl-2 download_button" title={"Скачать"}>
                                Отчет по заказам
                            </div>
                            <div onClick={this.xlsFullStat} className="col-xl-2 download_button" title={"Скачать"}>
                                Полная статистика
                            </div>
                            <div className="col-xl-2 download_button" onClick={()=>{
                                domtoimage.toBlob(document.getElementById('content-div'))
                                    .then(blob =>window.saveAs(blob, `${new Date().toLocaleString('ru')}-${localStorage.getItem('username')}.png`));
                            }}>
                                Скачать графики
                            </div>
                        </div>
                    </div>
                </div>
                <div id={'content-div'} style={{backgroundColor: '#f3f3f3'}}>
                    <div className="row">
                        <div className="offset-md-1 col-xl-10 superuserform_companylist">
                            <h2> Заказы:</h2>
                            <div className="row">
                                <div className="col-xl-6">
                                    {
                                        this.generateAcceptedTable(this.state.acceptedAmmountMonthValues,this.state.mmonthNames)
                                    }
                                </div>
                                <div className="col-xl-6">
                                    {
                                        this.generateExecutedTable(this.state.executedAmmountMonthValues,this.state.mmonthNames)
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="offset-md-1 col-xl-10 superuserform_companylist">
                            <h2> Товарные списания:</h2>
                            <div className="row">
                                <div className="col-xl-6">
                                    {
                                        this.generateFailedTableProducts(this.state.productAmount,this.state.mmonthNames)
                                    }
                                </div>
                                <div className="col-xl-6">
                                    {
                                        this.generateFailedTablePrices(this.state.productPrice,this.state.mmonthNames)
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="offset-md-1 col-xl-6 superuserform_companylist info-block">
                            <h2> Сотрудники:</h2>
                            <div className="row">
                                <Container>
                                    <canvas id="barChart"></canvas>
                                </Container>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}