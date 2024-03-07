import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./OrderHistory.module.css"
import { API_URLS, formatCurrency } from "~/utils/commonUtils";

const OrderHistory = ({ userId }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${API_URLS.ORDERS}?userId=${userId}`)
            .then(response => {
                setOrders(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching orders:", error);
                setError("Lỗi tải lịch sử mua hàng. Vui lòng thử lại!")
                setLoading(false)
            });
    }, [userId])

    if (loading) return <p style={{ textAlign: "center" }}>Đang tải lịch sử mua hàng ...</p>
    if (error) return <p style={{ textAlign: "center" }}>{error}</p>

    return (
        <>
            <h3>Lịch sử mua hàng</h3>
            {orders.length === 0 ? <p className={styles['no-order']}>Bạn chưa có đơn hàng nào!</p> :
                <ol>
                    {
                        orders.map(order => (
                            <li key={order.id}>
                                <div className={styles['order-info']}>
                                    <p className={styles['order-date']}>Đơn hàng ngày: {new Date(order.date).toLocaleDateString()}</p>
                                    <p className={styles['order-amount']}>Tổng tiền: {formatCurrency(order.totalAmount)}</p>
                                </div>
                                <table className={styles['order-products']}>
                                    <tbody>
                                        {order.orderItems.map(item => (
                                            <tr key={item.id}>
                                                <td className={styles['product-img']}><img src={item.image} alt={item.productName} width="160" /></td>
                                                <td className={styles['product-name']}><Link href={item.link}>{item.productName}</Link></td>
                                                <td className={styles['product-quantity']}>Số lượng: {item.quantity}</td>
                                                <td className={styles['product-price']}>Giá: {formatCurrency(item.price)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </li>
                        ))
                    }
                </ol>
            }
        </>
    )
}

export default OrderHistory;