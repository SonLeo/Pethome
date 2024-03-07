import Link from 'next/link';
import React from 'react';
import styles from './ProductItem.module.css'
import { formatCurrency } from '~/utils/commonUtils';
import ProductRating from '../productRating/ProductRating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons"
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons"
import { useUser } from '../userContext';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useToast } from '../toastContext';
import { buyNow } from '~/rudux/actions/buyNowActions';
import { addToCart } from '~/rudux/actions/cartActions';

export default function ProductItem({ product }) {
    const { user } = useUser();
    const router = useRouter();
    const dispatch = useDispatch();
    const { showSuccessToast, showErrorToast } = useToast();
    const quantity = 1;
    const selectedVariants = {};

    const handleBuyNow = () => {
        dispatch(buyNow(product, quantity, selectedVariants));
        router.push("/checkout");
    }

    const handleAddToCart = () => {
        if (user) {
            dispatch(addToCart({
                userId: user.id,
                productToAdd: {
                    ...product,
                    quantity,
                }
            }));
            showSuccessToast("Đã thêm sản phẩm vào giỏ hàng!");
        } else {
            showErrorToast("Bạn cần đăng nhập trước!");
        }
    }

    return (
        <div className={styles["product-item"]}>
            <Link className={styles["product-link"]} href={product.link} title={product.productName}>
                <div className={styles["product-img"]}>
                    <img src={product.image} alt={product.productName} />
                </div>
                <h4 className={styles["product-name"]}>{product.productName}</h4>
                <div className={styles["product-price"]}>
                    <span className={styles["price-old"]}>
                        {product.price_old && formatCurrency(product.price_old)}
                    </span>
                    <span style={product.price_old ? { marginLeft: "10px" } : {}} className={styles["price-new"]}>
                        {product.price_new && formatCurrency(product.price_new)}
                    </span>
                </div>
                <div className={styles["product-liked"]}>
                    {product.like ? (
                        <FontAwesomeIcon icon={fasHeart} />
                    ) : (
                        <FontAwesomeIcon icon={farHeart} />
                    )}
                    <span className={styles["liked-text"]}> yêu thích</span>
                </div>
                <div className={styles["product-details"]}>
                    <span className={styles["product-rating"]}>
                        <ProductRating product={product} />
                    </span>
                    <span className={styles["product-sold"]}>
                        {product.sold} đã bán
                    </span>
                </div>
            </Link>

            <div className={styles["button-block"]}>
                <button 
                    className={`${styles["btn-add-cart"]} ${styles["btn"]}`}
                    onClick={handleAddToCart}
                >
                    Thêm
                    <div className={styles["add-cart-icon"]}>
                        <FontAwesomeIcon icon={faCartPlus} />
                    </div>
                </button>
                <button
                    className={`${styles["btn-buy"]} ${styles["btn"]}`}
                    onClick={handleBuyNow}
                >
                    Mua ngay
                </button>
            </div>
        </div>
    )
}