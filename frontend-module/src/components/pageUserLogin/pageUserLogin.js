import React, {Component} from "react";
import axios from 'axios';


class pageUserLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.processLogin = this.processLogin.bind(this);

    }

    setUsername(event) {
        this.setState({
            email: event.target.value
        })
    }

    setPassword(event) {
        this.setState({
            password: event.target.value
        })
    }

    render() {
        return (
            <form className="form-signin" id="login-form">
                <div id="loginicon"/>
                <input type="username" id="inputUsername" value={this.state.email} onChange={this.setUsername}
                       className="form-control"
                       placeholder="Логин" required=""
                       autoFocus=""/>
                <input type="password" value={this.state.password} id="inputPassword" onChange={this.setPassword}
                       className="form-control"
                       placeholder="Пароль" required=""/>
                <span style={{color: 'red'}} id="error-span"/>
                <button id="loginbutton" className="loginbutton btn btn-lg btn-primary btn-block"
                        onClick={this.processLogin} type="button">Вход
                </button>
            </form>)
            ;
    }

    processLogin() {
        let email = this.state.email;
        let password = this.state.password;
        let formData = new FormData();
        formData.append("username", email);
        formData.append("password", password);
        console.log(formData.get('password'));
        fetch('http://localhost:8080/api/auth', {method: "POST", body: formData}).then(response => {
            // document.getElementById('login-form').style.display = 'none';
            response.json().then(data => {
                if (data.error === undefined) {
                    document.getElementById('login-form').style.display = 'none';
                    console.log(`SUCCESS: ${data.token}`);
                    let headers = new Headers();
                    headers.append("Auth-token", data.token);//put token in header for api-access
                }else{
                    document.getElementById('error-span').innerText = "Check your data";
                }
            })
        }, err => console.log(err))
    }

}

export default pageUserLogin;
