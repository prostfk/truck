import React from "react";

export default class DriverWelcomePage extends React.Component {

    constructor(props) {
        super(props);
        document.title = 'Страница водителя';
    }

    render() {
        return (
            <div>Driver Welcome page</div>
        );
    }
}