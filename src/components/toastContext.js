import { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const duration = 3000;

    const showSuccessToast = (message = 'Đã xử lý thành công!') => {
        showToast({
            message: message,
            type: 'success',
            duration: duration
        });
    };

    const showErrorToast = (message = 'Có lỗi xảy ra, hãy thử lại!') => {
        showToast({
            message: message,
            type: 'error',
            duration: duration
        });
    };

    const showToast = ({ message, type, duration }) => {
        const id = new Date().getTime();
        setToasts(prevToasts => [...prevToasts, { id, message, type }]);
        setTimeout(() => {
            setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
        }, duration);
    };

    return (
        <ToastContext.Provider value={{ toasts, showSuccessToast, showErrorToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    return useContext(ToastContext);
};
