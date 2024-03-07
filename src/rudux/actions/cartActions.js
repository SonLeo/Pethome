export const ADD_TO_CART = 'ADD_TO_CART';
export const DELETE_FROM_CART = 'DELETE_FROM_CART';
export const UPDATE_CART_COUNT = 'UPDATE_CART_COUNT';
export const FETCH_CART_SUCCESS = 'FETCH_CART_SUCCESS';
export const FETCH_CART_ERROR = 'FETCH_CART_ERROR';
export const SET_CART_ITEMS = 'SET_CART_ITEMS';
export const SET_SELECTED_ITEMS = 'SET_SELECTED_ITEMS';
export const FETCH_CART_ITEMS = 'FETCH_CART_ITEMS';
export const ADD_PREVIOUS_ORDER_TO_CART = 'ADD_PREVIOUS_ORDER_TO_CART';

export const addToCart = (product) => ({
    type: ADD_TO_CART,
    payload: product
});

export const deleteFromCart = (productId) => ({
    type: DELETE_FROM_CART,
    payload: productId
});

export const updateCartCount = (count) => ({
    type: UPDATE_CART_COUNT,
    payload: count
});

export const fetchCartSuccess = (cartItems) => ({
    type: FETCH_CART_SUCCESS,
    payload: cartItems
});

export const fetchCartError = (error) => ({
    type: FETCH_CART_ERROR,
    payload: error
});

export const addPreviousOrderToCart = (orderItems) => ({
    type: ADD_PREVIOUS_ORDER_TO_CART,
    payload: orderItems
});