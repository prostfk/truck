import React, {Component} from "react";
import GoogleMapReact from 'google-map-react';
import InfoWindow from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class ManagerRouteList extends Component {

    static defaultProps = {
        center: {
            lat: 59.95,
            lng: 30.33
        },
        zoom: 11
    };

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

            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
        }

        document.title = "Путевой лист";
    }

    componentDidMount() {
        this.getRouteList().then(data => {
            this.setState({routePoints:data});
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
        return fetch(`http://localhost:8080/api/manager/routeList/${id}`, {method: "get", headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(function (response) {
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
        fetch(`http://localhost:8080/api/manager/deletePoint/${pointId}`, {method: "DELETE", headers: {'Auth-token': localStorage.getItem("Auth-token")}})
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
        let split = document.location.href.split('/');
        let id = split[split.length - 1];
        let ref = this;
       let routePoint = {};
       routePoint.id = null;
       routePoint.point = this.state.point;
       routePoint.pointLevel = this.state.sequence;
       routePoint.waybill = null;
       console.log(routePoint);

       fetch(`http://localhost:8080/api/manager/${id}/createPoint`, {method:"POST", headers: {'Content-Type':'application/json', 'Auth-token': localStorage.getItem("Auth-token")},
           body: JSON.stringify(routePoint)})
           .then(function(response) {
               return response.json();
           }).then(function(result) {
               if(result === true) {
                   console.log(result);
                   ref.forceUpdateHandler();
               }
           });
    }

    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });

    onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            })
        }
    };

    render() {
        return (
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyC8b04jlgefJ27fjvs4axnTGGKvYtFemWI' }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                >
                    <InfoWindow
                        marker={this.state.activeMarker}
                        visible={this.state.showingInfoWindow}>
                        <div>
                            <h1>{this.state.selectedPlace.name}</h1>
                        </div>
                    </InfoWindow>
                </GoogleMapReact>
            </div>
            /*<Map google={this.props.google}
                 onClick={this.onMapClicked}>
                <Marker onClick={this.onMarkerClick}
                        name={'Current location'} />

                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}>
                    <div>
                        <h1>{this.state.selectedPlace.name}</h1>
                    </div>
                </InfoWindow>
            </Map>*/
          /* <div className="row" id="managerroutelist">
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
            </div> */
        );
    }
}

export default ManagerRouteList;