import React from "react";

export default class DispatcherWelcomePage extends React.Component {

    constructor(props) {
        super(props);
        document.title = 'Страница Диспетчера';
    }

    render() {
        return (
            <div>Dispatcher Welcome page</div>
        );
    }
}