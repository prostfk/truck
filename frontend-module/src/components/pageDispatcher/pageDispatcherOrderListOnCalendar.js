import React from 'react';
import FullCalendar from 'fullcalendar-reactwrapper';
import 'fullcalendar-reactwrapper/dist/css/fullcalendar.min.css'


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
            events:[
                {
                    id:133,
                    title: 'All Day Event',
                    start: '2018-11-11'
                },
                {
                    id:134,
                    title: 'Long Event',
                    start: '2018-11-07',
                    end: '2018-11-09'
                },
                {
                    id:34,
                    title: 'order #34',
                    url: 'http://localhost:3000/orders/'+34+'/edit',
                    start: '2018-11-09',
                    end: '2018-11-14'
                }
            ]
        };
        document.title = "Заказы"
    }
    viewRender(view,element){
        alert("new date");
        console.log(view);
        console.log(element);
    }

    eventDrop(event,days_offset) {
        console.log(event);
        console.log(days_offset._days);
   /*     const { events } = this.state;

        const idx = events.indexOf(event);
        const updatedEvent = { ...event, start, end };

        const nextEvents = [...events];
        nextEvents.splice(idx, 1, updatedEvent);

        this.setState({
            events: nextEvents
        });*/
    }

    resizeEvent = (resizeType) => {
        console.log(resizeType);
        alert(resizeType.title + " was dropped on " + resizeType.start.format());
        alert(resizeType.title + " end is now " + resizeType.end.format());

    };


    componentDidMount(){
        this.getOrderList().then(data => {
            this.setState({orders: data.content,
                totalElements:data.totalElements,
                currentPage:++data.number});
        });

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
                            /* right: 'month'*/
                        }}
                        defaultDate={new Date()}
                        navLinks= {false} // can click day/week names to navigate views
                        editable= {true}
                        eventLimit= {true} // allow "more" link when too many events
                        events = {this.state.events}
                        eventResize = {this.resizeEvent}
                        eventDrop = {this.eventDrop}
                        viewRender = {this.viewRender}
                    />
                </div>
            </div>
        </div>
    }
}

export default pageDispatcherOrderListOnCalendar;