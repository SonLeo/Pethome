import Link from "next/link"
import styles from "./BannerGrooming.module.css"

const BannerGrooming = () => {
    return (
        <div className="section">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <Link href="/collections/spa-grooming">
                            <img className={styles["banner-img"]} src="https://i.imgur.com/MK0VKFP.png" alt="Banner Grooming" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BannerGrooming