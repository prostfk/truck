import React, {Component} from 'react';
import CommonUtil from "../commonUtil/commontUtil";
import Pagination from "react-js-pagination";
import CreateUser from "../PagesCommon/adminSysAdminCreateUser";

import {EditIcon} from "./pageAutoList";
import {NotificationManager} from "react-notifications";
import Link from "react-router-dom/es/Link";
import apiRequest from "../../util/ApiRequest";

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
        fetch('/api/users?page=' + pageid, {
            headers: {'authorization': localStorage.getItem('authorization')}
        }).then(response => {
            if (response.status === 403 || response.status === 500) {
                NotificationManager.error('Ошибка доступа');
            } else {
                return response.json();
            }
        }).then(data => {
            let getEditedUsers = data.content;
            this.setState({
                users: getEditedUsers,
                totalElements: data.totalElements,
                currentPage: ++data.number
            })
        }).catch(() => {
            NotificationManager.error('Ошибка доступа');
        })
    };

    changeInput = (event) => {
        this.setState({
            [event.target.id]: [event.target.value]
        });
    };

    handlePageChange(pageNumber) {
        this.getUsersRequest(pageNumber);
        this.setState({currentPage: pageNumber});
    }

    renderUser = (user, index) => {
        if (!user) return;
        let timeZoneOffset = new Date().getTimezoneOffset();
        let dateOfRegistration = user.reg_date == null ? "-" : moment().utc(user.reg_date);
        let localTime = moment(dateOfRegistration).utcOffset(-timeZoneOffset).format('YYYY-MM-DD HH:mm');

        return <div className={'row table_row animated fadeInUp'} key={index}>
            <div className={'col-md-3'}>{user.username}</div>
            <div className={'col-md-3'}>{this.russianRole(user.userRole)}</div>
            <div className={'col-md-3'}>{localTime}</div>
            <div className={'col-md-2'} style={{'overflow': 'hidden'}}>{user.email}</div>
            {user.userRole !== 'ROLE_COMP_OWNER' ?
                <div className={'col-md-1'}><Link to={`/user/${user.id}/edit`}><EditIcon/></Link></div> : <div/>}
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
                    <div className="col-md-3">Никнейм</div>
                    <div className="col-md-3">Роль</div>
                    <div className="col-md-3">Дата регистрации</div>
                    <div className="col-md-2">Почта</div>
                    <div className="col-md-1">Ред.</div>
                </div>
                {
                    this.state.users.map((user, index) => {
                        return this.renderUser(user, index);
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
                <CreateUser updateList={this.getUsersRequest}/>
            </div>
        </div>
    }


}