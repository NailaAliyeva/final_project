import { CHANCE_RECYCLE_BIN_TYPE_COUNT } from "./actions";

const initialState = {
    commemorative: 0,
    bullion: 0,
    exclusive: 0,
}

export function recycleBinReducer(state = initialState, action) {
    switch (action.type) {
        case CHANCE_RECYCLE_BIN_TYPE_COUNT:
            return { ...state, ...action.payload };
    }
    return state;
}