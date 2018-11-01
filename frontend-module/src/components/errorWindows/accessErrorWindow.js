import React, {Component} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class AccessErrorWindow extends Component {


    constructor(props) {
        super(props);
        this.state = {
            message: props.message,
            modal: true
        };
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
        window.location.href = '/'
    };

    render() {
        return (
            <div>
                <Modal isOpen={this.state.modal}>
                    <form>
                        <ModalHeader>Выйти?</ModalHeader>
                        <ModalBody>
                            <h1>Ошибка</h1>
                            <p>{this.state.message}</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={this.toggle}>Закрыть</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        );
    }
}