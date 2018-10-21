import React, { Component } from "react";
/*import { Link } from 'react-router-dom'*/

class EditCompanyPage extends React.Component {
    constructor(props){
        super(props);
        const { match: { params } } = this.props;
        this.state = {
            companyId:params.companyId
        }
    }
    render(){
        if(!this.state.companyId){
           return <h1>Error loading page</h1>
        }
        return <h1>Edit company {this.state.companyId} </h1>
    }
}

export default EditCompanyPage;