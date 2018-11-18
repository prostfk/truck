import React, {Component} from "react";
import {GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';

class ManagerRouteList extends Component {

    constructor(props) {
        super(props);
        this.getRouteList = this.getRouteList.bind(this);
        this.renderTable = this.renderTable.bind(this);
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
    renderTable(routePoint) {
        if (!routePoint) return;
        return <div><Marker onClick={this.onMarkerClick}
                       name={routePoint.point} />
            <InfoWindow onClose={this.onInfoWindowClose} marker = {this.state.activeMarker } visible = {this.state.showingInfoWindow }>
                <div>
                    <h1>routePoint.point</h1>
                </div>
            </InfoWindow></div>

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
        console.log('click');
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
    onMapClick() {
        console.log("map clicked");
        // document.getElementById("googleMap").appendChild(Marker);
    }
    render() {
        const style = {
            width: '50vw',
            height: '75vh',
            'marginLeft': 'auto',
            'marginRight': 'auto'
        }
        return (
            <Map google={this.props.google} zoom={14} onClick={this.onMapClick} id="googleMap">
                <Marker onClick={this.onMarkerClick}
                        name={'Current location'} />
                <InfoWindow onClose={this.onInfoWindowClose} marker = {this.state.activeMarker } visible = {this.state.showingInfoWindow }>
                    <div>
                        <h1>Text</h1>
                    </div>
                    <button>Отметить</button>
                </InfoWindow>
                {/*/!*{*!/*/}
                    {/*this.state.routePoints.map((element) => {*/}
                        {/*return this.renderTable(element);*/}
                    {/*})*/}
                {/*}*/}
            </Map>
        );
          //   {/*<div style={{ height: '100vh', width: '100%' }}>*/}
          //       {/*<GoogleMapReact*/}
          //           {/*bootstrapURLKeys={{ key: 'AIzaSyC8b04jlgefJ27fjvs4axnTGGKvYtFemWI' }}*/}
          //           {/*defaultCenter={this.props.center}*/}
          //           {/*defaultZoom={this.props.zoom}*/}
          //       {/*>*/}
          //           {/*<InfoWindow*/}
          //               {/*marker={this.state.activeMarker}*/}
          //               {/*visible={this.state.showingInfoWindow}>*/}
          //               {/*<div>*/}
          //                   {/*<h1>{this.state.selectedPlace.name}</h1>*/}
          //               {/*</div>*/}
          //           {/*</InfoWindow>*/}
          //       {/*</GoogleMapReact>*/}
          //   {/*</div>*/}
          // //   /*<Map google={this.props.google}
          // //        onClick={this.onMapClicked}>
          // //       <Marker onClick={this.onMarkerClick}
          // //               name={'Current location'} />
          // //
          // //       <InfoWindow
          // //           marker={this.state.activeMarker}
          // //           visible={this.state.showingInfoWindow}>
          // //           <div>
          // //               <h1>{this.state.selectedPlace.name}</h1>
          // //           </div>
          // //       </InfoWindow>
          // //   </Map>*/
          // // /* <div className="row" id="managerroutelist">
          // //       <div className="offset-md-2 col-md-8 form_clear">
          // //           <div className="row">
          // //               <div className="col-md-5">
          // //                   <h3>Путевой лист</h3>
          // //               </div>
          // //           </div>
          // //       </div>
          // //       <div className="offset-md-2 col-md-8 form_clear">
          // //           <h3>Контрольные точки</h3>
          // //           <div className="row table_header">
          // //               <div className="col-md-4">
          // //                   <input value={this.state.point} onChange={this.setPoint.bind(this)} type="text" className="form-control" placeholder="Место" />
          // //               </div>
          // //               <div className="col-md-4">
          // //                   <input value={this.state.sequence} onChange={this.setSequence.bind(this)} type="text" className="form-control" placeholder="Очерёдность" />
          // //               </div>
          // //               <div className="col-md-4">
          // //                   <button type="button" className="btn btn-info btn_fullsize" onClick={this.addPoint.bind(this)}>Добавить</button>
          // //               </div>
          // //           </div>
          // //           {
          // //               this.state.routePoints.map((element) => {
          // //                   return this.renderTable(element);
          // //               })
          // //           }
          // //       </div>
          // //   </div> */
    }
}

export default GoogleApiWrapper({
    api: (process.env.AIzaSyC8b04jlgefJ27fjvs4axnTGGKvYtFemWI)
})(ManagerRouteList)