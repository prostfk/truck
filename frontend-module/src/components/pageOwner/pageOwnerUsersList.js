import React, {Component} from 'react';

export default class UsersList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            totalElements: 0,
            currentPage: 0
        };
        document.title = "Пользователи компании";
        this.fetchToUsers();
    }

    fetchToUsers = (pageid = 1) => {
        fetch('/api/users?page=' + pageid, {headers: {'Auth-token': localStorage.getItem('Auth-token')}}).then(response => {
            if (response.status === 403 || response.status === 500) {
                throw new Error('Ошибка доступа');
            } else {
                return response.json();
            }
        }).then(data => {
            console.log(data);
            this.setState({
                users: data.users,
                totalElements:data.totalElements,
                currentPage:++data.currentPage
            })
        })
    };

    renderUser = (user) => {
        return <div className={'row table_row'}>
            <div className={'col-md-1'}>{user.id}</div>
            <div className={'col-md-5'}>{user.username}</div>
            <div className={'col-md-3'}>{this.russianRole(user.userRole)}</div>
            <div className={'col-md-3'}>{user.email}</div>
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
            default:
                return role;
        }
    };

    render() {
        return (
            <div className={'row'}>
                <div className="offset-md-3 col-md-6 superuserform_companylist">
                    <div className="row table_header">
                        <div className="col-md-1">Id</div>
                        <div className="col-md-5">Никнейм</div>
                        <div className="col-md-3">Роль</div>
                        <div className="col-md-3">Почта</div>
                    </div>
                    {
                        this.state.users.map((user) => {
                            return this.renderUser(user);
                        })
                    }
                    <div className="row">
                        <nav aria-label="...">
                            <ul className="pagination pagination-sm">
                                <li className="page-item disabled">
                                    <a className="page-link" href="#" tabIndex="-1">1</a>
                                </li>
                                <li className="page-item"><a className="page-link" href="#">2</a></li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        );
    }
}