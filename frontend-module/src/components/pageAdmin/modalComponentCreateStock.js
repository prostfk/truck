import React, {Component} from 'react';
import PropTypes from "prop-types"
import ReactGoogleMapLoader from "react-google-maps-loader"
import ReactGooglePlacesSuggest from "react-google-places-suggest"
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {NotificationManager} from "react-notifications";


export default class CreateStockModal extends Component {

    state = {
        modal: false,
        search: "",
        value: "",
        suggest: "",
        successAddress: '',
        name: '',
        lat: null,
        lng: null
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
        console.log(`lat: ${suggest.geometry.location.lat()}, lng: ${suggest.geometry.location.lng()}`);
        if (suggest.types[0] === 'street_address') {
            document.getElementById('info').style.color = 'green';
            document.getElementById('info').innerText = "Валидный адрес";
            this.setState({
                successAddress: this.state.search,
                lat: suggest.geometry.location.lat(),
                lng: suggest.geometry.location.lng()
            })
        } else {
            document.getElementById('info').style.color = 'red';
            this.setState({successAddress: ''})
        }
        this.setState({search: "", suggest: suggest})

    };

    submitForm = () => {
        if (this.state.successAddress !== '' && this.state.lng != null && this.state.lat != null) {
            console.log(this.state.successAddress);
            console.log(this.state.suggest.place_id);
            let formData = new FormData();
            formData.append("name", this.state.name);
            formData.append("address", this.state.successAddress);
            formData.append("lat", this.state.lat);
            formData.append("lng", this.state.lng);

            fetch('http://localhost:8080/api/stocks', {
                method: "POST",
                body: formData,
                headers: {'authorization': localStorage.getItem("authorization")}
            }).then(response => {
                response.json().then(data => {
                    console.log(data);
                    // this.forceUpdateHandler();    /*this.setState({stocks:data}) its not working.. why??*/
                    this.setState({modal: false, search: "", value: "", suggest: "", successAddress: ''})
                })
            }).catch(() => {
                NotificationManager.error('Ошибка доступа');
            });
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
                <a className={'btn btn-success btn_fullsize'} onClick={this.toggle}>Добавить адрес</a>
                <Modal isOpen={this.state.modal}>
                    <ModalHeader>
                        <h4>Добавление склада</h4>
                        <span className={'text-muted'}>Формат ввода: Город, улица номер дома</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="form-group col-md-8 offset-md-2">
                                <label>Название склада:</label>
                                <input type="text" placeholder={'Название склада'} className={'form-control'}
                                       value={this.state.name} id={'name'}
                                       onChange={(e) => this.setState({name: e.target.value})}/>
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
const API_KEY = "AIzaSyA-10DP5m2sFHl7JbD3QYeG0D8o3BlvnKE";
CreateStockModal.propTypes = {
    googleMaps: PropTypes.object,
};
