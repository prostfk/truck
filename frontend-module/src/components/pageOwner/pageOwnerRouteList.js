import React from "react";
import {Link} from 'react-router-dom'

class OwnerRouteList extends React.Component {
    constructor(props) {
        super(props);
        this.getRouteList = this.getRouteList.bind(this);
        this.renderTable = this.renderTable.bind(this);
        /*this.forceUpdateHandler = this.forceUpdateHandler.bind(this);*/
        /*const {orderrouteListId} = this.props.match.params;*/
        this.state = {
            routePoints: [],
            isEmpty: false
            /*orderId: orderrouteListId*/
        };
        document.title = 'Путевой лист'
    }

    componentDidMount() {
        this.getRouteList().then(data => {
            let empty = false;
            if(data.length === 0)
                empty = true;
            this.setState({routePoints: data, isEmpty: empty});
        });
    }

    /*get all company list*/
    getRouteList() {
        let link = document.location.href.split("/");
        let id = link[link.length - 1];
        return fetch(`/api/company/routList/${id}`, {
            method: 'GET',
            headers: {'Auth-token': localStorage.getItem('Auth-token')}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            return result;
        });
    }

    /*render row of table ( calls from html ) */
    renderTable(routePoint) {
        if (!routePoint) return;
        return <div className="row table_row order_row">
            <div className="col-md-2">{routePoint.pointLevel}</div>
            <div className="col-md-7">{routePoint.point}</div>
            <div className="col-md-3">{routePoint.marked ? "Пройдена" : "-"}</div>
            {/*<div className="col-md-3"><a onClick={this.markPoint.bind(this, routePoint.id)}
                                         className="table_button bg-secondary text-white">Отметиться</a></div>*/}
        </div>
    }


    render() {
        return <div class="row">{this.state.orderId}
            <div class="offset-md-2 col-md-8 superuserform_companylist">
                <div className="row table_header animated fadeIn">
                    <div className="col-md-2">Очередность</div>
                    <div className="col-md-7">Адрес</div>
                    <div className="col-md-3">Отметка</div>
                    {/*<div className="col-md-3">Действие</div>*/}
                </div>
                <div className="row table_row order_row" style={{display: this.state.isEmpty ? 'block' : 'none'}}>
                    <div className="col-md-12"><b>Путевой лист не заполнен</b></div>
                </div>
                {
                    this.state.routePoints.map((element) => {
                        return this.renderTable(element);
                    })
                }
            </div>
            <div className="offset-md-2 col-md-8 form_clear"
                 id={'sendOrderRequestButton'} /*style={customerCompanyStyle}*/>
                <Link to={`/owner/orders`} className="btn btn-success btn_fullsize">Вернуться</Link>
            </div>
        </div>
    }
}

export default OwnerRouteList;