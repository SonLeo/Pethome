export const SELECT_SUBCATEGORIES = 'SELECT_SUBCATEGORIES';

export const selectSubcategories = (subcategories) => ({
    type: SELECT_SUBCATEGORIES,
    payload: subcategories
})