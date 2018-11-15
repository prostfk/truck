import React from 'react';
import ReactDOM from 'react-dom';

// ... and fullcalendar-reactwrapper.
import FullCalendar from 'fullcalendar-reactwrapper';
import 'fullcalendar-reactwrapper/dist/css/fullcalendar.min.css'


class pageDispatcherOrderListOnCalendar extends React.Component{
    constructor(props) {
        super(props);
        this.getOrderList = this.getOrderList.bind(this);
        this.moveEvent = this.moveEvent.bind(this);
        this.state = {
            orders:[],
            company:{},
            totalElements:0,
            currentPage:1,
            events:[
                {
                    title: 'All Day Event',
                    start: '2018-11-11'
                },
                {
                    title: 'Long Event',
                    start: '2018-11-07',
                    end: '2018-11-10'
                },
                {
                    id: 999,
                    title: 'Repeating Event',
                    start: '2018-11-09T16:00:00'
                },
                {
                    id: 999,
                    title: 'Repeating Event',
                    start: '2018-11-16T16:00:00'
                },
                {
                    title: 'Conference',
                    start: '2018-11-11',
                    end: '2018-11-05-13'
                },
                {
                    title: 'Meeting',
                    start: '2018-11-12T10:30:00',
                    end: '2018-11-12T12:30:00'
                },
                {
                    title: 'Birthday Party',
                    start: '2018-11-13T07:00:00'
                },
                {
                    title: 'Click for Google',
                    url: 'http://google.com/',
                    start: '2018-11-28'
                }
            ]
        };
        document.title = "Заказы"
    }

    moveEvent({ event, start, end }) {
        const { events } = this.state;

        const idx = events.indexOf(event);
        const updatedEvent = { ...event, start, end };

        const nextEvents = [...events];
        nextEvents.splice(idx, 1, updatedEvent);

        this.setState({
            events: nextEvents
        });
    }

    resizeEvent = (resizeType, { event, start, end }) => {
        const { events } = this.state;

        const nextEvents = events.map(existingEvent => {
            return existingEvent.id == event.id
                ? { ...existingEvent, start, end }
                : existingEvent;
        });

        this.setState({
            events: nextEvents
        });
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
            <div className="offset-md-2 col-md-8 superuserform_companylist">
                <h1>Календарь заказов</h1>
                <div id="example-component">
                    <FullCalendar
                        id = "your-custom-ID"
                        header = {{
                            left: 'prev,next today myCustomButton',
                            center: 'title',
                            right: 'month,basicWeek,basicDay'
                        }}
                        defaultDate={'2018-11-12'}
                        navLinks= {true} // can click day/week names to navigate views
                        editable= {true}
                        eventLimit= {true} // allow "more" link when too many events
                        events = {this.state.events}
                    />
                </div>
            </div>
        </div>
    }
}

export default pageDispatcherOrderListOnCalendar;