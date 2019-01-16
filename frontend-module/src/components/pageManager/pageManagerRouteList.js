import React, {Component} from "react";

import {GoogleApiWrapper, InfoWindow, Map, Marker, Polyline} from 'google-maps-react';
import * as ReactDOM from "react-dom";
import redMarker from '../pageDriver/img/non-passed-marker.png';
import CommonUtil from "../commonUtil/commontUtil";
import {NotificationManager} from "react-notifications";
import apiRequest from "../../util/ApiRequest";


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
            point: "",
            pointLevel: 0,
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
            data.sort((a, b) => a.id > b.id ? 1 : (a.id < b.id ? -1 : 0));
            CommonUtil.moveElementInArray(data, this.__findIndexOfPointByPointName(data, "Завершение"), data.length - 1);
            this.setState({routePoints: data, pointLevel: level + 1});
            if (data[0]) {
                this.setState({mapCenter: {lat: data[0].lat, lng: data[0].lng}})
            }
        });
    }

    forceUpdateHandler() {
        this.getRouteList().then(data => {
            let level = 0;
            data.forEach(point => {
                if (level < point.pointLevel) {
                    level = point.pointLevel;
                }
                data.sort((a, b) => a.id > b.id ? 1 : (a.id < b.id ? -1 : 0));
                CommonUtil.moveElementInArray(data, this.__findIndexOfPointByPointName(data, "Завершение"), data.length - 1);
            });
            this.setState({routePoints: data, point: "", pointLevel: level + 1});
        });
    }

    getRouteList() {
        let split = document.location.href.split('/');
        let id = split[split.length - 1];
        return apiRequest(`/api/manager/routeList/${id}`).then(data=>{
            return data;
        });
    }

    renderMarkers(routePoint, index) {
        if (!routePoint) return;
        return <Marker onClick={this.onMarkerClick} icon={redMarker} key={index}
                       name={routePoint.point} position={{lat: routePoint.lat, lng: routePoint.lng}}
                       id={routePoint.id}/>

    }

    deletePoint(pointId) {
        const ref = this;
        apiRequest(`/api/manager/deletePoint/${pointId}`, 'delete').then(function (result) {
            if (result === true) {
                ref.onInfoWindowClose();
                ref.forceUpdateHandler();
            }
        }).catch(() => {
            NotificationManager.error("Ошибка при удалении");
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
        apiRequest(`/api/manager/${id}/createPoint`,'post').then(function (result) {
            if (result === true) {
                ref.forceUpdateHandler();
            }
        });
    }

    onMarkerClick = (props, marker, event) => {
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
        const button = <div className="table_button bg-secondary text-white"
                            onClick={this.deletePoint.bind(this, markerId)} pointId={markerId}>Удалить</div>;
        ReactDOM.render(React.Children.only(button), document.getElementById("info-window-container"));
    }

    onMapClick = (mapProps, clickEvent, event) => {
        let position = event.latLng;
        this.getAddressFromLatAndLng(position.lat(), position.lng()).then(cityName => {
            this.addPoint(position.lat(), position.lng(), cityName);
        })
    };

    rendSideList = (point, index) => {
        return <div className={'row animated fadeInUp'} key={index}>
            <li className={point.marked ? 'list-group-item list-group-item-action list-group-item-success' : 'list-group-item list-group-item-action list-group-item-danger'}
                style={{fontSize: '14px'}}>{point.point + " - " + (point.marked ? 'Пройдена' : 'Не пройдена')}</li>
        </div>
    };

    getAddressFromLatAndLng = (lat, lng) => {//open cage data api 2,500 requests per day
        return apiRequest(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=17234ab712334e7caa071303d82f6b98`).then(data => {
            return data.results[0].components.city;
        })
    };

    render() {
        return (
            <div className={'row animated fadeIn'} style={{overflow: 'hidden'}}>
                <div className={'col-md-3'}>
                    <ul>
                        <h1>Точки</h1>
                        {this.state.routePoints.map((p, index) => {
                            return this.rendSideList(p, index);
                        })}
                    </ul>
                </div>
                <div className={'col-md-9'}>
                    <div style={{height: '92.5vh', width: '90%'}}>
                        <Map google={this.props.google}
                             center={{lat: this.state.mapCenter.lat, lng: this.state.mapCenter.lng}}
                             zoom={14} onClick={this.onMapClick} id="googleMap">
                            {
                                this.state.routePoints.map((element, index) => {
                                    return this.renderMarkers(element, index);
                                })
                            }
                            <InfoWindow onClose={this.onInfoWindowClose}
                                        onOpen={e => {
                                            this.onInfoWindowOpen(this.props, e, this.state.activeMarker.id);
                                        }}
                                        marker={this.state.activeMarker} visible={this.state.showingInfoWindow}>
                                <div>
                                    <h3>{this.state.activeMarker.name}</h3>
                                    <div className="table_button bg-secondary text-white" id="info-window-container"/>
                                </div>
                            </InfoWindow>
                            <Polyline
                                path={this.state.routePoints}
                                strokeColor="#CF89F9"
                                strokeOpacity={0.8}
                                strokeWeight={2}/>
                        </Map>
                    </div>
                </div>
            </div>
        );

    }

    __findIndexOfPointByPointName(array, name) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].point === name) {
                return i;
            }
        }
    }

}

export default GoogleApiWrapper({
    api: (process.env.AIzaSyC8b04jlgefJ27fjvs4axnTGGKvYtFemWI)
})(ManagerRouteList)