import Footer from "~/views/layouts/footer/Footer"
import Header from "~/views/layouts/header/Header"
import Login from "~/views/layouts/authentication/Login"

const LoginPage = () => {
    return (
        <>
            <Header />
            <Login />
            <Footer />
        </>
    )
}

export default LoginPage;