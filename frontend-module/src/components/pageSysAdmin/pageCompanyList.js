import React from "react";
/*import ReactDOM from "react";*/

class SysAdminPage extends React.Component{
    constructor(props) {
        super(props);
        this.getCompanyList = this.getCompanyList.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.sendref = this.sendref.bind(this);
        this.changeMail = this.changeMail.bind(this);
        this.state = {
            companies:[],
            inputMail:""
        };
        document.title = "Список компаний"
    }
    /*update row in companies row's after change status of company*/
    forceUpdateHandler(companyId){
        const refThis = this;
        fetch('http://localhost:8080/api/companies/'+companyId, {method: "get"}).then(function (response) {
            return response.json();
        }).then(function (result) {
            refThis.state.companies.find((element, index, array)=>{
                if(element.id===companyId){
                    const newCompanies = refThis.state.companies;
                    newCompanies[index] = result;
                    refThis.setState({companies:newCompanies});
                }
            });
        })
    };
    changeMail(event){
        this.setState({
            inputMail: event.target.value
        })
    }
    sendref(){
        let formData = new FormData();
        let value = this.state.inputMail;
        formData.append("email", value);
        fetch('http://localhost:8080/createAdmin', {method: "POST", body: formData}).then(function (response) {
            response.json().then(function (data) {
                if (data.error===undefined){
                    document.getElementById('emaillabel').innerText = 'Check your email';
                }else{
                    document.getElementById('emaillabel').innerText = 'check you data';
                }
            })
        })
    }
    /*auto run when page init*/
    componentDidMount(){
        this.getCompanyList().then(data => {
            this.setState({companies:data});
        });
    }

    /*get all company list*/
    getCompanyList() {
        const myRes = fetch('http://localhost:8080/api/companies', {method: "get",headers: {'Auth-token': sessionStorage.getItem('Auth-token')}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            return result;
        });
        return myRes;
    }

    /*render row of table ( calls from html ) */
    renderTable(company){
        if(!company) return;
        const buttonLabel = "Вкл/Выкл";
        return <div className={"row table_row"}>
            <div className={"col-md-1"}>{company.id}</div>
            <div className={"col-md-5"}>{company.name}</div>
            <div className={"col-md-3"} id={"companystatus_"+company.id}>{company.active?"Активна":"Приостановлена"}</div>
            <div className={"col-md-3"}>
{/*                <Link to={`/companylist/${company.id}`} activeClassName="active">{buttonLabel}</Link>*/}
                <a onClick={this.changeCompanyStatus.bind(this,company.id)} className={"table_button bg-secondary text-white"}>{buttonLabel}</a>
           </div>
        </div>
    }

    /*button changestatus handler*/
    changeCompanyStatus(compId,event){
        const ref = this;
        const myres = fetch('http://localhost:8080/api/companies/changeStatus', {
            method: "POST",
            body: compId
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            if (result === true) {
                ref.forceUpdateHandler(compId);
            }
            return result;
        }).catch((err) => {
            console.log(err);
        });
    }

    render(){
        return <div class="row">
            <div class="offset-md-1 col-md-6 superuserform_companylist">
                <div className="row table_header">
                    <div className="col-md-1">ID</div>
                    <div className="col-md-5">Название компании</div>
                    <div className="col-md-3">Статус</div>
                    <div className="col-md-3">Действие</div>
                </div>
                    {
                        this.state.companies.map((element)=>{
                            return this.renderTable(element);
                        })
                    }
                <div className="row">
                    <nav aria-label="...">
                        <ul class="pagination pagination-sm">
                            <li class="page-item disabled">
                                <a class="page-link" href="#" tabindex="-1">1</a>
                            </li>
                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                            <li class="page-item"><a class="page-link" href="#">3</a></li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div class="offset-md-1 col-md-3">
                <form class="superuserform_newaccountform grey_form">
                    <h5>Регистрация новой компании</h5>
                    <div class="form-group">
                        <label htmlFor="id" id="emaillabel">Email</label>
                        <input onChange={this.changeMail} type="email" class="form-control"  id="email" placeholder="newUser@mail.com" required=""/>
                    </div>
                    <a onClick={this.sendref} class="btn btn-success btn_fullsize">Отправить</a>
                </form>
            </div>

        </div>
    }
}

export default SysAdminPage;