import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

export default class ModalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {modal: false, reason: ''};

        this.toggle = this.toggle.bind(this);
        this.handleChangeReason = this.handleChangeReason.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    handleChangeReason(event) {
        this.setState({reason: event.target.value});
    }


    handleSubmit(event) {
        this.props.clickfunc(this.state.reason, this.props.compId);
        this.setState({
            modal: !this.state.modal,
            reason: ''
        });
    }


    render() {
        return (

            <div>
                <a className={this.props.className} onClick={this.toggle}>Выкл</a>
                <Modal isOpen={this.state.modal}>
                    <form onSubmit={this.handleSubmit}>
                        <ModalHeader>Блокировка компании</ModalHeader>
                        <ModalBody>
                            <div className="row">
                                <div className="form-group col-md-8 offset-md-2">
                                    <label>Причина блокировки:</label>
                                    <input type="text" value={this.state.reason} onChange={this.handleChangeReason}
                                           className="form-control"/>
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
