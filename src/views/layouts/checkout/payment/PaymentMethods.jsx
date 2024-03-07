import React, { useState } from 'react';
import styles from "./PaymentMethods.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const PaymentMethods = () => {
    const [selectedMethod, setSelectedMethod] = useState('cod');

    const paymentMethods = [
        {
            value: 'apple_pay',
            label: 'Apple Pay',
        },
        {
            value: 'credit_card',
            label: 'Thẻ Tín dụng/Ghi nợ',
        },
        {
            value: 'cod',
            label: 'Thanh toán khi nhận hàng',
        }
    ];

    return (
        <div className={styles['payment-container']}>
            <h3 className={styles['payment-heading']}>Phương thức thanh toán</h3>
            <ul className={styles['payment-method-list']}>
                {paymentMethods.map(method => (
                    <li 
                    key={method.value} 
                    className={`${styles['payment-method-item']} ${selectedMethod === method.value ? styles['payment-method-item--selected'] : ''}`}
                >
                    <label className={styles['payment-method']}>
                        <input
                            type="radio"
                            value={method.value}
                            disabled={method.disabled}
                            checked={selectedMethod === method.value}
                            onChange={() => setSelectedMethod(method.value)}
                        />
                        {method.label}
                        {selectedMethod === method.value && (
                            <div className={styles['payment-method__tick']}>
                                <FontAwesomeIcon icon={faCheck} />
                            </div>
                        )}
                    </label>
                </li>
                ))}
            </ul>
        </div>
    )
}

export default PaymentMethods;
