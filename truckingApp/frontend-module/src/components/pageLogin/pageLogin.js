import React, { Component } from "react";

class LoginPage extends React.Component{
    render(){
        return <form className="form-signin">
            <div id="loginicon">
                <img id="icon" src="/static/img/login.png" alt=""></img>
            </div>
            <input type="email" id="inputEmail" className="form-control" placeholder="Логин" required="" autofocus=""/>
            <input type="password" id="inputPassword" className="form-control" placeholder="Пароль" required=""></input>
            <button id="loginbutton" className="loginbutton btn btn-lg btn-primary btn-block" type="submit">Вход</button>
        </form>
    }
}

export default LoginPage;