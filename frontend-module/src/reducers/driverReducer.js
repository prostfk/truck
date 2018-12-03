import {UPLOAD_ORDERS} from "../constants/driverActionTypes";

export default (state = [], action) => {
    switch (action.type) {
        case UPLOAD_ORDERS:
            return [
                action.payload
            ];
        default:
            return state;
    }
}