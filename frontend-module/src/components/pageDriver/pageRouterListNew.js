import React, {Component} from 'react'
import {GoogleApiWrapper, InfoWindow, Map, Marker} from 'google-maps-react';
import * as ReactDOM from "react-dom";
import nonPassedMarker from './img/non-passed-marker.png';
import passedMarker from './img/passed-marker.png';



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
            selectedPoint: ''
        };
        document.title = "Путевой лист";
    }

    componentDidMount() {
        this.getRouteList().then(data => {
            this.setState({routePoints: data});
        });
    }

    getRouteList() {
        return fetch('http://localhost:8080/api/orders/getMyOrders/' + this.state.orderId + '/routelist', {headers: {'Auth-token': localStorage.getItem('Auth-token')}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            return result;
        });
    }

    markPoint = (pointId) => {
        const ref = this;
        const myres = fetch('http://localhost:8080/api/orders/getMyOrders/' + this.state.orderId + '/markpoint/' + pointId, {
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
            this.setState({routePoints: data, point: "", sequence: ""});
        });
    }

    onMarkerClick = (props, marker, e) => {
        console.log(props);
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
            selectedPoint: props.pointId,
            selectedPointStatus: props.pointStatus
        });
    };

    rendTest = (point) => {
        return <div className={'row'}>
            <p style={{fontSize: '14px'}}>{point.point + " - " + (point.marked ? 'Пройдена' : 'Непройдена')}</p>
        </div>
    };

    onButtonSubmitClick = () => {
        this.markPoint(this.state.selectedPoint);
    };

    setMarksToMap = (point) => {
        let icon = point.marked ? passedMarker : nonPassedMarker;
        return (
            <Marker icon={{url: icon}}
                title={point.point}
                name={point.point}
                pointId={point.id}
                pointStatus={point.marked}
                position={{lat: point.lat, lng: point.lng}}
                onClick={this.onMarkerClick}/>)
    };

    onInfoWindowOpen(props, e) { //For mark button. Doesn't work without it
        console.log(props);
        const button = this.state.selectedPointStatus ? (<div onClick={this.onButtonSubmitClick} className={'btn btn-danger'} id={'button-submit-mark-handler'}>Отменить</div>) : (<div onClick={this.onButtonSubmitClick} className={'btn btn-success'} id={'button-submit-mark-handler'}>Отметиться</div>);
        ReactDOM.render(React.Children.only(button), document.getElementById("but-sub-mark"));
    }

    render() {
        const style = {
            width: '100%',
            height: '90%'
        };
        return (
            <div className={'row'}>
                <div className={'offset-md-1 col-md-1'}>
                    <h1>Точки</h1>
                    {this.state.routePoints.map(p => {
                        return this.rendTest(p);
                    })}
                </div>
                <div className={'offset-md-1 col-md-9'}>
                    <div style={{height: '100vh', width: '90%'}}>
                        <Map center={{lat: 53.9, lng: 27.56667}} google={window.google}
                             style={{width: '100%', height: '100%', position: 'relative'}}
                             className={'map'}
                             zoom={11}>
                            {
                                this.state.routePoints.map(point => {
                                    return this.setMarksToMap(point);
                                })
                            }
                            <InfoWindow
                                marker={this.state.activeMarker}
                                visible={this.state.showingInfoWindow}
                                onOpen={e=>{
                                    this.onInfoWindowOpen(this.props,e);
                                }}>
                                <p>{this.state.selectedPlace.name}</p>
                                <div id="but-sub-mark"/>
                            </InfoWindow>

                        </Map>
                    </div>
                </div>


            </div>
        );

    }


}


export default GoogleApiWrapper({
    apiKey: ("AIzaSyC8b04jlgefJ27fjvs4axnTGGKvYtFemWI")
})(DriverRouterListNew)