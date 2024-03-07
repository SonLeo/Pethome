import Footer from "~/views/layouts/footer/Footer";
import Header from "~/views/layouts/header/Header";
import styles from "~/views/layouts/sidebar/Sidebar.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faTags } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import axios from "axios";
import { API_URLS } from "~/utils/commonUtils";
import ProductFilter from "~/components/productFilter/ProductFilter";
import Pagination from "~/components/pagination/Pagination";
import ProductList from "~/components/productList/ProductList";
import Breadcumbs from "~/components/breadcumbs/Breadcumbs";

const ITEMS_PER_PAGE = 40;

function SubcategoryPage({ category, subcategory, subcategories, currentPage, products }) {
    const router = useRouter();
    
    const generateBreadcrumbs = () => {
        const categorySlug = router.query.categoryName;
        const subcategorySlug = router.query.subcategoryName;

        if (!categorySlug || !subcategorySlug) return [];
        
        return [
            { name: "Trang chủ", href: "/" },
            category && { name: category.name, href: "/" + categorySlug },
            subcategory && { name: subcategory.name, href: "/" + categorySlug + "/" + subcategorySlug }
        ].filter(Boolean);
    }

    const breadcumbs = generateBreadcrumbs();
    const relevantSubcategories = subcategories.filter(sub => sub.categoryIds.includes(category.id))

    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

    return (
        <>
            <Header />
            <div className="section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <Breadcumbs breadcumbs={breadcumbs} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <nav className={styles["sidebar"]}>
                                <div className={styles["subcategories"]}>
                                    <h3 className={styles["categories-heading"]}>
                                        <FontAwesomeIcon className={styles["category-heading-icon"]} icon={faTags} /> {category.name}
                                    </h3>
                                    <ul className={styles["category-list"]}>
                                        {relevantSubcategories.map(subcategory => (
                                            <li
                                                key={subcategory.id}
                                                className={`${styles["category-item"]} ${router.query.subcategoryName === subcategory.slug ? styles["category-item--active"]: ""}`}
                                            >
                                                <a href={`/${category.slug}/${subcategory.slug}`} className={styles["category-item__link"]}>
                                                    {subcategory.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className={styles["brands"]}>
                                    <h3 className={styles["brands-heading"]}>
                                        <FontAwesomeIcon className={styles["category-heading-icon"]} icon={faTag} /> Thương hiệu
                                    </h3>
                                    <ul className={styles["category-list"]}>
                                        <li className={styles["category-item"]}>
                                            <p className={styles["category-item__link"]}>
                                                <input type="checkbox" id="1" /> <label htmlFor="1">Royal Canin</label>
                                            </p>
                                        </li>
                                        <li className={styles["category-item"]}>
                                            <p className={styles["category-item__link"]}>
                                                <input type="checkbox" id="2" /> <label htmlFor="2">Pedigree</label>
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                        </div>

                        <div className="col-md-9">
                            <ProductFilter
                                totalPages={totalPages}
                                category={category}
                                subcategory={subcategory}
                                currentPage={currentPage}
                                selectedSubcategories={subcategory}
                            />
                            <ProductList products={products} />
                            <Pagination
                                totalPages={totalPages}
                                category={category}
                                subcategory={subcategory}
                                currentPage={currentPage}
                                selectedSubcategories={subcategory}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export async function getServerSideProps(context) {
    const currentPage = context.query.page ? parseInt(context.query.page) : 1;
    try {
        const { data: allProducts } = await axios.get(API_URLS.PRODUCTS);
        const { data: allCategories } = await axios.get(API_URLS.CATEGORIES);
        const { data: allSubcategories } = await axios.get(API_URLS.SUBCATEGORIES);

        const category = allCategories.find(cat => cat.slug === context.params.categoryName);
        const subcategory = allSubcategories.find(sub => sub.slug === context.params.subcategoryName);
        const productsInSubcategory = allProducts.filter(product => (product.subcategoryIds.includes(subcategory.id)) && product.categoryIds.includes(category.id));
        return {
            props: {
                category,
                subcategory,
                categories: allCategories,
                subcategories: allSubcategories,
                currentPage: currentPage,
                products: productsInSubcategory
            }
        }
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        return { notFound: true };
    }
}

export default SubcategoryPage;