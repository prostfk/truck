import React from "react";
import ModalComponent from './modalComponent'
/*import ReactDOM from "react";*/

class SysAdminPage extends React.Component{
    constructor(props) {
        super(props);
        this.getCompanyList = this.getCompanyList.bind(this);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
        this.sendRef = this.sendRef.bind(this);
        this.changeMail = this.changeMail.bind(this);
        this.submitLock = this.submitLock.bind(this);
        this.state = {
            companies:[],
            inputMail:""
        };
        document.title = "Список компаний"
    }
    /*update row in companies row's after change status of company*/
    forceUpdateHandler(companyId){
        const refThis = this;
        fetch('http://localhost:8080/api/companies/'+companyId, {headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(function (response) {
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
    sendRef(){
        let formData = new FormData();
        let value = this.state.inputMail;
        formData.append("email", value);
        fetch(`http://localhost:8080/api/createAdmin?email=${value}`, {method: "POST", headers: {'Auth-token': localStorage.getItem("Auth-token")}}).then(function (response) {
            response.json().then(function (data) {
                console.log(data)
                if (data.error===undefined){
                    document.getElementById('result-span').style.color = 'green';
                    document.getElementById('result-span').innerText = 'Письмо отправлено';
                    document.getElementById('user-new-form').style.display = 'none';
                    setTimeout(()=>{
                        document.getElementById('user-new-form').style.display = '';
                    },2000);
                    document.getElementById('result-span').innerText = '';
                }else{
                    document.getElementById('result-span').style.color = 'red';
                    document.getElementById('result-span').innerText = 'Неверная почта';
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
        const myRes = fetch('http://localhost:8080/api/companies', {method: "get",headers: {'Auth-token': localStorage.getItem('Auth-token')}}).then(function (response) {
            return response.json();
        }).then(function (result) {
            return result;
        });
        return myRes;
    }

    /*render row of table ( calls from html ) */
    renderTable(company){
        if(!company) return;
        const buttonactivate = <ModalComponent clickfunc={this.submitLock} className={"table_button bg-secondary text-white"} compId={company.id}/>;
        const buttondeactivate = <a onClick={this.submitUnlock.bind(this,company.id)} className={"table_button bg-secondary text-white"}>Вкл</a>;
        const lockedDate = company.lockDate==null?"":" Дата: "+ (new Date(company.lockDate));
        const titleoflock = company.active?"Активна": (company.lockerId==null?"[admin]":company.lockerId.username) + " : " +(company.lockComment==""?"[without message]":company.lockComment) + lockedDate ;
        return <div className={"row table_row"}>
            <div className={"col-md-1"}>{company.id}</div>
            <div className={"col-md-5"}>{company.name}</div>
            <div className={"col-md-3"} title={titleoflock} id={"companystatus_"+company.id}>{company.active?"Активна":"Приостановлена"}</div>
            <div className={"col-md-3"}>
{/*                <Link to={`/companylist/${company.id}`} activeClassName="active">{buttonLabel}</Link>*/}
            {company.active?buttonactivate:buttondeactivate}
            </div>
        </div>
    }

    /*button changestatus handler*/
    submitUnlock(compId, event){
        const ref = this;
        const myres = fetch('http://localhost:8080/api/companies/changeStatus', {
            method: "POST",
            body: compId,
            headers: {'Auth-token': localStorage.getItem("Auth-token")}
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

    submitLock(desc, compId){
        const ref = this;
        console.log(desc + compId);
        const myres = fetch('http://localhost:8080/api/companies/disable/'+compId, {
            method: "POST",
            body: desc,
            headers: {'Auth-token': localStorage.getItem("Auth-token")}
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
        return <div className="row">
            <div className="offset-md-1 col-md-6 superuserform_companylist">
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

            <div className="offset-md-1 col-md-3">
                <div className="">
                    <form className="superuserform_newaccountform grey_form">
                        <h5>Регистрация новой компании</h5>
                        <span id="result-span"/>
                        <div id={'user-new-form'}>
                            <div className="form-group">
                                <label htmlFor="id" id="emaillabel">Email</label>
                                <input onChange={this.changeMail} type="email" className="form-control"  id="email" placeholder="newUser@mail.com" required=""/>
                            </div>
                            <a onClick={this.sendRef} className="btn btn-success btn_fullsize">Отправить</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    }
}

export default SysAdminPage;