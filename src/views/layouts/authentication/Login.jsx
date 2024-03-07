import axios from "axios";
import Link from "next/link";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "./Form.module.css";
import { API_URLS, REGEX } from "~/utils/commonUtils";
import { useUser } from "~/components/userContext";
import { useToast } from "~/components/toastContext";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setUser } = useUser();
    const { showSuccessToast, showErrorToast } = useToast();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user) {
            setUser(user);
            router.push('/');
        }
    }, []);

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        if (loading) return;
        setLoading(true);

        try {
            const usersResponse = await axios.get(API_URLS.USERS);
            const matchedUser = usersResponse.data.find(user =>
                (user.email === values.emailOrPhone || user.phone === values.emailOrPhone) &&
                user.password === values.password
            );

            if (matchedUser) {
                const safeUser = { ...matchedUser };
                delete safeUser.password;
                localStorage.setItem("user", JSON.stringify(safeUser));

                setUser(safeUser);
                showSuccessToast('Đăng nhập thành công!');
                router.push('/');
            } else {
                setFieldError("emailOrPhone", "Sai tài khoản hoặc mật khẩu!");
                setFieldError("password", "Sai tài khoản hoặc mật khẩu!");
            }
        } catch (error) {
            showErrorToast("Có lỗi trong quá trình đăng nhập. Hãy thử lại!")
            console.error("Login error:", error);
        }
        setLoading(false);
        setSubmitting(false);
    }

    return (
        <Formik
            initialValues={{
                emailOrPhone: "",
                password: ""
            }}
            onSubmit={handleSubmit}
            validate={values => {
                const errors = {}

                if (!values.emailOrPhone) {
                    errors.emailOrPhone = "Mục này không được để trống!"
                } else if (!REGEX.emailOrPhone.test(values.emailOrPhone)) {
                    errors.emailOrPhone = "Email hoặc số điện thoại sai định dạng"
                }

                if (!values.password) {
                    errors.password = "Mục này không được để trống"
                }

                return errors;
            }}
        >
            {({ values, errors, handleChange, handleSubmit, setFieldTouched, touched }) => (
                <div className={styles.main}>
                    <form id={styles['form-login']} className={styles.form} onSubmit={handleSubmit}>
                        <h3 className={styles.heading}>Đăng nhập</h3>
                        <div className={`${styles['form-group']} ${errors.emailOrPhone && touched.emailOrPhone ? styles.invalid : ""}`}>
                            <label className={styles['form-label']} htmlFor="emailOrPhone">Email / SĐT: <span className={styles.required}>*</span></label>
                            <input
                                name="emailOrPhone"
                                id={styles.emailOrPhone}
                                placeholder="VD: 0866211334"
                                className={styles['form-control']}
                                value={values.emailOrPhone}
                                onChange={handleChange}
                                onBlur={() => setFieldTouched("emailOrPhone", true)}
                            />
                            {errors.emailOrPhone && touched.emailOrPhone && <span className={styles['form-message']}>{errors.emailOrPhone}</span>}
                        </div>

                        <div className={`${styles['form-group']} ${errors.password && touched.password ? styles.invalid : ""}`}>
                            <label className={styles['form-label']} htmlFor="password">Mật khẩu: <span className={styles.required}>*</span></label>
                            <input
                                type="password"
                                name="password"
                                id={styles.password}
                                placeholder="Nhập mật khẩu"
                                className={styles['form-control']}
                                value={values.password}
                                onChange={handleChange}
                                onBlur={() => setFieldTouched("password", true)}
                            />
                            {errors.password && touched.password && <span className={styles['form-message']}>{errors.password}</span>}
                        </div>

                        <button type="submit" className={styles['form-submit']}>Đăng nhập</button>

                        <div className={styles['forgot-password']}><Link href='/forgot-password'>Quên mật khẩu?</Link></div>

                        <div className={styles['sign-up']}>Chưa có tài khoản? <Link href='/sign-up'>Đăng ký ngay</Link></div>
                    </form>
                </div>
            )}
        </Formik>
    )
}

export default Login;
