import React from "react";
import Link from "react-router-dom/es/Link";
import {EditIcon} from "../pageAdmin/pageAutoList";
const moment = require('moment');

const UsersList = () => {
    let timeZoneOffset = new Date().getTimezoneOffset();
    return <div>
        {
            this.props.users ? this.props.users.map((user, index)=>{
                return <div className={'row table_row animated fadeInUp'} key={index}>
                    <div className={'col-md-3'}>{user.username}</div>
                    <div className={'col-md-3'}>{russianRole(user.userRole)}</div>
                    <div className={'col-md-3'}>{moment(user.reg_date == null ? "-" : moment().utc(user.reg_date)).utcOffset(-timeZoneOffset).format('YYYY-MM-DD HH:mm')}</div>
                    <div className={'col-md-2'} style={{'overflow': 'hidden'}}>{user.email}</div>
                    {user.userRole !== 'ROLE_COMP_OWNER' ?
                        <div className={'col-md-1'}><Link to={`/user/${user.id}/edit`}><EditIcon/></Link></div> : <div/>}
                </div>
            }) : <div/>

        }
    </div>
};

const russianRole = (role) => {
    switch (role) {
        case 'ROLE_ADMIN':
            return 'Администратор';
        case 'ROLE_DISPATCHER':
            return 'Диспетчер';
        case 'ROLE_MANAGER':
            return 'Менеджер';
        case 'ROLE_DRIVER':
            return 'Водитель';
        case 'ROLE_COMP_OWNER':
            return 'Владелец';
        default:
            return role;
    }
};

export default UsersList;