import React from 'react';
import SockJsClient from 'react-stomp';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import FullCalendar from 'fullcalendar-reactwrapper';
import 'fullcalendar-reactwrapper/dist/css/fullcalendar.min.css'

var moment = require('moment');
require("moment/min/locales.min");

class pageDispatcherOrderListOnCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.eventDrop = this.eventDrop.bind(this);
        this.resizeEvent = this.resizeEvent.bind(this);
        this.getData = this.getData.bind(this);
        this.state = {
            orders: [],
            company: {},
            totalElements: 0,
            currentPage: 1,
            calendarEvents:[],
            start:"",
            end:"",
            callback:function () {
            }
        };
        document.title = "Заказы";

    }

    getData(start, end, timezone, callback) {
        let refthis = this;
        console.log(this.state);
        let from = moment(start._d).format('YYYY-MM-DD');
        let to = moment(end._d).format('YYYY-MM-DD');
        return fetch('http://localhost:8080/api/ordersByDate?from=' + from + '&to=' + to, {
            method: "get",
            headers: {'Auth-token': localStorage.getItem("Auth-token")}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            let myres = result;

            myres.forEach(function (item, i, arr) {
                let tmpDate = moment(item.end);
                tmpDate.add(1, 'days');
                item.end = tmpDate;
            });
            return myres;
        }).then(function (result) {
            return callback(result);
        }).catch(err => {
            NotificationManager.error('Отказано в доступе', 'Ошибка');
        });
    }


    eventDrop(event, days_offset, revertFunc, jsEvent, ui, view) {
        console.log(this.state);
        if ((moment().isAfter(event._start)) || (moment().isAfter(event._start._i))) {
            revertFunc();
            if ((moment().isAfter(event._start))) NotificationManager.error('Заказ уже начался/завершился', 'Ошибка');
            else NotificationManager.error('Нельзя перемещать в прошлое', 'Ошибка');
            return;
        }
        let formData = new FormData();
        formData.append("orderId", event.id);
        formData.append("daysOffset", days_offset._days);

        fetch('http://localhost:8080/api/waybill/changedate', {
            method: "PUT",
            body: formData,
            headers: {'Auth-token': localStorage.getItem("Auth-token")}
        })
            .then(response => {
                if (response.status === 500) {
                    revertFunc();
                    NotificationManager.error('Ошибка получения данных', 'Ошибка');
                }
                return response.json()
            })
            .then(data => {
                if (data === false) {
                    revertFunc();
                    NotificationManager.error('Вы не можете изменить дату на данную, водитель или авто заняты', 'Ошибка : Пересечение заказов');
                }
            }).catch(err => {
            revertFunc();
        })
    }

    resizeEvent = (resizeType, delta, revertFunc) => {

        console.log(resizeType.title + " was dropped on " + resizeType.start.format());
        console.log(resizeType.title + " end is now " + resizeType.end.format());
        /*        revertFunc();*/
    };

    calendarRef = React.createRef();

    render() {
        const self = this;
        return <div className="row">
            <div className="offset-md-3 col-md-6 superuserform_companylist">
                <NotificationContainer/>
                <h1>Календарь заказов</h1>
                <div id="calendarComponent">


                    <FullCalendar
                        id="trucksCalendar"
                        header={{
                            left: 'prev,next today myCustomButton',
                            center: 'title',
                            right: 'month,basicWeek,basicDay,list'
                        }}
                        defaultDate={new Date()}
                        navLinks={false} // can click day/week names to navigate views
                        editable={true}
                        events={this.getData}
                        displayEventTime={false} // disable 12a prefix in events
                        eventLimit={true} // allow "more" link when too many events
                        eventResize={this.resizeEvent}
                        eventDrop={this.eventDrop}
                        showNonCurrentDates={false}
                        ref={this.calendarRef}
                    />
                    <SockJsClient url='http://localhost:8080/stomp' topics={['/topic/dispatcher']}
                                  onMessage={(msg) => {
                                      console.log(this.state.company)
                                      NotificationManager.info('Данные обновлены', 'Обновление');
                                    this.forceUpdate();
                                  }}
                                  ref={ (client) => { this.clientRef = client }} />
                </div>
            </div>
        </div>
    }
}

export default pageDispatcherOrderListOnCalendar;