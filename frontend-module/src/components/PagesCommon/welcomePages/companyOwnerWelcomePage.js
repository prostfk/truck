import React from "react";

export default class CompanyOwnerWelcomePage extends React.Component {

    constructor(props) {
        super(props);
        document.title = 'Страница Владельца компании';
    }

    render() {
        return (
            <div className={"offset-md-3 mt-5"}>
                <h1>Добро пожаловать на страницу владельца компании.</h1>
                <h2 className={"mt-2"}>Доступные опции</h2>
                <ul className={"mt-2"}>
                    <li className={"mt-3"}>Просмотр списка пользователей компании.</li>
                    <li className={"mt-3"}>Просмотр клиентов компании и получение статистики.</li>
                    <li className={"mt-3"}>Просмотр текущих складов.</li>
                    <li className={"mt-3"}>Получение полной статистики в формате xls.</li>
                    <li className={"mt-3"}>Просмотр накладной, путевого листа, акта списания по каждому заказу.</li>
                </ul>
            </div>
        );
    }
}