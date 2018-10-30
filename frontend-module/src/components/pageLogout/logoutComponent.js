import React, {Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class LogoutComponent extends Component {


    constructor(props) {
        super(props);
        this.state = {
            modal: false
        }
    }

    submitLogout = () => {
        sessionStorage.removeItem('Auth-token');
        sessionStorage.removeItem('username');
        this.toggle();
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    render() {
        return (
            <div>
                <a className={this.props.className} onClick={this.toggle}>Выйти</a>
                <Modal isOpen={this.state.modal}>
                    <form onSubmit={this.closeWindow}>
                        <ModalHeader>Выйти?</ModalHeader>
                        <ModalBody>
                            <Button color="info" onClick={this.submitLogout}>Выйти</Button>
                            <Button color="danger" onClick={this.toggle}>Отмена</Button>
                        </ModalBody>
                    </form>
                </Modal>
            </div>
        );
    }

}