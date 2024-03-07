import { Formik } from "formik";
import { useEffect, useState } from "react";
import { API_URLS, REGEX } from "~/utils/commonUtils";
import styles from "./ShipmentDetails.module.css";
import AddressPopup from "../addressPopup/AddressPopup";
import axios from "axios";
import { useUser } from "~/components/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

const ShipmentDetails = ({ onShippingInfoChange }) => {
    const { user } = useUser();
    const [focusedField, setFocusedField] = useState(null);
    const [showSavedAddresses, setShowSavedAddresses] = useState(false);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [isNewAddressSelected, setIsNewAddressSelected] = useState(false);
    const [isEditable, setIsEditable] = useState({
        receiver: false,
        phone: false,
        address: false
    });

    const [savedAddresses, setSavedAddresses] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user && user.id) {
                try {
                    const response = await axios.get(`${API_URLS.USERS}/${user.id}`);
                    if (response.data) {
                        const userData = response.data;
                        const addresses = [];

                        const defaultAddress = {
                            receiver: userData.username || "",
                            phone: userData.phone || "",
                            address: userData.address || ""
                        };

                        if (Object.values(defaultAddress).some(val => val !== "")) {
                            addresses.push(defaultAddress);
                        }

                        if (userData.shippingDetails && Array.isArray(userData.shippingDetails)) {
                            addresses.push(...userData.shippingDetails);
                        }
                        setSavedAddresses(addresses);
                    } else {
                        console.error("Unexpected API response:", response);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        }
        fetchUserData();
    }, [user]);

    const toggleSavedAddresses = () => setShowSavedAddresses(prevState => !prevState);

    const toggleEditable = (field) => {
        const newEditableState = {
            receiver: false,
            phone: false,
            address: false
        };

        newEditableState[field] = true;
        setIsEditable(newEditableState);
    };

    const handleSelectAddress = (index, address, setFieldValue) => {
        setSelectedAddressIndex(index);
        setFieldValue("receiver", address.receiver);
        setFieldValue("phone", address.phone);
        setFieldValue("address", address.address);
        setIsNewAddressSelected(false);
    };

    const handleDeleteAddress = async (indexToDelete, setFieldValue) => {
        const updateAddresses = savedAddresses.filter((_, index) => index !== indexToDelete);

        if (indexToDelete === 0) {
            setSavedAddresses(updateAddresses);
            return;
        }

        try {
            const userResponse = await axios.get(`${API_URLS.USERS}/${user.id}`);
            const currentUser = userResponse.data;

            const response = await axios.put(`${API_URLS.USERS}/${user.id}`, {
                ...currentUser,
                shippingDetails: updateAddresses.slice(1)
            });

            if (response.status === 200) {
                setSavedAddresses(updateAddresses);
                console.log(updateAddresses[0])
                if (selectedAddressIndex === indexToDelete || selectedAddressIndex > updateAddresses.length - 1) {
                    setSelectedAddressIndex(0);
                    setFieldValue("receiver", updateAddresses[0].receiver);
                    setFieldValue("phone", updateAddresses[0].phone);
                    setFieldValue("address", updateAddresses[0].address);
                    setIsNewAddressSelected(false);
                }
            } else {
                console.error("Failed to delete address.");
            }
        } catch (error) {
            console.error("Error deleting address:", error);
        }
    };

    const validate = values => {
        const errors = {}

        if (!values.receiver) {
            errors.receiver = "Tên người nhận không được để trống!";
        }

        if (!values.phone) {
            errors.phone = "Số điện thoại người nhận không được để trống!";
        } else if (values.phone && !REGEX.phone.test(values.phone)) {
            errors.phone = "Số điện thoại không hợp lệ!";
        }

        if (!values.address) {
            errors.address = "Địa chỉ nhận hàng không được để trống!";
        }

        return errors;
    }

    return (
        <Formik
            initialValues={{
                receiver: user ? user.username : "",
                phone: user ? user.phone : "",
                address: user ? user.address : "",
                note: ""
            }}
            enableReinitialize={true}
            onSubmit={(values) => {
                onShippingInfoChange(values);
            }}
            validate={validate}
        >
            {({ values, errors, touched, handleChange, handleSubmit, setFieldTouched, setFieldValue }) => (
                <div className={styles['shipment-details']}>
                    <div className={styles['shipment-header']}>
                        <h3 className={styles['shipment-heading']}>Thông tin giao hàng</h3>
                        <div>
                            <p className={styles['toggle-saved-address']} onClick={toggleSavedAddresses}>Chọn địa chỉ đã lưu</p>
                            <p className={styles['new-saved-address']} onClick={() => setShowPopup(true)}>Thêm mới</p>
                        </div>
                    </div>
                    <AddressPopup
                        isVisible={showPopup}
                        userId={user?.id}
                        savedAddresses={savedAddresses}
                        onSave={(newAddress) => {
                            const updatedAddresses = [...savedAddresses, newAddress];
                            setSavedAddresses(updatedAddresses);
                            setSelectedAddressIndex(updatedAddresses.length - 1);
                            onShippingInfoChange(newAddress);
                            setFieldValue("receiver", newAddress.receiver);
                            setFieldValue("phone", newAddress.phone);
                            setFieldValue("address", newAddress.address);
                            setIsNewAddressSelected(true);
                            setShowPopup(false);
                        }}
                        onClose={() => setShowPopup(false)}
                    />
                    {showSavedAddresses && (
                        <ul className={styles['saved-addresses-list']}>
                            {savedAddresses.map((address, index) => (
                                <li className={styles['saved-address']} key={index}>
                                    <label>
                                        <input className={styles['saved-address-radio']}
                                            type="radio"
                                            name="selectedAddress"
                                            checked={selectedAddressIndex === index}
                                            onChange={() => handleSelectAddress(index, address, setFieldValue)}
                                        />
                                        <div className={styles['saved-address-details']}>
                                            <p className={styles['saved-address-header']}>
                                                <span className={styles['saved-address-receiver']}>{address.receiver}</span>
                                                <span className={styles['seperate']}></span>
                                                <span className={styles['saved-address-phone']}>{address.phone}</span>
                                                {index === 0 ? <span className={styles['address-default']}>(Mặc định)</span> : ""}
                                            </p>
                                            <p className={styles['saved-address-body']}>{address.address}</p>
                                        </div>
                                    </label>
                                    {index !== 0 ?
                                        <div className={styles['delete']} onClick={() => handleDeleteAddress(index, setFieldValue)}>
                                            <FontAwesomeIcon icon={faCircleXmark} />
                                        </div>
                                        : ""
                                    }
                                </li>
                            ))}
                        </ul>
                    )}
                    <form className={styles['shipment-form']} onSubmit={handleSubmit}>
                        {/* receiver */}
                        <div className={`${styles['form-group']} ${isEditable.receiver && focusedField === 'receiver' ? styles['form-active'] : ''}`}>
                            <label className={styles['form-label']} htmlFor="receiver">Tên người nhận:</label>
                            <input
                                type="text"
                                name="receiver"
                                id="receiver"
                                className={styles['form-control']}
                                value={values.receiver}
                                onChange={(e) => {
                                    handleChange(e);
                                    onShippingInfoChange({
                                        ...values,
                                        [e.target.name]: e.target.value
                                    });
                                }}
                                disabled={!isEditable.receiver}
                                onFocus={() => setFocusedField('receiver')}
                                onBlur={() => {
                                    setFieldTouched("receiver", true);
                                    setFocusedField(null);
                                }}
                            />
                            <label htmlFor="receiver"><img className={styles['form-edit-icon']} src="/assets/icons/member/edit.svg" alt="Edit" onClick={() => toggleEditable('receiver')} /></label>
                            {errors.receiver && touched.receiver && <p className={styles['form-message']}>{errors.receiver}</p>}
                        </div>

                        {/* phone */}
                        <div className={`${styles['form-group']} ${isEditable.phone && focusedField === 'phone' ? styles['form-active'] : ''}`}>
                            <label className={styles['form-label']} htmlFor="phone">Số điện thoại:</label>
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                className={styles['form-control']}
                                value={values.phone}
                                onChange={(e) => {
                                    handleChange(e);
                                    onShippingInfoChange({
                                        ...values,
                                        [e.target.name]: e.target.value
                                    });
                                }}
                                disabled={!isEditable.phone}
                                onFocus={() => setFocusedField('phone')}
                                onBlur={() => {
                                    setFieldTouched("phone", true);
                                    setFocusedField(null);
                                }}
                            />
                            <label htmlFor="phone"><img className={styles['form-edit-icon']} src="/assets/icons/member/edit.svg" alt="Edit" onClick={() => toggleEditable('phone')} /></label>
                            {errors.phone && touched.phone && <p className={styles['form-message']}>{errors.phone}</p>}
                        </div>

                        {/* address */}
                        <div className={`${styles['form-group']} ${isEditable.address && focusedField === 'address' ? styles['form-active'] : ''}`}>
                            <label className={styles['form-label']} htmlFor="address">Địa chỉ:</label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                className={`${styles['form-control']} ${styles['form-address']}`}
                                value={values.address}
                                onChange={(e) => {
                                    handleChange(e);
                                    onShippingInfoChange({
                                        ...values,
                                        [e.target.name]: e.target.value
                                    });
                                }}
                                disabled={!isEditable.address}
                                onFocus={() => setFocusedField('address')}
                                onBlur={() => {
                                    setFieldTouched("address", true);
                                    setFocusedField(null);
                                }}
                            />
                            <label htmlFor="address"><img className={styles['form-edit-icon']} src="/assets/icons/member/edit.svg" alt="Edit" onClick={() => toggleEditable('address')} /></label>
                            {errors.address && touched.address && <p className={styles['form-message']}>{errors.address}</p>}
                        </div>

                        {/* message */}
                        <div className={styles['form-group-note']}>
                            <label className={styles['from-note-label']} htmlFor="shipmentNote">Lời nhắn:</label>
                            <input
                                type="text"
                                name="note"
                                id="shipmentNote"
                                className={styles['note-control']}
                                placeholder="Lưu ý cho đơn hàng ..."
                                value={values.note}
                                onChange={(e) => {
                                    handleChange(e);
                                    onShippingInfoChange({
                                        ...values,
                                        [e.target.name]: e.target.value
                                    });
                                }}
                            />
                        </div>
                    </form>
                </div>
            )}
        </Formik>
    )
}

export default ShipmentDetails;