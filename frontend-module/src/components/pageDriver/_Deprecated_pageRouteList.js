/*
import React from "react";

class DriverRouteList extends React.Component {
    constructor(props) {
        super(props);
        this.getRouteList = this.getRouteList.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        const {orderrouteListId} = this.props.match.params;
        this.state = {
            routePoints: [],
            orderId: orderrouteListId
        };
        document.title = 'Путевой лист'
    }

    markPoint(pointId, event) {
        const ref = this;
        fetch('http://localhost:8080/api/orders/getMyOrders/' + this.state.orderId + '/markpoint/' + pointId, {
            method: "PUT",
            headers: {'Auth-token': localStorage.getItem('Auth-token')}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            ref.forceUpdateHandler(result);
            return result;
        }).catch((err) => {
            console.log(err);
        });
    }

    forceUpdateHandler(point) {
        let refThis = this;
        this.state.routePoints.find((element, index, array) => {
            if (element.id === point.id) {
                const newPoints = refThis.state.routePoints;
                newPoints[index] = point;
                refThis.setState({routePoints: newPoints});
            }
        });
    };

    componentDidMount() {
        this.getRouteList().then(data => {
            this.setState({routePoints: data});
        });
    }

    /!*get all company list*!/
    getRouteList() {
        return fetch('http://localhost:8080/api/orders/getMyOrders/' + this.state.orderId + '/routelist', {headers: {'Auth-token': localStorage.getItem('Auth-token')}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            return result;
        });
    }

    /!*render row of table ( calls from html ) *!/
    renderTable(routePoint) {
        if (!routePoint) return;
        return <div className="row table_row order_row">
            <div className="col-md-1">{routePoint.pointLevel}</div>
            <div className="col-md-5">{routePoint.point}</div>
            <div className="col-md-3">{routePoint.marked ? "Пройдена" : "-"}</div>
            <div className="col-md-3"><a onClick={this.markPoint.bind(this, routePoint.id)}
                                         className="table_button bg-secondary text-white">Отметиться</a></div>
        </div>
    }


    render() {
        return <div class="row">{this.state.orderId}
            <div class="offset-md-2 col-md-8 superuserform_companylist">
                <div className="row table_header">
                    <div className="col-md-1">Очередность</div>
                    <div className="col-md-5">Адрес</div>
                    <div className="col-md-3">Отметка</div>
                    <div className="col-md-3">Действие</div>
                </div>
                {
                    this.state.routePoints.map((element) => {
                        return this.renderTable(element);
                    })
                }
            </div>
        </div>
    }
}

export default DriverRouteList;*/
