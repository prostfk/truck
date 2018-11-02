import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class ModalAcceptDelete extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modal: false};
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    handleSubmit(event) {
        this.props.clickfunc(this.props.stockId);
        this.setState({
            modal: !this.state.modal,
        });
    }



    render() {
        return (

            <div>
                <a className={this.props.className} onClick={this.toggle}>Удалить</a>
                <Modal isOpen={this.state.modal}>
                    <form onSubmit={this.handleSubmit}>
                        <ModalHeader>Вы действительно хотите удалить склад?</ModalHeader>
                        <ModalBody>
                            <div className="row">
                                <div className="form-group col-md-8 offset-md-2">
                                    Восстановить склад будет невозможно
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={this.handleSubmit}>Подтвердить</Button>
                            <Button color="info" onClick={this.toggle}>Отменить</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>

        );
    }
}
