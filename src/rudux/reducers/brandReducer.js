import { SELECT_BRANDS } from "../actions/brandActions";

const initialState = {
    selectedBrands: []
};

const brandReducer = (state = initialState, action) => {
    switch (action.type) {
        case SELECT_BRANDS:
            return { ...state, selectedBrands: action.payload };
        default:
            return state;
    }
}

export default brandReducer;