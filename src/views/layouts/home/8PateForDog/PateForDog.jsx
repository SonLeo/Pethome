import ProductSection from "~/components/productSection/ProductSection";
import { API_URLS } from "~/utils/commonUtils";

const PateForDog = () => {
    return (
        <ProductSection
            title="Pate, đồ hộp, sữa cho chó"
            mainLink={{ href: "/collections/thuc-an-hat-cho-cho", title: "Pate, đồ hộp, sữa cho chó" }}
            subLinks={[
                { href: "/collections/pate-do-hop-cho-cho", title: "Pate, đồ hộp, sữa" },
                { href: "/collections/thuc-an-hat-cho-cho", title: "Thức ăn hạt" },
                { href: "/collections/an-vat-banh-thuong-cho-cho", title: "Ăn vặt, bánh thưởng" },
                { href: "/collections/do-choi-cho-cho", title: "Đồ chơi" }
            ]}
            apiUrl={API_URLS.PRODUCTS}
            categoryFilter="pate-do-hop-sua-cho-cho"
        />
    )
}

export default PateForDog