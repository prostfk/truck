import React, {Component} from 'react';
import PropTypes from "prop-types"
import ReactGoogleMapLoader from "react-google-maps-loader"
import ReactGooglePlacesSuggest from "react-google-places-suggest"
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';


export default class EditStockModal extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        modal: false,
        search: "",
        value: this.props.stockName,
        suggest: "",
        successAddress: this.props.stockName
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
        console.log(this.state)
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
            this.setState({successAddress: ''})
        }
        // this.setState({search: "", value: suggest.formatted_address, suggest: suggest})
        this.setState({search: "", suggest: suggest})
        // this.setState({suggest: suggest})

    };

    submitForm = () => {
        if (this.state.successAddress !== '') {
            console.log(this.state.successAddress);
            console.log(this.state.suggest.place_id);
            let formData = new FormData();
            formData.append("id", this.props.stockId);
            formData.append("name", this.state.successAddress);
            formData.append("address", this.state.suggest.place_id);
            fetch('http://localhost:8080/api/editStock', {method: "PUT", body: formData, headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(response => {
                response.json().then(data => {
                    console.log(data);
                    this.setState({modal: false, search: "", value: "", suggest: "", successAddress: ''})
                })
            }, err => console.log(err));
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
                <a className={"table_button bg-secondary text-white"} onClick={this.toggle}>Изменить</a>
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
                                            key: 'AIzaSyC8b04jlgefJ27fjvs4axnTGGKvYtFemWI',
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
EditStockModal.propTypes = {
    googleMaps: PropTypes.object,
};
