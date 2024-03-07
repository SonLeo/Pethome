import React, { useEffect, useState } from 'react';
import styles from "./Discount.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicket } from "@fortawesome/free-solid-svg-icons";
import { useUser } from '~/components/userContext';
import axios from 'axios';
import { API_URLS } from '~/utils/commonUtils';
import { useToast } from '~/components/toastContext';

const Discount = ({ onVoucherApplied, calculateTotalProductPrice }) => {
    const { user } = useUser();
    const [selectedVoucher, setSelectedVoucher] = useState('');
    const [isVoucherListVisible, setVoucherListVisible] = useState(false);
    const [vouchers, setVouchers] = useState([]);
    const { showSuccessToast, showErrorToast } = useToast();

    useEffect(() => {
        const fetchUserData = async () => {
            if (user && user.id) {
                try {
                    const response = await axios.get(`${API_URLS.USERS}/${user.id}`);
                    if (response.data && Array.isArray(response.data.vouchers)) {
                        setVouchers(response.data.vouchers);
                    } else {
                        setVouchers([]);
                    }
                } catch (error) {
                    console.error("Error fetching vouchers:", error);
                }
            }
        };
        fetchUserData();
    }, [user]);

    const handleInputChange = (e) => {
        setSelectedVoucher(e.target.value)
    }

    const handleVoucherChange = (e) => {
        setSelectedVoucher(e.target.value);
    };

    const toggleVoucherList = (e) => {
        e.preventDefault();
        setVoucherListVisible(!isVoucherListVisible);
    };

    const isVoucherValid = (voucherCode, totalOrderValue) => {
        const currentDate = new Date();
        const voucher = vouchers.find(vou => vou.title === voucherCode);
        if (!voucher) {
            return false;
        }

        const startDate = new Date(voucher.startDate);
        const endDate = new Date(voucher.endDate);
        if (currentDate < startDate || currentDate > endDate) {
            return false;
        }
        
        if (voucher.minOrderValue && totalOrderValue < voucher.minOrderValue) {
            return false;
        }

        return true;
    }

    const applyVoucher = () => {
        if (!selectedVoucher) {
            showErrorToast("Bạn chưa chọn voucher nào!");
            return;
        }

        if (isVoucherValid(selectedVoucher, calculateTotalProductPrice)) {
            const appliedVoucher = vouchers.find(vou => vou.title === selectedVoucher);
            onVoucherApplied(appliedVoucher);
            showSuccessToast("Áp dụng voucher thành công!");
        } else {
            showErrorToast("Voucher không hợp lệ, vui lòng kiểm tra lại!");
        }
    }

    const handleApplyVoucher = (e) => {
        e.preventDefault();
        applyVoucher();
    };

    return (
        <>
            <h3 className={styles['discount-heading']}>Voucher <FontAwesomeIcon icon={faTicket} /></h3>
            <form onSubmit={handleApplyVoucher} className={styles['form-group-voucher']}>
                <div className={styles['voucher-control']}>
                    <input
                        type="text"
                        name="voucher"
                        className={styles['voucher-input']}
                        placeholder="Mã giảm giá"
                        value={selectedVoucher}
                        onChange={handleInputChange}
                    />
                    <button className={`${styles['form-submit']} ${styles['form-btn']}`} type="submit">Sử dụng</button>
                    <button className={`${styles['form-toggle']} ${styles['form-btn']}`} onClick={toggleVoucherList}>{isVoucherListVisible ? "Ẩn voucher" : "Chọn voucher"}</button>
                </div>
                {isVoucherListVisible && (
                    vouchers.length > 0 ? (
                        <ul className={styles['voucher-list']}>
                            {vouchers.map(voucher => (
                                <li key={voucher.title}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="voucherRadio"
                                            className={styles['voucher-radio']}
                                            value={voucher.title}
                                            checked={selectedVoucher === voucher.title}
                                            onChange={handleVoucherChange}
                                        />
                                        <div className={styles['voucher-content']}>
                                            <h4 className={styles['voucher-title']}>{voucher.title}</h4>
                                            <p className={styles['voucher-detail']}>{voucher.detail}</p>
                                        </div>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <ul className={styles['voucher-list']}>
                            <p className={styles['no-voucher-message']}>Bạn chưa có voucher nào!</p>
                        </ul>
                    )
                )}
            </form>
        </>
    )
}

export default Discount;
