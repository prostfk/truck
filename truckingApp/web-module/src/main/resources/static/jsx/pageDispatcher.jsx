class DispatcherCreateOrderPage extends react.Component{
    render(){
        return <div class="row">
            <div class="offset-md-2 col-md-8 form_clear">
                <div class="row">
                    <div class="col-md-6">
                        <h3>Основное</h3>
                        <small id="emailHelp" class="form-text text-muted">Компания- заказчик перевозки</small>
                        <input type="text" class="form-control" id="order_owner" placeholder="Заказчик"></input>

                        <small id="emailHelp" class="form-text text-muted">Адрес Отправления</small>
                        <input type="text" class="form-control" id="order_owner" placeholder="Откуда"></input>

                        <small id="emailHelp" class="form-text text-muted">Адрес доставки</small>
                        <input type="text" class="form-control" id="order_owner" placeholder="Куда"></input>

                        <div class="form-group">
                            <small id="emailHelp" class="form-text text-muted">Сатус заказа</small>
                            <select class="form-control" id="exampleSelect1">
                                <option>Принят</option>
                                <option>Отклонен</option>
                                <option>Выполен</option>
                                <option>Не выполнен</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h3>ТТН</h3>

                        <small id="emailHelp" class="form-text text-muted">Статус</small>
                        <select class="form-control" id="exampleFormControlSelect1">
                            <option selected>Оформлен</option>
                            <option>Проверка завершена</option>
                            <option>Доставлен</option>
                        </select>

                        <small id="emailHelp" class="form-text text-muted">Водитель</small>

                        <select class="form-control" id="exampleFormControlSelect1">
                            <option selected>Иванов</option>
                            <option>Петров</option>
                            <option>Тучкин</option>
                        </select>

                        <small id="emailHelp" class="form-text text-muted">Автомобиль</small>
                        <select class="form-control" id="exampleFormControlSelect1">
                            <option selected>Volvo 10</option>
                            <option>BMW 44-10</option>
                            <option>BusCry 22-13</option>
                        </select>
                        <small id="emailHelp" class="form-text text-muted">Дата отправления</small>
                        <input type="text" class="form-control" id="order_owner" placeholder="14.10.2015"></input>

                        <small id="emailHelp" class="form-text text-muted">Дата прибытия</small>
                        <input type="text" class="form-control" id="order_owner" placeholder="15.10.2016"></input>

                    </div>
                </div>
            </div>
            <div class="offset-md-2 col-md-8 form_clear">
                <h3>Товарная патрия</h3>
                <div class="row">
                    <di class="col-md-3">
                        <input type="text" class="form-control" placeholder="Наименование товара"></input>
                    </di>
                    <di class="col-md-3">
                        <select class="custom-select">
                            <option selected>Принят</option>
                            <option value="1">Проверен</option>
                            <option value="2">Доставлен</option>
                            <option value="3">Утерян</option>
                        </select>
                    </di>
                    <di class="col-md-3">
                        <input type="text" class="form-control" placeholder="Описание, количество.."></input>
                    </di>
                    <di class="col-md-3">
                        <button type="button" class="btn btn-info btn_fullsize">Добавить</button>
                    </di>
                </div>

                <div class="row table_row">
                    <div class="col-md-3">Процессор Intel</div>
                    <div class="col-md-3">Принят</div>
                    <div class="col-md-3">100шт</div>
                    <div class="col-md-3"><a href="" class="btn-sm btn-dark">Удалить</a></div>
                </div>
            </div>

            <div class="offset-md-2 col-md-8 form_clear">
                <button class="btn btn-success btn_fullsize">Сохранить</button>
            </div>
        </div>
    }
}