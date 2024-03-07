import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./Checkout.module.css";
import { useUser } from "~/components/userContext";
import { API_URLS, formatCurrency } from '~/utils/commonUtils';
import ShipmentDetails from "./shipmentDetails/ShipmentDetails";
import Discount from "./discount/discount";
import PaymentMethods from "./payment/PaymentMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEquals, faTimes } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useToast } from "~/components/toastContext";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { clearBuyNow } from "~/rudux/actions/buyNowActions";

const Checkout = () => {
    const [discount, setDiscount] = useState(0);
    const [cartId, setCartId] = useState(null);
    const { user } = useUser();
    const { showSuccessToast, showErrorToast } = useToast();
    const router = useRouter();
    const shippingCost = 30000;
    const selectedProducts = useSelector(state => state.cart.selectedItems);
    const buyProduct = useSelector(state => state.buyNow.buyProduct);
    const dispatch = useDispatch();
    const productToCheckout = buyProduct.length !== 0 ? [buyProduct] : selectedProducts;

    console.log(buyProduct)

    const [shippingInfo, setShippingInfo] = useState({
        receiver: user ? user.username : "",
        phone: user ? user.phone : "",
        address: user ? user.address : "",
        note: ""
    });

    useEffect(() => {
        if (productToCheckout.length === 0) {
            showErrorToast("Bạn chưa chọn sản phẩm để thanh toán!");
            router.push('/cart');
        }
    }, []);

    useEffect(() => {
        if (user && user.id) {
            axios.get(`${API_URLS.CARTS}?userId=${user.id}`)
                .then(response => {
                    if (response.data && response.data.length > 0) {
                        const userCart = response.data[0];
                        setCartId(userCart.id);
                    }
                })
                .catch(error => {
                    console.error("Error fetching cart:", error);
                });
        }
    }, [user]);

    useEffect(() => {
        setShippingInfo({
            receiver: user ? user.username : "",
            phone: user ? user.phone : "",
            address: user ? user.address : "",
            note: ""
        });
    }, [user]);

    const handleShippingInfoChange = (updatedInfo) => {
        setShippingInfo(updatedInfo);
    };

    const handleCheckout = async () => {
        try {
            const newOrder = {
                userId: user.id,
                date: new Date().toISOString(),
                totalAmount: calculateTotalAmountAfterDiscount(),
                status: "processing",
                note: shippingInfo.note,
                shipping: {
                    address: shippingInfo.address,
                    estimateDelivery: new Date(new Date().getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString(),
                    recipientName: shippingInfo.receiver,
                    recipientPhone: shippingInfo.phone
                },
                history: [{
                    date: new Date().toISOString(),
                    action: "Order created"
                }],
                payment: {
                    method: "cash",
                    status: "paid",
                    transactionId: null
                },
                orderItems: productToCheckout.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    productName: item.productName,
                    price: item.price_new,
                    link: item.link,
                    image: item.image
                }))
            };

            const response = await axios.post(`${API_URLS.ORDERS}`, newOrder);

            if (response.status === 200 || response.status === 201) {
                showSuccessToast("Đặt hàng thành công!");
                dispatch(clearBuyNow());
                if (cartId) {
                    const cartResponse = await axios.get(`${API_URLS.CARTS}/${cartId}`);
                    const currentCartItems = cartResponse.data.cartItems;
                    const remainingItems = currentCartItems.filter(item =>
                        !selectedProducts.some(selectedItem => selectedItem.productId === item.productId && selectedItem.id === item.id)
                    );
                    
                    await axios.put(`${API_URLS.CARTS}/${cartId}`, {
                        ...cartResponse.data,
                        cartItems: remainingItems
                    });
                }
                router.push(`/order`);
                
            } else {
                showErrorToast("Đặt hàng thất bại!");
            }
        } catch (error) {
            showErrorToast("Có lỗi xảy ra, vui lòng thử lại!");
        }
    }

    const calculateTotalProductPrice = () => {
        return productToCheckout.reduce((acc, item) => acc + (item.price_new * item.quantity), 0);
    }

    const onVoucherApplied = (voucher) => {
        let newDiscount = 0;
        if (voucher.discountType === 'percent') {
            newDiscount = (calculateTotalProductPrice() * voucher.value) / 100;
        } else if (voucher.discountType === 'amount') {
            newDiscount = voucher.value;
        }

        console.log("New discount value:", newDiscount);
        setDiscount(newDiscount);
    }

    const calculateTotalAmountAfterDiscount = () => {
        return calculateTotalProductPrice() + shippingCost - discount;
    }

    return (
        <section className="section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-xl-12">
                        <h2 className={styles['checkout-heading']}>Thanh toán</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 col-xl-6">
                        <h3 className={styles['checkout-sub-heading']}>Sản phẩm</h3>
                        <ul className={styles['product-list']}>
                            {productToCheckout.map(item => (
                                <li className={styles['product-item']} key={item.id}>
                                    <div className={styles['product-image']}><img src={item.image} /></div>
                                    <div className={styles['product-details']}>
                                        <h4 className={styles['product-name']}>{item.productName}</h4>
                                        <div>
                                            <span className={styles['product-price']}>{formatCurrency(item.price_new)}</span>
                                            <span className={styles['product-icon']}><FontAwesomeIcon icon={faTimes} /></span>
                                            <span className={styles['product-quantity']}>{item.quantity}</span>
                                            <span className={styles['product-icon']}><FontAwesomeIcon icon={faEquals} /></span>
                                            <span className={styles['product-amount']}>{formatCurrency(item.price_new * item.quantity)}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className={styles['calculate']}>
                            <div className={styles['summary']}>
                                <div className={styles['summary-item']}>
                                    <span className={styles['summary-label']}>Tạm tính:</span>
                                    <span className={styles['summary-value']}>{formatCurrency(calculateTotalProductPrice())}</span>
                                </div>
                                <div className={styles['summary-item']}>
                                    <span className={styles['summary-label']}>Phí vận chuyển:</span>
                                    <span className={styles['summary-value']}>{formatCurrency(30000)}</span>
                                </div>
                                <div className={styles['discount-section']}>
                                    <span className={styles['discount-label']}>Giảm giá:</span>
                                    <span className={styles['discount-value']}>{formatCurrency(discount)}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles['final-total']}>
                            <span className={styles['final-total-label']}>Tổng thanh toán:</span>
                            <span className={styles['final-total-value']}>{formatCurrency(calculateTotalAmountAfterDiscount())}</span>
                        </div>
                        <div className={styles['actions']}>
                            <div className="row">
                                <div className="col-lg-6 col-xl-6">
                                    <div className={styles['back-to-cart']}>
                                        <Link href="http://localhost:3000/cart">Quay lại giỏ hàng</Link>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-xl-6">
                                    <button className={styles['checkout-btn']} onClick={handleCheckout}>Đặt hàng ngay</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-xl-6">
                        <ShipmentDetails
                            onShippingInfoChange={handleShippingInfoChange}
                        />
                        <Discount
                            onVoucherApplied={onVoucherApplied}
                            calculateTotalProductPrice={calculateTotalProductPrice()}
                        />
                        <PaymentMethods />
                    </div>
                </div>

            </div>
        </section>
    );
}

export default Checkout;
