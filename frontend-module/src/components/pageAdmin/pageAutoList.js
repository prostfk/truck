import React, {Component} from 'react';
import CommonUtil from "../commonUtil/commontUtil";

import {withBaseIcon} from 'react-icons-kit'
import {remove} from 'react-icons-kit/fa/remove'
import {edit} from 'react-icons-kit/fa/edit'
import ModalAcceptDelete from "./modalAcceptDelete";
import ModalComponentEditAuto from "./modalComponentEditAuto";
import ValidationUtil from "../commonUtil/validationUtil";

const SideIconContainer = withBaseIcon({size: 24, style: {color: '#50505d'}});
const RedIconContainer = withBaseIcon({size: 24, style: {color: '#8d2a27'}});
export const RemoveIcon = () => <RedIconContainer icon={remove}/>
export const EditIcon = () => <SideIconContainer icon={edit}/>

export default class AutoList extends Component {

    constructor(props) {
        super(props);
        this.submitDelete = this.submitDelete.bind(this);
        this.submitEdit = this.submitEdit.bind(this);
        this.state = {
            autos: [],
            newAutoName: '',
            newAutoNumber: '',
            newAutoType: '',
            newAutoFuelConsumption: '',
        };
        this.fetchToAutos();
    }

    validateAuto = () => {
        let nameVal = ValidationUtil.validateStringForLength(this.state.newAutoName, 3, 45);
        let numberVal = ValidationUtil.validateStringForLength(this.state.newAutoNumber, 5, 45);
        let typeVal = ValidationUtil.validateStringForLength(this.state.newAutoType, 3, 25);
        let fuelVal = ValidationUtil.validateNumberInTheRage(this.state.newAutoFuelConsumption, 3, 150);
        if (!nameVal) document.getElementById('error-name-span').innerText = 'Название должно быть от 3 до 45 символов';
        else document.getElementById('error-name-span').innerText = '';
        if (!numberVal) document.getElementById('error-number-span').innerText = 'Номер должен быть от 5 до 45 символов';
        else document.getElementById('error-number-span').innerText = '';
        if (!typeVal) document.getElementById('error-type-span').innerText = 'Тип должен быть от 3 до 25 символов';
        else document.getElementById('error-type-span').innerText = '';
        if (!fuelVal) document.getElementById('error-fuel-span').innerText = 'Расход должен быть от 3 до 150 литров';
        else document.getElementById('error-fuel-span').innerText = '';
        console.log(`Number: ${numberVal}, Name: ${nameVal}, Type: ${typeVal}, Fuel: ${fuelVal}`);
        return nameVal && numberVal && typeVal && fuelVal;
    };

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

    saveNewAuto = () => {
        if (this.validateAuto()) {
            let formData = new FormData();
            formData.append('name', this.state.newAutoName);
            formData.append('type', this.state.newAutoType);
            formData.append('fuelConsumption', this.state.newAutoFuelConsumption);
            formData.append('carNumber', this.state.newAutoNumber);
            fetch('http://localhost:8080/api/saveAuto/', {
                method: "POST",
                body: formData,
                headers: {'Auth-token': localStorage.getItem('Auth-token')}
            }).then(response => {
                console.log(response);
                return response.json();
            }).then(data => {
                console.log(data);
                this.setState({
                    newAutoFuelConsumption: "",
                    newAutoType: "",
                    newAutoName: "",
                    newAutoNumber: ""
                });
                this.forceUpdateHandler();
            });
        }
    };

    forceUpdateHandler() {
        const refthis = this;
        fetch('http://localhost:8080/api/autos/', {
            method: "get",
            headers: {'Auth-token': localStorage.getItem("Auth-token")}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            refthis.setState({autos: result})
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
                <div className={"col-md-2"}>
                    <ModalComponentEditAuto clickfunc={this.submitEdit}
                                            className={"table_button bg-secondary text-white"} autoId={auto.id}
                                            autoName={auto.name} autoCarNumber={auto.carNumber} autoType={auto.type}
                                            autoFuelConsumption={auto.fuelConsumption}/>
                </div>
            </div>
            <div className={"col-md-1"}>
                <ModalAcceptDelete clickfunc={this.submitDelete} componentId={auto.id}
                                   headerText={"Вы действительно хотите удалить авто?"}
                                   bodyText={"Восстановить авто будет невозможно"}/>
            </div>
        </div>
    };

    submitDelete(autoId) {
        const ref = this;
        fetch('http://localhost:8080/api/auto/', {
            method: 'DELETE',
            body: autoId,
            headers: {'Auth-token': localStorage.getItem("Auth-token")}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            if (result) {
                ref.setState({autos: result})
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    submitEdit(autoId, autoName, autoCarNumber, autoType, autoFuelConsumption, event) {
        let refThis = this;
        let formData = new FormData();
        formData.append("id", autoId);
        formData.append("name", autoName);
        formData.append("carNumber", autoCarNumber);
        formData.append("type", autoType);
        formData.append("fuelConsumption", autoFuelConsumption);

        fetch('http://localhost:8080/api/auto/edit', {
            method: "PUT",
            body: formData,
            headers: {'Auth-token': localStorage.getItem('Auth-token')}
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
            if (data.error === undefined) {
                refThis.state.autos.find((element, index, array) => {
                    if (element.id === data.id) {
                        const newAutos = refThis.state.autos;
                        newAutos[index] = data;
                        refThis.setState({autos: newAutos});
                    }
                });
            } else {
                /* document.getElementById('error-form-span').innerText = data.error;*/
            }
        })
    }

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
                        <div className="col-md-2"/>
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
                            <div className="form-group">
                                <label htmlFor="newUserEmail" id="emailLabel">Название</label>
                                <input onChange={this.changeInput} type="text" className="form-control" id="newAutoName"
                                       placeholder="Mazda 1000" required="" value={this.state.newAutoName}/>
                                <span className="error-span" id="error-name-span"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="newUserEmail" id="emailLabel">Номер</label>
                                <input onChange={this.changeInput} type="text" className="form-control"
                                       id="newAutoNumber"
                                       placeholder="0000 AH-7" required="" value={this.state.newAutoNumber}/>
                                <span className="error-span" id="error-number-span"/>

                            </div>
                            <div className="form-group">
                                <label htmlFor="newUserEmail" id="emailLabel">Тип</label>
                                <input onChange={this.changeInput} type="text" className="form-control" id="newAutoType"
                                       placeholder="Крытый кузов" required="" value={this.state.newAutoType}/>
                                <span className="error-span" id="error-type-span"/>

                            </div>
                            <div className="form-group">
                                <label htmlFor="newUserEmail" id="emailLabel">Расход на 100км</label>
                                <input onChange={this.changeInput} type="text" className="form-control"
                                       id="newAutoFuelConsumption"
                                       placeholder="20" required="" value={this.state.newAutoFuelConsumption}/>
                                <span className="error-span" id="error-fuel-span"/>
                            </div>
                            <a onClick={this.saveNewAuto} className="btn btn-success btn_fullsize">Сохранить</a>
                        </div>
                    </form>
                </div>
            </div>
        );
    }


}