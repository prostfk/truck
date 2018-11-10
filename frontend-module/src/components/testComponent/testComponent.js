import React, {Component} from "react";
import GoogleMapReact from 'google-map-react'


const AnyReactComponent = ({text}) => <div>{text}</div>;

export class TestComponent extends Component {

    static defaultProps = {
        center: {lat: 40.7446790, lng: -73.9485420},
        zoom: 11
    };

    render() {
        let design = {
            color: 'red'
        };
        return (
            <div>

                <div className='google-map'>
                    <GoogleMapReact style={{height: '80%'}}
                        defaultCenter={this.props.center}
                        defaultZoom={this.props.zoom}>

                    </GoogleMapReact>
                </div>
            </div>
        );
    }


}

// export default GoogleApiWrapper({
//     apiKey: ('AIzaSyC8b04jlgefJ27fjvs4axnTGGKvYtFemWI')
// })(TestComponent)