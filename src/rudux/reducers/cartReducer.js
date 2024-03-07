import {
  ADD_PREVIOUS_ORDER_TO_CART,
  ADD_TO_CART,
  FETCH_CART_ERROR,
  FETCH_CART_SUCCESS,
  SET_CART_ITEMS,
  SET_SELECTED_ITEMS,
  UPDATE_CART_COUNT,
} from "../actions/cartActions";

const initialState = {
  cartItems: [],
  selectedItems: [],
  count: 0,
  error: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CART_SUCCESS:
      return {
        ...state,
        cartItems: action.payload,
        count: action.payload.length,
      };
    case FETCH_CART_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_CART_COUNT:
      return {
        ...state,
        count: action.payload,
      };
    case SET_CART_ITEMS:
      return {
        ...state,
        cartItems: action.payload,
      };
    case SET_SELECTED_ITEMS:
      return {
        ...state,
        selectedItems: action.payload,
      };
    case ADD_TO_CART:
      const productToAdd = action.payload;
      if (!productToAdd || Object.keys(productToAdd).length === 0) {
        return state;
      }
      const existingProductIndex = state.cartItems.findIndex(
        cartItem => cartItem.productId === productToAdd.productId
      );
      let newCartItems;
      if (existingProductIndex >= 0) {
        newCartItems = [...state.cartItems];
        newCartItems[existingProductIndex].quantity += productToAdd.quantity;
      } else {
        newCartItems = [...state.cartItems, productToAdd]
      }
      return { ...state, cartItems: newCartItems };
    case ADD_PREVIOUS_ORDER_TO_CART:
      const updatedCart = [...state.cartItems];
      const orderItems = Array.isArray(action.payload) ? action.payload : [];

      orderItems.forEach((orderItem) => {
        const existingProductIndex = updatedCart.findIndex(
          (cartItem) => cartItem.productId === orderItem.productId
        );
        if (existingProductIndex >= 0) {
          updatedCart[existingProductIndex].quantity += orderItem.quantity;
        } else {
          updatedCart.push(orderItem);
        }
      });
      return { ...state, cartItems: updatedCart };
    default:
      return state;
  }
};

export default cartReducer;
