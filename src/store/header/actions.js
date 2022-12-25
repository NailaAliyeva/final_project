export const CHANCE_RECYCLE_BIN_COUNT = 'CHANCE_RECYCLE_BIN_COUNT';
export const SHOW_HISTORY = 'SHOW_HISTORY';

export const setCountRecycleBin = (count) => ({
    type: CHANCE_RECYCLE_BIN_COUNT,
    payload: count
})

export const showHistori = (val) => ({
    type: SHOW_HISTORY,
    payload: val
})
