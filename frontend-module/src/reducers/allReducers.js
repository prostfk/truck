import {combineReducers} from "redux";
import driverReducer from './driverReducer';
import userReducer from "./userReducer";

export default combineReducers({
    driverReducer,
    userReducer
});