import React, {Component} from "react";

class testComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            out: ''
        };
        this.checkSecurity = this.checkSecurity.bind(this);
        document.title = "Test page"
    }

    render() {
        return <div>
        </div>;
    }

    checkSecurity() {
        return fetch(`http://localhost:8080/api/orders/5`, {method: "get"}).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            return result;
        });
    }


}

export default testComponent;
