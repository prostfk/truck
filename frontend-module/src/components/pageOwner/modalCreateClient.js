import React, {Component} from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import ValidationUtil from "../commonUtil/validationUtil";
import {NotificationManager} from "react-notifications";

export default class ModalCreateClient extends Component {

    state = {
        modal: false,
        name: ''
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal,
            name: ''
        });
    };

    handleChangeReason = (event) => {
        this.setState({name: event.target.value});
    };

    validateClient = () => {
        return ValidationUtil.validateStringForLength(ValidationUtil.getStringFromUnknownObject(this.state.name),3, 39);
    };

    handleSubmit = (event) => {
        if (!this.validateClient()){
            return;
        }
        let refThis = this;
        let formData = new FormData();
        formData.append("name", ValidationUtil.getStringFromUnknownObject(this.state.name));
        fetch(`/api/createClient`, {
            method: "POST",
            body: formData,
            headers: {'Auth-token': localStorage.getItem("Auth-token")}
        }).then(function (response) {
            response.json().then(function (data) {
                console.log(data);
                if (data.error !== undefined) {
                    NotificationManager.error('Такое название уже существует');
                    document.getElementById('name-error-span').innerText = 'Такое название уже существует';
                }else{
                    NotificationManager.success('Добавлено');
                    document.getElementById('name-input').style.color = '';
                    document.getElementById('name-error-span').innerText = '';
                }
            })
        }).then(()=>{
            refThis.toggle();
        })


    };


    render() {
        return (
            <div className={'superuserform_newaccountform grey_form'}>
                <button className={'btn btn-success btn_fullsize'} onClick={this.toggle}>Создать</button>
                <Modal isOpen={this.state.modal}>
                    <div>
                        <ModalHeader>Новый клиент</ModalHeader>
                        <ModalBody>
                            <div className="row">
                                <div className="form-group col-md-8 offset-md-2">
                                    <label>Название компании-клиента</label><br/>
                                    <span className="error-span" id="name-error-span"/>
                                    <input type="text" id={'name-input'} value={this.state.name} onChange={this.handleChangeReason}
                                           className="form-control"/>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={this.handleSubmit}>Подтвердить</Button>
                            <Button color="info" onClick={this.toggle}>Выйти</Button>
                        </ModalFooter>
                    </div>
                </Modal>
            </div>

        );
    }

}