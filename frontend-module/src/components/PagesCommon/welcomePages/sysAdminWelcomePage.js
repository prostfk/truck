import React from "react";

export default class SysAdminWelcomePage extends React.Component {

    constructor(props) {
        super(props);
        document.title = 'Страница Системного администартора';
    }

    render() {
        return (
            <div>SysAdmin Welcome page</div>
        );
    }
}