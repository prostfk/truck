/*login page*/
class LoginPage extends React.Component {
    render() {
        return React.createElement(
            "form",
            { className: "form-signin" },
            React.createElement(
                "div",
                { id: "loginicon" },
                React.createElement("img", { id: "icon", src: "/static/img/login.png", alt: "" })
            ),
            React.createElement("input", { type: "email", id: "inputEmail", className: "form-control", placeholder: "\u041B\u043E\u0433\u0438\u043D", required: "", autofocus: "" }),
            React.createElement("input", { type: "password", id: "inputPassword", className: "form-control", placeholder: "\u041F\u0430\u0440\u043E\u043B\u044C", required: "" }),
            React.createElement(
                "button",
                { id: "loginbutton", className: "loginbutton btn btn-lg btn-primary btn-block", type: "submit" },
                "\u0412\u0445\u043E\u0434"
            )
        );
    }
}
/*login page*/

ReactDOM.render(React.createElement(LoginPage, null), document.getElementById('container_body'));
