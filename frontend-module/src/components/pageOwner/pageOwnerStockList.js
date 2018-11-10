import React from "react";

class PageOwnerStockList extends React.Component {
    constructor(props) {
        super(props);
        this.getStockList = this.getStockList.bind(this);
        this.state = {
            stocks:[],
            stockName:"",
            stockAddress:""
        };
        document.title = "Склады"
    }


    getStockList(){
        return fetch('/api/stocks', {
            method: 'GET',
            headers: {'Auth-token': localStorage.getItem("Auth-token")}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            return result;
        });
    }

    componentDidMount(){
        this.getStockList().then(data => {
            this.setState({stocks:data});
        });
    }

    static renderTable(stock){
        console.log("stock name"+ stock.name);
        console.log(stock);
        if(!stock) return;
        return <div className={"row table_row"}>
            <div className={"col-md-1"}>{stock.id}</div>
            <div className={"offset-md-1 col-md-5"}>{stock.name}</div>
            <div className={"offset-md-1 col-md-4"}>{stock.address}</div>
        </div>
    }

    render(){
       return <div className="row">
           <div className="offset-md-3 col-md-6 superuserform_companylist">
                   <div className="row table_header">
                       <div className="col-md-1">ID</div>
                       <div className="offset-md-1 col-md-5">Название склада</div>
                       <div className="offset-md-1 col-md-4">Адрес</div>
                   </div>
                   {
                       this.state.stocks.map((element)=>{
                           return PageOwnerStockList.renderTable(element);
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
       </div>
    }
}

export default PageOwnerStockList;