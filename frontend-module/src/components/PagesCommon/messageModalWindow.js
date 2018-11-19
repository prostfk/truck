import React, {Component} from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

export default class MessageModalWindow extends Component {

    constructor(props) {
        super(props);
        this.state = {modal: false};
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    render() {
        return (
            <div>
                <Modal isOpen={this.state.modal}>
                    <ModalHeader>{this.props.header}</ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <h4 style={{color: this.props.color}}>{this.props.body}</h4>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="info" onClick={this.toggle}>Закрыть</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

}