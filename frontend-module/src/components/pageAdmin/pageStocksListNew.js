import React from "react";
import ModalAcceptDelete from "./modalAcceptDelete";
import CreateStockModal from "./modalComponentCreateStock";
import EditStockModal from "./modalComponentEditStock";
/*import PropTypes from "prop-types";*/
import Pagination from "react-js-pagination";
import {NotificationManager} from "react-notifications";
import ValidationUtil from "../commonUtil/validationUtil";

export default class PageStockListNew extends React.Component {
    constructor(props) {
        super(props);
        this.getStockList = this.getStockList.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.setCompanyName = this.setCompanyName.bind(this);
        this.setCompanyAddress = this.setCompanyAddress.bind(this);
        this.addNewStock = this.addNewStock.bind(this);
        this.submitDelete = this.submitDelete.bind(this);
        this.submitEdit = this.submitEdit.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.state = {
            stocks:[],
            stockName:"",
            stockAddress:"",
            totalElements:0,
            currentPage:1,
            searchStockName: ''
        };
        document.title = "Склады"
    }

    forceUpdateHandler(){
        const refthis = this;
        fetch('http://localhost:8080/api/stocks?='+this.state.currentPage, {method: "get", headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            refthis.setState({stocks:result})
        })
    };

    changeInput = (event) => {
        this.setState({
            [event.target.id]: [event.target.value]
        });
        console.log(this.state.searchStockName)
    };

    setCompanyName(event) {
        this.setState({
            stockName: event.target.value
        })
    }
    setCompanyAddress(event) {
        this.setState({
            stockAddress: event.target.value
        })
    }
    addNewStock(event){
        let stockaddress = this.state.stockAddress;
        let stockname = this.state.stockName;
        let formData = new FormData();
        formData.append("name", stockname);
        formData.append("address", stockaddress);
        console.log(formData);
        fetch('http://localhost:8080/api/stocks', {method: "POST",body: formData, headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(response => {
            response.json().then(data => {
                console.log(data);
                // this.forceUpdateHandler();    /*this.setState({stocks:data}) its not working.. why??*/
                this.setState({stockName:"",stockAddress:""})
            })
        }).catch(()=>{
            NotificationManager.error('Ошибка');
        });
    }

    getStockList(pageid=1){
        const fetchResult = fetch('http://localhost:8080/api/stocks?page='+pageid, {headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            return result;
        });
        return fetchResult;
    }
    componentDidMount(){
        this.getStockList().then(data => {
            this.setState({
                stocks:data.content,
                totalElements:data.totalElements,
                currentPage:++data.number
            });
        });
    }
    handlePageChange(pageNumber) {
        this.getStockList(pageNumber).then(data => {
            this.setState({
                stocks:data.content,
                totalElements:data.totalElements,
                currentPage:++data.number
            });
        });

        console.log(this.state);
        console.log("im updating!");
    }

    submitEdit(newStockName,newStockAdress,stockId,event){
        let refThis=this;
        let formData = new FormData();
        formData.append("id", stockId);
        formData.append("name", newStockName);
        formData.append("address", newStockAdress);

        fetch('http://localhost:8080/api/editStock/', {
            method: "PUT",
            body: formData,
            headers: {'Auth-token': localStorage.getItem('Auth-token')}
        }).then(response => {
            console.log(response);
            return response.json();
        }).then(data => {
            console.log(data);
            if (data.error === undefined) {
                refThis.state.stocks.find((element, index, array) => {
                    if (element.id === data.id) {
                        const newStocks = refThis.state.stocks;
                        newStocks[index] = data;
                        refThis.setState({companies: newStocks});
                    }
                });
            } else {
                /* document.getElementById('error-form-span').innerText = data.error;*/
            }
        }).catch(()=>{
            NotificationManager.error('Ошибка');
        });
    }

    renderTable(stock){
        if(!stock) return;
        return <div className={"row table_row animated fadeInUp"}>
            <div className={"col-md-1"}>{stock.id}</div>
            <div className={"col-md-5"}>{stock.name}</div>
            <div className={"col-md-4"}>{stock.address}</div>
            <div className={"col-md-1"}>
                <EditStockModal stockName={stock.name} stockId={stock.id}/>
                {/*<ModalComponentStockEdit clickfunc={this.submitEdit} className={"table_button bg-secondary text-white"} stockName={stock.name} stockAddress={stock.address} stockId={stock.id}/>*/}
            </div>
            <div className={"col-md-1"}>
                <ModalAcceptDelete clickfunc={this.submitDelete} componentId={stock.id} headerText={"Вы действительно хотите удалить склад?"} bodyText={"Восстановить склад будет невозможно"} />
            </div>
        </div>
    }

    submitDelete(stockId){
        const ref = this;
        fetch('http://localhost:8080/api/stocks', {
            method: 'DELETE',
            body: stockId,
            headers: {'Auth-token': localStorage.getItem("Auth-token")}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            if (result) {
                ref.setState({stocks:result})
            }
        }).catch(()=>{
            NotificationManager.error('Ошибка');
        });
    }

    searchStocks = () => {
        let name = ValidationUtil.getStringFromUnnownObject(this.state.searchStockName);
        console.log(name);
        fetch(`http://localhost:8080/api/findStock?active=true&name=${name}`, {headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(response=>{
            return response.json();
        }).then(data=>{
            console.log(data);
            if (Array.isArray(data)){
                let str = '';
                if (data.length === 0){
                    document.getElementById('error-stocks-list').innerText = 'Такого склада нет';
                    document.getElementById('stocks-ul').innerHTML = '';
                }else {
                    document.getElementById('error-stocks-list').innerText = '';
                    for (let i = 0; i < data.length; i++) {
                        str += `<li class="list-group-item list-group-item-action animated fadeInUp">${data[i].name}</li>`
                    }
                    document.getElementById('stocks-ul').innerHTML = str;
                }
            }else{
                NotificationManager.error('Ошибка');
            }
        }).catch(()=>{
            NotificationManager.error('Ошибка ');
        });
    };

    render(){
        return <div className="row">
            <div className="offset-md-1 col-md-6 superuserform_companylist">
                <div className="row table_header animated fadeIn">
                    <div className="col-md-1">ID</div>
                    <div className="col-md-5">Название склада</div>
                    <div className="col-md-4">Адрес</div>
                    <div className="col-md-1"/>
                    <div className="col-md-1"/>
                </div>
                {
                    this.state.stocks.map((element)=>{
                        return this.renderTable(element);
                    })
                }

                <div className="table_footer">
                    <div>
                        <Pagination
                            activePage={this.state.currentPage}
                            totalItemsCount={this.state.totalElements}
                            itemsCountPerPage={5}
                            pageRangeDisplayed={5}
                            hideDisabled={true}
                            itemClass={"page-item"}
                            linkClass={"page-link"}
                            activeClass={"activePage"}
                            onChange={this.handlePageChange}
                        />
                    </div>
                </div>
            </div>

            <div className="offset-md-1 col-md-2">
                <form className="superuserform_newaccountform grey_form animated fadeIn">
                    <CreateStockModal/>
                    {/*<a onClick={this.addNewStock} className="btn btn_fullsize btn-success">Добавить</a>*/}
                </form>
                <div className={'superuserform_newaccountform grey_form animated fadeIn'}>
                    <h4>Поиск склада</h4>
                    <small>Введите название склада:</small>
                    <input type="text" onChange={this.changeInput} id={'searchStockName'} className="form-control"/>
                    <button className="btn btn-primary" onClick={this.searchStocks}>Поиск</button>
                    <small className="error-span" id={'error-stocks-list'}/>
                </div>
                <ul id={'stocks-ul'} className={'list-group'}/>

            </div>

        </div>
    }
}
