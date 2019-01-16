import React from 'react';
import ReactDOM from "react-dom";
import SockJsClient from 'react-stomp';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import FullCalendar from 'fullcalendar-reactwrapper';
import 'fullcalendar-reactwrapper/dist/css/fullcalendar.min.css'
import {WEBURL} from "../../constants/urls"
import apiRequest from "../../util/ApiRequest";

var moment = require('moment');
require("moment/min/locales.min");


class pageDispatcherOrderListOnCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.eventDrop = this.eventDrop.bind(this);
        this.resizeEvent = this.resizeEvent.bind(this);
        this.getEvents = this.getEvents.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.state = {
            orders: [],
            company: {},
            totalElements: 0,
            currentPage: 1,
            calendarEvents:[],
            start:"",
            end:"",
            myref:"",
            currentDateFrom:new Date().setDate(1),
            currentDateTo:"-"
        };
        document.title = "Заказы";

    }

    getEvents(start, end, timezone, callback) {
        let refthis = this;
        let from = moment(start._d).format('YYYY-MM-DD');
        let to = moment(end._d).format('YYYY-MM-DD');

        this.state.currentDateFrom=from;
        this.state.currentDateTo=to;

        return apiRequest(`/api/ordersByDate?from=${from}&to=${to}`).then(function (result) {
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
        if ((moment().isAfter(event._start)) || (moment().isAfter(event._start._i))) {
            revertFunc();
            if ((moment().isAfter(event._start))) NotificationManager.error('Заказ уже начался/завершился', 'Ошибка');
            else NotificationManager.error('Нельзя перемещать в прошлое', 'Ошибка');
            return;
        }
        let formData = new FormData();
        formData.append("orderId", event.id);
        formData.append("daysOffset", days_offset._days);

        apiRequest('/api/waybill/changedate', 'put', formData)
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

    handleMessage(msg){
        let myId = localStorage.getItem("userId");
        let myCompanyId = localStorage.getItem("companyId");

       msg.waybillDto.dateArrival=msg.waybillDto.dateArrival.year+"-"+msg.waybillDto.dateArrival.monthValue+"-"+msg.waybillDto.dateArrival.dayOfMonth;
       msg.waybillDto.dateDeparture=msg.waybillDto.dateDeparture.year+"-"+msg.waybillDto.dateDeparture.monthValue+"-"+msg.waybillDto.dateDeparture.dayOfMonth;

        if(myCompanyId!==msg.companyId) return; //commit to view notifications for all users;

        let dateArrival = moment(msg.waybillDto.dateArrival);
        let rangeArrival =dateArrival.isBetween(moment(this.state.currentDateFrom),moment(this.state.currentDateTo));

        let dateDeparture = moment(msg.waybillDto.dateDeparture);
        let rangeDeparture =dateDeparture.isBetween(moment(this.state.currentDateFrom),moment(this.state.currentDateTo));

        if(!rangeArrival && !rangeDeparture) return;

        if(myId===msg.updaterUser) {
            NotificationManager.success('Заказ обновлён '+ msg.orderName, 'Информация');
        }
        else{
            NotificationManager.info('Изменены даты перевозки заказа - '+ msg.orderName, 'Пользователь: '+ msg.updaterUserName);
        }
        this.forceUpdate();
    }

    render() {
        return <div className="row animated fadeIn">
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
                        defaultDate={this.state.currentDateFrom}
                        navLinks={false} // can click day/week names to navigate views
                        editable={true}
                        events={this.getEvents}
                        displayEventTime={false} // disable 12a prefix in events
                        eventLimit={true} // allow "more" link when too many events
                        eventResize={this.resizeEvent}
                        eventDrop={this.eventDrop}
                        showNonCurrentDates={false}
                        ref={(input) => { this.state.myref = input; }}
                    />
                    <SockJsClient url= {WEBURL + '/stomp'} topics={['/topic/'+localStorage.getItem("companyId")+'/calendarUpdate']}
                                  onMessage={(msg) => {
                                      this.handleMessage(msg);
                                  }}
                                  ref={ (client) => { this.clientRef = client }} />
                </div>
            </div>
        </div>
    }
}

export default pageDispatcherOrderListOnCalendar;