import { combineReducers } from "redux";
// import { topBodyReducer } from './body-top/reducers'
import { headerReducer } from './header/reducers'
import { recycleBinReducer } from "./recycle-bin/reducers";

export default combineReducers({
    // topBody: topBodyReducer,
    header: headerReducer,
    recycleBin: recycleBinReducer
})