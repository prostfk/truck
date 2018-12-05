import React from "react";
import {Link} from 'react-router-dom'
import CommonUtil from "../commonUtil/commontUtil";
/*import ErrorUiHandler from "../errorWindows/errorHandler";*/
import Pagination from "react-js-pagination";
import {NotificationManager} from "react-notifications";
import {withBaseIcon} from "react-icons-kit";
import {edit} from 'react-icons-kit/fa/edit'
const SideIconContainer = withBaseIcon({size: 24, style: {color: '#50505d'}});
const EditIcon = () => <SideIconContainer icon={edit}/>


class DispatcherOrderList extends React.Component {
    constructor(props) {
        super(props);
        this.getOrderList = this.getOrderList.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.getCompany = this.getCompany.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.state = {
            orders: [],
            company: {},
            totalElements: 0,
            currentPage: 1
        };
        document.title = "Заказы"
    }

    componentDidMount() {
        this.getOrderList().then(data => {
            this.setState({
                orders: data.content,
                totalElements: data.totalElements,
                currentPage: ++data.number
            });
        });
        this.getCompany().then(data => {
            this.setState({company: data});
        });

    }

    /*get all company list*/
    getOrderList(pageid = 1) {
        return fetch('http://localhost:8080/api/orders?page=' + pageid, {
            method: "get",
            headers: {'Auth-token': localStorage.getItem("Auth-token")}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            return result;
        }).catch(() => {
            NotificationManager.error('Ошибка');
        });
    }

    handlePageChange(pageNumber) {
        this.getOrderList(pageNumber).then(data => {
            this.setState({
                orders: data.content,
                totalElements: data.totalElements,
                currentPage: ++data.number
            });
        });
        this.setState({currentPage: pageNumber});
    }

    getCompany() {
        return fetch('http://localhost:8080/api/getCompany/', {
            method: "get",
            headers: {'Auth-token': localStorage.getItem("Auth-token")}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            return result;
        }).catch(() => {
            NotificationManager.error('Ошибка');
        });
    }

    renderTable(order, index) {
        if (!order) return;
        return <div className="row table_row order_row animated fadeInUp" key={index}>
            <div className="col-md-3">{order.name}</div>
            <div className="col-md-2" title={order.sender.address}>{order.sender.name}</div>
            <div className="col-md-2" title={order.receiver.address}>{order.receiver.name}</div>
            <div className="col-md-2">{CommonUtil.getCorrectDateFromLong(order.waybill.dateDeparture)}</div>
            <div className="col-md-2">{CommonUtil.getCorrectDateFromLong(order.waybill.dateArrival)}</div>
            <div className="col-md-1">
                <Link to={`/orders/${order.id}/edit`}><EditIcon/></Link>
            </div>
        </div>
    }


    render() {
        let element;// = <div></div>;
        if (this.state.company.active === 1) {
            element = <form className="superuserform_newaccountform grey_form">
                        <span>
                            <h5>Добавление заказа</h5>
                        <Link to={`/orders/createorder`} className="btn btn-success btn_fullsize">Создать</Link>
                        </span>
                     </form> ;
        } else if (this.state.company.active === 0) {
            element =
                <form className="superuserform_newaccountform err-block">
                    <div>
                        Комания Заблокирована!
                        <div>Администратор: {this.state.company.lockerId.username}</div>
                        <div>Дата: {CommonUtil.getCorrectDateFromLong(this.state.company.lockDate)}</div>
                        <div>Причина: {this.state.company.lockComment}</div>
                    </div>
                </form>

        }
        return <div className="row">
            <div className="offset-lg-1 col-lg-6 col-md-7 superuserform_companylist animated fadeIn">
                <div className="row table_header">
                    <div className="col-md-3">Заказ</div>
                    <div className="col-md-2">Название склада (отправитель)</div>
                    <div className="col-md-2">Название склада (получатель)</div>
                    <div className="col-md-2">Дата отправления</div>
                    <div className="col-md-2">Дата получения</div>
                    <div className="col-md-1"/>
                </div>
                {
                    this.state.orders.map((element, index) => {
                        return this.renderTable(element, index);
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
            <div className="offset-lg-1 col-lg-3 col-md-5 animated fadeIn">
                    {element}
            </div>
        </div>
    }
}

export default DispatcherOrderList;