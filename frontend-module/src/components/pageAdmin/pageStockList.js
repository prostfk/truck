import React from "react";
import ModalAcceptDelete from "./modalAcceptDelete";

class PageStockList extends React.Component {
    constructor(props) {
        super(props);
        this.getStockList = this.getStockList.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.setCompanyName = this.setCompanyName.bind(this);
        this.setCompanyAddress = this.setCompanyAddress.bind(this);
        this.addNewCompany = this.addNewCompany.bind(this);
        this.submiteDelete = this.submiteDelete.bind(this);
        this.state = {
            stocks:[],
            stockName:"",
            stockAddress:""
        };
        document.title = "Склады"
    }

    forceUpdateHandler(){
        const refthis = this;
        fetch('http://localhost:8080/api/stocks/', {method: "get", headers: {'Auth-token': sessionStorage.getItem("Auth-token")}}).then(function (response) {
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
    addNewCompany(event){
        let stockaddress = this.state.stockAddress;
        let stockname = this.state.stockName;
        let formData = new FormData();
        formData.append("name", stockname);
        formData.append("address", stockaddress);
        console.log(formData);
        fetch('http://localhost:8080/api/stocks', {method: "POST",body: formData, headers: {'Auth-token': sessionStorage.getItem("Auth-token")}}).then(response => {
            response.json().then(data => {
                console.log(data);
                this.forceUpdateHandler();
            })
        }, err => console.log(err))
    }

    getStockList(){
        const fetchResult = fetch('http://localhost:8080/api/stocks', {headers: {'Auth-token': sessionStorage.getItem("Auth-token")}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            return result;
        });
        return fetchResult;
    }
    componentDidMount(){
        this.getStockList().then(data => {
            this.setState({stocks:data});
        });
    }
    renderTable(stock){
        console.log("stock name"+ stock.name);
        console.log(stock);
        if(!stock) return;
        return <div className={"row table_row"}>
            <div className={"col-md-1"}>{stock.id}</div>
            <div className={"col-md-4"}>{stock.name}</div>
            <div className={"col-md-3"}>{stock.address}</div>
            <div className={"col-md-1"}>
                <a className={"table_button bg-secondary text-white"}>edit</a>
            </div>
            <div className={"col-md-3"}>
                <ModalAcceptDelete clickfunc={this.submiteDelete} className={"table_button bg-secondary text-white"} stockId={stock.id}/>
            </div>
        </div>
    }

    submiteDelete(stockId){
        const ref = this;
        fetch('http://localhost:8080/api/stocks', {
            method: "DELETE",
            body: stockId,
            headers: {'Auth-token': sessionStorage.getItem("Auth-token")}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result)
            if (result) {
                ref.setState({stocks:result})
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    render(){
       return <div class="row">
           <div class="offset-md-1 col-md-6 superuserform_companylist">
                   <div className="row table_header">
                       <div className="col-md-1">ID</div>
                       <div className="col-md-5">Название склада</div>
                       <div className="col-md-4">Адрес</div>
                       <div className="col-md-1"></div>
                       <div className="col-md-1"></div>
                   </div>
                   {
                       this.state.stocks.map((element)=>{
                           return this.renderTable(element);
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
                       <input value={this.state.stockName} onChange={this.setCompanyName} type="text" class="form-control" id="inputname" placeholder="Склад #201" required=""/>
                   </div>
                   <div class="form-group">
                       <input value={this.state.stockAddress} onChange={this.setCompanyAddress} type="text" class="form-control" id="inputstockadres" placeholder="Адрес" required=""/>
                   </div>
                   <a onClick={this.addNewCompany} class="btn btn_fullsize btn-success">Добавить</a>
               </form>
           </div>

       </div>
    }
}

export default PageStockList;