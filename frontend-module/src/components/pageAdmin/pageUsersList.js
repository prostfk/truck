import React, {Component} from 'react';
import CommonUtil from "../commonUtil/commontUtil";
import Pagination from "react-js-pagination";
/*import ValidationUtil from "../commonUtil/validationUtil";*/
import CreateUser from "../PagesCommon/adminSysAdminCreateUser";

import {EditIcon} from "./pageAutoList";
/*import {edit} from 'react-icons-kit/fa/edit'*/

/*const SideIconContainer = withBaseIcon({size: 24, style: {color: '#50505d'}});
import Moment from 'react-moment';
import {withBaseIcon} from "react-icons-kit";
*/


var moment = require('moment');
require("moment/min/locales.min");


export default class UsersList extends Component {

    constructor(props) {
        super(props);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.getUsersRequest = this.getUsersRequest.bind(this);
        this.state = {
            users: [],
            totalElements: 0,
            currentPage: 1,
            newUserEmail: '',
            newUserUsername: '',
            newUserPassword: '',
            newUserRole: '',
            newUserDate: CommonUtil.getCorrectDateFromLong(new Date().getTime()),
            newUserFirstName: '',
            newUserSecondName: '',
            newUserThirdName: '',
            newUserCountry: '',
            newUserCity: '',
            newUserStreet: '',
            newUserHouseNumber: '',
            newUserFlatNumber: '',
            newUserPassport: ''
        };
        this.getUsersRequest();
    }


    getUsersRequest = (pageid = 1) => {
        fetch('http://localhost:8080/api/users?page=' + pageid, {
            headers: {'Auth-token': localStorage.getItem('Auth-token')}
        }).then(response => {
            if (response.status === 403 || response.status === 500) {
                throw new Error('Ошибка доступа');
            } else {
                return response.json();
            }
        }).then(data => {
            let gettedusers = data.content;
            console.log(gettedusers);
            this.setState({
                users: gettedusers,
                totalElements: data.totalElements,
                currentPage: ++data.number
            })
        })
    };

    changeInput = (event) => {
        this.setState({
            [event.target.id]: [event.target.value]
        });
        console.log(this.state)
    };

    handlePageChange(pageNumber) {
        this.getUsersRequest(pageNumber);
        this.setState({currentPage: pageNumber});
    }

    renderUser = (user) => {
        if (!user) return;
        user.reg_date[6] = user.reg_date[6] / 1000000;
        let timezoneoffset = new Date().getTimezoneOffset();
        let dateofreg = user.reg_date == null ? "-" : moment.utc(user.reg_date);
        let localTime = moment(dateofreg).utcOffset(-timezoneoffset).format('YYYY-MM-DD HH:mm:ss');


        return <div className={'row table_row animated fadeInUp'}>

            {/*<div className={'col-md-1'}>{user.id}</div>*/}
            <div className={'col-md-3'}>{user.username}</div>
            <div className={'col-md-3'}>{this.russianRole(user.userRole)}</div>
            <div className={'col-md-3'}>{localTime}</div>
            <div className={'col-md-2'} style={{'overflow': 'hidden'}}>{user.email}</div>
            {user.userRole !== 'ROLE_COMP_OWNER' ? <div className={'col-md-1'}><a href={`/user/${user.id}/edit`}><EditIcon></EditIcon></a></div> : <div/>}
            </div>
    };

    russianRole = (role) => {
        switch (role) {
            case 'ROLE_ADMIN':
                return 'Администратор';
            case 'ROLE_DISPATCHER':
                return 'Диспетчер';
            case 'ROLE_MANAGER':
                return 'Менеджер';
            case 'ROLE_DRIVER':
                return 'Водитель';
            case 'ROLE_COMP_OWNER':
                return 'Владелец';
            default:
                return role;
        }
    };


    render() {
        return <div className={'row'}>
            <div className="offset-md-1 col-md-5 superuserform_companylist">
                <div className="row table_header animated fadeIn">
                    {/*<div className="col-md-1">Id</div>*/}
                    <div className="col-md-3">Никнейм</div>
                    <div className="col-md-3">Роль</div>
                    <div className="col-md-3">Дата регистрации</div>
                    <div className="col-md-2">Почта</div>
                    <div className="col-md-1">Изменить</div>
                </div>
                {
                    this.state.users.map((user) => {
                        return this.renderUser(user);
                    })
                }
                <div className="table_footer">
                    <div>
                        <Pagination
                            activePage={this.state.currentPage}
                            totalItemsCount={this.state.totalElements}
                            itemsCountPerPage={5}
                            pageRangeDisplayed={5}
                            hideDisabled={true}
                            itemClass={"page-item"}
                            linkClass={"page-link"}
                            activeClass={"activePage"}
                            onChange={this.handlePageChange}
                        />
                    </div>
                </div>
            </div>

            <div className="offset-md-1 col-md-4 animated fadeIn" id={'add-user-form'}>
                <CreateUser/>
            </div>
        </div>
    }


}