import React, {Component} from 'react';
import AccessErrorWindow from "./accessErrorWindow";

export default class ErrorUiHandler extends Component {


    constructor(props) {
        super(props);
        this.state = {
            err: null,
            errInfo: null
        };
    }

    componentDidCatch(err,errInfo){
        this.setState({
            err: err,
            errInfo: errInfo
        })
    }

    render() {
        if (this.state.errInfo){
            return (
                <div>
                    <AccessErrorWindow message={"Ошибка __текст ошибки__"}/>
                </div>
            );
        }else {
            return this.props.children;
        }

    }

}