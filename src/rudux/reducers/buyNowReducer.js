const { BUY_NOW, CLEAR_BUY_NOW } = require("../actions/buyNowActions");

const initialState = {
    buyProduct: []
};

const buyNowReducer = (state = initialState, action) => {
    switch (action.type) {
        case BUY_NOW:
            return { ...state, buyProduct: action.payload };
        case CLEAR_BUY_NOW:
            return { ...state, buyProduct: []}
        default:
            return state;
    }
}

export default buyNowReducer;