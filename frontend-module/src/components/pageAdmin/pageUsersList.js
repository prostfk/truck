import React, {Component} from 'react';
import CommonUtil from "../commonUtil/commontUtil";
import Pagination from "react-js-pagination";
import ValidationUtil from "../commonUtil/validationUtil";

import {EditIcon} from "./pageAutoList";
import {edit} from 'react-icons-kit/fa/edit'

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
            totalElements:0,
            currentPage:1,
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


    validateUserForm = () => {
        let usernameVal = ValidationUtil.validateStringForLength(this.state.newUserUsername, 5, 20);
        let nameVal = ValidationUtil.validateStringForLength(this.state.newUserFirstName, 2, 50);
        let surnameVal = ValidationUtil.validateStringForLength(this.state.newUserSecondName, 4, 50);
        let passwordVal = ValidationUtil.validateStringForLength(this.state.newUserPassword, 6, 20);
        let emailVal = ValidationUtil.validateEmailForPattern(this.state.newUserEmail);
        if (!usernameVal) document.getElementById('error-username-span').innerText = "Никнейм должен быть от 5 до 20 символов";
        else document.getElementById('error-username-span').innerText = '';
        if (!nameVal) document.getElementById('newUserFirstName').style.border = '1px solid red';//document.getElementById('error-name-span').innerText = "Имя должно быть от 2 до 20 символов";
        else document.getElementById('newUserFirstName').style.border = '';//document.getElementById('error-name-span').innerText = '';
        if (!surnameVal) document.getElementById('newUserSecondName').style.border = '1px solid red'; //document.getElementById('error-surname-span').innerText = "Фамилия должна быть от 4 до 20 символов";
        else document.getElementById('newUserSecondName').style.border = '';//document.getElementById('error-surname-span').innerText = '';
        if (!usernameVal) document.getElementById('error-password-span').innerText = "Пароль должен быть от 6 до 20 символов";
        else document.getElementById('error-password-span').innerText = '';
        if (!emailVal) document.getElementById('error-email-span').innerText = "Неправильная почта";
        else document.getElementById('error-email-span').innerText = '';
        if ((Array.isArray(this.state.newUserRole)? this.state.newUserRole.join('') === 'ROLE_DRIVER': false) && this.state.newUserPassport === ''){
            console.log(this.state.newUserPassport);

            document.getElementById('error-passport-span').innerText = "Неправильные данные";
            return false;
        }
        console.log(this.state);
        return usernameVal && nameVal && surnameVal && passwordVal;
    };


 getUsersRequest = (pageid=1) => {
        fetch('http://localhost:8080/api/users?page='+pageid, {headers: {'Auth-token': localStorage.getItem('Auth-token')}
        }).then(response => {
            if (response.status === 403 || response.status === 500) {
                throw new Error('Ошибка доступа');
            } else {
                return response.json();
            }
        }).then(data => {
            let gettedusers =data.content;
            console.log(gettedusers);
            this.setState({
                users: gettedusers,
                totalElements:data.totalElements,
                currentPage:++data.number
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
        if(!user) return;
        user.reg_date[6]=user.reg_date[6]/1000000;
        let timezoneoffset = new Date().getTimezoneOffset();

        let dateofreg = user.reg_date==null?"-":moment.utc(user.reg_date);
        let localTime = moment(dateofreg).utcOffset(-timezoneoffset).format('YYYY-MM-DD HH:mm:ss');


        return <div className={'row table_row'}>
            <div className={'col-md-1'}>{user.id}</div>
            <div className={'col-md-3'}>{user.username}</div>
            <div className={'col-md-2'}>{this.russianRole(user.userRole)}</div>
            <div className={'col-md-3'}>{localTime}</div>
            <div className={'col-md-2'}>{user.email}</div>
            <div className={'col-md-1'}><a href={`/user/${user.id}/edit`}><EditIcon></EditIcon></a>
            </div>
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
        if (this.validateUserForm()){
            let formData = new FormData();
            formData.append('username',this.state.newUserUsername);
            formData.append('email',this.state.newUserEmail);
            formData.append('userRole',this.state.newUserRole);
            formData.append('password',this.state.newUserPassword);
            formData.append('birthDay', this.state.newUserDate);
            formData.append('firstName', this.state.newUserFirstName);
            formData.append('secondName', this.state.newUserSecondName);
            formData.append('thirdName', this.state.newUserThirdName);
            formData.append('country', this.state.newUserCountry);
            formData.append('city', this.state.newUserCity);
            formData.append('street', this.state.newUserStreet);
            formData.append('houseNumber', this.state.newUserHouseNumber);
            formData.append('flatNumber', this.state.newUserFlatNumber);
            if (this.state.newUserPassport !== ''){
                formData.append('passport', this.state.newUserPassport)
            }
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
                        document.getElementById('newUserFirstName').value = '';
                        document.getElementById('newUserSecondName').value = '';
                        document.getElementById('newUserThirdName').value = '';
                        document.getElementById('newUserCountry').value = '';
                        document.getElementById('newUserCity').value = '';
                        document.getElementById('newUserStreet').value = '';
                        document.getElementById('newUserHouseNumber').value = '';
                        document.getElementById('newUserFlatNumber').value = '';

                    },2000);
                }else{
                    document.getElementById('error-form-span').innerText = data.error;
                }
            })
        }
    };

    render() {
        return <div className={'row'}>
            <div className="offset-md-1 col-md-6 superuserform_companylist">
                <div className="row table_header">
                    <div className="col-md-1">Id</div>
                    <div className="col-md-3">Никнейм</div>
                    <div className="col-md-2">Роль</div>
                    <div className="col-md-3">Дата регистрации</div>
                    <div className="col-md-2">Почта</div>
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
                    <form className="superuserform_newaccountform grey_form">
                        <span id="message-span"/>
                        <div id={'from-content'}>
                            <h6>Регистрация нового пользователя</h6>
                            <span className={'error-span'} id={'error-form-span'}/>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="newUserUsername" id="usernameLabel">Никнейм*</label>
                                        <input onChange={this.changeInput} type="text" className="form-control" id="newUserUsername"
                                               placeholder="bestWorker2018" required=""/>
                                        <span className="error-span" id="error-username-span"/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="newUserPassword" id="passwordLabel">Пароль*</label>
                                        <input onChange={this.changeInput} type="password" className="form-control"
                                               id="newUserPassword" placeholder="qwerty" required=""/>
                                        <span className="error-span" id="error-password-span"/>
                                    </div>
                                </div>
                            </div>


                            <div className="row">
                                <div className="col-md-4">
                                    <input onChange={this.changeInput} type="text" className="form-control" placeholder="Имя" id="newUserFirstName" />
                                </div>
                                <div className="col-md-4">
                                    <input onChange={this.changeInput} type="text" className="form-control" placeholder="Фамилия" id="newUserSecondName" />
                                </div>
                                <div className="col-md-4">
                                    <input onChange={this.changeInput} type="text" className="form-control" placeholder="Отчество" id="newUserThirdName" />
                                </div>
                            </div>
                            {/*<div className="form-group">*/}
                                {/*<label htmlFor="newUserSecondName" id="userSecondNameLabel">Фамилия*</label>*/}
                                {/*<input onChange={this.changeInput} type="text" className="form-control" id="newUserSecondName" placeholder={'Фамилия'} required=""/>*/}
                                {/*<span className="error-span" id="error-surname-span"/>*/}
                            {/*</div>*/}
                            {/*<div className="form-group">*/}
                                {/*<label htmlFor="newUserFirstName" id="userFirstNameLabel">Имя*</label>*/}
                                {/*<input onChange={this.changeInput} type="text" className="form-control" placeholder={'Имя'} id="newUserFirstName"/>*/}
                                {/*<span className="error-span" id="error-name-span"/>*/}
                            {/*</div>*/}
                            {/*<div className="form-group">*/}
                                {/*<label htmlFor="newUserThirdName" id="userThirdNameLabel">Отчество</label>*/}
                                {/*<input onChange={this.changeInput} type="text" className="form-control" placeholder={'Отчество'} id="newUserThirdName" />*/}
                            {/*</div>*/}

                            <div className="row">
                                <div className="col-md-6">
                                    <label htmlFor="newUserEmail" id="emailLabel">Email</label>
                                    <input onChange={this.changeInput} type="email" className="form-control" id="newUserEmail"
                                           placeholder="newUser@gmail.com" required=""/>
                                    <span className="error-span" id="error-email-span"/>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="newUserRole" id="roleLabel">Роль</label>
                                    <select className={'form-control'} id={'newUserRole'} value={this.state.newUserRole} onChange={this.changeInput}>
                                        <option value={'ROLE_ADMIN'}>Администратор</option>
                                        <option value={'ROLE_DISPATCHER'}>Диспетчер</option>
                                        <option value={'ROLE_MANAGER'}>Менеджер</option>
                                        <option value={'ROLE_DRIVER'}>Водитель</option>
                                    </select></div>
                            </div>
                            <label>Адрес</label>
                            <div className="row">

                                <div className="col-md-6">
                                    <input onChange={this.changeInput} type="text" className="form-control" placeholder="Страна" id="newUserCountry" />
                                </div>
                                <div className="col-md-6">
                                    <input onChange={this.changeInput} type="text" className="form-control" placeholder="Город" id="newUserCity" />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-12 row">
                                    <input onChange={this.changeInput} type="text" className="form-control col-md-4" placeholder="Улица" id="newUserStreet" />
                                    <input onChange={this.changeInput} type="text" className="form-control col-md-3 offset-md-1" placeholder="Дом" id="newUserHouseNumber" />
                                    <input onChange={this.changeInput} type="text" className="form-control col-md-3 offset-md-1" placeholder="Квартира" id="newUserFlatNumber" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="newUserDate" id="dateLabel">Дата рождения</label>
                                <input onChange={this.changeInput} value={this.state.newUserDate} type="text" className="form-control" id="newUserDate"
                                       placeholder="01/01/2018" required=""/>
                            </div>

                            {
                                this.state.newUserRole === 'ROLE_DRIVER' || (Array.isArray(this.state.newUserRole) ? this.state.newUserRole.includes('ROLE_DRIVER') : false)? (
                                    <div className="form-group">
                                        <label htmlFor="newUserPassport" id="newUserPassport">Номер паспорта *</label>
                                        <input onChange={this.changeInput} value={this.state.newUserPassport} type="text" className="form-control" id="newUserPassport" required=""/>
                                        <span className="error-span" id="error-passport-span"/>
                                    </div>
                                ) : <div/>


                            }
                            {/*<div className="form-group">*/}
                                {/*<label htmlFor="newUserPassport" id="newUserPassport">Номер паспорта</label>*/}
                                {/*<input onChange={this.changeInput} value={this.state.newUserPassport} type="text" className="form-control" id="newUserPassport" required=""/>*/}
                                {/*<span className="error-span" id="error-passport-span"/>*/}
                            {/*</div>*/}
                            <a onClick={this.saveNewUser} className="btn btn-success btn_fullsize">Сохранить</a>
                        </div>
                    </form>
            </div>
        </div>
    }


}