import React, {Component} from 'react';

import {Chart, Line} from 'react-chartjs-2';
import { Container } from 'mdbreact';

import Icon from 'react-icons-kit';
import {user} from 'react-icons-kit/fa/user';
import {bank} from 'react-icons-kit/fa/bank';
import {automobile} from 'react-icons-kit/fa/automobile';


export default class PageOwnerClientStats extends Component {
    constructor(props){
        super(props);
        const {match: {params}} = this.props;
        this.getStatisticsByCompany = this.getStatisticsByCompany.bind(this);
        this.generateExecutedTable = this.generateExecutedTable.bind(this);
        this.state={
            clientId:params.clientId,
            mmonthNames:[],
            executedAmmount:{},
            executedAmmountMonthValues:[],
            clientName:""
        };
        document.title = "Статистика";
    }

    getStatisticsByCompany() {
        return fetch('/api/company/getStatByClient/'+this.state.clientId, {method: "get", headers: {'authorization': localStorage.getItem("authorization")}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            return result;
        }).catch(err=>{
            throw new Error('Ошибка доступа')
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


    componentDidMount(){
        this.getStatisticsByCompany().then(data => {
            this.setState({
                executedAmmount:data.executedAmmount,
                clientName:data.clientDto.name
            });
        }).then(()=>{
            for (var k in this.state.executedAmmount){

                let newarr = this.state.mmonthNames;
                newarr.push(this.getMonthName(k));

                let newArrOfVals = this.state.executedAmmountMonthValues;
                newArrOfVals.push(this.state.executedAmmount[k]);

                this.setState({
                    mmonthNames:newarr,
                    executedAmmountMonthValues:newArrOfVals
                })
            }
        }).catch(err=>{
            console.log(err);
        })
        console.log(this.state.clientName)
    }

    render(){
        return (
            <div className="row">
                <div className="offset-xl-1 col-xl-10 superuserform_companylist">
                    <h3>Статистика выполненных заказов для клиента " {this.state.clientName} "</h3>
                </div>
                <div className="offset-xl-1 col-xl-10 superuserform_companylist">
                    {
                        this.generateExecutedTable(this.state.executedAmmountMonthValues,this.state.mmonthNames)
                    }
                </div>
            </div>
        );
    }

}