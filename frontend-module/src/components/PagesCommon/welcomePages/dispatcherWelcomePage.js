import React from "react";

export default class DispatcherWelcomePage extends React.Component {

    constructor(props) {
        super(props);
        document.title = 'Страница Диспетчера';
    }

    render() {
        return (
            <div className={"offset-md-3 mt-5"}>
                <h1>Добро пожаловать на страницу диспетчера.</h1>
                <h2 className={"mt-2"}>Доступные опции.</h2>
                <ul className={"mt-2"}>
                    <li className={"mt-3"}>Оформление заказа.</li>
                    <li className={"mt-3"}>Менеджмент даты заказов по календарю.</li>
                    <li className={"mt-3"}>Поиск и редактирования склада.</li>
                </ul>
            </div>
        );
    }
}