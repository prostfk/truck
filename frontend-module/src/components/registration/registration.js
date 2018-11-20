import React, {Component} from "react";
import ValidationUtil from "../commonUtil/validationUtil";
import CommonUtil from "../commonUtil/commontUtil";

class registration extends Component {

    constructor(props) {
        super(props);
        let tokenValue = document.location.href.split("=")[1];
        this.changeInput = this.changeInput.bind(this);
        this.sendFetch = this.sendFetch.bind(this);
        this.state = {
            newUsername: '',
            newPassword: '',
            newCompanyName: '',
            newBirthDate: CommonUtil.getCorrectDateFromLong(new Date().getTime()),
            newFirstName: '',
            newSecondName: '',
            newThirdName: '',
            newCity: '',
            newCountry: '',
            newStreet: '',
            newHouseNumber: '',
            newFlatNumber: '',
            token: tokenValue,
            validation: false
        };
        this.checkToken();
    }

    checkToken = () => {
        fetch(`/anon/tokenValidation?token=${this.state.token}`).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
            if (data.error !== undefined) {
                window.location.href = '/';
            }
        })
    };

    changeInput(event) {
        this.setState({
            [event.target.id]: [event.target.value]
        });
        console.log(this.state.newBirthDate)
    }

    validateCompany = (event) => {
        fetch(`http://localhost:8080/checkCompanyName?name=${this.state.newCompanyName}`).then(response => {
            return response.json();
        }).then(data => {
            if (data.error !== undefined) {
                this.setState({validation: false});
                document.getElementById('newCompanyName').classList.add("is-invalid");
                document.getElementById('error-company-span').innerText = 'Такая компания уже существует';
                return false;
            } else {
                document.getElementById('newCompanyName').classList.remove("is-invalid");
                document.getElementById('error-company-span').innerText = '';
                return true;
            }
        })
    };

    validateForm = () => {
        // let companyVal = this.validateCompany();
        let userNameVal = ValidationUtil.validateStringForLength(this.state.newUsername, 5, 20);
        let passwordVal = ValidationUtil.validateStringForLength(this.state.newPassword, 6, 20);
        let dateVal = ValidationUtil.validateDateToPattern(this.state.newBirthDate);
        let nameVal = ValidationUtil.validateStringForLength(this.state.newFirstName, 2, 40);
        let surnameVal = ValidationUtil.validateStringForLength(this.state.newSecondName, 4, 40);
        if (!userNameVal) {
            document.getElementById('newUsername').classList.add("is-invalid");
            document.getElementById('error-username-span').innerText = 'Имя пользователя должно содержать от 5 до 20 символов';
        } else {
            document.getElementById('newUsername').classList.remove("is-invalid");
            document.getElementById('error-username-span').innerText = '';
        }
        if (!passwordVal) {
            document.getElementById('newPassword').classList.add("is-invalid");
            document.getElementById('error-password-span').innerText = 'Пароль должен содержать от 6 до 20 символов';
        } else {
            document.getElementById('newPassword').classList.remove("is-invalid");
            document.getElementById('error-password-span').innerText = '';
        }
        if (!dateVal) {
            document.getElementById('newBirthDate').classList.add("is-invalid");
            document.getElementById('error-date-span').innerText = 'Дата невалидна';
        } else {
            document.getElementById('newBirthDate').classList.remove("is-invalid");
            document.getElementById('error-date-span').innerText = '';
        }
        if (!nameVal) {
            document.getElementById('newFirstName').classList.add("is-invalid");
            document.getElementById('error-name-span').innerText = 'Имя должно содержать от 2 до 40 символов';
        } else {
            document.getElementById('newFirstName').classList.remove("is-invalid");
            document.getElementById('error-name-span').innerText = '';
        }
        if (!surnameVal) {
            document.getElementById('newSecondName').classList.add("is-invalid");
            document.getElementById('error-surname-span').innerText = 'Пароль должен содержать от 4 до 40 символов';
        } else {
            document.getElementById('newSecondName').classList.remove("is-invalid");
            document.getElementById('error-surname-span').innerText = '';
        }
        console.log(userNameVal + "" + passwordVal + "" + dateVal + "" + nameVal + "" + surnameVal + "");
        return userNameVal && passwordVal && dateVal && nameVal && surnameVal;
    };

    sendFetch() { //fixme: redo form sending and backend processing(16-11-18)
        if (this.validateForm()) {
            console.log(true);
            let formData = new FormData();
            formData.append('username', this.state.newUsername);
            formData.append('firstName', this.state.newFirstName);
            formData.append('secondName', this.state.newSecondName);
            formData.append('thirdName', this.state.newThirdName);
            formData.append('birthDay', this.state.newBirthDate);
            formData.append('country', this.state.newCountry);
            formData.append('city', this.state.newCity);
            formData.append('street', this.state.newStreet);
            formData.append('houseNumber', this.state.newHouseNumber);
            formData.append('newFlatNumber', this.state.newFlatNumber);
            formData.append('companyName', this.state.newCompanyName);
            formData.append('token', this.state.token);
            formData.append('password', this.state.newPassword);
            formData.forEach((v, k) => {
                console.log(k + " " + v)
            });
            fetch(`http://localhost:8080/registration`, {
                method: "POST",
                body: formData,
                headers: {'Auth-token': localStorage.getItem('Auth-token')}
            }).then(response => {
                return response.json()
            }).then(data => {
                console.log(data);
                if (data.error === undefined) {
                    window.location.href = '/auth'
                } else {
                    document.getElementById('error-span').style.color = "red";
                    document.getElementById('error-span').innerText = "Ошибка";
                }
            })
        }
    }

    render() {
        return <div>
            <div style={{marginTop: '2%'}}>
                <div className="offset-md-3 col-md-6">
                    <div className="form-group row">
                        <h1 className={'col-md-auto'}>Добро пожаловать!</h1>
                        <span className="error-span" id="error-span"/>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="newCompanyName" className="col-2 col-form-label">Название компании *</label>
                        <div className="col-10">
                            <input className="form-control" type="text" onChange={this.changeInput}
                                   value={this.state.newCompanyName} id="newCompanyName"/>
                            <small className="text-danger" id="error-company-span"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="newUsername" className="col-2 col-form-label">Логин *</label>
                        <div className="col-10">
                            <input className="form-control" type="search" value={this.state.newUsername}
                                   onChange={this.changeInput}
                                   id="newUsername"/>
                            <small className="text-danger" id="error-username-span"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="example-password-input" className="col-2 col-form-label">Пароль *</label>
                        <div className="col-10">
                            <input className="form-control" type="password" placeholder="zxccxz"
                                   value={this.state.newPassword} onChange={this.changeInput} id="newPassword"/>
                            <small className="text-danger" id="error-password-span"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="example-url-input" className="col-2 col-form-label">Дата рождения *</label>
                        <div className="col-10">
                            <input className="form-control date-picker" type="text" value={this.state.newBirthDate}
                                   onChange={this.changeInput}
                                   id="newBirthDate"/>
                            <small className="text-danger" id="error-date-span"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="newSecondName" className="col-2 col-form-label">Фамилия *</label>
                        <div className="col-10">
                            <input className="form-control" type="text" value={this.state.newSecondName}
                                   onChange={this.changeInput} id="newSecondName"/>
                            <small className="text-danger" id="error-surname-span"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="newFirstName" className="col-2 col-form-label">Имя *</label>
                        <div className="col-10">
                            <input className="form-control" type="text" value={this.state.newFirstName}
                                   onChange={this.changeInput} id="newFirstName"/>
                            <small className="text-danger" id="error-name-span"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="newThirdName" className="col-2 col-form-label">Отчество</label>
                        <div className="col-10">
                            <input className="form-control" type="text" value={this.state.newThirdName}
                                   onChange={this.changeInput}
                                   id="newThirdName"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="newCountry" className="col-2 col-form-label">Страна</label>
                        <div className="col-10">
                            <input className="form-control" type="text" value={this.state.newCountry}
                                   onChange={this.changeInput} id="newCountry"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="newCity" className="col-2 col-form-label">Город</label>
                        <div className="col-10">
                            <input className="form-control" type="text" value={this.state.newCity}
                                   onChange={this.changeInput} id="newCity"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="newStreet" className="col-2 col-form-label">Улица</label>
                        <div className="col-10">
                            <input className="form-control" type="text" value={this.state.newStreet}
                                   onChange={this.changeInput} id="newStreet"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="newHouseNumber" className="col-2 col-form-label">Дом</label>
                        <div className="col-10">
                            <input className="form-control" type="number" value={this.state.newHouseNumber}
                                   onChange={this.changeInput} id="newHouseNumber"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="newFlatNumber" className="col-2 col-form-label">Квартира</label>
                        <div className="col-10">
                            <input className="form-control" type="number" value={this.state.newFlatNumber}
                                   onChange={this.changeInput} id="newFlatNumber"/>
                        </div>
                    </div>
                    <div className={'form-group row'}>
                        <button onClick={this.sendFetch} className={'btn btn-success'}>Подтвердить</button>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default registration;
