import React, { Component } from "react";


/*товарная партия*/
class EditConsigment extends React.Component{
    constructor(props) {
        super(props);
        this.changeInput = this.changeInput.bind(this);
        this.addProduct = this.addProduct.bind(this);
        const { match: { params } } = this.props;
        this.state = {
            consigmentId:params.consigmentId,
            productlist:[],
            newproduct_name:"",
            newproduct_status:"0",
        };
    }
    addProduct(){
        const prodname= this.state.newproduct_name;
        const prodstatus= this.state.newproduct_status;
        const proddesc= this.state.newproduct_description;
        var product = {
            id:this.state.productsammount,
            name:prodname,
            status:prodstatus,
            description:proddesc
        };
        var newammount=this.state.productsammount++;

        this.setState({
            productsammount:newammount
        });

        let arrayProducts = this.state.productlist;
        arrayProducts.push(product);
        this.setState({
            productlist: arrayProducts
        });
        this.setState({
            newproduct_name: "",
            newproduct_status:"0",
            newproduct_description:""
        });
    }
    changeInput(event){
        this.setState({
            [event.target.id]: [event.target.value]
        });
    }
    rendertable(product){
        if(!product) return;

        var status;
        if(product.status=="-1") status="Не выбран";
        else if(product.status=="0") status="Принят";
        else if(product.status=="1") status="Проверен";
        else if(product.status=="2") status="Доставлен";
        else if(product.status=="3") status="Утерян";

        return <div class="row table_row">
            <div class="col-md-3">{product.name}</div>
            <div class="col-md-3">{status}</div>
            <div class="col-md-3">{product.description}</div>
            <div class="col-md-3">
                <a onClick={this.deleteproduct.bind(this,
                    product.id)} className={"table_button bg-secondary text-white"}>Удалить</a>
            </div>
        </div>
    }
    render(){
        return  <div class="offset-md-2 col-md-8 form_clear">
            <h3>Товарная патрия {this.state.consigmentId}</h3>
            <div class="row">
                <di class="col-md-3">
                    <input value={this.state.newproduct_name} onChange={this.changeInput} id="newproduct_name" type="text" class="form-control" placeholder="Наименование товара"/>
                </di>
                <di class="col-md-3">
                    <select value={this.state.newproduct_status} onChange={this.changeInput} id="newproduct_status" class="custom-select">
                        <option value="0" selected >Принят</option>
                        <option value="1">Проверен</option>
                        <option value="2">Доставлен</option>
                        <option value="3">Утерян</option>
                    </select>
                </di>
                <di class="col-md-3">
                    <input value={this.state.newproduct_description} onChange={this.changeInput} id="newproduct_description"  type="text" class="form-control" placeholder="Описание, количество.."/>
                </di>
                <di class="col-md-3">
                    <button onClick={this.addProduct} type="button" class="btn btn-info btn_fullsize">Добавить</button>
                </di>
            </div>
            {
                this.state.productlist.map((element)=>{
                    return this.rendertable(element);
                })
            }
        </div>
    }
}

export default EditConsigment;