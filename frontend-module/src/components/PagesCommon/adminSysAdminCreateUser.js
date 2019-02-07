import React, {Component} from 'react';
import CommonUtil from "../commonUtil/commontUtil";
import ValidationUtil from "../commonUtil/validationUtil";
import {NotificationManager} from "react-notifications";
import apiRequest from "../../util/ApiRequest";

export default class CreateUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newUserEmail: '',
            newUserUsername: '',
            newUserPassword: '',
            newUserRole: 'ROLE_ADMIN',
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
        }
    }

    changeInput = (event) => {
        this.setState({
            [event.target.id]: [event.target.value]
        });
        console.log(this.state)
    };

    validateUserForm = () => {
        let usernameVal = ValidationUtil.validateStringForLength(this.state.newUserUsername, 5, 20);
        let nameVal = ValidationUtil.validateStringForLength(this.state.newUserFirstName, 2, 50);
        let dateVal = ValidationUtil.validateDateForNotThisYear(this.state.newUserDate);
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
        if (!dateVal) document.getElementById('error-date-span').innerText = "Неправильная дата(дд/мм/гггг)";
        else document.getElementById('error-date-span').innerText = '';
        if ((Array.isArray(this.state.newUserRole) ? this.state.newUserRole.join('') === 'ROLE_DRIVER' : false) && this.state.newUserPassport === '') {
            console.log(this.state.newUserPassport);
            document.getElementById('error-passport-span').innerText = "Неправильные данные";
            return false;
        }
        console.log(this.state);
        return usernameVal && nameVal && surnameVal && passwordVal && emailVal && dateVal;
    };

    saveNewUser = () => {
        let ref = this;
        if (this.validateUserForm()) {
            let formData = new FormData();
            formData.append('username', this.state.newUserUsername);
            formData.append('email', this.state.newUserEmail);
            formData.append('userRole', this.state.newUserRole);
            formData.append('password', this.state.newUserPassword);
            formData.append('birthDay', this.state.newUserDate);
            formData.append('firstName', this.state.newUserFirstName);
            formData.append('secondName', this.state.newUserSecondName);
            formData.append('thirdName', this.state.newUserThirdName);
            formData.append('country', this.state.newUserCountry);
            formData.append('city', this.state.newUserCity);
            formData.append('street', this.state.newUserStreet);
            formData.append('houseNumber', this.state.newUserHouseNumber);
            formData.append('flatNumber', this.state.newUserFlatNumber);
            if (this.state.newUserPassport !== '') {
                formData.append('passport', this.state.newUserPassport)
            }
            fetch('/api/saveUser', {
                method: 'POST',
                body: formData,
                headers: {'authorization': localStorage.getItem('authorization')}
            }).then(response => {
                if (response.status > 199 && response.status < 300) {
                    return response.json();
                }
            }).then(data=>{
                if (data.error === undefined) {
                    document.getElementById('message-span').innerText = 'Сохранено';
                    document.getElementById('from-content').style.display = 'none';
                    ref.props.updateList();
                    setTimeout(function () {
                        // document.getElementById('add-user-form').style.display = 'none';
                        document.getElementById('message-span').innerText = '';
                        document.getElementById('from-content').style.display = '';
                        document.getElementById('newUserEmail').value = '';
                        document.getElementById('newUserPassword').value = '';
                        document.getElementById('newUserUsername').value = '';
                        // document.getElementById('newUserRole').value = 'ROLE_ADMIN';
                        document.getElementById('newUserDate').value = CommonUtil.getCorrectDateFromLong(new Date().getTime());
                        document.getElementById('newUserFirstName').value = '';
                        document.getElementById('newUserSecondName').value = '';
                        document.getElementById('newUserThirdName').value = '';
                        document.getElementById('newUserCountry').value = '';
                        document.getElementById('newUserCity').value = '';
                        document.getElementById('newUserStreet').value = '';
                        document.getElementById('newUserHouseNumber').value = '';
                        document.getElementById('newUserFlatNumber').value = '';
                        document.getElementById('error-form-span').innerText = '';
                    }, 1000);
                } else {
                    if (data.error === 'user with such username already exists'){
                        document.getElementById('error-form-span').innerText = 'Пользователь с таким никнеймом уже существует';
                    }else{
                        document.getElementById('error-form-span').innerText = data.error;
                    }
                }
            }).catch(()=>{
                NotificationManager.error('Ошибка');
            });
        }
    };

    render() {
        return (
            <div>
                <form className="superuserform_newaccountform grey_form" >
                    <span id="message-span"/>
                    <div id={'from-content'}>
                        <span className={'error-span'} id={'error-form-span'}/>
                        <div className="row">
                            <div className="col-md-6 ">
                                    <label htmlFor="newUserUsername" id="usernameLabel">Никнейм*</label>
                                    <input onChange={this.changeInput} type="text" className="form-control" id="newUserUsername"
                                           placeholder="bestWorker2018" required=""/>
                                    <span className="error-span" id="error-username-span"/>
                            </div>
                            <div className="col-md-6 ">
                                    <label htmlFor="newUserPassword" id="passwordLabel">Пароль*</label>
                                    <input onChange={this.changeInput} type="password" className="form-control"
                                           id="newUserPassword" placeholder="qwerty" required=""/>
                                    <span className="error-span" id="error-password-span"/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <label htmlFor="newUserSecondName" id="newUserSecondNameLabel">ФИО*</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <input onChange={this.changeInput} type="text" className="form-control"
                                       placeholder="Фамилия" id="newUserSecondName"/>
                            </div>
                            <div className="col-md-4">
                                <input onChange={this.changeInput} type="text"
                                       className="form-control" placeholder="Имя"
                                       id="newUserFirstName"/>
                            </div>
                            <div className="col-md-4">
                                <input onChange={this.changeInput} type="text"
                                       className="form-control" placeholder="Отчество"
                                       id="newUserThirdName"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <label htmlFor="newUserAddress" id="userAddressLabel">Адрес</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <input onChange={this.changeInput} type="text" className="form-control"
                                       placeholder="Страна" id="newUserCountry"/>
                            </div>
                            <div className="col-md-6">
                                <input onChange={this.changeInput} type="text"
                                       className="form-control" placeholder="Город"
                                       id="newUserCity"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <input onChange={this.changeInput} type="text" className="form-control"
                                       placeholder="Улица" id="newUserStreet"/>
                            </div>
                            <div className="col-md-4">
                                <input onChange={this.changeInput} type="text"
                                       className="form-control" placeholder="Дом"
                                       id="newUserHouseNumber"/>
                            </div>
                            <div className="col-md-4">
                                <input onChange={this.changeInput} type="text"
                                       className="form-control" placeholder="Квартира"
                                       id="newUserFlatNumber"/>
                            </div>
                        </div>
                        <div className="row">

                            <div className="col-md-4">
                                <label htmlFor="newUserEmail" id="emailLabel">Email*</label>
                                <input onChange={this.changeInput} type="email" className="form-control" id="newUserEmail"
                                       placeholder="newUser@gmail.com" required=""/>
                                <span className="error-span" id="error-email-span"/>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="newUserRole" id="roleLabel">Роль*</label>
                                <select className={'form-control'} id={'newUserRole'} value={this.state.newUserRole}
                                        onChange={this.changeInput}>
                                    <option value={'ROLE_ADMIN'}>Администратор</option>
                                    <option value={'ROLE_DISPATCHER'}>Диспетчер</option>
                                    <option value={'ROLE_MANAGER'}>Менеджер</option>
                                    <option value={'ROLE_DRIVER'}>Водитель</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                    <label htmlFor="newUserDate" id="dateLabel">Д.р.*</label>
                                    <input onChange={this.changeInput} value={this.state.newUserDate} type="text"
                                           className="form-control" id="newUserDate"
                                           placeholder="01/01/2018" required=""/>
                                    <span className="error-span" id="error-date-span"/>
                            </div>
                        </div>
                        <div className="row col-md-6">
                            {
                                this.state.newUserRole === 'ROLE_DRIVER' || (Array.isArray(this.state.newUserRole) ? this.state.newUserRole.includes('ROLE_DRIVER') : false) ? (
                                    <div className="form-group">
                                        <label htmlFor="newUserPassport" id="newUserPassport">Номер паспорта *</label>
                                        <input onChange={this.changeInput} value={this.state.newUserPassport} type="text"
                                               className="form-control" id="newUserPassport" required=""/>
                                        <span className="error-span" id="error-passport-span"/>
                                    </div>
                                ) : <div/>
                            }
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <a onClick={this.saveNewUser} className="btn btn-success btn_fullsize">Сохранить</a>
                            </div>
                        </div>



                    </div>
                </form>
            </div>
        );
    }


}