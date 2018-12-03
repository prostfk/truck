import {DELETE_ORDER, UPLOAD_ORDERS} from "../constants/driverActionTypes";

export default (state = [], action) => {
    switch (action.type) {
        case UPLOAD_ORDERS:
            return [
                action.payload
            ];
        case DELETE_ORDER:
            let temp = state;
            for (let i = 0; i < temp.length; i++) {
                if (temp[i].id === action.payload) {
                    temp.splice(i, 1);
                    break;
                }
            }
            return [
                temp
            ];
        default:
            return state;
    }
}