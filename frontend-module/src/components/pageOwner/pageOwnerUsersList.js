import React, {Component} from 'react';
import Pagination from "react-js-pagination";
import CreateUser from "../PagesCommon/adminSysAdminCreateUser";
import {NotificationManager} from "react-notifications";

export default class UsersList extends Component {

    constructor(props) {
        super(props);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.getUsersRequest = this.getUsersRequest.bind(this);
        this.state = {
            users: [],
            totalElements: 0,
            currentPage: 1
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
        }).catch(()=>{
            NotificationManager.error('Ошибка доступа');
        });
    };

    handlePageChange(pageNumber) {
        this.getUsersRequest(pageNumber);
        this.setState({currentPage: pageNumber});
    }

    renderUser = (user) => {
        return <div className={'row table_row animated fadeInUp'}>
            <div className={'col-md-4'}>{user.username}</div>
            <div className={'col-md-4'}>{this.russianRole(user.userRole)}</div>
            <div className={'col-md-4'}>{user.email}</div>
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
                return 'Владелец компании';
            default:
                return role;
        }
    };

    render() {
        return <div className={'row'}>
            <div className="offset-md-1 col-md-5 superuserform_companylist">
                <div className="row table_header animated fadeIn">
                    {/*<div className="col-md-1">Id</div>*/}
                    <div className="col-md-4">Никнейм</div>
                    <div className="col-md-4">Роль</div>
                    <div className="col-md-4">Почта</div>
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
            <div className="offset-md-1 col-md-4" id={'add-user-form'}>
                <CreateUser/>
            </div>
        </div>
    }
}