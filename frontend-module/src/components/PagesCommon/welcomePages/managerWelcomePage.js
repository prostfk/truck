import React from "react";

export default class ManagerWelcomePage extends React.Component {

    constructor(props) {
        super(props);
        document.title = 'Страница Менеджера';
    }

    render() {
        return (
            <div>Manager Welcome page</div>
        );
    }
}