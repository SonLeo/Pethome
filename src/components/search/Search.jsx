import { useEffect, useState } from "react"
import styles from "./Search.module.css"
import axios from "axios";
import { API_URLS } from "~/utils/commonUtils";

export default function Search() {
    const [searchItem, setSearchItem] = useState("");
    const [results, setResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (searchItem) {
                const response = await axios.get(`${API_URLS.PRODUCTS}?q=${searchItem}`);
                const data = await response.json();
                setResults(data);
            }
        }

        fetchData();
    }, [searchItem]);

    const handleSearchChange = async (event) => {
        const value = event.target.value;
        setSearchItem(value);

        if (value) {
            const results = await searchProducts(value);
            setSuggestions(results);
        } else {
            setSuggestions([]);
        }
    }

    const selectProduct = (product) => {
        setSearchItem(product.productName);
        setSuggestions([]);
    }

    return (
        <>
            <div className={styles["search"]}>
                <form className={styles["form"]}>
                    <input 
                        type="text" 
                        name="search" 
                        value={searchItem}
                        onChange={handleSearchChange}
                        placeholder="Tìm kiếm sản phẩm..." 
                        className={styles.formControl} 
                        autoComplete="off" 

                    />
                    <button className={styles["btn"]}
                        
                    >
                        <img className={styles["searchIcon"]} src="/assets/icons/Search-white.svg" alt="Search Icon" />
                    </button>
                </form>
            </div>
            <div className={styles["suggestions"]}>
                {suggestions.map(product => (
                    <div key={product.id} onClick={() => selectProduct(product)}>
                        {product.productName}
                    </div>
                ))}
            </div>
        </>
    )
}