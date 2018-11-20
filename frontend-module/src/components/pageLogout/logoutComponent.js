import React, {Component} from 'react';
import {Button, Modal, ModalHeader, ModalBody} from 'reactstrap';

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
        return (
            <div>
                <a className={this.props.className} style={{color: '#E5E8E8'}} onClick={this.toggle}><span
                    className={'btn'}><b>Выйти</b></span></a>
                <Modal isOpen={this.state.modal}>
                    <form>
                        <ModalHeader>Выйти?</ModalHeader>
                        <ModalBody className={"logoutForm"}>
                            <Button color="danger" onClick={this.submitLogout}>Выйти</Button>
                            <Button style={{marginLeft: '2%'}} backgroundColor={'#4e4e4e'}
                                    onClick={this.toggle}>Отмена</Button>
                        </ModalBody>
                    </form>
                </Modal>
            </div>
        );
    }

}