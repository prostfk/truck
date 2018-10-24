import React, {Component} from "react";

class registration extends Component {

    constructor(props) {
        super(props);
        let tokenValue = document.location.href.split("=")[1];
        this.changeInput = this.changeInput.bind(this);
        this.sendFetch = this.sendFetch.bind(this);
        this.state = {
            username: '',
            password: '',
            companyName: '',
            token: tokenValue
        }
    }

    changeInput(event) {
        this.setState({
            [event.target.id]: [event.target.value]
        });
    }

    sendFetch() {
        let formData = new FormData();
        formData.append('username', this.state.username);
        formData.append('password', this.state.password);
        formData.append('companyName', this.state.companyName);
        formData.append('token', this.state.token);
        console.log(this.state);
        console.log(formData.forEach(i => console.log(i)));
        fetch(`http://localhost:8080/registration`, {
            method: "POST",
            body: formData
        }).then(response => response.json().then(data => {
            console.log(data);
        }))
    }

    render() {
        return <div className="row">
            <div className="offset-md-3 col-md-6">
                <form className="superuserform_newaccountform registrate_company_form">
                    <h2>Регистрация компании</h2>
                    <div className="form-group">
                        <label htmlFor="inputCompanyName">Название компании</label>
                        <input onChange={this.changeInput} type="text" className="text_left form-control" id="companyName"
                               placeholder="Express Auto" required=""/>
                    </div>

                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputEmail">Логин</label>
                            <input onChange={this.changeInput} type="text" className="text_left form-control" id="username" placeholder="UserName"
                                   required=""/>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputPassword">Пароль</label>
                            <input onChange={this.changeInput} type="password" className="text_left form-control" name="password" id="password"
                                   placeholder="Password" required=""/>
                        </div>
                    </div>

                    <button type="button" onClick={this.sendFetch} className="loginbutton btn btn-lg btn-primary btn-block">Создать</button>
                </form>
            </div>
        </div>;
    }
}

export default registration;
