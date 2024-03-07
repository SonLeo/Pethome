export const SELECT_BRANDS = 'SELECT_BRANDS';

export const selectBrands = (brands) => ({
    type: SELECT_BRANDS,
    payload: brands
})