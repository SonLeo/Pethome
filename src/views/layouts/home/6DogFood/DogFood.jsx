import ProductSection from "~/components/productSection/ProductSection";
import { API_URLS } from "~/utils/commonUtils";

const DogFood = () => {
    return (
        <ProductSection
            title="Thức ăn hạt cho chó"
            mainLink={{ href: "/collections/thuc-an-hat-cho-cho", title: "Thức ăn hạt cho chó" }}
            subLinks={[
                { href: "/collections/thuc-an-hat-cho-cho", title: "Thức ăn hạt cho chó" },
                { href: "/collections/pate-do-hop-cho-cho", title: "Pate, đồ hộp và sữa" },
                { href: "/collections/an-vat-banh-thuong-cho-cho", title: "Ăn vặt, bánh thưởng" },
                { href: "/collections/do-choi-cho-cho", title: "Đồ chơi" }
            ]}
            apiUrl={API_URLS.PRODUCTS}
            categoryFilter="thuc-an-hat-cho-cho"
        />
    )
}

export default DogFood;