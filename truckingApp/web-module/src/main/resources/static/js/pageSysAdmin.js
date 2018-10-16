export class SysAdminPage extends react.Component {
    render() {
        return React.createElement(
            "div",
            { "class": "row" },
            React.createElement(
                "div",
                { "class": "offset-md-1 col-md-6 superuserform_companylist" },
                React.createElement(
                    "table",
                    { "class": "table" },
                    React.createElement(
                        "thead",
                        { "class": "thead" },
                        React.createElement(
                            "tr",
                            null,
                            React.createElement(
                                "th",
                                { scope: "col" },
                                "ID"
                            ),
                            React.createElement(
                                "th",
                                { scope: "col" },
                                "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438"
                            ),
                            React.createElement(
                                "th",
                                { scope: "col" },
                                "\u0421\u0442\u0430\u0442\u0443\u0441"
                            ),
                            React.createElement(
                                "th",
                                { scope: "col" },
                                "\u0414\u0430\u0442\u0430 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438"
                            ),
                            React.createElement("th", { scope: "col" })
                        )
                    ),
                    React.createElement(
                        "tbody",
                        null,
                        React.createElement(
                            "tr",
                            null,
                            React.createElement(
                                "th",
                                { scope: "row" },
                                "1"
                            ),
                            React.createElement(
                                "td",
                                null,
                                "PoliExpress"
                            ),
                            React.createElement(
                                "td",
                                null,
                                "Active"
                            ),
                            React.createElement(
                                "td",
                                null,
                                "01.02.2013"
                            ),
                            React.createElement(
                                "td",
                                null,
                                React.createElement(
                                    "a",
                                    { href: "edit" },
                                    "\u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C"
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "nav",
                    { "aria-label": "..." },
                    React.createElement(
                        "ul",
                        { "class": "pagination pagination-sm" },
                        React.createElement(
                            "li",
                            { "class": "page-item disabled" },
                            React.createElement(
                                "a",
                                { "class": "page-link", href: "#", tabindex: "-1" },
                                "1"
                            )
                        ),
                        React.createElement(
                            "li",
                            { "class": "page-item" },
                            React.createElement(
                                "a",
                                { "class": "page-link", href: "#" },
                                "2"
                            )
                        ),
                        React.createElement(
                            "li",
                            { "class": "page-item" },
                            React.createElement(
                                "a",
                                { "class": "page-link", href: "#" },
                                "3"
                            )
                        )
                    )
                )
            ),
            React.createElement(
                "div",
                { "class": "offset-md-1 col-md-3" },
                React.createElement(
                    "form",
                    { "class": "superuserform_newaccountform" },
                    React.createElement(
                        "h5",
                        null,
                        "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u043D\u043E\u0432\u043E\u0439 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438"
                    ),
                    React.createElement(
                        "div",
                        { "class": "form-group" },
                        React.createElement("input", { type: "text", "class": "form-control", id: "inputEmail", placeholder: "newUser@mail.com", required: "" })
                    ),
                    React.createElement(
                        "button",
                        { "class": "btn btn-success" },
                        "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043F\u0440\u0438\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435"
                    )
                )
            )
        );
    }
}
