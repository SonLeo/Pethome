import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "~/components/userContext";
import styles from "./Cart.module.css"
import { API_URLS, formatCurrency, calculateAmount } from '~/utils/commonUtils';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/router";
import { useToast } from "~/components/toastContext";
import { useDispatch, useSelector } from "react-redux";
import { SET_CART_ITEMS, SET_SELECTED_ITEMS } from "~/rudux/actions/cartActions";

const Cart = () => {
    const dispatch = useDispatch();
    const { user } = useUser();
    const router = useRouter();
    const { showErrorToast } = useToast();
    const cartItems = useSelector(state => state.cart.cartItems);
    const [isAllChecked, setIsAllChecked] = useState(false);

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

    const handleSelectAll = () => {
        const newIsAllChecked = !isAllChecked;
        setIsAllChecked(newIsAllChecked);
        const updatedCartItems = cartItems.map(item => ({ ...item, isChecked: newIsAllChecked }));
        dispatch({ type: SET_CART_ITEMS, payload: updatedCartItems });
    }

    const handleProductCheck = (itemId) => {
        const updatedCartItems = cartItems.map(item => {
            if (item.id === itemId) {
                return { ...item, isChecked: !item.isChecked }
            }
            return item;
        });
        const allChecked = updatedCartItems.every(item => item.isChecked);
        setIsAllChecked(allChecked);
        dispatch({ type: SET_CART_ITEMS, payload: updatedCartItems });
    };

    const handleDeleteSelected = async () => {
        const updatedCartItems = cartItems.filter(item => !item.isChecked);
        const cartId = cartItems[0].cartId;

        try {
            const response = await axios.put(`${API_URLS.CARTS}/${cartId}`, {
                userId: user.id,
                cartItems: updatedCartItems
            });

            if (response.status === 200) {
                dispatch({ type: SET_CART_ITEMS, payload: updatedCartItems });
            } else {
                console.error("Error updating the cart items:", response);
            }
        } catch (error) {
            console.error("Error updating cart items:", error);
        }
    };

    const handleQuantityChange = (itemId, change) => {
        const updatedCartItems = cartItems.map(item => {
            if (item.id === itemId) {
                const newQuantity = item.quantity + change;
                return { ...item, quantity: newQuantity};
            }
            return item;
        })
        dispatch({ type: SET_CART_ITEMS, payload: updatedCartItems });
    }

    const handleInputChange = (itemId, e) => {
        const value = e.target.value;
        const updatedCartItems = cartItems.map(item => {
            if (item.id === itemId) {
                return { ...item, quantity: value };
            }
            return item;
        })
        dispatch({ type: SET_CART_ITEMS, payload: updatedCartItems });
    }

    const handleInputBlur = (itemId, e) => {
        const value = parseInt(e.target.value);
        const itemStock = cartItems.find(item => item.id === itemId)?.stockQuantity || 0;

        const updatedCartItems = cartItems.map(item => {
            if (item.id === itemId) {
                if (isNaN(value) || value < 0) {
                    return { ...item, quantity: item.quantity };
                } else if (value > itemStock) {
                    showErrorToast(`sản phẩm bạn chọn chỉ còn ${itemStock} sản phẩm`);
                    return { ...item, quantity: itemStock };
                } else {
                    return { ...item, quantity: value };
                }
            }
            return item;
        });
        dispatch({ type: SET_CART_ITEMS, payload: updatedCartItems });
    }

    const handleDeleteItem = async (itemId) => {
        const updatedCartItems = cartItems.filter(item => item.id !== itemId)
        const cartId = cartItems[0].cartId;

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

    const handlePurchase = () => {
        if (selectedItemsCount > 0) {
            const selectedProducts = cartItems.filter(item => item.isChecked);
            dispatch({ type: SET_SELECTED_ITEMS, payload: selectedProducts });
            router.push('/checkout');
        } else {
            showErrorToast('Bạn chưa chọn sản phẩm nào!')
        }
    };

    const selectedItemsCount = cartItems.filter(item => item.isChecked).length;
    const totalAmount = cartItems.filter(item => item.isChecked).reduce((acc, item) => acc + (item.price_new * item.quantity), 0);

    return (
        <>
            <section className="section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-xl-12">
                            <div className={styles['cart-container']}>
                                <h2 className={styles['cart-heading']}>Giỏ hàng của bạn</h2>
                                <div className={styles['cart-list']}>
                                    <div className={styles['select-all']}>
                                        <input type="checkbox" id="check-all" checked={isAllChecked} onChange={handleSelectAll} /> <label htmlFor="check-all">Chọn tất cả sản phẩm</label>
                                    </div>
                                    <ul className={styles['list-head']}>
                                        <li className={styles['head-item']}>Sản phẩm</li>
                                        <li className={styles['head-item']}>Đơn giá</li>
                                        <li className={styles['head-item']}>Số lượng</li>
                                        <li className={styles['head-item']}>Thành tiền</li>
                                        <li className={styles['head-item']}>Thao tác</li>
                                    </ul>
                                    {cartItems.length === 0 ? (
                                        <p className={styles['cart-empty']}>Giỏ hàng trống!</p>
                                    ) : cartItems.map(item => (
                                        <div className={styles['cart-item']} key={item.id}>
                                            <div className={styles['product-details']}>
                                                <input className={styles['product-check']} type="checkbox" checked={item.isChecked} onChange={() => handleProductCheck(item.id)} />
                                                <Link className={styles['product-link']} href={item.link}>
                                                    <img className={styles['product-image']} src={item.image} alt="Product image" width={80} />
                                                    <span className={styles['product-name']}>{item.productName}</span>
                                                </Link>
                                            </div>
                                            <div className={styles['product-price']}>
                                                <span className={styles['price-old']}>{item.price_old && formatCurrency(item.price_old)}</span>
                                                <span style={{ marginLeft: "10px" }} className={styles['price-new']}>{formatCurrency(item.price_new)}</span>
                                            </div>
                                            <div className={styles['product-quantity']}>
                                                <button
                                                    className={`${styles.btn} ${styles['quantity-decrease']}`}
                                                    onClick={() => handleQuantityChange(item.id, -1)}
                                                    disabled={item.quantity < 2}
                                                >
                                                    <FontAwesomeIcon icon={faMinus} />
                                                </button>
                                                <input
                                                    type="text"
                                                    value={item.quantity}
                                                    onChange={(e) => handleInputChange(item.id, e)}
                                                    onBlur={(e) => handleInputBlur(item.id, e)}
                                                />
                                                <button
                                                    className={`${styles.btn} ${styles['quantity-increase']}`}
                                                    onClick={() => handleQuantityChange(item.id, 1)}
                                                    disabled={item.quantity >= item.stockQuantity}
                                                >
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </button>
                                            </div>
                                            <div className={styles['product-amount']}>
                                                <span>{formatCurrency(calculateAmount(item.price_new, item.quantity))}</span>
                                            </div>
                                            <div className={styles['product-action']}>
                                                <button className={styles.delete} onClick={() => handleDeleteItem(item.id)}>Xóa</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.purchase}>
                        <div className="row">
                            <div className="col-lg-12 col-xl-12">
                                <div className={styles['select-status']}>
                                    Bạn đã chọn <strong>{selectedItemsCount}</strong> sản phẩm
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 col-xl-12">
                                <div className={styles['purchase-details']}>
                                    <div className={styles['purchase-select-all']}>
                                        <input type="checkbox" id="purchase-check-all" checked={isAllChecked} onChange={handleSelectAll} /> <label htmlFor="purchase-check-all">Chọn tất cả sản phẩm</label>
                                    </div>
                                    <div className={styles['delete-checked']} onClick={handleDeleteSelected}>
                                        Xóa <span><strong>{selectedItemsCount}</strong></span> sản phẩm đã chọn
                                    </div>
                                    <div className={styles['purchase-amount']}>
                                        Tổng thanh toán ({selectedItemsCount} sản phẩm): <span className={styles['purchase-amount-details']}>{formatCurrency(totalAmount)}</span>
                                    </div>
                                    <button className={styles['purchase-btn']} onClick={handlePurchase}>Mua hàng</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Cart;
