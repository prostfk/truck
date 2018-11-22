import React, {Component} from "react";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

class DriverConsignment extends Component {

    constructor(props) {
        super(props);
        this.getProductList = this.getProductList.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.setLostState = this.setLostState.bind(this);


        this.state = {
            products: [],
            isLost: false,

            modalCancellation: false,
            countOfSelectedProduct: 0,
            remainsOfSelectedProduct: 0,
            selectedProductIndex: 0,
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

    handleInputChange(e) {
        let newValue = this.state.countOfSelectedProduct - e.target.value;
        this.setState({
            remainsOfSelectedProduct: newValue,
        });
    }

    componentDidMount() {
        this.getProductList().then(data => {
            this.setState({products: data});
        });
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
    getProductList() {
        let split = document.location.href.split('/');
        let orderId = split[split.length - 1];
        return fetch(`http://localhost:8080/api/orders/getMyOrders/${orderId}/consignment`, {
            method: "get",
            headers: {'Auth-token': localStorage.getItem("Auth-token")}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            return result;
        }).catch((err) => {
            console.log(err);
        });
    }

    /*render row of table ( calls from html ) */
    renderTable(product, index) {
        console.log(product);
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
        if (status === "Утерян")
            isLost = true;

        return <div key={index} className="row table_row manager_orders animated fadeInUp">
            <div className="col-md-3">{product.name}</div>
            <div className="col-md-2">{status}</div>
            <div className="col-md-3">{product.description}</div>
            <div className="col-md-2">{product.price}</div>
            <div className="col-md-2"><a className="table_button bg-secondary text-white"
                                         onClick={this.toggleModalCancellation.bind(this, index)}>Списать</a></div>
        </div>
    }

    setLostState(/*productId*/) {
        this.toggleModalCancellation();

        let productId = this.state.products[this.state.selectedProductIndex].id;
        let cancel = this.state.countOfSelectedProduct - this.state.remainsOfSelectedProduct;


        let split = document.location.href.split('/');
        let orderId = split[split.length - 1];
        const ref = this;
        fetch(`http://localhost:8080/api/orders/getMyOrders/${orderId}/cancelProduct/${productId}?cancel=${cancel}`, {
            method: "GET",
            headers: {'Auth-token': localStorage.getItem("Auth-token")}
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            console.log(result);
            ref.forceUpdateHandler(result);
            return result;
        }).catch((err) => {
            console.log(err);
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

                <div className="offset-md-1 col-md-8 form_clear">
                    <h3>Товарная партия</h3>
                    <div className="row table_header">
                        <div className="col-md-3">Наименование</div>
                        <div className="col-md-2">Состоние</div>
                        <div className="col-md-3">Описание</div>
                        <div className="col-md-2">Цена</div>
                        <div className="col-md-2"/>
                    </div>
                    {
                        this.state.products.map((element, index) => {
                            return this.renderTable(element, index);
                        })
                    }
                    <div className="table_footer">
                        <nav aria-label="...">
                            <ul className="pagination pagination-sm">
                                <li className="page-item disabled">
                                    <a className="page-link" href="#" tabIndex="-1">1</a>
                                </li>
                                <li className="page-item"><a className="page-link" href="#">2</a></li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        );
    }
}

export default DriverConsignment;