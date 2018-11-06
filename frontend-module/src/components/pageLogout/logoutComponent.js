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
        localStorage.removeItem('Auth-token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        this.toggle();
        window.location.href = "/";
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    render() {
        let red = {
            color: '#E5E8E8'
        };
        let margin = {
            marginLeft: '2%'
        };
        return (
            <div>
                <a className={this.props.className} style={red} onClick={this.toggle}><b>Выйти</b></a>
                <Modal isOpen={this.state.modal}>
                    <form>
                        <ModalHeader>Выйти?</ModalHeader>
                        <ModalBody className={"logoutForm"}>
                                    <Button color="info" onClick={this.submitLogout}>Выйти</Button>
                                    <Button style={margin} color="danger" onClick={this.toggle}>Отмена</Button>
                        </ModalBody>
                    </form>
                </Modal>
            </div>
        );
    }

}