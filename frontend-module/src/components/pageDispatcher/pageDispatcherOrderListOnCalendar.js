import React from 'react';
import FullCalendar from 'fullcalendar-reactwrapper';
import 'fullcalendar-reactwrapper/dist/css/fullcalendar.min.css'

var moment = require('moment');
require("moment/min/locales.min");



class pageDispatcherOrderListOnCalendar extends React.Component{
    constructor(props) {
        super(props);
        this.getOrderList = this.getOrderList.bind(this);
        this.eventDrop = this.eventDrop.bind(this);
        this.resizeEvent = this.resizeEvent.bind(this);
        this.viewRender = this.viewRender.bind(this);
        this.state = {
            orders:[],
            company:{},
            totalElements:0,
            currentPage:1,
        };
        document.title = "Заказы"
    }
    viewRender(start, end, timezone, callback){
        let from = moment(start._d).format('YYYY-MM-DD');
        let to = moment(end._d).format('YYYY-MM-DD');
        let refthis=this;
        return fetch('http://localhost:8080/api/ordersByDate?from='+from+'&to='+to, {method: "get", headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            let myres= result;

            myres.forEach(function(item, i, arr) {
                let tmpDate = moment(item.end);

                tmpDate.add(1, 'days');

                item.end =tmpDate;
            });
            return myres;
        }).then(function (result) {
            callback(result);
        }).catch(err=>{
            throw new Error('Ошибка доступа')
        });
    }


    eventDrop(event,days_offset, revertFunc) {
        console.log(event);
        console.log(days_offset._days);
/*        revertFunc();*/
    }

    resizeEvent = (resizeType, delta, revertFunc) => {
        console.log(resizeType.title + " was dropped on " + resizeType.start.format());
        console.log(resizeType.title + " end is now " + resizeType.end.format());
/*        revertFunc();*/
    };


    componentDidMount(){
/*        this.getOrderList().then(data => {
            this.setState({orders: data.content,
                totalElements:data.totalElements,
                currentPage:++data.number});
        });*/

    }

    /*get all company list*/
    getOrderList(pageid=1) {
        return fetch('http://localhost:8080/api/orders?page='+pageid, {method: "get", headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            return result;
        }).catch(err=>{
            throw new Error('Ошибка доступа')
        });
    }


    render(){

        return  <div className="row">
            <div className="offset-md-3 col-md-6 superuserform_companylist">
                <h1>Календарь заказов</h1>
                <div id="calendarComponent">
                    <FullCalendar
                        id = "trucksCalendar"
                        header = {{
                            left: 'prev,next today myCustomButton',
                            center: 'title',
                            right: 'month,basicWeek,basicDay,list'
                        }}
                        defaultDate={new Date()}
                        navLinks= {false} // can click day/week names to navigate views
                        editable= {true}
                        eventLimit= {true} // allow "more" link when too many events
                        eventResize = {this.resizeEvent}
                        eventDrop = {this.eventDrop}
                        events = {this.viewRender}
                        showNonCurrentDates ={false}
                    />
                </div>
            </div>
        </div>
    }
}

export default pageDispatcherOrderListOnCalendar;