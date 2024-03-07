import axios from 'axios';
import { select, put, takeLatest, call } from 'redux-saga/effects';
import { API_URLS } from '~/utils/commonUtils';
import { 
    DELETE_FROM_CART, 
    FETCH_CART_SUCCESS, 
    FETCH_CART_ERROR, 
    FETCH_CART_ITEMS,
    ADD_PREVIOUS_ORDER_TO_CART,
    SET_CART_ITEMS,
    ADD_TO_CART
} from '../actions/cartActions';

function* handleError(error, errorMessage) {
    console.error(errorMessage, error);
    yield put({ type: FETCH_CART_ERROR, payload: errorMessage + error.toString() });
}

function* fetchCartItems(action) {
    try {
        const response = yield call(axios.get, `${API_URLS.CARTS}?userId=${action.payload.userId}`);
        if (response.data && response.data.length > 0) {
            yield put({ type: SET_CART_ITEMS, payload: response.data[0].cartItems });
        }
    } catch (error) {
        yield* handleError(error, 'Error fetching cart items: ');
    }
}

function* deleteFromCartSaga(action) {
    try {
        const cartId = action.payload.cartId;
        const updatedCartItems = action.payload.cartItems.filter(item => item.id !== action.payload.itemId);
        const response = yield call(axios.put, `${API_URLS.CARTS}/${cartId}`, {
            userId: action.payload.userId,
            cartItems: updatedCartItems
        });
        if (response.status === 200) {
            yield put({ type: FETCH_CART_SUCCESS, payload: updatedCartItems });
        } else {
            yield* handleError(new Error(`Response status: ${response.status}`), "Error updating the cart items: ");
        }
    } catch (error) {
        yield* handleError(error, 'Error updating cart items: ');
    }
}

function* addToCartSaga(action) {
    try {
        const { userId, productToAdd } = action.payload;
        const cartResponse = yield call(axios.get, `${API_URLS.CARTS}?userId=${userId}`);
        const cart = cartResponse.data[0];
        const updatedCartItems = cart ? [...cart.cartItems] : [];

        const existingProductIndex = productToAdd && updatedCartItems.findIndex(
            cartItem => cartItem.id === productToAdd.id
        );
        if (existingProductIndex >= 0) {
            updatedCartItems[existingProductIndex].quantity += productToAdd.quantity;
        } else {
            updatedCartItems.push({
                ...productToAdd,
            });
        }

        let response;
        if (!cart) {
            response = yield call(axios.post, `${API_URLS.CARTS}`, {
                userId,
                cartItems: updatedCartItems
            });
        } else {
            response = yield call(axios.put, `${API_URLS.CARTS}/${cart.id}`, {
                userId,
                cartItems: updatedCartItems
            });
        }

        if (response.status >= 200 && response.status < 300) {
            yield put({ type: FETCH_CART_SUCCESS, payload: updatedCartItems});
        } else {
            yield* handleError(new Error(`Mã trạng thái phản hồi: ${response.status}`), "Lỗi khi thêm sản phẩm vào giỏ hàng: ");
        }
    } catch (error) {
        yield* handleError(error, "Lỗi khi thêm sản phẩm vào giỏ hàng: ");
    }
}

function* addPreviousOrderToCartSaga(action) {
    try {
        const { userId, orderItems } = action.payload;
        const productIds = orderItems.map(item => item.productId);
        const productsResponse = yield call(axios.get, `${API_URLS.PRODUCTS}`, {
            params: { id: productIds }
        });
        const productsData = productsResponse.data;
        
        const cartResponse = yield call(axios.get, `${API_URLS.CARTS}?userId=${userId}`);
        const cart = cartResponse.data[0];

        const updatedCartItems = cart ? [...cart.cartItems] : [];

        orderItems.forEach(orderItem => {
            const product = productsData.find(prod => prod.id === orderItem.productId);
            const existingItem = updatedCartItems.find(cartItem => cartItem.productId === orderItem.productId);
            if (existingItem) {
                existingItem.quantity += orderItem.quantity;
            } else {
                updatedCartItems.push({
                    ...product,
                    ...orderItem,
                    id: product.id,
                    cartId: cart ? cart.id : undefined
                });
            }
        });

        let response;
        if (!cart) {
            response = yield call(axios.post, `${API_URLS.CARTS}`, {
                userId,
                cartItems: updatedCartItems
            });
        } else {
            response = yield call(axios.put, `${API_URLS.CARTS}/${cart.id}`, {
                userId,
                cartItems: updatedCartItems
            });
        }

        if (response.status >= 200 && response.status < 300) {
            yield put({ type: FETCH_CART_SUCCESS, payload: updatedCartItems });
        } else {
            yield* handleError(new Error(`Response status: ${response.status}`), "Error updating/creating the cart: ");
        }
    } catch (error) {
        yield* handleError(error, 'Error adding previous order items to cart: ');
    }
}

export function* watchFetchCartItems() {
    yield takeLatest(FETCH_CART_ITEMS, fetchCartItems);
}

export function* watchDeleteFromCart() {
    yield takeLatest(DELETE_FROM_CART, deleteFromCartSaga);
}

export function* watchAddToCart() {
    yield takeLatest(ADD_TO_CART, addToCartSaga);
}

export function* watchAddPreviousOrderToCart() {
    yield takeLatest(ADD_PREVIOUS_ORDER_TO_CART, addPreviousOrderToCartSaga);
}
