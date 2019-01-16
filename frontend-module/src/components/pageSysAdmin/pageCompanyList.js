import React from "react";
import ModalComponent from './modalComponent'
import {NotificationManager} from "react-notifications";
import Pagination from "react-js-pagination";
import apiRequest from "../../util/ApiRequest";

/*import ReactDOM from "react";*/

class SysAdminPage extends React.Component {
    constructor(props) {
        super(props);
        this.getCompanyList = this.getCompanyList.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.sendRef = this.sendRef.bind(this);
        this.changeMail = this.changeMail.bind(this);
        this.submitLock = this.submitLock.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.state = {
            companies: [],
            inputMail: "",
            totalElements: 0,
            currentPage: 1
        };
        document.title = "Список компаний"
    }

    /*update row in companies row's after change status of company*/
    forceUpdateHandler(companyId) {
        const refThis = this;
        apiRequest(`/api/companies/${companyId}`).then(function (result) {
            refThis.state.companies.find((element, index, array) => {
                if (element.id === companyId) {
                    const newCompanies = refThis.state.companies;
                    newCompanies[index] = result;
                    refThis.setState({companies: newCompanies});
                }
            });
        }).catch(() => {
            NotificationManager.error('Ошибка');
        });
    };

    changeMail(event) {
        this.setState({
            inputMail: event.target.value
        })
    }

    sendRef() {
        apiRequest(`/api/createAdmin?email=${this.state.inputMail}`, 'post').then(data => {
            if (data.error === undefined) {
                NotificationManager.success('Отправлено');
                this.setState({inputMail: ''});
            } else {
                NotificationManager.error('Ошибка');
                document.getElementById('result-span').style.color = 'red';
                document.getElementById('result-span').innerText = 'Неверная почта';
            }
        }).catch(() => {
            NotificationManager.error('Ошибка');
        });
    }

    /*auto run when page init*/
    componentDidMount() {
        this.getCompanyList().then(data => {
            if (data) {
                this.setState({
                    companies: data.content,
                    totalElements: data.totalElements,
                    currentPage: ++data.number
                });
            }
        });
    }

    handlePageChange(pageNumber) {
        this.getCompanyList(pageNumber);
        this.setState({currentPage: pageNumber});
    }

    /*get all company list*/
    getCompanyList(pageid = 1) {
        return apiRequest(`/api/companies?page=${pageid}`).then(function (result) {
            return result;
        });
    }

    /*render row of table ( calls from html ) */
    renderTable(company) {
        if (!company) return;
        const buttonactivate = <ModalComponent clickfunc={this.submitLock}
                                               className={"table_button bg-secondary text-white"} compId={company.id}/>;
        const buttondeactivate = <a onClick={this.submitUnlock.bind(this, company.id)}
                                    className={"table_button bg-secondary text-white"}>Вкл</a>;
        const lockedDate = company.lockDate == null ? "" : " Дата: " + (new Date(company.lockDate));
        const titleoflock = company.active ? "Активна" : (company.lockerId === null ? "[admin]" : company.lockerId.username) + " : " + (company.lockComment === "" ? "[without message]" : company.lockComment) + lockedDate;
        return <div className={"row table_row animated fadeInUp"} key={company.id}>
            <div className={"col-md-1"}>{company.id}</div>
            <div className={"col-md-5"}>{company.name}</div>
            <div className={"col-md-3"} title={titleoflock}
                 id={"companystatus_" + company.id}>{company.active ? "Активна" : "Приостановлена"}</div>
            <div className={"col-md-3"}>
                {/*<Link to={`/companylist/${company.id}`} activeClassName="active">{buttonLabel}</Link>*/}
                {company.active ? buttonactivate : buttondeactivate}
            </div>
        </div>
    }

    /*button changestatus handler*/
    submitUnlock(compId, event) {
        const ref = this;
        let formData = new FormData();
        formData.append('companyId', compId);
        apiRequest('/api/companies/changeStatus', 'post', formData).then(function (result) {
            if (result === true) {
                ref.forceUpdateHandler(compId);
            }
            return result;
        })
    }

    submitLock(desc, compId) {
        const ref = this;
        let formData = new FormData();
        formData.append('description', desc);
        apiRequest(`/api/companies/disable/${compId}`, 'post', formData).then(function (result) {
            if (result === true) {
                ref.forceUpdateHandler(compId);
            }
            return result;
        }).catch((err) => {
            NotificationManager.warning('Ошибка блокировки')
        });
    }

    render() {
        return <div className="row">
            <div className="offset-md-1 col-md-6 superuserform_companylist">
                <div className="row table_header animated fadeIn">
                    <div className="col-md-1">ID</div>
                    <div className="col-md-5">Название компании</div>
                    <div className="col-md-3">Статус</div>
                    <div className="col-md-3">Действие</div>
                </div>
                {
                    this.state.companies.map((element) => {
                        return this.renderTable(element);
                    })
                }
                <div className="table_footer">
                    <div>
                        <Pagination
                            activePage={this.state.currentPage}
                            totalItemsCount={this.state.totalElements}
                            itemsCountPerPage={5}
                            pageRangeDisplayed={5}
                            hideDisabled={true}
                            itemClass={"page-item"}
                            linkClass={"page-link"}
                            activeClass={"activePage"}
                            onChange={this.handlePageChange}
                        />
                    </div>
                </div>
            </div>

            <div className="offset-md-1 col-md-3">
                <div className="">
                    <form className="superuserform_newaccountform grey_form">
                        <h5>Регистрация новой компании</h5>
                        <span id="result-span"/>
                        <div id={'user-new-form'}>
                            <div className="form-group">
                                <label htmlFor="id" id="emaillabel">Email</label>
                                <input onChange={this.changeMail} type="email" className="form-control" id="email"
                                       placeholder="newUser@mail.com" required=""/>
                            </div>
                            <a onClick={this.sendRef} className="btn btn-success btn_fullsize">Отправить</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    }
}

export default SysAdminPage;