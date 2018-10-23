import React, {Component} from "react";

class testComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            out: ''
        };
        this.checkSecurity = this.checkSecurity.bind(this);

    }

    render() {
        return <div>
            <input type="text" id="output" readOnly className="form-control"/>
            <button className="btn btn-primary" onClick={this.checkSecurity}>Load</button>
        </div>;
    }

    checkSecurity() {
        fetch('http://localhost:8080/api/checkSecure',{headers: {'Auth-token': sessionStorage.getItem('Auth-token')}}).then(response => response.json().then(data => {
            console.log(data);
            document.getElementById('output').innerText = data.message;
        }))
    }

}

export default testComponent;
