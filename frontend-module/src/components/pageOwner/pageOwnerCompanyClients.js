import React, {Component} from 'react';
import {Link} from "react-router-dom";
import Pagination from "react-js-pagination";
import ModalCreateClient from "./modalCreateClient";

export default class CompanyClients extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clients: [],
            totalElements: 0,
            currentPage: 0
        };
        document.title = "Клиенты";
        this.fetchClients();
    }

    fetchClients = (pageid = 1) => {
        fetch('/api/company/clients?page=' + pageid, {
            method: 'GET',
            headers: {'Auth-token': localStorage.getItem('Auth-token'), 'Accept': 'application/json;charset=UTF-8'}
        }).then(response => {
            if (response.status === 403 || response.status === 500) {
                throw new Error('Ошибка доступа');
            } else {
                return response.json();
            }
        }).then(data => {
            console.log(data);
            this.setState({
                clients: data.clients,
                totalElements: data.totalElements,
                currentPage: ++data.currentPage
            })
        })
    };

    renderUser = (client, index) => {
        return <div className={'row table_row animated fadeInUp'} key={index}>
            <div className={'col-md-1'}>{client.id}</div>
            <div className={'col-md-5'}>{client.name}</div>
            <div className={'col-md-3'}>{client.type}</div>
            <div className="col-md-3">
                <Link to={`/owner/client/${client.id}`} className="table_button bg-secondary text-white">Перейти</Link>
            </div>
        </div>
    };

    render() {
        return (
            <div className={'row'}>
                <div className="offset-md-2 col-md-6 superuserform_companylist">
                    <div className="row table_header">
                        <div className="col-md-1">Id</div>
                        <div className="col-md-5">Название</div>
                        <div className="col-md-3">Тип</div>
                        <div className="col-md-3">Статистика</div>
                    </div>
                    {
                        this.state.clients.map((user, index) => {
                            return this.renderUser(user, index);
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
                <div className="offset-md-1 col-md-2" id={'add-user-form'}>
                    <ModalCreateClient/>
                </div>
            </div>
        );
    }
}