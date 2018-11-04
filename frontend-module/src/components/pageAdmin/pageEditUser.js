import React, {Component} from 'react';
import CommonUtil from "../commonUtil/commontUtil";

export default class EditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            birthDay: '',
            userRole: '',
            id: ''
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
        fetch(`http://localhost:8080/api/user/${id}`, {headers: {'Auth-token': sessionStorage.getItem('Auth-token')}}).then(response => {
            return response.json()
        }).then(data => {
            console.log(data);
            this.setState({
                username: data.username,
                email: data.email,
                birthDay: CommonUtil.getCorrectDateFromLong(data.birthDay),
                userRole: data.userRole,
                id: data.id
            });
        }).catch(err=>{
            throw new Error('Ошибка доступа')
        })
    };

    submitChanges = () => {
        let formData = new FormData();
        formData.append("id", this.state.id);
        formData.append("username", this.state.username);
        formData.append("email", this.state.email);
        formData.append("password", this.state.password);
        formData.append("birthDay", this.state.birthDay);
        formData.append("userRole", this.state.userRole);
        formData.forEach((v,k)=>{
            console.log(k + " - " + v);
        });
        fetch('http://localhost:8080/api/updateUser', {
            method: "POST",
            body: formData,
            headers: {'Auth-token': sessionStorage.getItem('Auth-token')}
        }).then(response=>response.json()).then(data=>{
            console.log(data);
            if (data.error === undefined){
                this.props.history.push('/usersList')
            }else{
                document.getElementById('error-form-span').innerText = data.error;
            }
        })

    };


    render() {
        return (
            <div className={"col-md-8 offset-md-2 superuserform_companylist"}>
                <div className="form-group row">
                    <h3>Изменение пользователя</h3>
                </div>
                <div className="form-group row">
                    <span className="error-span" id={'error-form-span'}/>
                </div>
                <div className="form-group row">
                    <label htmlFor="username" className="col-2 col-form-label">Никнейм</label>
                    <div className="col-10">
                        <input className="form-control" value={this.state.username} onChange={this.changeInput} type="text" id="username"/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="email" className="col-2 col-form-label">Email</label>
                    <div className="col-10">
                        <input className="form-control" value={this.state.email} onChange={this.changeInput} type="email" id="email"/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="birthDate" className="col-2 col-form-label">Дата рождения</label>
                    <div className="col-10">
                        <input className="form-control" value={this.state.birthDay} onChange={this.changeInput} placeholder={'01/01/2018'} type="text" id="birthDay"/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="userRole" className="col-2 col-form-label">Роль</label>
                    <div className="col-10">
                        <select className={'form-control'} id={'userRole'} value={this.state.userRole} onChange={this.changeInput}>
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
                        <input className="form-control" value={this.state.password} onChange={this.changeInput} type="password" id="password"/>
                    </div>
                </div>
                <div className="form-group row">
                    <button className={'btn btn-primary'} onClick={this.submitChanges}>Сохранить</button>
                </div>

            </div>
        );
    }

}