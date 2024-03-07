import axios from "axios";
import { Formik } from "formik";
import { useState } from "react";
import styles from "./EditInfo.module.css";
import { API_URLS, REGEX } from "~/utils/commonUtils";
import { useToast } from "~/components/toastContext";

const EditInfo = ({ user, onUpdated }) => {
    const { showSuccessToast, showErrorToast } = useToast();

    const [isEditable, setIsEditable] = useState({
        username: false,
        email: false,
        address: false,
        gender: false
    });

    const toggleEditable = (field) => {
        const newEditableState = {
            username: false,
            email: false,
            address: false,
            gender: false
        };

        newEditableState[field] = true;
        setIsEditable(newEditableState);
    };

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        try {
            const usersResponse = await axios.get(API_URLS.USERS);
            const matchedUserByEmail = values.email !== user.email &&
                usersResponse.data.find(user => user.email === values.email);

            if (matchedUserByEmail) {
                setFieldError("email", "Email đã được sử dụng!");
                setSubmitting(false);
                return;
            }

            const updatedUser = await axios.patch(`${API_URLS.USERS}/${user.id}`, values);
            localStorage.setItem("user", JSON.stringify(values));
            if (onUpdated) {
                onUpdated(updatedUser.data)
            }
            setIsEditable({
                username: false,
                email: false,
                address: false,
                gender: false
            });
            showSuccessToast('Thông tin đã được cập nhật!');
        } catch (error) {
            showErrorToast('Có lỗi xảy ra. Hãy thử lại!');
            console.error("Edit error:", error);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Formik
            initialValues={user}
            onSubmit={handleSubmit}
            validate={values => {
                const errors = {}

                if (!values.username) {
                    errors.username = "Họ tên không được để trống!";
                }

                if (values.email && !REGEX.email.test(values.email)) {
                    errors.email = "Email không hợp lệ!"
                }

                return errors;
            }}
        >
            {({ values, errors, touched, handleChange, handleSubmit, setFieldTouched }) => (
                <div className={styles.user}>
                    <form className={styles['user-form']} onSubmit={handleSubmit}>
                        <h2 className={styles['user-form-heading']}>Thông tin tài khoản</h2>

                        {/* Username */}
                        <div className={`${styles['form-group']} ${isEditable.username ? styles['form-active'] : ''}`}>
                            <label className={styles['form-label']} htmlFor="username">Họ tên:</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                className={styles['form-control']}
                                value={values.username}
                                onChange={handleChange}
                                onBlur={() => setFieldTouched("username", true)}
                                disabled={!isEditable.username}
                            />
                            {errors.username && touched.username && <span className={styles['form-message']}>{errors.username}</span>}
                            <label htmlFor="username"><img className={styles['form-edit-icon']} src="/assets/icons/member/edit.svg" alt="Edit" onClick={() => toggleEditable('username')} /></label>
                        </div>

                        {/* Gender */}
                        <div className={`${styles['form-group']} ${isEditable.gender ? styles['form-active'] : ''}`}>
                            <label className={styles['form-label']} htmlFor="gender">Giới tính:</label>
                            {
                                isEditable.gender ?
                                    (
                                        <select
                                            name="gender"
                                            onChange={(e) => {
                                                const selectedValue = parseInt(e.target.value, 10);
                                                handleChange({
                                                    target: {
                                                        name: e.target.name,
                                                        value: selectedValue
                                                    }
                                                });
                                            }}
                                            className={styles['form-control']}
                                            value={values.gender}
                                        >
                                            <option value={0}>Nam</option>
                                            <option value={1}>Nữ</option>
                                        </select>
                                    ) :
                                    (
                                        <input
                                            type="text"
                                            name="genderDisplay"
                                            className={styles['form-control']}
                                            value={
                                                values.gender === 1 ? "Nư" : "Nam"
                                            }
                                            disabled={true}
                                        />
                                    )
                            }
                            <label htmlFor="gender"><img className={styles['form-edit-icon']} src="/assets/icons/member/edit.svg" alt="Edit" onClick={() => toggleEditable('gender')} /></label>
                        </div>

                        {/* phone */}
                        <div className={styles['form-group']}>
                            <label className={styles['form-label']} htmlFor="phone">Điện thoại:</label>
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                className={styles['form-control']}
                                value={values.phone}
                                disabled="disable"
                            />
                        </div>

                        {/* Email */}
                        <div className={`${styles['form-group']} ${isEditable.email ? styles['form-active'] : ''}`}>
                            <label className={styles['form-label']} htmlFor="email">Email:</label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                className={styles['form-control']}
                                value={values.email}
                                onChange={handleChange}
                                onBlur={() => setFieldTouched("email", true)}
                                disabled={!isEditable.email}
                            />
                            {errors.email && touched.email && <span className={styles['form-message']}>{errors.email}</span>}
                            <label htmlFor="email"><img className={styles['form-edit-icon']} src="/assets/icons/member/edit.svg" alt="Edit" onClick={() => toggleEditable('email')} /></label>
                        </div>

                        {/* Address */}
                        <div className={`${styles['form-group']} ${isEditable.address ? styles['form-active'] : ''}`}>
                            <label className={styles['form-label']} htmlFor="address">Địa chỉ:</label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                className={`${styles['form-control']} ${styles['form-address']}`}
                                value={values.address}
                                onChange={handleChange}
                                onBlur={() => setFieldTouched("address", true)}
                                disabled={!isEditable.address}
                            />
                            <label htmlFor="address"><img className={styles['form-edit-icon']} src="/assets/icons/member/edit.svg" alt="Edit" onClick={() => toggleEditable('address')} /></label>
                        </div>

                        {/* Change Password */}
                        <div className={styles['form-group']}>
                            <p>Đổi mật khẩu</p>
                            <img className={styles['form-edit-icon']} src="/assets/icons/member/edit.svg" alt="Edit" />
                        </div>

                        {/* Submit */}
                        <button className={styles['form-submit']} type="submit">Cập nhật thông tin</button>
                    </form>
                </div>
            )}
        </Formik>
    )
}

export default EditInfo;