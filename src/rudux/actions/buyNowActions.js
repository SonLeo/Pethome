export const BUY_NOW = 'BUY_NOW';
export const CLEAR_BUY_NOW = 'CLEAR_BUY_NOW';

export const buyNow = (product, quantity, selectedVariants) => ({
    type: BUY_NOW,
    payload: {
        ...product,
        quantity,
        selectedVariants
    }
})

export const clearBuyNow = () => ({
    type: CLEAR_BUY_NOW
})