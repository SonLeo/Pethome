import { useState, useEffect } from 'react';
import styles from './Deal.module.css';
import { getProducts } from '~/services/productsServices';
import { getCategories } from '~/services/categoryService';
import { getHomeProductTabs } from '~/services/otherService';
import ProductItem from '~/components/productItem/ProductItem';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from "swiper/modules";

export default function Deals() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [homeProductTabs, setHomeProductTabs] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, categoriesData, homeProductTabsData] = await Promise.all([
                    getProducts(),
                    getCategories(),
                    getHomeProductTabs(),
                ]);

                setProducts(productsData);
                setCategories(categoriesData);
                setHomeProductTabs(homeProductTabsData);
            } catch (error) {
                console.error("Error fetching data:", error);
                throw error;
            }
        }

        fetchData();
    }, [])

    useEffect (() => {
        if (categories.length > 0) {
            filterProductsByCategory(activeTab);
        }
    }, [products, categories, activeTab]);

    const getCategoryIdBySlug = (slug) => {
        const foundCategory = categories.find((category) => category.slug === slug);
        return foundCategory ? foundCategory.id : -1;
    };

    const filterProductsByCategory = (tabIndex) => {
        const categorySlug = homeProductTabs[tabIndex].slug;
        const filtered = products.filter((product) =>
            product.categoryIds.includes(getCategoryIdBySlug(categorySlug))
        );

        setFilteredProducts(filtered);
    };

    return (
        <section className="section">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className={styles["section-heading"]}>
                            <h2>Deal nổi bật</h2>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <ul className={styles["tabs"]}>
                            {homeProductTabs.map((tab, index) => (
                                <li
                                    key={index}
                                    className={`${styles["tab-item"]} ${activeTab === index ? styles.active : ""}`}
                                    onClick={() => setActiveTab(index)}
                                >
                                    {tab.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-md-12">
                        <div className={styles["tab-content"]}>
                            {homeProductTabs.map((_, tabIndex) => (
                                <div
                                    key={tabIndex}
                                    className={`${styles["tab-pane"]} ${activeTab === tabIndex ? styles.active : ""}`}
                                >
                                    <Swiper
                                        slidesPerView={1}
                                        spaceBetween={10}
                                        autoplay={{
                                            delay: 3000,
                                            disableOnInteraction: false,
                                        }}
                                        navigation={true}
                                        modules={[Autoplay, Navigation]}
                                        className={styles["products-view-grid"]}
                                        breakpoints={{
                                            576: {
                                                slidesPerView: 2,
                                            },
                                            768: {
                                                slidesPerView: 3,
                                            },
                                            992: {
                                                slidesPerView: 4,
                                            },
                                            1200: {
                                                slidesPerView: 5,
                                            },
                                        }}
                                    >
                                        {filteredProducts.map((product, index) => (
                                            <SwiperSlide key={index}>
                                                <ProductItem product={product} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}