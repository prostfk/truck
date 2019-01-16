import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import apiRequest from "../../util/ApiRequest";

export default class SendEmail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            senderEmail: '',
            receiverEmail: '',
            emailText: '',
            type: ''
        };
    }

    changeInput = (event) => {
        this.setState({
            [event.target.id]: [event.target.value]
        });
    };

    validateEmailForm = () => {
        if (this.state.senderEmail.length > 3 && this.state.senderEmail.length < 30) {
            apiRequest(`/api/checkEmail?email=${this.state.receiverEmail}`,'get').then(data => {
                console.log(data);
                if (data.error !== undefined) {
                    document.getElementById('error-email').innerText = 'Невалидный email';
                    return false;
                }
            });
        }
        if (this.state.emailText.length < 2 || this.state.emailText.length > 1000000000) {
            document.getElementById('error-message').innerText = 'Недопустимый размер текста';
            return false;
        }
        return true;
    };

    sendEmail = () => {
        if (this.validateEmailForm) return;
        let formData = new FormData();
        formData.append('email', this.state.receiverEmail);
        formData.append('message', this.state.emailText);
        formData.append('type', this.state.type);
        apiRequest('/api/sendEmail','post', formData).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
            if (data.error === undefined) {
                this.props.history.push('/usersList');
            } else {
                document.getElementById('error-span').innerText = 'Проверьте правильность почты';
            }
        }).catch(() => {
            NotificationManager.error('Ошибка доступа');
        })
    };

    render() {

        let margin = {
            marginTop: '3%'
        };

        return (
            <div className={'container'} style={margin}>
                <form id="contact-form">

                    <div className="controls">
                        <div className="row">
                            <div className="col-md-6">
                                <span className="error-span" id="error-span"/>
                                <div className="form-group">
                                    <label htmlFor="receiverEmail">Email *</label>
                                    <input id="receiverEmail" type="email" onChange={this.changeInput}
                                           value={this.state.receiverEmail} className="form-control"
                                           placeholder="Email *" required="required"
                                           data-error="Valid email is required."/>
                                    <div id={'error-email'} className="help-block with-errors"/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="type">Тема *</label>
                                    <select id="type" onChange={this.changeInput} value={this.state.type}
                                            className="form-control" required="required"
                                            data-error="Please specify your need.">
                                        <option value=""/>
                                        <option value="Оповещение безопасности">Оповещение безопасности</option>
                                        <option value="Приглашение">Приглашение</option>
                                        <option value="Штраф">Штраф</option>
                                        <option value="Другое">Другое</option>
                                    </select>
                                    <div id={'error-type'} className="help-block with-errors"/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="emailText">Сообщение *</label>
                                    <textarea onChange={this.changeInput} value={this.state.emailText} id="emailText"
                                              name="message" className="form-control"
                                              placeholder="Message for me *" rows="4" required="required"
                                              data-error="Please, leave us a message."/>
                                    <div id={'error-message'} className="help-block with-errors"/>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <button type="button" className="btn btn-success btn-send"
                                        onClick={this.sendEmail}>Отправить
                                </button>
                            </div>
                        </div>

                    </div>

                </form>
            </div>
        );
    }


}