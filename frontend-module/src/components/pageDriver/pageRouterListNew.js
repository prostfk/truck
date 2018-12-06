import React, {Component} from 'react'
import {GoogleApiWrapper, InfoWindow, Map, Marker, Polyline} from 'google-maps-react';
import * as ReactDOM from "react-dom";
import nonPassedMarker from './img/non-passed-marker.png';
import passedMarker from './img/passed-marker.png';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import CommonUtil from "../commonUtil/commontUtil";

export class DriverRouterListNew extends Component {

    constructor(props) {
        super(props);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        let link = window.location.href.split("/");
        let oId = link[link.length - 1];
        this.state = {
            routePoints: [],
            orderId: oId,
            point: "",
            sequence: "",
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            markers: {},
            selectedPoint: '',
            pathCoordinates: [],
            mapCenter: {lat: 53.9, lng: 27.56667},

            passedPoints: [],
            enablePoints: [],
            passedPathCoordinates: [],
        };
        document.title = "Путевой лист";
    }

    componentDidMount() {
        this.getRouteList().then(data => {
            if (data.length === 0) return;
            this.setState({
                routePoints: data,
                pathCoordinates: [],
                mapCenter: {lng: data[0].lng, lat: data[0].lat},
            });
            this.updatePoints(data);
        });
    }

    updatePoints(data) {
        let passedPoints = [];
        let enablePoints = [];
        let pathCoordinates = [];
        let passedPathCoordinates = [];

        // Temp sort
        data.sort((a, b) => a.id > b.id ? 1 : (a.id < b.id ? -1 : 0));
        CommonUtil.moveElementInArray(data,this.__findIndexOfPointByPointName(data,"Завершение"),data.length-1);

        /*for (let i = 0; i < data.length; i++) {
            console.log(data[i].id);
        }*/

        for (let i = 0; i < data.length; i++) {
            pathCoordinates.push({lng: data[i].lng, lat: data[i].lat});

            if (data[i].marked) {
                passedPoints.push(data[i]);
                passedPathCoordinates.push({lng: data[i].lng, lat: data[i].lat});
            }
        }

        if (passedPoints.length > 0) {
            enablePoints.push(data[passedPoints.length - 1]);
            if (passedPoints.length < data.length) {
                enablePoints.push(data[passedPoints.length])
            }
        } else {
            enablePoints.push(data[0])
        }

        this.setState({
            passedPoints: passedPoints,
            enablePoints: enablePoints,
            pathCoordinates: pathCoordinates,
            passedPathCoordinates: passedPathCoordinates,
        })
    }

    getRouteList() {
        return fetch('/api/orders/getMyOrders/' + this.state.orderId + '/routelist', {headers: {'Auth-token': localStorage.getItem('Auth-token')}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            return result;
        });
    }

    markPoint = (pointId) => {
        const ref = this;
        const myres = fetch('/api/orders/getMyOrders/' + this.state.orderId + '/markpoint/' + pointId, {
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
    };

    forceUpdateHandler() {
        this.getRouteList().then(data => {
            this.updatePoints(data);
            this.setState({
                routePoints: data,
                point: "",
                sequence: ""});
        });
    }

    onMarkerClick = (props, marker, e) => {
        console.log(props);

        let enablePoints = this.state.enablePoints;
        let permission = false;

        for (let i = 0; i < enablePoints.length; i++) {
            console.log("Enable point: " + enablePoints[i].id);
            if (props.pointId === enablePoints[i].id) {
                permission = true;
            }
        }

        if (permission) {
            this.setState({
                selectedPlace: props,
                activeMarker: marker,
                showingInfoWindow: true,
                selectedPoint: props.pointId,
                selectedPointStatus: props.pointStatus
            });
        } else {
            NotificationManager.error("Нельзя выбрать эту точку.", "Ошибка")
        }

    };

    rendPointsList = (point, index) => {
        return <div key={index} className={'row animated fadeInUp'}>
            <li className={point.marked ? 'list-group-item list-group-item-action list-group-item-success' : 'list-group-item list-group-item-action list-group-item-danger'}
                style={{fontSize: '14px'}}>{point.point + " - " + (point.marked ? 'Пройдена' : 'Не пройдена')}</li>
        </div>
    };

    onButtonSubmitClick = () => {
        this.markPoint(this.state.selectedPoint);
        this.setState({
            showingInfoWindow: !this.state.showingInfoWindow,
        });
    };

    setMarksToMap = (point, index) => {
        let icon = point.marked ? passedMarker : nonPassedMarker;
        return (
            <Marker key={index}
                    icon={{url: icon}}
                    title={point.point}
                    name={point.point}
                    pointId={point.id}
                    pointStatus={point.marked}
                    position={{lat: point.lat, lng: point.lng}}
                    onClick={this.onMarkerClick}/>)
    };

    onInfoWindowOpen(props, e) { //For mark button. Doesn't work without it
        console.log(props);
        const button = this.state.selectedPointStatus ? (
            <div onClick={this.onButtonSubmitClick} className={'btn btn-danger'}
                 id={'button-submit-mark-handler'}>Отменить</div>) : (
            <div onClick={this.onButtonSubmitClick} className={'btn btn-success'}
                 id={'button-submit-mark-handler'}>Отметиться</div>);
        ReactDOM.render(React.Children.only(button), document.getElementById("but-sub-mark"));
    }

    render() {
        return (
            <div className={'row animated fadeIn'} style={{overflow: 'hidden'}}>
                <div className={'col-md-3'}>
                    <ul>
                        <h1>Точки</h1>
                        {this.state.routePoints.map((p, index) => {
                            return this.rendPointsList(p, index);
                        })}
                    </ul>
                </div>
                <div className={'col-md-9'}>
                    <div style={{height: '92.5vh', width: '90%'}}>
                        <Map center={{lat: this.state.mapCenter.lat, lng: this.state.mapCenter.lng}}
                             google={this.props.google}
                             style={{width: '100%', height: '100%', position: 'relative'}}
                             className={'map'}
                             zoom={12}>
                            {
                                this.state.routePoints.map((point, index) => {
                                    return this.setMarksToMap(point, index);
                                })
                            }
                            <InfoWindow
                                marker={this.state.activeMarker}
                                visible={this.state.showingInfoWindow}
                                onOpen={e => {
                                    this.onInfoWindowOpen(this.props, e);
                                }}>
                                <div>
                                    <p>{this.state.selectedPlace.name}</p>
                                    <div id="but-sub-mark"/>
                                </div>
                            </InfoWindow>
                            <Polyline
                                path={this.state.pathCoordinates}
                                strokeColor="#C02900"
                                strokeOpacity={0.8}
                                strokeWeight={2}/>
                            <Polyline
                                path={this.state.passedPathCoordinates}
                                strokeColor="#1AC000"
                                strokeOpacity={0.8}
                                strokeWeight={2}/>
                        </Map>
                    </div>
                </div>
            </div>
        );

    }

    __findIndexOfPointByPointName(array, name){
        for (let i = 0; i < array.length; i++) {
            if (array[i].point === name){
                return i;
            }
        }
    }


}


export default GoogleApiWrapper({
    apiKey: ("AIzaSyC8b04jlgefJ27fjvs4axnTGGKvYtFemWI")
})(DriverRouterListNew)