export const REGEX = {
    emailOrPhone: /^(?:[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+|0[1-9][0-9]{8})$/,
    phone: /^(?:\+84|0)[1-9][0-9]{7,8}$/,
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    password: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/
}

export const formatCurrency = (amount) => {
    if (isNaN(amount) || amount === undefined) {
        return amount;
    }
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

export const formatDate = (date) => {
    const d = new Date(date);
    const day = ("0" + d.getDate()).slice(-2);
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
}

export const calculateAmount = (price, quantity) => {
    return price * quantity;
}

export const API_URLS = {
    USERS: "http://localhost:3001/api/users",
    CARTS: "http://localhost:3001/api/carts",
    ORDERS: "http://localhost:3001/api/orders",
    PRODUCTS: "http://localhost:3001/api/products",
    POSTS: "http://localhost:3001/api/posts",
    CATEGORIES: "http://localhost:3001/api/categories",
    SUBCATEGORIES: "http://localhost:3001/api/subcategories",
    BRANDS: "http://localhost:3001/api/brands",
    VARIANTS: "http://localhost:3001/api/variants",
    BANNERSLIDES: "http://localhost:3001/api/bannerSlides",
    BANNERPRODUCTS: "http://localhost:3001/api/bannerProduct",
    BANNERSERVICES: "http://localhost:3001/api/bannerService",
    HOMEPRODUCTTABS: "http://localhost:3001/api/homeProductTabs",
}