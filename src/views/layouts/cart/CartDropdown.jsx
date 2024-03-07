import axios from "axios";
import styles from "./CartDropdown.module.css";
import Link from "next/link";
import { SET_CART_ITEMS } from "~/rudux/actions/cartActions";
import { API_URLS } from "~/utils/commonUtils";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useUser } from "~/components/userContext";

const CartDropdown = ({ cart }) => {
    const dispatch = useDispatch();
    const { user } = useUser();
    useEffect(() => {
        if (user && user.id) {
            axios.get(`${API_URLS.CARTS}?userId=${user.id}`)
                .then(response => {
                    if (response.data && response.data.length > 0) {
                        const updatedCartItems = response.data[0].cartItems.map(item => ({ ...item, isChecked: false }));
                        dispatch({ type: SET_CART_ITEMS, payload: updatedCartItems });
                    }
                })
                .catch(error => {
                    console.error("Error fetching cart items:", error);
                });
        }
    }, [user]);

    const handleDeleteItem = async (itemId) => {
        const updatedCartItems = cart.filter(item => item.id !== itemId);
        const cartId = cart[0].cartId;
    
        try {
            const response = await axios.put(`${API_URLS.CARTS}/${cartId}`, {
                userId: user.id,
                cartItems: updatedCartItems
            });
    
            if (response.status === 200) {
                dispatch({ type: SET_CART_ITEMS, payload: updatedCartItems })
            } else {
                console.error("Error updating the cart items:", response);
            }
        } catch (error) {
            console.error("Error updating cart items:", error);
        }
    };
    
    return (
        <div className={styles.cartDropdown}>
            <h4 className={styles['cart-heading']}>Sản phẩm đã thêm</h4>
            <ul className={styles['cart-list']}>
                {
                    cart.length ? (
                        cart.map(item => (
                            <li key={item.id} className={styles['cart-item']}>
                                <img className={styles['product-img']} src={item.image} alt={item.productName} />
                                <div className={styles['product-info']}>
                                    <h5 className={styles['product-name']}>{item.productName}</h5>
                                    <div className={styles['product-price-wrap']}>
                                        <span className={styles['product-price']}>{item.price_new}</span>
                                        <span className={styles['product-multiply']}>×</span>
                                        <span className={styles['product-quantity']}>{item.quantity}</span>
                                    </div>
                                </div>
                                <button className={styles['product-remove']} onClick={() => handleDeleteItem(item.id)}>
                                    Xóa
                                </button>
                            </li>
                        ))
                    ) : (
                        <div className={styles['cart-empty']}>
                            <img src="/assets/images/cart/cart_empty_icon.png" alt="Cart Empty Icon" className={styles['cart-empty-img']} />
                            <p className={styles['cart-empty-msg']}>Giỏ hàng trống!</p>
                        </div>
                    )
                }
            </ul>
            <div className={styles['cart-footer']}>
                <Link href="/cart"><button className={styles['go-to-cart']}>Xem giỏ hàng</button></Link>
            </div>
        </div>
    );
};

export default CartDropdown;
