import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './BannerProduct.module.css';
import { getBannerProducts } from '~/services/otherService';

export default function BannerProduct() {
    const [bannerProducts, setBannerProducts] = useState([]);

    useEffect (() => {
        const fetchData = async () => {
            try {
                const bannerProductsData = await getBannerProducts();
                setBannerProducts(bannerProductsData);
            } catch (error) {
                console.error("Error fetching banner products:", error);
                throw error;
            }
        }

        fetchData();
    }, []);

    return (
        <section className="section">
            <div className={styles["section-banner-products"]}>
                <div className="container">
                    <div className="row">
                        {bannerProducts.map((banner, index) => (
                            <div className="col-md-4" key={index}>
                                <div className={styles["banner-item"]}>
                                    <Link href={banner.path}>
                                        <div className={styles["banner-container"]}>
                                            <img src={banner.image} className="img-fluid w-100" alt="banner-product" />
                                            <div className={styles["banner-caption"]}>
                                                <h4>{banner.title}</h4>
                                                <h3>{banner.subtitle}</h3>
                                            </div>
                                            <button className={styles["banner-button"]}>Mua ngay</button>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}