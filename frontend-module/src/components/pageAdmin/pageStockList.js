import React from "react";
import ModalAcceptDelete from "./modalAcceptDelete";
import ModalComponentStockEdit from "./modalComponentStockEdit";

class PageStockList extends React.Component {
    constructor(props) {
        super(props);
        this.getStockList = this.getStockList.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.setCompanyName = this.setCompanyName.bind(this);
        this.setCompanyAddress = this.setCompanyAddress.bind(this);
        this.addNewStock = this.addNewStock.bind(this);
        this.submiteDelete = this.submiteDelete.bind(this);
        this.submitEdit = this.submitEdit.bind(this);
        this.state = {
            stocks:[],
            stockName:"",
            stockAddress:""
        };
        document.title = "Склады"
    }

    forceUpdateHandler(){
        const refthis = this;
        fetch('http://localhost:8080/api/stocks/', {method: "get", headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(function (response) {
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
                this.forceUpdateHandler();    /*this.setState({stocks:data}) its not working.. why??*/
                this.setState({stockName:"",stockAddress:""})
            })
        }, err => console.log(err))
    }

    getStockList(){
        const fetchResult = fetch('http://localhost:8080/api/stocks', {headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(function (response) {
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
                <ModalComponentStockEdit clickfunc={this.submitEdit} className={"table_button bg-secondary text-white"} stockName={stock.name} stockAddress={stock.address} stockId={stock.id}/>
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
                       <div className="col-md-1"></div>
                       <div className="col-md-1"></div>
                   </div>
                   {
                       this.state.stocks.map((element)=>{
                           return this.renderTable(element);
                       })
                   }

               <nav aria-label="...">
                   <ul className="pagination pagination-sm">
                       <li className="page-item disabled">
                           <a className="page-link" href="#" tabIndex="-1">1</a>
                       </li>
                       <li className="page-item"><a className="page-link" href="#">2</a></li>
                       <li className="page-item"><a className="page-link" href="#">3</a></li>
                   </ul>
               </nav>
           </div>

           <div className="offset-md-1 col-md-3">
               <form className="superuserform_newaccountform grey_form">
                   <h5>Добавить склад</h5>
                   <div className="form-group">
                       <input value={this.state.stockName} onChange={this.setCompanyName} type="text" className="form-control" id="inputname" placeholder="Склад #201" required=""/>
                   </div>
                   <div className="form-group">
                       <input value={this.state.stockAddress} onChange={this.setCompanyAddress} type="text" className="form-control" id="inputstockadres" placeholder="Адрес" required=""/>
                   </div>
                   <a onClick={this.addNewStock} className="btn btn_fullsize btn-success">Добавить</a>
               </form>
           </div>

       </div>
    }
}

export default PageStockList;