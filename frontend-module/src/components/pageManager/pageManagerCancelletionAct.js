import React, {Component} from "react";

class ManagerCancelletionAct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productState: ""
        };
        document.title = "Акт списания"
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="offset-md-2 col-md-8 form_clear">
                        <div className="row">
                            <div className="col-md-5">
                                <h3>Акт списания</h3>
                            </div>
                        </div>
                    </div>
                    <div className="offset-md-2 col-md-8 form_clear">
                        <h3>Товарная партия</h3>
                        <div className="row table_header">
                            <div className="col-md-3">Наименование</div>
                            <div className="col-md-3">Состоние</div>
                            <div className="col-md-3">Количество</div>
                            <div className="col-md-3"/>
                        </div>

                        <div className="row table_row">
                            <div className="col-md-3">Процессор Intel</div>
                            <div className="col-md-3">{this.state.productState}</div>
                            <div className="col-md-3">100шт</div>
                            <div className="col-md-3"><span className="cancel_product">списать</span></div>
                        </div>
                    </div>
                </div>

                <div className="offset-md-2 col-md-8 form_clear">
                    <button className="btn btn-success btn_fullsize"> Сохранить</button>
                </div>
            </div>
        );
    }

}

export default ManagerCancelletionAct;