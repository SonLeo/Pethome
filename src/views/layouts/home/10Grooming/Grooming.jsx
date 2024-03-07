import ProductSection from "~/components/productSection/ProductSection";
import { API_URLS } from "~/utils/commonUtils";

const Grooming = () => {
    return (
        <ProductSection
            title="Làm đẹp cho cún - miu"
            mainLink={{ href: "/collections/lam-dep", title: "Làm đẹp cho cún - miu" }}
            subLinks={[
                { href: "/collections/sua-tam-cho-cun", title: "Sữa tắm cho cún" },
                { href: "/collections/sua-tam-cho-miu", title: "Sữa tắm cho miu" },
                { href: "/collections/chai-xit-khu-mui", title: "Chai xịt khử mùi" },
                { href: "/collections/cham-soc-tai-mat-mieng", title: "Chăm sóc tai - mắt - miệng" }
            ]}
            apiUrl={API_URLS.PRODUCTS}
            categoryFilter="lam-dep-cho-cun-miu"
        />
    )
}

export default Grooming;