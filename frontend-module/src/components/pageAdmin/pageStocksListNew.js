import React from "react";
import ModalAcceptDelete from "./modalAcceptDelete";
import CreateStockModal from "./modalComponentCreateStock";
import EditStockModal from "./modalComponentEditStock";
import PropTypes from "prop-types";
import Pagination from "react-js-pagination";

export default class PageStockListNew extends React.Component {
    constructor(props) {
        super(props);
        this.getStockList = this.getStockList.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.setCompanyName = this.setCompanyName.bind(this);
        this.setCompanyAddress = this.setCompanyAddress.bind(this);
        this.addNewStock = this.addNewStock.bind(this);
        this.submiteDelete = this.submiteDelete.bind(this);
        this.submitEdit = this.submitEdit.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.state = {
            stocks:[],
            stockName:"",
            stockAddress:"",
            totalElements:0,
            currentPage:1
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
        }, err => console.log(err))
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
                stocks:data.stocks,
                totalElements:data.totalElements,
                currentPage:++data.currentPage
            });
        });
    }
    handlePageChange(pageNumber) {
        this.getStockList(pageNumber).then(data => {
            this.setState({
                stocks:data.stocks,
                totalElements:data.totalElements,
                currentPage:++data.currentPage
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
        })
    }

    renderTable(stock){
        console.log("stock name"+ stock.name);
        console.log(stock);
        if(!stock) return;
        return <div className={"row table_row"}>
            <div className={"col-md-1"}>{stock.id}</div>
            <div className={"col-md-4"}>{stock.name}</div>
            <div className={"col-md-4"}>{stock.address}</div>
            <div className={"col-md-2"}>
                <EditStockModal stockName={stock.name} stockId={stock.id}/>
                {/*<ModalComponentStockEdit clickfunc={this.submitEdit} className={"table_button bg-secondary text-white"} stockName={stock.name} stockAddress={stock.address} stockId={stock.id}/>*/}
            </div>
            <div className={"col-md-1"}>
                <ModalAcceptDelete clickfunc={this.submiteDelete} componentId={stock.id} headerText={"Вы действительно хотите удалить склад?"} bodyText={"Восстановить склад будет невозможно"} />
            </div>
        </div>
    }

    submiteDelete(stockId){
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
        }).catch((err) => {
            console.log(err);
        });
    }
    render(){
        return <div className="row">
            <div className="offset-md-1 col-md-6 superuserform_companylist">
                <div className="row table_header">
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

                <div className="row">
                    <div>
                        <Pagination
                            activePage={this.state.currentPage}
                            totalItemsCount={this.state.totalElements}
                            itemsCountPerPage={5}
                            pageRangeDisplayed={5}
                            hideDisabled={true}
                            itemClass={"page-link page-item"}
                            activeClass={"activePage"}
                            onChange={this.handlePageChange}
                        />
                    </div>
                </div>
            </div>

            <div className="offset-md-1 col-md-3">
                <form className="superuserform_newaccountform grey_form">
                    <CreateStockModal/>
                    {/*<a onClick={this.addNewStock} className="btn btn_fullsize btn-success">Добавить</a>*/}
                </form>
            </div>

        </div>
    }
}
