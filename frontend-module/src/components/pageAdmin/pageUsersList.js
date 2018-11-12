import React, {Component} from 'react';
import CommonUtil from "../commonUtil/commontUtil";
import Pagination from "react-js-pagination";

export default class UsersList extends Component {

    constructor(props) {
        super(props);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.getUsersRequest = this.getUsersRequest.bind(this);
        this.state = {
            users: [],
            totalElements:0,
            currentPage:0,
            newUserEmail: '',
            newUserUsername: '',
            newUserPassword: '',
            newUserRole: '',
            newUserDate: CommonUtil.getCorrectDateFromLong(new Date().getTime())
        };
        this.getUsersRequest();
    }

    getUsersRequest = (pageid=1) => {
        console.log(pageid);
        fetch('http://localhost:8080/api/users?page='+pageid, {headers: {'Auth-token': localStorage.getItem('Auth-token')}

        }).then(response => {
            if (response.status === 403 || response.status === 500) {
                throw new Error('Ошибка доступа');
            } else {
                return response.json();
            }
        }).then(data => {
            let gettedusers =data.users;
            console.log(gettedusers);
            this.setState({
                users: gettedusers,
                totalElements:data.totalElements,
                currentPage:++data.currentPage
            })
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

    renderUser = (user) => {
        return <div className={'row table_row'}>
            <div className={'col-md-1'}>{user.id}</div>
            <div className={'col-md-5'}>{user.username}</div>
            <div className={'col-md-3'}>{this.russianRole(user.userRole)}</div>
            <div className={'col-md-3'}>{user.email}</div>
            <div className={'col-md-3'}><a href={`/user/${user.id}/edit`}>Изменить</a></div>
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

    saveNewUser = () => {
        let formData = new FormData();
        formData.append('username',this.state.newUserUsername);
        formData.append('email',this.state.newUserEmail);
        formData.append('userRole',this.state.newUserRole);
        formData.append('password',this.state.newUserPassword);
        formData.append('birthDay', this.state.newUserDate);
        fetch('http://localhost:8080/api/saveUser', {
            method: 'POST',
            body: formData,
            headers: {'Auth-token': localStorage.getItem('Auth-token')}
        }).then(response => {
            if (response.status > 199 && response.status < 300) {
                return response.json();
            }
        }).then(data=>{
            //todo add backend processing!
            console.log(data);
            if (data.error === undefined){
                document.getElementById('message-span').innerText = 'Сохранено';
                document.getElementById('from-content').style.display = 'none';
                setTimeout(function () {
                    // document.getElementById('add-user-form').style.display = 'none';
                    document.getElementById('message-span').innerText = '';
                    document.getElementById('from-content').style.display = '';
                    document.getElementById('newUserEmail').value = '';
                    document.getElementById('newUserPassword').value = '';
                    document.getElementById('newUserUsername').value = '';
                    document.getElementById('newUserRole').value = '';
                    document.getElementById('newUserDate').value = CommonUtil.getCorrectDateFromLong(new Date().getTime());


                },2000);
            }else{
                document.getElementById('error-form-span').innerText = data.error;
            }
        })
    };

    render() {
        return <div className={'row'}>
            <div className="offset-md-1 col-md-6 superuserform_companylist">
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
                    <div>
                        <Pagination
                            activePage={this.state.currentPage}
                            totalItemsCount={this.state.totalElements}
                            itemsCountPerPage={5}
                            pageRangeDisplayed={5}
                            hideDisabled={true}
                            itemClass={"page-link page-item"}
                            activeClass={"activePage"}
                            onChange={this.handlePageChange}
                        />
                    </div>
                </div>
            </div>

            <div className="offset-md-1 col-md-3" id={'add-user-form'}>
                <form className="superuserform_newaccountform grey_form">
                    <span id="message-span"/>
                    <div id={'from-content'}>
                        <h5>Регистрация нового пользователя</h5>
                        <span className={'error-span'} id={'error-form-span'}/>
                        <div className="form-group">
                            <label htmlFor="newUserEmail" id="emailLabel">Email</label>
                            <input onChange={this.changeInput} type="email" className="form-control" id="newUserEmail"
                                   placeholder="newUser@gmail.com" required=""/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="newUserUsername" id="usernameLabel">Никнейм</label>
                            <input onChange={this.changeInput} type="text" className="form-control" id="newUserUsername"
                                   placeholder="bestWorker2018" required=""/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="newUserDate" id="dateLabel">Дата рождения</label>
                            <input onChange={this.changeInput} value={this.state.newUserDate} type="text"
                                   className="form-control" id="newUserDate"
                                   placeholder="01/01/2018" required=""/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="newUserRole" id="roleLabel">Роль</label>
                            <select className={'form-control'} id={'newUserRole'} value={this.state.newUserRole}
                                    onChange={this.changeInput}>
                                <option value={'ROLE_ADMIN'}>Администратор</option>
                                <option value={'ROLE_DISPATCHER'}>Диспетчер</option>
                                <option value={'ROLE_MANAGER'}>Менеджер</option>
                                <option value={'ROLE_DRIVER'}>Водитель</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="newUserPassword" id="passwordLabel">Пароль</label>
                            <input onChange={this.changeInput} type="password" className="form-control"
                                   id="newUserPassword" placeholder="qwerty" required=""/>
                        </div>
                        <a onClick={this.saveNewUser} className="btn btn-success btn_fullsize">Сохранить</a>
                    </div>
                </form>
            </div>
        </div>;
    }


}