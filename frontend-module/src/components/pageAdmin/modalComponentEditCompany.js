import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import ValidationUtil from "../commonUtil/validationUtil";
import {NotificationManager} from "react-notifications";

export default class ModalComponentEditCompany extends React.Component {
    constructor(props) {
        super(props);
        this.state = {modal: false, companyName: ""};
        this.toggle = this.toggle.bind(this);
        this.handleChangeCompanyName = this.handleChangeCompanyName.bind(this);
        this.getCompanyName = this.getCompanyName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    validateCompanyName = () => {
        let nameVal = ValidationUtil.validateStringForLength(this.state.companyName, 3, 30);
        if (!nameVal) document.getElementById('error-name-span').innerText = 'Имя должно быть от 3 до 30 символов';
        else document.getElementById('error-name-span').innerText = '';
        return nameVal;
    };

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    handleChangeCompanyName(event) {
        this.setState({companyName: event.target.value});
    }

    handleSubmit(event) {
        if (this.validateCompanyName()) {
            fetch('http://localhost:8080/api/changeCompanyName', {
                method: "PUT",
                body: this.state.companyName,
                headers: {'Auth-token': localStorage.getItem("Auth-token")}
            }).then(function (response) {
                return response.json();
            }).then(function (result) {
                console.log(result);
            }).catch(() => {
                NotificationManager.error('Ошибка доступа');
            });

            this.setState({
                modal: !this.state.modal,
            });
        }
    }

    getCompanyName() {
        const fetchResult = fetch('http://localhost:8080/api/getCompanyName', {headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(response => {
            return response.json();
        }).catch(() => {
            NotificationManager.error('Ошибка доступа');
        });
        return fetchResult;
    }

    componentDidMount() {
        this.getCompanyName().then(data => {
            let oldComName = data.companyName;
            this.setState({companyName: oldComName});
        });
    }


    render() {
        return (

            <div>
                <a className={this.props.className} onClick={this.toggle}>{this.props.text}</a>
                <Modal isOpen={this.state.modal}>
                    <form onSubmit={this.handleSubmit}>
                        <ModalHeader>Редактирование компании</ModalHeader>
                        <ModalBody>
                            <div className="row">
                                <div className="form-group col-md-8 offset-md-2">
                                    <span id="error-name-span" className="error-span"/>
                                    <label>Название компании:</label>
                                    <input type="text" value={this.state.companyName}
                                           onChange={this.handleChangeCompanyName} className="form-control"/>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={this.handleSubmit}>Подтвердить</Button>
                            <Button color="info" onClick={this.toggle}>Выйти</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>

        );
    }
}
