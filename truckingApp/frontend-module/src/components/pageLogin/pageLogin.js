import React, { Component } from "react";

class LoginPage extends React.Component{
    render(){
        return <form className="form-signin">
            <div id="loginicon"/>
            <input type="email" id="inputEmail" className="form-control" placeholder="Логин" required="" autoFocus=""/>
            <input type="password" id="inputPassword" className="form-control" placeholder="Пароль" required=""/>
            <button id="loginbutton" className="loginbutton btn btn-lg btn-primary btn-block" type="submit">Вход</button>
        </form>
    }
}

export default LoginPage;