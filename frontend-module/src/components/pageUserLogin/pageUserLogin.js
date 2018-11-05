import React, {Component} from "react";


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
        document.title = "Вход"
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
                <div id="loginicon">
                    <img id="icon" src="/static/img/login.png" alt=""></img>
                </div>
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
        let username = this.state.email;
        let password = this.state.password;
        let formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        console.log(formData.get('password'));
        fetch('http://localhost:8080/auth', {method: "POST", body: formData}).then(response => {
            // document.getElementById('login-form').style.display = 'none';
            response.json().then(data => {
                if (data.error === undefined) {
                    document.getElementById('login-form').style.display = 'none';
                    console.log(`SUCCESS: ${data.token}`);
                    sessionStorage.setItem("Auth-token", data.token);
                    sessionStorage.setItem("username", username);
                    sessionStorage.setItem("role", data.role);
                    this.props.history.push('/');
                }else{
                    document.getElementById('error-span').innerText = "Check your data";
                }
            })
        }, err => console.log(err))
    }

}

export default pageUserLogin;
