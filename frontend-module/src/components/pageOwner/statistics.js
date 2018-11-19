import React, {Component} from 'react';

export default class CompanyOwnerStatistics extends Component {

    constructor(props){
        super(props);

    }

    xlsSender = () => {
        fetch("http://localhost:8080/api/company/statistics",  {headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(response=>{
            return response.blob()
        }).then(blob=>{
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = `${localStorage.getItem('username')}.xls`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
    };

    //todo statistics ui


    render() {
        return (
            <div>
                <br/><br/>
                <button className={'btn btn-success'} onClick={this.xlsSender}>Click me</button>
            </div>
        );
    }
}