import styles from "./ToastMessage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { useToast } from '~/components/toastContext';

const ToastMessage = () => {
    const { toasts } = useToast();

    const getIcon = (type) => {
        if (type === 'success') {
            return <FontAwesomeIcon icon={faCheckCircle} />;
        } else if (type === 'error') {
            return <FontAwesomeIcon icon={faTimesCircle} />;
        }
    }

    return (
        <div id="toast-container" className={styles.toastContainer}>
            {toasts.map((toast) => (
                <div key={toast.id} className={`${styles.toast} ${styles[`toast--${toast.type}`]}`}>
                    <div className={styles.toast__icon}>
                        {getIcon(toast.type)}
                    </div>
                    <div className={styles.toast__body}>
                        <p className={styles.toast__message}>{toast.message}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ToastMessage;
