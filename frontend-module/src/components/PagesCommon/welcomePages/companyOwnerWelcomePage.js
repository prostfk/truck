import React from "react";

export default class CompanyOwnerWelcomePage extends React.Component {

    constructor(props) {
        super(props);
        document.title = 'Страница Владельца компании';
    }

    render() {
        return (
            <div>CompanyOwner Welcome page</div>
        );
    }
}