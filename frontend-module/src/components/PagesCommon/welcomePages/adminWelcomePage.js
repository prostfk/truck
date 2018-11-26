import React from "react";

export default class AdminWelcomePage extends React.Component {

    constructor(props) {
        super(props);
        document.title = 'Страница Администратора';
    }
    render() {
        return (
            <div>Admin Welcome page</div>
        );
    }
}