import React, { Component } from "react";

class PageStockList extends React.Component {
    constructor(props) {
        super(props);
        this.getStockList = this.getStockList.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.setcompanyName = this.setcompanyName.bind(this);
        this.setcompanyAddress = this.setcompanyAddress.bind(this);
        this.addNewCompany = this.addNewCompany.bind(this);
        this.state = {
            stocks:[],
            stockname:"",
            stockaddress:""
        };
    }

    forceUpdateHandler(){
        var refthis=this;
        fetch('http://localhost:8080/api/stocks/', {method: "get"}).then(function (response) {
            return response.json();
        }).then(function (result) {
            refthis.setState({stocks:result})
        })
    };

    setcompanyName(event) {
        this.setState({
            stockname: event.target.value
        })
    }
    setcompanyAddress(event) {
        this.setState({
            stockaddress: event.target.value
        })
    }
    addNewCompany(event){
        let stockaddress = this.state.stockaddress;
        let stockname = this.state.stockname;
        let formData = new FormData();
        formData.append("name", stockname);
        formData.append("address", stockaddress);
        console.log(formData);
        var ref= this;

        fetch('http://localhost:8080/api/stocks', {method: "POST",body: formData}).then(response => {
            response.json().then(data => {
                console.log(data);
                this.forceUpdateHandler();
            })
        }, err => console.log(err))
    }

    getStockList(){
        var myres = fetch('http://localhost:8080/api/stocks', {method: "get"}).then(function (response) {
            return response.json();
        }).then(function (result) {
            return result;
        })
        return myres;
    }
    componentDidMount(){
        this.getStockList().then(data => {
            this.setState({stocks:data});
        });
    }
    rendertable(stock){
        console.log("stock name"+ stock.name);
        console.log(stock);
        if(!stock) return;
        return <div className={"row table_row"}>
            <div className={"col-md-1"}>{stock.id}</div>
            <div className={"col-md-5"}>{stock.name}</div>
            <div className={"col-md-3"}>{stock.address}</div>
            <div className={"col-md-3"}>
                <a className={"table_button bg-secondary text-white"}>edit</a>
            </div>
        </div>
    }
    render(){
       return <div class="row">
           <div class="offset-md-1 col-md-6 superuserform_companylist">
                   <div className="row table_header">
                       <div className="col-md-1">ID</div>
                       <div className="col-md-5">Название склада</div>
                       <div className="col-md-3">Адрес</div>
                       <div className="col-md-3">Действие</div>
                   </div>
                   {
                       this.state.stocks.map((element)=>{
                           return this.rendertable(element);
                       })
                   }

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
               <form class="superuserform_newaccountform grey_form">
                   <h5>Добавить склад</h5>
                   <div class="form-group">
                       <input value={this.state.stockname}  onChange={this.setcompanyName} type="text" class="form-control" id="inputname" placeholder="Склад #201" required=""></input>
                   </div>
                   <div class="form-group">
                       <input value={this.state.stockaddress} onChange={this.setcompanyAddress} type="text" class="form-control" id="inputstockadres" placeholder="Адрес" required=""></input>
                   </div>
                   <a onClick={this.addNewCompany} class="btn btn_fullsize btn-success">Добавить</a>
               </form>
           </div>

       </div>
    }
}

export default PageStockList;