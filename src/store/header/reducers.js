import { CHANCE_RECYCLE_BIN_COUNT, SHOW_HISTORY } from "./actions";

const initialState = {
    count: 0,
    showHistory: false,
}

export function headerReducer(state = initialState, action) {
    switch (action.type) {
        case CHANCE_RECYCLE_BIN_COUNT:
            return { ...state, count: action.payload };
        case SHOW_HISTORY :
            return {...state, showHistory: action.payload}
    }
    return state;
}