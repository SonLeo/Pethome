import axios from "axios";
import { API_URLS } from "../utils/commonUtils";

const getCategories = async () => {
    try {
        const response = await axios.get(API_URLS.CATEGORIES)
        return response.data;
    } catch (error) {
        console.error('Error fectching categories:', error);
        throw error;
    }
};

const getSubcategories = async () => {
    try {
        const response = await axios.get(API_URLS.SUBCATEGORIES);
        return response.data;
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        throw error;
    }
}

export { getCategories, getSubcategories };