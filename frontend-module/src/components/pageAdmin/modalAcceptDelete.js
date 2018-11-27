import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import {withBaseIcon} from 'react-icons-kit'
import {remove} from 'react-icons-kit/fa/remove'

const RedIconContainer = withBaseIcon({size: 24, style: {color: '#8d2a27'}});
export const RemoveIcon = () => <RedIconContainer icon={remove}/>;

export default class ModalAcceptDelete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {modal: false};
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    handleSubmit(event) {
        this.props.clickfunc(this.props.componentId);
        this.setState({
            modal: !this.state.modal,
        });
    }


    render() {
        return (

            <div>
                <a onClick={this.toggle}><RemoveIcon/></a>
                <Modal isOpen={this.state.modal}>
                    <form onSubmit={this.handleSubmit}>
                        <ModalHeader>{this.props.headerText}</ModalHeader>
                        <ModalBody>
                            <div className="row">
                                <div className="form-group col-md-8 offset-md-2">
                                    {this.props.bodyText}
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
