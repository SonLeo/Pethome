import { all } from 'redux-saga/effects';
import { watchAddPreviousOrderToCart, watchAddToCart, watchDeleteFromCart, watchFetchCartItems } from './cartSagas';

export default function* rootSaga() {
    yield all([
        watchFetchCartItems(),
        watchDeleteFromCart(),
        watchAddPreviousOrderToCart(),
        watchAddToCart()
    ]);
}
