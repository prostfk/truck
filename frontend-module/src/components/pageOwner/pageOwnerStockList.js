import React from "react";
import Pagination from "react-js-pagination";

export default class PageStockListNew extends React.Component {
    constructor(props) {
        super(props);
        this.getStockList = this.getStockList.bind(this);
        /*this.forceUpdateHandler = this.forceUpdateHandler.bind(this);*/
        this.handlePageChange = this.handlePageChange.bind(this);
        this.state = {
            stocks: [],
            stockName: "",
            stockAddress: "",
            totalElements: 0,
            currentPage: 1
        };
        document.title = "Склады"
    }

    forceUpdateHandler() {
        const refthis = this;
        fetch('http://localhost:8080/api/stocks?=' + this.state.currentPage, {
            method: "get",
            headers: {'Auth-token': localStorage.getItem("Auth-token")}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            refthis.setState({stocks: result})
        })
    };


    getStockList(pageid = 1) {
        const fetchResult = fetch('http://localhost:8080/api/stocks?page=' + pageid, {headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            return result;
        });
        return fetchResult;
    }

    componentDidMount() {
        this.getStockList().then(data => {
            this.setState({
                stocks: data.content,
                totalElements: data.totalElements,
                currentPage: ++data.number
            });
        });
    }

    handlePageChange(pageNumber) {
        this.getStockList(pageNumber).then(data => {
            this.setState({
                stocks: data.content,
                totalElements: data.totalElements,
                currentPage: ++data.number
            });
        });

        console.log(this.state);
        console.log("im updating!");
    }

    renderTable(stock) {
        console.log("stock name" + stock.name);
        console.log(stock);
        if (!stock) return;
        return <div className={"row table_row"}>
            <div className={"col-md-1"}>{stock.id}</div>
            <div className={"offset-md-1 col-md-5"}>{stock.name}</div>
            <div className={"offset-md-1 col-md-4"}>{stock.address}</div>
        </div>
    }

    render() {
        return <div className="row">
            <div className="offset-md-3 col-md-6 superuserform_companylist">
                <div className="row table_header">
                    <div className="col-md-1">ID</div>
                    <div className="offset-md-1 col-md-5">Название склада</div>
                    <div className="offset-md-1 col-md-4">Адрес</div>
                </div>
                {
                    this.state.stocks.map((element) => {
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
        </div>
    }
}
