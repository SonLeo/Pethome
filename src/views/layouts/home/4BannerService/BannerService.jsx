import Link from "next/link";
import { useEffect, useState } from "react";
import { getBannerServices } from "~/services/otherService";
import styles from "./BannerService.module.css"

export default function BannerService() {
    const [bannerServices, setBAnnerServices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bannerServicesData = await getBannerServices();
                setBAnnerServices(bannerServicesData);
            } catch (error) {
                console.error("Error fetching banner services:", error);
                throw error;
            }
        }

        fetchData();
    }, []);

    return (
        <div className="section">
            <div className="container">
                <div className="row">
                    {bannerServices.map((banner, index) => (
                        <div className="col-md-6" key={index}>
                            <Link href={banner.path}>
                                <img className={styles["banner-img"]} src={banner.image} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}