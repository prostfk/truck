import React, {Component} from 'react';
import CommonUtil from "../commonUtil/commontUtil";

import { withBaseIcon } from 'react-icons-kit'
import {remove} from 'react-icons-kit/fa/remove'
import {edit} from 'react-icons-kit/fa/edit'

const SideIconContainer = withBaseIcon({ size: 24, style: {color: '#50505d'}});
const RedIconContainer = withBaseIcon({ size: 24, style: {color: '#8d2a27'}});
export const RemoveIcon = () => <RedIconContainer icon={remove}/>
export const EditIcon = () => <SideIconContainer icon={edit}/>

export default class AutoList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            autos: [],
            newautoEmail: '',
        };
        this.fetchToAutos();
    }

    fetchToAutos = () => {
        fetch('http://localhost:8080/api/autos', {headers: {'Auth-token': localStorage.getItem('Auth-token')}}).then(response => {
            if (response.status === 403 || response.status === 500) {
                throw new Error('Ошибка доступа');
            } else {
                return response.json();
            }
        }).then(data => {
            this.setState({
                autos: data
            })
        })
    };

    changeInput = (event) => {
        this.setState({
            [event.target.id]: [event.target.value]
        });
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

    saveNewAuto = () => {
        let formData = new FormData();
        formData.append('autoname',this.state.newUserUsername);
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

    renderAuto = (auto) => {
        return <div className={'row table_row'}>
            <div className={'col-md-1'}>{auto.id}</div>
            <div className={'col-md-3'}>{auto.name}</div>
            <div className={'col-md-2'}>{auto.carNumber}</div>
            <div className={'col-md-2'}>{auto.type}</div>
            <div className={'col-md-2'}>{auto.fuelConsumption}</div>
            <div className={'col-md-1'}>
                <a href={`/auto/${auto.id}/edit`}><EditIcon></EditIcon></a>
             </div>
            <div className={'col-md-1'}>
                <a href={`/auto/${auto.id}/remove`}><RemoveIcon></RemoveIcon></a>
             </div>
        </div>
    };

    render() {
        return (
            <div className={'row'}>
                <div className="offset-md-1 col-md-6 superuserform_companylist">
                    <div className="row table_header">
                        <div className="col-md-2">Id</div>
                        <div className="col-md-2">Название</div>
                        <div className="col-md-2">Номер</div>
                        <div className="col-md-2">Тип</div>
                        <div className="col-md-2">Расход на 100км</div>
                        <div className="col-md-2"></div>
                    </div>
                    {
                        this.state.autos.map((auto) => {
                            return this.renderAuto(auto);
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

                <div className="offset-md-1 col-md-3" id={'add-auto-form'}>
                    <form className="superuserform_newaccountform grey_form">
                        <span id="message-span"/>
                        <div id={'from-content'}>
                            <h5>Регистрация нового авто</h5>
                            <span className={'error-span'} id={'error-form-span'}/>
                            <div className="form-group">
                                <label htmlFor="newUserEmail" id="emailLabel">Email</label>
                                <input onChange={this.changeInput} type="email" className="form-control" id="newUserEmail"
                                       placeholder="newUser@gmail.com" required=""/>
                            </div>
                            <a onClick={this.saveNewAuto} className="btn btn-success btn_fullsize">Сохранить</a>
                        </div>
                    </form>
                </div>
            </div>
        );
    }


}