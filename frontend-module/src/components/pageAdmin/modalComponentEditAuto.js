import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {EditIcon} from "./pageAutoList";
import {NotificationManager} from "react-notifications";

export default class ModalComponentEditAuto extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            autoId: props.autoId,
            autoName: props.autoName,
            autoCarNumber: props.autoCarNumber,
            autoType: props.autoType,
            autoFuelConsumption: props.autoFuelConsumption
        };

        this.toggle = this.toggle.bind(this);
        this.handleChangeAutoName = this.handleChangeAutoName.bind(this);
        this.handleChangeAutoCarNumber = this.handleChangeAutoCarNumber.bind(this);
        this.handleChangeAutoType = this.handleChangeAutoType.bind(this);
        this.handleChangeAutoFuelConsumption = this.handleChangeAutoFuelConsumption.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    handleChangeAutoName(event) {
        this.setState({autoName: event.target.value});
    }

    handleChangeAutoCarNumber(event) {
        this.setState({autoCarNumber: event.target.value});
    }

    handleChangeAutoType(event) {
        this.setState({autoType: event.target.value});
    }

    handleChangeAutoFuelConsumption(event) {
        this.setState({autoFuelConsumption: event.target.value});
    }

    handleSubmit(event) {
        this.props.clickfunc(this.state.autoId, this.state.autoName, this.state.autoCarNumber, this.state.autoType, this.state.autoFuelConsumption);
        this.setState({
            modal: !this.state.modal,
        });
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
                <a onClick={this.toggle}><EditIcon></EditIcon></a>
                <Modal isOpen={this.state.modal}>
                    <form onSubmit={this.handleSubmit}>
                        <ModalHeader>Редактирование автомобиля</ModalHeader>
                        <ModalBody>
                            <div className="row">
                                <div className="form-group col-md-8 offset-md-2">
                                    <label>Название авто:</label>
                                    <input type="text" value={this.state.autoName} onChange={this.handleChangeAutoName}
                                           className="form-control"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-8 offset-md-2">
                                    <label>номер авто:</label>
                                    <input type="text" value={this.state.autoCarNumber}
                                           onChange={this.handleChangeAutoCarNumber} className="form-control"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-8 offset-md-2">
                                    <label>тип авто авто:</label>
                                    <input type="text" value={this.state.autoType} onChange={this.handleChangeAutoType}
                                           className="form-control"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-8 offset-md-2">
                                    <label>Расход на 100км:</label>
                                    <input type="text" value={this.state.autoFuelConsumption}
                                           onChange={this.handleChangeAutoFuelConsumption} className="form-control"/>
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
