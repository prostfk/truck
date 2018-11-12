import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class ModalChooseWaybillStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modal: false, waybillStatus: '1'};

        this.toggle = this.toggle.bind(this);
        this.handleChangeWaybillStatus = this.handleChangeWaybillStatus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    handleChangeWaybillStatus(event) {
        this.setState({waybillStatus: event.target.value});
    }

    handleSubmit(event) {
        this.props.clickfunc(this.props.orderId, this.state.waybillStatus );
        this.setState({
            modal: !this.state.modal,
        });
    }



    render() {
        return (

            <div>
                <a className={this.props.className} onClick={this.toggle}>Отменить проверку</a>
                <Modal isOpen={this.state.modal}>
                    <form onSubmit={this.handleSubmit}>
                        <ModalHeader>Установка статуса ТТН</ModalHeader>
                        <ModalBody>
                            <div className="row">
                                <div className="form-group col-md-8 offset-md-2">
                                    <select className="form-control" onChange={this.handleChangeWaybillStatus}>
                                        <option value={'1'}>Оформлен</option>
                                        <option value={'3'}>Доставлен</option>
                                    </select>
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
