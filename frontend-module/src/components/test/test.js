import React, {Component} from "react";

class test extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
        test.getUsers = test.getUsers.bind(this);
    }

    render() {
        return <div><input type="text" readOnly value={this.state.users}/><button onClick={test.getUsers}>Click to load</button></div>;
    }

    static getUsers() {
        fetch('/rest/users').then(function (response) {
            response.json().then(function (data) {
                this.setState({
                    users: data
                })
            })
        })
    }

}

export default test;
