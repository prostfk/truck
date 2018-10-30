import React, {Component} from "react";

class ManagerRouteList extends Component {

    constructor(props) {
        super(props);
        this.getRouteList = this.getRouteList.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.state = {
            routePoints: [],
            orderId: "",
            point:"",
            sequence:"",
            waybill:{}
        }

        document.title = "Путевой лист";
    }

    componentDidMount() {
        this.getRouteList().then(data => {
            this.setState({routePoints:data, waybill:data[0].waybill});
        });
    }

    forceUpdateHandler() {
        this.getRouteList().then(data => {
            this.setState({routePoints:data, point:"", sequence:""});
        });
    }
    getRouteList() {
        let split = document.location.href.split('/');
        let id = split[split.length - 1];
        console.log(id);
        return fetch(`http://localhost:8080/api/manager/routelist/${id}`, {method: "get"}).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            return result;
        });
    }

    setPoint(event) {
        this.setState( {
            point: event.target.value
        });
    }
    setSequence(event) {
        this.setState({
            sequence: event.target.value
        });
    }
    renderTable(routePoint) {
        if (!routePoint) return;

        return <div className="row table_row">
            <div className="col-md-4">{routePoint.point}</div>
            <div className="col-md-4">{routePoint.pointLevel}</div>
            <div className="col-md-4"><span className="cancel_product" onClick={this.deletePoint.bind(this, routePoint.id)}>удалить</span></div>
        </div>
    }

    deletePoint(pointId) {
        console.log(pointId);
        const ref = this;
        fetch(`http://localhost:8080/api/manager/deletepoint/${pointId}`, {method: "DELETE"})
            .then(function(response) {
                return response.json();
            }).then(function(result) {
                if(result === true) {
                    ref.forceUpdateHandler();
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    addPoint() {
        let ref = this;
       let routePoint = {};
       routePoint.id = null;
       routePoint.point = this.state.point;
       routePoint.pointLevel = this.state.sequence;
       routePoint.waybill = this.state.waybill;
       console.log(routePoint);

       fetch('http://localhost:8080/api/manager/createPoint', {method:"POST", headers: {'Content-Type':'application/json'},
           body: JSON.stringify(routePoint)})
           .then(function(response) {
               return response.json();
           }).then(function(result) {
               if(result === true) {
                   ref.forceUpdateHandler();
               }
           });
    }
    render() {
        return (
            <div className="row" id="managerroutelist">
                <div className="offset-md-2 col-md-8 form_clear">
                    <div className="row">
                        <div className="col-md-5">
                            <h3>Путевой лист</h3>
                        </div>
                    </div>
                </div>
                <div className="offset-md-2 col-md-8 form_clear">
                    <h3>Контрольные точки</h3>
                    <div className="row table_header">
                        <div className="col-md-4">
                            <input value={this.state.point} onChange={this.setPoint.bind(this)} type="text" className="form-control" placeholder="Место" />
                        </div>
                        <div className="col-md-4">
                            <input value={this.state.sequence} onChange={this.setSequence.bind(this)} type="text" className="form-control" placeholder="Очерёдность" />
                        </div>
                        <div className="col-md-4">
                            <button type="button" className="btn btn-info btn_fullsize" onClick={this.addPoint.bind(this)}>Добавить</button>
                        </div>
                    </div>
                    {
                        this.state.routePoints.map((element) => {
                            return this.renderTable(element);
                        })
                    }
                </div>
            </div>
        );
    }
}

export default ManagerRouteList;