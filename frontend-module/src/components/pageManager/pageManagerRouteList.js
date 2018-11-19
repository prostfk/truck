import React, {Component} from "react";
import {GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';

class ManagerRouteList extends Component {

    constructor(props) {
        super(props);
        this.getRouteList = this.getRouteList.bind(this);
        this.renderMarkers = this.renderMarkers.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onInfoWindowClose = this.onInfoWindowClose.bind(this);
        this.onMapClick = this.onMapClick.bind(this);
        this.state = {
            routePoints: [],
            orderId: "",
            point:"",
            sequence:"",
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {}
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
    renderMarkers(routePoint) {
        if (!routePoint) return;
        return <Marker onClick={this.onMarkerClick}
                       name={routePoint.point} position={{lat: routePoint.lat, lng: routePoint.lng}}/>

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

    onMarkerClick = (props, marker, e) => {
        console.log(marker);
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }
    onInfoWindowClose() {
        this.setState({
            showingInfoWindow: false
        });
    }
    onMapClick = (event, map, position) => {
        console.log(position.latLng.lat());
        console.log(map);
        let {
            google
        } = this.props;

        let pos = position;
        position = new google.maps.LatLng(pos.lat, pos.lng);
        const pref = {
            map: map,
            position: position
        };
        console.log(this.props);
        const marker = new google.maps.Marker(pref);
        console.log(marker);
        console.log("map clicked");
        console.log(event.latLng.lat());
        console.log(event.target);
    }
    render() {
        const style = {
            width: '50vw',
            height: '75vh',
            'marginLeft': 'auto',
            'marginRight': 'auto'
        }
        return (
            <Map google={this.props.google}
                 center={{
                     lat: 53.7169,
                     lng: 27.9776
                 }}
                 zoom={14} onClick={this.onMapClick} id="googleMap">
                {
                    this.state.routePoints.map((element) => {
                        return this.renderMarkers(element);
                    })
                }
                <InfoWindow onClose={this.onInfoWindowClose} marker = {this.state.activeMarker } visible = {this.state.showingInfoWindow }>
                    <div>
                        <h1>{this.state.activeMarker.name}</h1>
                    </div>
                </InfoWindow>
            </Map>
        );

    }
}

export default GoogleApiWrapper({
    api: (process.env.AIzaSyC8b04jlgefJ27fjvs4axnTGGKvYtFemWI)
})(ManagerRouteList)