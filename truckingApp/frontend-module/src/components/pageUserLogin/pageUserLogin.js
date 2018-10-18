import React, {Component} from "react";
import axios from 'axios';


class pageUserLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.processLogin = this.processLogin.bind(this);

    }

    setEmail (event) {
        this.setState({
            email: event.target.value
        })
    }

    setPassword(event){
        this.setState({
            password: event.target.value
        })
    }

    render() {
        return (
            <form className="form-signin" id="login-form">
                <div id="loginicon"/>
                <input type="email" id="inputEmail" value={this.state.email} onChange={this.setEmail} className="form-control"
                       placeholder="Логин" required=""
                       autoFocus=""/>
                <input type="password" value={this.state.password} id="inputPassword" onChange={this.setPassword} className="form-control"
                       placeholder="Пароль" required=""/>
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
        formData.append("email", email);
        formData.append("password", password);
        console.log(this.state.email + " " + this.state.password);
        axios.post('http://localhost:8080/rest/login', {formData}).then(response => {
            document.getElementById('login-form').style.display = 'none';
            console.log(response);
        }, err => console.log(err))
    }

}

export default pageUserLogin;
