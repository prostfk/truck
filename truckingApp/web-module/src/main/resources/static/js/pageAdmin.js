class AdminPage extends react.Component {
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
                                "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0421\u043A\u043B\u0430\u0434\u0430"
                            ),
                            React.createElement(
                                "th",
                                { scope: "col" },
                                "\u0410\u0434\u0440\u0435\u0441"
                            ),
                            React.createElement("th", null),
                            React.createElement("th", null)
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
                                "7"
                            ),
                            React.createElement(
                                "td",
                                null,
                                "\u0421\u043A\u043B\u0430\u0434 ISO"
                            ),
                            React.createElement(
                                "td",
                                null,
                                "\u0423\u043B. \u041F\u0430\u0432\u043B\u043E\u0432\u0430 12"
                            ),
                            React.createElement(
                                "td",
                                null,
                                React.createElement(
                                    "a",
                                    { href: "edit" },
                                    "\u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C"
                                )
                            ),
                            React.createElement(
                                "td",
                                null,
                                React.createElement(
                                    "a",
                                    { href: "edit" },
                                    "\u0423\u0434\u0430\u043B\u0438\u0442\u044C"
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
                        "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0441\u043A\u043B\u0430\u0434"
                    ),
                    React.createElement(
                        "div",
                        { "class": "form-group" },
                        React.createElement("input", { type: "text", "class": "form-control", id: "inputname", placeholder: "\u0421\u043A\u043B\u0430\u0434 #201", required: "" })
                    ),
                    React.createElement(
                        "div",
                        { "class": "form-group" },
                        React.createElement("input", { type: "text", "class": "form-control", id: "inputadres", placeholder: "\u0410\u0434\u0440\u0435\u0441", required: "" })
                    ),
                    React.createElement(
                        "button",
                        { "class": "btn btn-success" },
                        "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0441\u043A\u043B\u0430\u0434"
                    )
                )
            )
        );
    }
}
