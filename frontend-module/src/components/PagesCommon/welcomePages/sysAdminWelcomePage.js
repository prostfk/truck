import React from "react";

export default class SysAdminWelcomePage extends React.Component {

    constructor(props) {
        super(props);
        document.title = 'Страница Системного администартора';
    }

    render() {
        return (
            <div className={"offset-md-3 mt-5"}>
                <h1>Добро пожаловать на страницу системного администратора.</h1>
                <h2 className={"mt-2"}>Доступные опции</h2>
                <ul className={"mt-2"}>
                    <li className={"mt-3"}>Регистрация новой компании с системе.</li>
                    <li className={"mt-3"}>Блокировка активности компании с указанием причины.</li>
                    <li className={"mt-3"}>Получени статистики.</li>
                </ul>
            </div>
        );
    }
}