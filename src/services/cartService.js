import axios from "axios";
import { API_URLS } from "~/utils/commonUtils";

export const getUserCart = async (userId) => {
    try {
        const response = await axios.get(`${API_URLS.CARTS}?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
}

export const calculateTotalItems = (cartItems) => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
};