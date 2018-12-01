import React from "react";

export default class DriverWelcomePage extends React.Component {

    constructor(props) {
        super(props);
        document.title = 'Страница водителя';
    }

    render() {
        return (
            <div className={"offset-md-3 mt-5"}>
                <h1>Добро пожаловать на страницу водителя.</h1>
                <h2 className={"mt-2"}>Достпные опции</h2>
                <ul className={"mt-2"}>
                    <li className={"mt-3"}>Отмечать контрольные точки.</li>
                    <li className={"mt-3"}>Списать товар с партии, в случаче потери.</li>
                </ul>
            </div>
        );
    }
}