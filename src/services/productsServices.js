import axios from "axios"
import { API_URLS } from "../utils/commonUtils"

const getProducts = async () => {
    try {
        const response = await axios.get(API_URLS.PRODUCTS)
        return response.data
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error
    }
}

export { getProducts };