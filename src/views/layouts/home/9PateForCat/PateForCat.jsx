import ProductSection from "~/components/productSection/ProductSection";
import { API_URLS } from "~/utils/commonUtils";

const PateForCat = () => {
    return (
        <ProductSection
            title="Pate, đồ hộp, sữa cho mèo"
            mainLink={{ href: "/collections/thuc-an-hat-cho-meo", title: "Pate, đồ hộp, sữa cho mèo" }}
            subLinks={[
                { href: "/collections/pate-do-hop-cho-meo", title: "Pate, đồ hộp, sữa" },
                { href: "/collections/thuc-an-hat-cho-meo", title: "Thức ăn hạt" },
                { href: "/collections/an-vat-banh-thuong-cho-meo", title: "Ăn vặt, bánh thưởng" },
                { href: "/collections/do-choi-cho-meo", title: "Đồ chơi" }
            ]}
            apiUrl={API_URLS.PRODUCTS}
            categoryFilter="pate-do-hop-sua-cho-meo"
        />
    )
}

export default PateForCat;