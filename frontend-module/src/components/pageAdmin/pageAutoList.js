import React, {Component} from 'react';

import {withBaseIcon} from 'react-icons-kit'
import {remove} from 'react-icons-kit/fa/remove'
import {edit} from 'react-icons-kit/fa/edit'
import ModalAcceptDelete from "./modalAcceptDelete";
import ModalComponentEditAuto from "./modalComponentEditAuto";
import ValidationUtil from "../commonUtil/validationUtil";
import Pagination from "react-js-pagination";
import {NotificationManager} from "react-notifications";
import apiRequest from "../../util/ApiRequest";

const SideIconContainer = withBaseIcon({size: 24, style: {color: '#50505d'}});
const RedIconContainer = withBaseIcon({size: 24, style: {color: '#8d2a27'}});
export const RemoveIcon = () => <RedIconContainer icon={remove}/>;
export const EditIcon = () => <SideIconContainer icon={edit}/>;

export default class AutoList extends Component {

    constructor(props) {
        super(props);
        this.submitDelete = this.submitDelete.bind(this);
        this.submitEdit = this.submitEdit.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.state = {
            autos: [],
            newAutoName: '',
            newAutoNumber: '',
            newAutoType: '',
            newAutoFuelConsumption: '',
            totalElements: 0,
            currentPage: 1,
            number: 0
        };
        this.forceUpdateHandler();
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
        return nameVal && numberVal && typeVal && fuelVal;
    };

    forceUpdateHandler(pageId = 1) {
        const refThis = this;
        apiRequest(`/api/autos?page=${pageId}`).then(function (result) {
            refThis.setState({
                autos: result.content,
                totalElements: result.totalElements,
                currentPage: ++result.number
            })
        }).catch(() => {
            NotificationManager.error('Ошибка доступа');
        });
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
            apiRequest('/api/saveAuto/','post',formData).then(() => {
                this.setState({
                    newAutoFuelConsumption: "",
                    newAutoType: "",
                    newAutoName: "",
                    newAutoNumber: ""
                });
                this.forceUpdateHandler();
            }).catch(() => {
                NotificationManager.error('Ошибка доступа');
            });
        }
    };

    handlePageChange(pageNumber) {
        this.forceUpdateHandler(pageNumber);
        this.setState({currentPage: pageNumber});
    }

    renderModalAuto(auto) {
        return <ModalComponentEditAuto key={auto.id} clickFunc={this.submitEdit}
                                       className={"table_button bg-secondary text-white"} autoId={auto.id}
                                       autoName={auto.name} autoCarNumber={auto.carNumber} autoType={auto.type}
                                       autoFuelConsumption={auto.fuelConsumption}/>
    }


    renderAuto = (auto) => {
        return <div className={'row table_row animated fadeInUp'} key={auto.id}>
            <div className={'col-md-1'}>{auto.id}</div>
            <div className={'col-md-3'}>{auto.name}</div>
            <div className={'col-md-2'}>{auto.carNumber}</div>
            <div className={'col-md-2'}>{auto.type}</div>
            <div className={'col-md-2'}>{auto.fuelConsumption}</div>
            <div className={'col-md-1'}>
                <div className={"col-md-2"}>
                    {this.renderModalAuto(auto)}
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
        apiRequest('/api/auto','delete',autoId).then(function (result) {
            if (result) {
                ref.setState({autos: result})
            }
        }).catch(() => {
            NotificationManager.error('Ошибка доступа');
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
        apiRequest('/api/auto/edit', 'put',formData).then(data => {
            if (data.error === undefined) {
                refThis.state.autos.find((element, index, array) => {
                    if (element.id === data.id) {
                        const newAutos = refThis.state.autos;
                        newAutos[index] = data;
                        refThis.setState({autos: newAutos});
                    }
                });
            } else {
                NotificationManager.error('Ошибка, попробуйте еще раз');
            }
        }).catch(() => {
            NotificationManager.error('Ошибка доступа');
        });
    }

    render() {
        return (
            <div className={'row'}>
                <div className="offset-md-1 col-md-6 superuserform_companylist">
                    <div className="row table_header animated fadeIn">
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

                <div className="offset-md-1 col-md-3" id={'add-auto-form'}>
                    <form className="superuserform_newaccountform grey_form  animated fadeIn">
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