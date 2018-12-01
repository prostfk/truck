import React from "react";

export default class AdminWelcomePage extends React.Component {

    constructor(props) {
        super(props);
        document.title = 'Страница Администратора';
    }
    render() {
        return (
            <div className={"offset-md-3 mt-5"}>
                <h1>Добро пожаловать на страницу администратора.</h1>
                <h2 className={"mt-2"}>Доступные опции</h2>
                <ul className={"mt-3"}>
                    <li className={"mt-3"}>Просмотр и редактирование списка пользователей компании.</li>
                    <li className={"mt-3"}>Добавление и редактирование складов.</li>
                    <li className={"mt-3"}>Добавление и редактирование авто.</li>
                    <li className={"mt-3"}>Редактирование компани.</li>
                </ul>
            </div>
        );
    }
}