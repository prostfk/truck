import React from "react";

export default class ManagerWelcomePage extends React.Component {

    constructor(props) {
        super(props);
        document.title = 'Страница Менеджера';
    }

    render() {
        return (
            <div className={"offset-md-3 mt-5"}>
                <h1>Добро пожаловать на страницу менеджера</h1>
                <h2 className={"mt-2"}>Доступные опции</h2>
                <ul className={"mt-2"}>
                    <li className={"mt-3"}>Просмотр заказов, товарной партии, путевого листа.</li>
                    <li className={"mt-3"}>Списание и восстановление товаров в товарной партии.</li>
                    <li className={"mt-3"}>Добавление и удаление точек прибытия путевом листе для водителя.</li>
                    <li className={"mt-3"}>Подтверждение проверки заказа.</li>
                </ul>
            </div>
        );
    }
}