import axios from 'axios';
import shorid from 'shortid';
import { useEffect, useState } from 'react';
import styles from './Order.module.css';
import { useUser } from '~/components/userContext';
import { API_URLS, formatCurrency, formatDate, calculateAmount } from '~/utils/commonUtils';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '~/components/toastContext';
import { useDispatch } from 'react-redux';
import { ADD_PREVIOUS_ORDER_TO_CART, addPreviousOrderToCart } from '~/rudux/actions/cartActions';
import { useRouter } from 'next/router';

const STATUS_MAP = {
    'Tất cả': null,
    'Đang xử lý': 'processing',
    'Đang giao': 'delivering',
    'Hoàn thành': 'completed',
    'Đã hủy': 'cancelled'
};

const getVietnameseTitle = (englishStatus) => {
    return Object.keys(STATUS_MAP).find(key => STATUS_MAP[key] === englishStatus);
};

const Order = () => {
    const { user } = useUser();
    const dispatch = useDispatch();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [selectedTab, setSelectedTab] = useState('Tất cả');
    const { showSuccessToast, showErrorToast } = useToast();

    useEffect(() => {
        if (user && user.id) {
            axios.get(`${API_URLS.ORDERS}?userId=${user.id}`)
                .then(response => {
                    const sortedOrders = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setOrders(sortedOrders);
                })
                .catch(error => {
                    console.error("Error fetching user's orders:", error);
                });
        }
    }, [user]);

    const cancelOrder = (orderId) => {
        const updatedOrders = orders.map(order => {
            if (order.id === orderId) {
                return { ...order, status: 'cancelled' };
            }
            return order;
        });
        setOrders(updatedOrders);

        axios.patch(`${API_URLS.ORDERS}/${orderId}`, { status: 'cancelled' })
            .then(response => {
                showSuccessToast("Hủy đơn hàng thành công");
            })
            .catch(error => {
                showErrorToast("Hủy đơn hàng thất bại");
            });
    };

    const rePurchase = (orderItems) => {
        dispatch(addPreviousOrderToCart({ userId: user.id, orderItems }));
        router.push("/cart");
    }
    
    const renderTabContent = () => {
        const filteredOrders = STATUS_MAP[selectedTab]
            ? orders.filter(order => order.status === STATUS_MAP[selectedTab])
            : orders;

        if (filteredOrders.length === 0) {
            return <div className={styles['empty-tab']}>Không có đơn hàng nào!</div>;
        }

        return (
            <div className={styles['order-container']}>
                {filteredOrders.map(order => (
                    <div key={order.id} className={styles['order-item']}>
                        <div className={styles['order-head']}>
                            <h3 className={styles['order-title']}>Đơn hàng #{order.id}</h3>
                            <div className={styles['order-date']}>Ngày đặt: {formatDate(order.date)}</div>
                            <div className={styles['order-status']}>{getVietnameseTitle(order.status)}</div>
                        </div>
                        <div className={styles['order-body']}>
                            {order.orderItems.map(product => (
                                <div key={shorid.generate()} className={styles['order-product']}>
                                    <div className={styles['product-detail']}>
                                        <img className={styles['product-img']} src={product.image} />
                                        <h4 className={styles['product-title']}>{product.productName}</h4>
                                    </div>
                                    <div className={styles['product-calculate']}>
                                        <span className={styles['spanroduct-price']}>{formatCurrency(product.price)}</span>
                                        <span className={styles['calculate-icon']}><FontAwesomeIcon icon={faTimes} /></span>
                                        <span className={styles['product-quantity']}>{product.quantity}</span>
                                    </div>
                                    <div className={styles['product-amount']}>{formatCurrency(calculateAmount(product.price, product.quantity))}</div>
                                </div>
                            ))}
                        </div>
                        <div className={styles['order-action']}>
                            {order.status === 'processing'
                                ? <button className={styles['btn-action']} onClick={() => cancelOrder(order.id)}>Hủy đơn</button>
                                : <button className={styles['btn-action']} onClick={() => rePurchase(order.orderItems)}>Mua lại</button>
                            }
                            <div className={styles['order-total']}>Tổng tiền: {formatCurrency(order.totalAmount)}</div>
                        </div>
                    </div>
                ))}
            </div>
        )
    };

    return (
        <section className="section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-xl-12">
                        <div className={styles['order-container']}>
                            <h2 className={styles['order-heading']}>Đơn mua</h2>
                            <div className={styles['order-tabs']}>
                                <ul className={styles['tab-list']}>
                                    {Object.keys(STATUS_MAP).map(tab => (
                                        <li
                                            key={tab}
                                            className={selectedTab === tab ? `${styles.tab} ${styles['tab-active']}` : styles['tab']}
                                            onClick={() => setSelectedTab(tab)}
                                        >
                                            {tab}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles['tab-content-container']}>
                                {renderTabContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Order;
