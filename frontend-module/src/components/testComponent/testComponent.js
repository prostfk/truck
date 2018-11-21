import React, {Component} from 'react';
import PropTypes from "prop-types"
import ReactGoogleMapLoader from "react-google-maps-loader"
import ReactGooglePlacesSuggest from "react-google-places-suggest"
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';


export default class TestComponent extends Component {

    state = {
        modal: false,
        search: "",
        value: "",
        suggest: "",
        successAddress: ''
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    handleInputChange = (e) => {
        this.setState({search: e.target.value, value: e.target.value})
    };

    handleSelectSuggest = (suggest) => {
        console.log(suggest);
        if (suggest.types[0] === 'street_address') {
            document.getElementById('info').style.color = 'green';
            document.getElementById('info').innerText = "Валидный адрес";
            this.setState({successAddress: this.state.search})
        } else {
            document.getElementById('info').style.color = 'red';
            document.getElementById('info').innerText = "Невалидный адрес";
            this.setState({successAddress: ''})
        }
        // this.setState({search: "", value: suggest.formatted_address, suggest: suggest})
        this.setState({search: "", suggest: suggest})
        // this.setState({suggest: suggest})

    };

    submitForm = () => {
        if (this.state.successAddress !== '') {
            //fetch().then().then()
            console.log(this.state.successAddress);
            console.log(this.state.suggest.place_id);
            this.toggle();
        } else {
            document.getElementById('info').style.color = 'red';
            document.getElementById('info').innerText = 'Ваш адрес не валидный!';
            this.setState({successAddress: ''})
        }
    };

    render() {
        const {search, value} = this.state;
        return (
            <div>
                <a className={'btn btn-success'} onClick={this.toggle}>Добавить адрес</a>
                <Modal isOpen={this.state.modal}>
                    <ModalHeader>
                        <h4>Добавление склада</h4>
                        <span className={'text-muted'}>Формат ввода: Город, улица номер дома</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="form-group col-md-8 offset-md-2">
                                <label>Адрес склада:</label>
                                <div id={'react-google-maps-searcher'}>
                                    <ReactGoogleMapLoader
                                        params={{
                                            key: API_KEY,
                                            libraries: "places,geocode",
                                        }}
                                        render={googleMaps =>
                                            googleMaps && (
                                                <div>
                                                    <ReactGooglePlacesSuggest
                                                        autocompletionRequest={{input: search}}
                                                        googleMaps={googleMaps}
                                                        onSelectSuggest={this.handleSelectSuggest}>
                                                        <input
                                                            type="text"
                                                            value={value}
                                                            className={'form-control'}
                                                            style={{borderRadius: '5px', width: '100%'}}
                                                            placeholder="Search a location"
                                                            onChange={this.handleInputChange}/>
                                                    </ReactGooglePlacesSuggest>
                                                </div>
                                            )
                                        }
                                    />
                                    <span id="info"/>
                                </div>


                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="green" onClick={this.submitForm}>Подтвердить</Button>
                        <Button color="info" onClick={this.toggle}>Выйти</Button>
                    </ModalFooter>
                </Modal>

            </div>
        )
    }


//AIzaSyC8b04jlgefJ27fjvs4axnTGGKvYtFemWI
}
const API_KEY = "AIzaSyC8b04jlgefJ27fjvs4axnTGGKvYtFemWI";
// TestComponent.propTypes = {
//     googleMaps: PropTypes.object,
// };

