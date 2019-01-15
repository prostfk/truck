import axios from 'axios';
import {NotificationManager} from 'react-notifications';
const ApiUtil = async (url, method = 'get', data = {}, headers = {},errCallback) => {
    headers.Accept = 'application/json;charset=UTF-8';
    console.log(headers);
    if (localStorage.getItem('Auth-token')){
        headers['Auth-token'] = localStorage.getItem('Auth-token')
    }
    let resp;
    switch (method.toUpperCase()) {
        case 'POST':
            resp = await axios.post(url,data,{headers}).then(resp=>resp).catch(err=>processError(err,errCallback));break;
        case 'PUT':
            resp = await axios.put(url,data,{headers}).then(resp=>resp).catch(err=>processError(err,errCallback));break;
        case 'DELETE':
            resp = await axios.delete(url,{headers}).then(resp=>resp).catch(err=>processError(err,errCallback));break;
        default:
            resp = await axios.get(url,{headers}).catch(err=>processError(err,errCallback));break;
    }
    console.log(resp.data);
    return await resp.data;
};

const processError = (err, callback) => {
    if (callback){
        callback(err);
    }else{
        NotificationManager.warning(err.toString());
    }
};
export default ApiUtil;