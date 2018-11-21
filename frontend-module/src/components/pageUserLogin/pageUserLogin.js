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

            <form className="form-signin center animated fadeInUp" id="login-form">
                <span style={{color: 'red'}} id="error-span"/>

                <input type="text" id="inputUsername" value={this.state.email} onChange={this.setUsername}
                       className="form-control"
                       placeholder="Логин" required=""
                       autoFocus=""/>
                <input type="password" value={this.state.password} id="inputPassword" onChange={this.setPassword}
                       className="form-control"
                       placeholder="Пароль" required=""/>
                <button className="btn btn-lg btn-secondary"
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
                    localStorage.setItem("Auth-token", data.token);
                    localStorage.setItem("username", username);
                    localStorage.setItem("role", data.role);
                    this.props.history.push('/');
                }else{
                    document.getElementById('error-span').innerText = "Неправильные данные";
                }
            })
        }, err => console.log(err))
    }

}

export default pageUserLogin;
