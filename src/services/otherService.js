import axios from "axios"
import { API_URLS } from "../utils/commonUtils"

const getBannerProducts = async () => {
    try {
        const response = await axios.get(API_URLS.BANNERPRODUCTS)
        return response.data
    } catch (error) {
        console.error("Error fetching banner products:", error)
        throw error
    }
}

const getBannerServices = async () => {
    try {
        const response = await axios.get(API_URLS.BANNERSERVICES)
        return response.data
    } catch (error) {
        console.error("Error fetching banner services", error)
        throw error
    }
}

const getBannerSlides = async () => {
    try {
        const response = await axios.get(API_URLS.BANNERSLIDES)
        return response.data
    } catch (error) {
        console.error("Error fetching banner slides:", error)
        throw error
    }
}

const getHomeProductTabs = async () => {
    try {
        const response = await axios.get(API_URLS.HOMEPRODUCTTABS)
        return response.data
    } catch (error) {
        console.error("Error fetching product's tabs:", error)
        throw error
    }
}

const getNews = async () => {
    try {
        const response = await axios.get(API_URLS.POSTS)
        return response.data
    } catch (error) {
        console.error("Error fetching news:", error)
        throw error
    }
}

export { getBannerProducts, getBannerServices, getBannerSlides, getHomeProductTabs, getNews }