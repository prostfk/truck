import React, {Component} from 'react';
import CommonUtil from "../commonUtil/commontUtil";
import {NotificationManager} from "react-notifications";

export default class EditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            birthDay: '',
            userRole: '',
            id: '',
            secondName: '',
            firstName: '',
            thirdName: '',
            country: '',
            city: '',
            street: '',
            houseNumber: '',
            flatNumber: ''
        };
        this.initForm();
    }

    changeInput = (event) => {
        this.setState({
            [event.target.id]: [event.target.value]
        });
    };

    initForm = () => {
        let link = window.location.href.split("/");
        let id = link[link.length - 2];
        fetch(`http://localhost:8080/api/user/${id}`, {headers: {'Auth-token': localStorage.getItem('Auth-token')}}).then(response => {
            return response.json()
        }).then(data => {
            this.setState({
                username: data.username,
                email: data.email,
                birthDay: CommonUtil.getCorrectDateFromLong(data.birthDay),
                userRole: data.userRole,
                id: data.id,
                secondName: data.secondName,
                firstName: data.firstName,
                thirdName: data.thirdName,
                country: data.country,
                city: data.city,
                street: data.street,
                houseNumber: data.houseNumber,
                flatNumber: data.flatNumber
            });
        }).catch(() => {
            NotificationManager.error('Ошибка доступа');
        });
    };

    submitChanges = () => {
        let formData = new FormData();
        formData.append("id", this.state.id);
        formData.append("username", this.state.username);
        formData.append("email", this.state.email);
        formData.append("password", this.state.password);
        formData.append("birthDay", this.state.birthDay);
        formData.append("userRole", this.state.userRole);
        formData.append("firstName", this.state.firstName);
        formData.append("secondName", this.state.secondName);
        formData.append("thirdName", this.state.thirdName);
        formData.append("country", this.state.country);
        formData.append("city", this.state.city);
        formData.append("street", this.state.street);
        formData.append("houseNumber", this.state.houseNumber);
        formData.append("flatNumber", this.state.flatNumber);
        fetch('http://localhost:8080/api/updateUser', {
            method: "POST",
            body: formData,
            headers: {'Auth-token': localStorage.getItem('Auth-token')}
        }).then(response => response.json()).then(data => {
            console.log(data);
            if (data.error === undefined) {
                this.props.history.push('/usersList')
            } else {
                if (data.error === 'user with such username already exists') {
                    document.getElementById('error-form-span').innerText = 'Такой никнейм уже существует';
                }
                document.getElementById('error-form-span').innerText = data.error;
            }
        }).catch(() => {
            NotificationManager.error('Ошибка доступа');
        });

    };


    render() {
        return (
            <div className={"col-md-8 offset-md-2 superuserform_companylist animated fadeIn"}>
                <div className="form-group row">
                    <h3>Изменение пользователя</h3>
                </div>
                <div className="form-group row">
                    <span className="error-span" id={'error-form-span'}/>
                </div>
                <div className="form-group row">
                    <label htmlFor="username" className="col-2 col-form-label">Никнейм</label>
                    <div className="col-10">
                        <input className="form-control" value={this.state.username} onChange={this.changeInput}
                               type="text" id="username"/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="secondName" className="col-2 col-form-label">Фамилия*</label>
                    <div className="col-10">
                        <input className="form-control" value={this.state.secondName} onChange={this.changeInput}
                               type="text" id="secondName" required={true}/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="firstName" className="col-2 col-form-label">Имя</label>
                    <div className="col-10">
                        <input className="form-control" value={this.state.firstName} onChange={this.changeInput}
                               type="text" id="firstName"/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="thirdName" className="col-2 col-form-label">Отчество</label>
                    <div className="col-10">
                        <input className="form-control" value={this.state.thirdName} onChange={this.changeInput}
                               type="text" id="thirdName"/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="address" className="col-2 col-form-label">Адрес</label>
                    <div className="col-10 row" id="address">
                        <div className="col-2">
                            <input className="form-control" value={this.state.country} onChange={this.changeInput}
                                   placeholder="Страна" type="text" id="country"/>
                        </div>
                        <div className="col-3">
                            <input className="form-control" value={this.state.city} onChange={this.changeInput}
                                   placeholder="Город" type="text" id="city"/>
                        </div>
                        <div className="col-3">
                            <input className="form-control" value={this.state.street} onChange={this.changeInput}
                                   placeholder="Улица" type="text" id="street"/>
                        </div>
                        <div className="col-2">
                            <input className="form-control" value={this.state.houseNumber} onChange={this.changeInput}
                                   placeholder="Дом" type="text" id="houseNumber"/>
                        </div>
                        <div className="col-2">
                            <input className="form-control" value={this.state.flatNumber} onChange={this.changeInput}
                                   placeholder="Квартира" type="text" id="flatNumber"/>
                        </div>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="email" className="col-2 col-form-label">Email</label>
                    <div className="col-10">
                        <input className="form-control" value={this.state.email} onChange={this.changeInput}
                               type="email" id="email"/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="birthDate" className="col-2 col-form-label">Дата рождения</label>
                    <div className="col-10">
                        <input className="form-control" value={this.state.birthDay} onChange={this.changeInput}
                               placeholder={'01/01/2018'} type="text" id="birthDay"/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="userRole" className="col-2 col-form-label">Роль</label>
                    <div className="col-10">
                        <select className={'form-control'} id={'userRole'} value={this.state.userRole}
                                onChange={this.changeInput}>
                            <option value={'ROLE_ADMIN'}>Администратор</option>
                            <option value={'ROLE_DISPATCHER'}>Диспетчер</option>
                            <option value={'ROLE_MANAGER'}>Менеджер</option>
                            <option value={'ROLE_DRIVER'}>Водитель</option>
                        </select>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="password" className="col-2 col-form-label">Password</label>
                    <div className="col-10">
                        <input className="form-control" value={this.state.password} onChange={this.changeInput}
                               type="password" id="password"/>
                    </div>
                </div>
                <div className="form-group row">
                    <button className={'btn btn-primary'} onClick={this.submitChanges}>Сохранить</button>
                </div>

            </div>
        );
    }

}