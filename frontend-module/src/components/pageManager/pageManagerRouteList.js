import React, {Component} from "react";
import {GoogleApiWrapper, InfoWindow, Map, Marker, Polyline} from 'google-maps-react';
import * as ReactDOM from "react-dom";
import redMarker from '../pageDriver/img/non-passed-marker.png';

export class ManagerRouteList extends Component {

    constructor(props) {
        super(props);
        this.getRouteList = this.getRouteList.bind(this);
        this.renderMarkers = this.renderMarkers.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onInfoWindowClose = this.onInfoWindowClose.bind(this);
        this.onInfoWindowOpen = this.onInfoWindowOpen.bind(this);
        this.onMapClick = this.onMapClick.bind(this);
        this.addPoint = this.addPoint.bind(this);
        this.state = {
            routePoints: [],
            orderId: "",
            point:"",
            pointLevel:0,
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            mapCenter: {lat: 53.9, lng: 27.56667}

        };

        document.title = "Путевой лист";
    }

    componentDidMount() {
        this.getRouteList().then(data => {
            let level = 0;
            data.forEach(point => {
                if(level < point.pointLevel) {
                    level = point.pointLevel;
                }
            });
            this.setState({routePoints:data, pointLevel:level+1});
            if (data[0]!==null){
                this.setState({mapCenter: {lat: data[0].lat, lng: data[0].lng}})
            }
        });
    }

    forceUpdateHandler() {
        this.getRouteList().then(data => {
            let level = 0;
            data.forEach(point => {
                if(level < point.pointLevel) {
                    level = point.pointLevel;
                }
            });
            this.setState({routePoints:data, point:"", pointLevel:level+1});
        });
    }
    getRouteList() {
        let split = document.location.href.split('/');
        let id = split[split.length - 1];
        console.log(id);
        return fetch(`http://localhost:8080/api/manager/routeList/${id}`, {
            method: "get",
            headers: {'Auth-token': localStorage.getItem("Auth-token")}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            return result;
        });
    }

    renderMarkers(routePoint) {
        if (!routePoint) return;
        return <Marker onClick={this.onMarkerClick} icon={redMarker}
                       name={routePoint.point} position={{lat: routePoint.lat, lng: routePoint.lng}} id={routePoint.id}/>

    }

    deletePoint(pointId) {
        console.log("delete");
        console.log(pointId);
        const ref = this;
        fetch(`http://localhost:8080/api/manager/deletePoint/${pointId}`, {method: "DELETE", headers: {'Auth-token': localStorage.getItem("Auth-token")}})
            .then(function(response) {
                return response.json();
            }).then(function(result) {
                if(result === true) {
                    ref.onInfoWindowClose();
                    ref.forceUpdateHandler();
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    addPoint(lat, lng, city) {
        let split = document.location.href.split('/');
        let id = split[split.length - 1];
        let ref = this;
       let routePoint = {};
       routePoint.id = null;
       routePoint.point = city;
       routePoint.pointLevel = this.state.pointLevel;
       routePoint.waybill = null;
       routePoint.lat = lat;
       routePoint.lng = lng;
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

    onMarkerClick = (props, marker, event) => {
        console.log(marker);
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    };
    onInfoWindowClose() {
        this.setState({
            showingInfoWindow: false
        });
    }
    onInfoWindowOpen(props, e, markerId) { //For mark button. Doesn't work without it
        console.log(props);
        console.log(markerId);
        const button = <div className="table_button bg-secondary text-white" onClick={this.deletePoint.bind(this, markerId)} pointId={markerId}>Удалить</div>
        ReactDOM.render(React.Children.only(button), document.getElementById("info-window-container"));
    }
    onMapClick = (mapProps, clickEvent, event) => {
        let position = event.latLng;
        this.getAddressFromLatAndLng(position.lat(), position.lng()).then(cityName => {
            this.addPoint(position.lat(), position.lng(), cityName);
        })
    };

    rendSideList = (point) => {
        return <div className={'row animated fadeInUp'}>
            <li className={point.marked ? 'list-group-item list-group-item-action list-group-item-success' : 'list-group-item list-group-item-action list-group-item-danger'}
                style={{fontSize: '14px'}}>{point.point + " - " + (point.marked ? 'Пройдена' : 'Не пройдена')}</li>
        </div>
    };

    getAddressFromLatAndLng = (lat, lng) => {//open cage data api 2,500 requests per day
        //geo api - 17234ab712334e7caa071303d82f6b98
        //https://api.opencagedata.com/geocode/v1/json?q=LAT+LNG&key=17234ab712334e7caa071303d82f6b98
        return fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=17234ab712334e7caa071303d82f6b98`).then(response => {
            return response.json()
        }).then(data => {
            console.log(data.results[0].components.city);
            return data.results[0].components.city;
        })
    };

    render() {
        const style = {
            width: '50vw',
            height: '75vh',
            'marginLeft': 'auto',
            'marginRight': 'auto'
        };
        return (
            <div className={'row'}>
                <div className={'col-md-3'}>
                    <ul>
                        <h1>Точки</h1>
                        {this.state.routePoints.map(p => {
                            return this.rendSideList(p);
                        })}
                    </ul>
                </div>
                <div className={'col-md-9'}>
                    <div style={{height: '92.5vh', width: '90%'}}>
                        <Map google={this.props.google}
                             center={{lat: this.state.mapCenter.lat, lng: this.state.mapCenter.lng}}
                             zoom={14} onClick={this.onMapClick} id="googleMap">
                            {
                                this.state.routePoints.map((element) => {
                                    return this.renderMarkers(element);
                                })
                            }
                            <InfoWindow onClose={this.onInfoWindowClose}
                                        onOpen={e => {
                                            this.onInfoWindowOpen(this.props, e, this.state.activeMarker.id);
                                        }}
                                        marker = {this.state.activeMarker } visible = {this.state.showingInfoWindow }>
                                <div>
                                    <h3>{this.state.activeMarker.name}</h3>
                                    <div className="table_button bg-secondary text-white" id="info-window-container"/>
                                </div>
                            </InfoWindow>
                            <Polyline
                                path={this.state.routePoints}
                                strokeColor="#CF89F9"
                                strokeOpacity={0.8}
                                strokeWeight={2} />
                        </Map>
                    </div></div>
            </div>
        );

    }
}

export default GoogleApiWrapper({
    api: (process.env.AIzaSyC8b04jlgefJ27fjvs4axnTGGKvYtFemWI)
})(ManagerRouteList)