import React from "react";


/*товарная партия*/
class EditConsignment extends React.Component {
    constructor(props) {
        super(props);
        this.changeInput = this.changeInput.bind(this);
        this.addProduct = this.addProduct.bind(this);
        const {match: {params}} = this.props;
        this.state = {
            consigmentId: params.consigmentId,
            productlist: [],
            newproduct_name: "",
            newproduct_status: "0",
        };
        document.title = "Товарная партия"
    }

    addProduct() {
        const prodname = this.state.newproduct_name;
        const prodstatus = this.state.newproduct_status;
        const proddesc = this.state.newproduct_description;
        let product = {
            id: this.state.productsammount,
            name: prodname,
            status: prodstatus,
            description: proddesc
        };
        this.setState((state) => ({
            productsammount: ++state.productsammount
        }));

        let arrayProducts = this.state.productlist;
        arrayProducts.push(product);
        this.setState({
            productlist: arrayProducts
        });
        this.setState({
            newproduct_name: "",
            newproduct_status: "0",
            newproduct_description: ""
        });

    }

    changeInput(event) {
        this.setState({
            [event.target.id]: [event.target.value]
        });
    }

    rendertable(product) {
        if (!product) return;

        let status;
        if (product.status === "-1") status = "Не выбран";
        else if (product.status === "0") status = "Принят";
        else if (product.status === "1") status = "Проверен";
        else if (product.status === "2") status = "Доставлен";
        else if (product.status === "3") status = "Утерян";

        return <div className="row table_row animated fadeInUp">
            <div className="col-md-3">{product.name}</div>
            <div className="col-md-3">{status}</div>
            <div className="col-md-3">{product.description}</div>
            <div className="col-md-3">
                <a onClick={this.deleteproduct.bind(this,
                    product.id)} className={"table_button bg-secondary text-white"}>Удалить</a>
            </div>
        </div>
    }

    render() {
        return <div className="offset-md-2 col-md-8 form_clear animated fadeIn">
            <h3>Товарная патрия {this.state.consigmentId}</h3>
            <div className="row">
                <di className="col-md-3">
                    <input value={this.state.newproduct_name} onChange={this.changeInput} id="newproduct_name"
                           type="text" className="form-control" placeholder="Наименование товара"/>
                </di>
                <div className="col-md-3">
                    <select value={this.state.newproduct_status} onChange={this.changeInput} id="newproduct_status"
                            className="custom-select">
                        <option value="0" selected>Принят</option>
                        <option value="1">Проверен</option>
                        <option value="2">Доставлен</option>
                        <option value="3">Утерян</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <input value={this.state.newproduct_description} onChange={this.changeInput}
                           id="newproduct_description" type="text" className="form-control"
                           placeholder="Описание, количество.."/>
                </div>
                <di className="col-md-3">
                    <button onClick={this.addProduct} type="button" className="btn btn-info btn_fullsize">Добавить</button>
                </di>
            </div>
            {
                this.state.productlist.map((element) => {
                    return this.rendertable(element);
                })
            }
        </div>
    }
}

export default EditConsignment;