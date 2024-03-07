import axios from "axios";
import Link from "next/link";
import { Formik } from "formik";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./Form.module.css";
import { API_URLS, REGEX } from "~/utils/commonUtils";
import { useUser } from "~/components/userContext"
import { useToast } from "~/components/toastContext";

const SignUp = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setUser } = useUser();
    const { showSuccessToast, showErrorToast } = useToast();

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        if (loading) return;
        setLoading(true);

        try {
            const usersResponse = await axios.get(API_URLS.USERS);
            const matchedUserByPhone = usersResponse.data.find(user => user.phone === values.phone);
            const matchedUserByEmail = values.email && usersResponse.data.find(user => user.email === values.email);

            if (matchedUserByPhone) {
                setFieldError("phone", "Số điện thoại đã được sử dụng!");
                setLoading(false);
                setSubmitting(false);
                return;
            }

            if (matchedUserByEmail) {
                setFieldError("email", "Email đã được sử dụng!");
                setLoading(false);
                setSubmitting(false);
                return;
            }

            const { confirmPassword, ...userToSave } = values;
            const response = await axios.post(API_URLS.USERS, userToSave);
            const createdUser = response.data;

            const safeUser = { ...createdUser };
            delete safeUser.password;
            setUser(safeUser)
            localStorage.setItem("user", JSON.stringify(safeUser))
            showSuccessToast('Đăng ký tài khoản thành công!');
            router.push('/');
        } catch (error) {
            showErrorToast("Có lỗi trong quá trình đăng ký. Hãy thử lại!");
            console.error("Signup error:", error);
            setLoading(false);
            setSubmitting(false);
        }
    }

    return (
        <Formik
            initialValues={{
                username: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
                role: "Customer",
                address: "",
                registrationDate: new Date().toISOString(),
                membershipLevel: "Pet's Rookie",
                gender: 0,
                accumulatedPoints: 0
            }}

            onSubmit={handleSubmit}
            validate={values => {
                const errors = {}

                if (!values.username) {
                    errors.username = "Họ tên không được để trống!";
                }

                if (!values.phone) {
                    errors.phone = "Số điện thoại không được để trống!";
                } else if (!REGEX.phone.test(values.phone)) {
                    errors.phone = "Số điện thoại không hợp lệ!";
                }

                if (values.email && !REGEX.email.test(values.email)) {
                    errors.email = "Email không hợp lệ!"
                }

                if (!values.password) {
                    errors.password = "Mật khẩu không được để trống!";
                } else if (!REGEX.password.test(values.password)) {
                    errors.password = "Mật khẩu cần ít nhất 6 ký tự, chứa ít nhất 1 số và 1 ký tự đặc biệt";
                }

                if (!values.confirmPassword) {
                    errors.confirmPassword = "Mật khẩu không được để trống";
                } else if (values.password !== values.confirmPassword) {
                    errors.confirmPassword = "Mật khẩu nhập lại không khớp";
                }

                return errors;
            }}
        >
            {({ values, errors, touched, handleChange, handleSubmit, setFieldTouched }) => (
                <div className={styles.main}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <h3 className={styles.heading}>Đăng ký</h3>

                        {/* Username */}
                        <div className={`${styles['form-group']} ${errors.username && touched.username ? styles.invalid : ""}`}>
                            <label className={styles['form-label']} htmlFor="username">Họ tên: <span className={styles.required}>*</span></label>
                            <input
                                type="text"
                                name="username"
                                id={styles.username}
                                placeholder="VD: Nguyễn Văn A"
                                className={styles['form-control']}
                                value={values.username}
                                onChange={handleChange}
                                onBlur={() => setFieldTouched("username", true)}
                            />
                            {errors.username && touched.username && <span className={styles['form-message']}>{errors.username}</span>}
                        </div>

                        {/* Phone */}
                        <div className={`${styles['form-group']} ${errors.phone && touched.phone ? styles.invalid : ""}`}>
                            <label className={styles['form-label']} htmlFor="phone">Số điện thoại: <span className={styles.required}>*</span></label>
                            <input
                                type="text"
                                name="phone"
                                id={styles.phone}
                                placeholder="VD: 0866211334"
                                className={styles['form-control']}
                                value={values.phone}
                                onChange={handleChange}
                                onBlur={() => setFieldTouched("phone", true)}
                            />
                            {errors.phone && touched.phone && <span className={styles['form-message']}>{errors.phone}</span>}
                        </div>

                        {/* Email */}
                        <div className={`${styles['form-group']} ${errors.email && touched.email ? styles.invalid : ""}`}>
                            <label className={styles['form-label']} htmlFor="email">Email:</label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                placeholder="VD: email@domain.com"
                                className={styles['form-control']}
                                value={values.email}
                                onChange={handleChange}
                                onBlur={() => setFieldTouched("email", true)}
                            />
                            {errors.email && touched.email && <span className={styles['form-message']}>{errors.email}</span>}
                        </div>

                        {/* Password */}
                        <div className={`${styles['form-group']} ${errors.password && touched.password ? styles.invalid : ""}`}>
                            <label className={styles['form-label']} htmlFor="password">
                                Mật khẩu: <span className={styles.required}>*</span>
                            </label>
                            <input 
                                type="password"
                                name="password"
                                id={styles.password}
                                placeholder="Nhập mật khẩu"
                                className={styles['form-control']}
                                value={values.password}
                                onChange={handleChange}
                                onBlur={() => {setFieldTouched("password", true)}}
                            />
                            {errors.password && touched.password && <span className={styles['form-message']}>{errors.password}</span>}
                        </div>

                        {/* Confirm Password */}
                        <div className={`${styles['form-group']} ${errors.confirmPassword && touched.confirmPassword ? styles.invalid : ""}`}>
                            <label className={styles['form-label']} htmlFor="confirmPassword">Nhập lại mật khẩu:  <span className={styles.required}>*</span></label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id={styles.confirmPassword}
                                placeholder="Nhập lại mật khẩu"
                                className={styles['form-control']}
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={() => setFieldTouched("confirmPassword", true)}
                            />
                            {errors.confirmPassword && touched.confirmPassword && <span className={styles['form-message']}>{errors.confirmPassword}</span>}

                        </div>

                        {/* Submit */}
                        <button className={styles['form-submit']} type="submit">Đăng ký</button>

                        <div className={styles['sign-in']}>
                            Đã có tài khoản? <Link href='/login'>Đăng nhập</Link>
                        </div>
                    </form>
                </div>
            )}
        </Formik>
    )
}

export default SignUp;