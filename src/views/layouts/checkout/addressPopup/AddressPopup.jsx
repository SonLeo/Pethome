import { Formik } from "formik";
import styles from "./AddressPopup.module.css"
import { API_URLS, REGEX } from "~/utils/commonUtils";
import axios from "axios";

const AddressPopup = ({ isVisible, onSave, onClose, userId, savedAddresses }) => {
    const addressExists = (newAddress) => {
        return savedAddresses.some(address => 
            address.receiver === newAddress.receiver &&
            address.phone === newAddress.phone &&
            address.address === newAddress.address
        );
    }

    const validate = values => {
        const errors = {};
        if (!values.receiver) {
            errors.receiver = "Tên không được để trống!";
        }

        if (!values.phone) {
            errors.phone = "Số điện thoại không được để trống!";
        } else if (values.phone && !REGEX.phone.test(values.phone)) {
            errors.phone = "Số điện thoại không hợp lệ!"
        }

        if (!values.address) {
            errors.address = "Địa chỉ không được để trống!"
        }

        if (addressExists(values)) {
            errors.receiver = "Địa chỉ này đã tồn tại!";
            errors.phone = "Địa chỉ này đã tồn tại!";
            errors.address = "Địa chỉ này đã tồn tại!";
        }

        return errors;
    }

    const handleSubmit = async (values) => {
        try {
            const userResponse = await axios.get(`${API_URLS.USERS}/${userId}`);
            const currentUser = userResponse.data;

            const updateShippingDetails = currentUser.shippingDetails
                ? [...currentUser.shippingDetails, values]
                : [values];

            const response = await axios.put(`${API_URLS.USERS}/${userId}`, {
                ...currentUser,
                shippingDetails: updateShippingDetails
            });

            if (response.status === 200) {
                onSave(values);
            } else {
                console.error("Failed to update shipping details.");
            }
        } catch (error) {
            console.error("Error updating shipping details:", error);
        }
        onClose();
    }

    return (
        isVisible && (
            <div className={styles['popup-overlay']}>
                <div className={styles['popup-content']}>
                    <h3 className={styles['popup-heading']}>Thêm địa chỉ mới</h3>
                    <Formik
                        initialValues={{
                            receiver: "",
                            phone: "",
                            address: ""
                        }}
                        validate={validate}
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched, handleChange, handleSubmit, setFieldTouched }) => (
                            <form className={styles['new-address-form']} onSubmit={handleSubmit}>
                                <div className={styles['form-row']}>
                                    {/* receiver */}
                                    <div
                                        className={`${styles['form-group']} ${errors.receiver && touched.receiver ? styles.invalid : ""}`}
                                        style={(errors.receiver && touched.receiver) || (errors.phone && touched.phone) ? { height: "60px" } : {}}
                                    >
                                        <div className={styles['form-label']} style={{ display: values.receiver ? "block" : "none" }}>Tên người nhận</div>
                                        <input
                                            name="receiver"
                                            id={styles.receiver}
                                            placeholder="Tên người nhận"
                                            className={styles['form-control']}
                                            value={values.receiver}
                                            onChange={handleChange}
                                            onBlur={() => setFieldTouched("receiver", true)}
                                        />
                                        {errors.receiver && touched.receiver && <p className={styles['form-message']}>{errors.receiver}</p>}
                                    </div>

                                    {/* Phone */}
                                    <div
                                        className={`${styles['form-group']} ${errors.phone && touched.phone ? styles.invalid : ""}`}
                                        style={(errors.receiver && touched.receiver) || (errors.phone && touched.phone) ? { height: "60px" } : {}}
                                    >
                                        <div className={styles['form-label']} style={{ display: values.phone ? "block" : "none" }}>Số điện thoại</div>
                                        <input
                                            name="phone"
                                            id={styles.phone}
                                            placeholder="Số điện thoại"
                                            className={styles['form-control']}
                                            value={values.phone}
                                            onChange={handleChange}
                                            onBlur={() => setFieldTouched("phone", true)}
                                        />
                                        {errors.phone && touched.phone && <p className={styles['form-message']}>{errors.phone}</p>}
                                    </div>
                                </div>

                                {/* Address */}
                                <div className={styles['form-row']}>
                                    <div className={`${styles['form-group']} ${errors.address && touched.address ? styles.invalid : ""}`}>
                                        <div className={styles['form-label']} style={{ display: values.address ? "block" : "none" }}>Địa chỉ</div>
                                        <input
                                            name="address"
                                            id={styles.address}
                                            placeholder="Địa chỉ"
                                            className={styles['form-control']}
                                            value={values.address}
                                            onChange={handleChange}
                                            onBlur={() => setFieldTouched("address", true)}
                                        />
                                        {errors.address && touched.address && <p className={styles['form-message']}>{errors.address}</p>}
                                    </div>
                                </div>

                                {/* button block */}
                                <div className={styles['form-row']}>
                                    <div className={styles['btn-block']}>
                                        <button className={`${styles['form-btn']} ${styles['form-cancel']}`} type="button" onClick={onClose}>Trở lại</button>
                                        <button className={`${styles['form-btn']} ${styles['form-submit']}`} type="submit">Lưu địa chỉ</button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        )
    );
}

export default AddressPopup;