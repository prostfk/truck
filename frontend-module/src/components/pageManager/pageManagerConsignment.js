﻿import React, {Component} from "react";
import Pagination from "react-js-pagination";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import apiRequest from "../../util/ApiRequest";
import {NotificationManager} from "react-notifications";

class ManagerConsignment extends Component {

    constructor(props) {
        super(props);
        this.getProductList = this.getProductList.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputChangeTwo = this.handleInputChangeTwo.bind(this);
        this.setLostState = this.setLostState.bind(this);
        this.restoreProduct = this.restoreProduct.bind(this);

        this.state = {
            products: [],
            isLost: false,

            modalCancellation: false,
            countOfSelectedProduct: 0,
            remainsOfSelectedProduct: 0,
            selectedProductIndex: 0,

            modalRestore: false,
            cancelledCount: 0,
            remainsCancelled: 0,
        };
        document.title = "Товарная партия"
    }

    toggleModalCancellation = (key) => {

        if (key >= 0) {
            this.setState((state, props) => ({
                modalCancellation: !state.modalCancellation,
                selectedProductIndex: key,
                countOfSelectedProduct: state.products[key].count,
                remainsOfSelectedProduct: state.products[key].count,
            }));
        } else {
            this.setState({
                modalCancellation: !this.state.modalCancellation,
            })
        }
    };

    toggleModalRestore = (key) => {

        if (key >= 0) {
            this.setState((state, props) => ({
                modalRestore: !state.modalRestore,
                selectedProductIndex: key,
                cancelledCount: state.products[key].cancelledCount,
                remainsCancelled: state.products[key].cancelledCount,
            }));
        } else {
            this.setState({
                modalRestore: !this.state.modalRestore,
            })
        }
    };

    componentDidMount() {
        this.getProductList().then(data => {
            this.setState({
                products: data.content,
                totalElements: data.totalElements,
                currentPage: ++data.number
            });
        });
    }

    handleInputChange(e) {
        let currentValue = e.target.value;
        let maxValue = this.state.countOfSelectedProduct;
        let newValue;
        if (currentValue > maxValue || currentValue < 0) {
            e.target.value = "";
            newValue = maxValue;
        } else {
            newValue = maxValue - currentValue;
        }

        this.setState({
            remainsOfSelectedProduct: newValue,
        });
    }

    handleInputChangeTwo(e) {
        let currentValue = e.target.value;
        let maxValue = this.state.cancelledCount;
        let newValue;
        if (currentValue > maxValue || currentValue < 0) {
            e.target.value = "";
            newValue = maxValue;
        } else {
            newValue = maxValue - currentValue;
        }

        this.setState({
            remainsCancelled: newValue,
        });
    }

    handlePageChange(pageNumber) {
        this.getProductList(pageNumber).then(data => {
            this.setState({
                products: data.content,
                totalElements: data.totalElements,
                currentPage: ++data.number
            });
        });
        this.setState({currentPage: pageNumber});
    }

    forceUpdateHandler(product) {
        console.log(product);
        const ref = this;
        ref.state.products.find((element, index) => {
            if (element.id === product.id) {
                const newProducts = ref.state.products;
                newProducts[index] = product;
                ref.setState({products: newProducts});
            }
        });
    }

    /*get active orders*/
    getProductList(pageid = 1) {
        let split = document.location.href.split('/');
        let id = split[split.length - 1];
        console.log(id);
        return fetch(`/api/manager/products/${id}?page=${pageid}`, {
            method: "get",
            headers: {'authorization': localStorage.getItem("authorization")}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            return result;
        }).catch((err) => {
            NotificationManager.warning(err.toString())
        });
    }

    /*render row of table ( calls from html ) */
    renderTable(product, index) {
        if (!product) return;
        let status;
        if (product.status === 1) {
            status = "Принят";
        } else if (product.status === 2) {
            status = "Проверен";
        } else if (product.status === 3) {
            status = "Доставлен";
        } else if (product.status === 4) {
            status = "Утерян";
        } else if (product.status === 5) {
            status = "Частично утерян";
        }
        let isLost = false;
        let semiLost = false;
        if (status === "Утерян") {
            isLost = true;
        } else if (status === "Частично утерян") {
            semiLost = true;
        }
        return <div key={index} className="row table_row manager_orders animated fadeInUp">
            <div className="col-md-2">{product.name}</div>
            <div className="col-md-2" style={{display: semiLost ? 'block' : 'none'}}>Частично утерян</div>
            <div className="col-md-2" style={{display: isLost ? 'block' : 'none'}}>Утерян</div>
            <div className="col-md-2" style={{display: isLost || semiLost ? 'none' : 'block'}}>
                <select className="form-control" value={status}
                        onChange={this.changeProductStatus.bind(this, product.id)}>
                    <option>Принят</option>
                    <option>Доставлен</option>
                    <option>Проверен</option>
                </select>
            </div>
            <div className="col-md-2">{product.description}</div>
            <div className="col-md-1">{product.price}</div>
            <div className="col-md-2">{product.count}/{product.cancelledCount}</div>
            <div className="col-md-1"><a className="table_button bg-secondary text-white"
                                         onClick={this.toggleModalCancellation.bind(this, index)}>{"Списать"}</a>
            </div>
            <div className="col-md-1"><a className="table_button bg-secondary text-white"
                                         onClick={this.toggleModalRestore.bind(this, index)}>{"Восстановить"}</a>
            </div>
        </div>
    }

    setLostState() {
        this.toggleModalCancellation();
        let productId = this.state.products[this.state.selectedProductIndex].id;
        let cancel = this.state.countOfSelectedProduct - this.state.remainsOfSelectedProduct;
        let split = document.location.href.split('/');
        let orderId = split[split.length - 1];
        const ref = this;

        /*let formData = new FormData();
        formData.append("orderId", orderId);
        formData.append("isLost", isLost);*/
        fetch(`/api/manager/${productId}/cancelProduct/${orderId}/?cancel=${cancel}`, {
            method: "GET",
            headers: {'authorization': localStorage.getItem("authorization")}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            ref.forceUpdateHandler(result);
            return result;
        }).catch((err) => {
            NotificationManager.warning(err.toString())
        });
    }

    restoreProduct() {
        this.toggleModalRestore();
        let productId = this.state.products[this.state.selectedProductIndex].id;
        let restore = this.state.cancelledCount - this.state.remainsCancelled;
        let split = document.location.href.split('/');
        let orderId = split[split.length - 1];
        const ref = this;

        /*let formData = new FormData();
        formData.append("orderId", orderId);
        formData.append("isLost", isLost);*/
        fetch(`/api/manager/${productId}/restoreProduct/${orderId}/?restore=${restore}`, {
            method: "GET",
            headers: {'authorization': localStorage.getItem("authorization")}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            ref.forceUpdateHandler(result);
            return result;
        }).catch((err) => {
            NotificationManager.warning(err.toString())
        });
    }

    changeProductStatus(productId, event) {
        let status;
        let ref = this;
        if (event.target.value === "Принят") status = 1;
        else if (event.target.value === "Проверен") status = 2;
        else if (event.target.value === "Доставлен") status = 3;
        else if (event.target.value === "Утерян") status = 4;

        fetch(`/api/manager/updateProductStatus/${productId}`, {
            method: "POST",
            body: status,
            headers: {'authorization': localStorage.getItem("authorization")}
        })
            .then(function (response) {
                return response.json();
            }).then(function (result) {
            if (result !== undefined) {
                ref.forceUpdateHandler(result);
            }
        }).catch((err) => {
            NotificationManager.warning(err.toString())
        });
    }

    render() {
        return (
            <div className="row">
                <Modal isOpen={this.state.modalCancellation}>
                    <form>
                        <ModalHeader>Списать товар</ModalHeader>
                        <ModalBody className={"logoutForm"}>
                            <div className={"d-inline-block"}>
                                <label htmlFor={"inputCurrentValue"} className={"mr-sm-2"}>Текущее количество</label>
                                <input id={"inputCurrentValue"} value={this.state.remainsOfSelectedProduct}
                                       type={"number"}
                                       disabled={true} className={"form-control"}/>
                            </div>
                            <div className={"d-inline-block"} style={{marginLeft: '3%'}}>
                                <label htmlFor={"cancelValue"} className={"mr-sm-2"}>Списанное количество</label>
                                <input id={"cancelValue"} type={"number"} min={0}
                                       max={this.state.countOfSelectedProduct}
                                       className={"form-control"} onChange={this.handleInputChange}/>
                            </div>
                        </ModalBody>

                        <ModalFooter className={"logoutForm"}>
                            <Button color="danger" onClick={this.setLostState}>Списать</Button>
                            <Button style={{marginLeft: '2%', backgroundColor: '#4e4e4e'}} onClick={() => {
                                this.toggleModalCancellation()
                            }}>Отмена</Button>
                        </ModalFooter>
                    </form>
                </Modal>

                <Modal isOpen={this.state.modalRestore}>
                    <form>
                        <ModalHeader>Восстановить товар</ModalHeader>
                        <ModalBody className={"logoutForm"}>
                            <div className={"d-inline-block"}>
                                <label htmlFor={"remainsCanceled"} className={"mr-sm-2"}>Количество списаний</label>
                                <input id={"remainsCanceled"} value={this.state.remainsCancelled}
                                       type={"number"}
                                       disabled={true} className={"form-control"}/>
                            </div>
                            <div className={"d-inline-block"} style={{marginLeft: '3%'}}>
                                <label htmlFor={"cancelledCount"} className={"mr-sm-2"}>Количество
                                    восстановленного</label>
                                <input id={"cancelledCount"} type={"number"} min={0}
                                       max={this.state.cancelledCount}
                                       className={"form-control"} onChange={this.handleInputChangeTwo}/>
                            </div>
                        </ModalBody>

                        <ModalFooter className={"logoutForm"}>
                            <Button color="danger" onClick={this.restoreProduct}>Восстановить</Button>
                            <Button style={{marginLeft: '2%', backgroundColor: '#4e4e4e'}} onClick={() => {
                                this.toggleModalRestore()
                            }}>Отмена</Button>
                        </ModalFooter>
                    </form>
                </Modal>

                <div className="offset-md-1 col-md-9 form_clear">
                    <h3>Товарная партия</h3>
                    <div className="row table_header animated fadeIn">
                        <div className="col-md-2">Наименование</div>
                        <div className="col-md-2">Состояние</div>
                        <div className="col-md-2">Описание</div>
                        <div className="col-md-1">Цена</div>
                        <div className="col-md-2">Количество товаров (в наличии/списано)</div>
                        <div className="col-md-1"/>
                        <div className="col-md-1"/>
                    </div>
                    {
                        this.state.products.map((element, index) => {
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
            </div>
        );
    }
}

export default ManagerConsignment;