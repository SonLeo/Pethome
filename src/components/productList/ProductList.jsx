import ProductItem from "../productItem/ProductItem";
import styles from "./ProductList.module.css"

export default function ProductList({ products }) {
    return (
        <div className="row">
            <div className={styles['products']}>
                {products.map(product => (
                    <div key={product.id} className={`col-md-3 ${styles['product-wrapper']}`}>
                        <ProductItem product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}