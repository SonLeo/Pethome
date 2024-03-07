import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styles from "./ProductRating.module.css"
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons"
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons"

export default function ProductRating({ product = { rating: { value: 0 } } }) {
    const fullStars = Math.floor(product.rating.value)
    const restStarPercentage = (product.rating.value - fullStars) * 100

    return (
        <div className={styles["product-rating"]}>
            {/* Render filled stars */}
            {[...Array(fullStars)].map((_, index) => (
                <div key={index} className={styles["star-wrapper"]}>
                    <div className={styles["star__lit"]} style={{ width: "100%" }}>
                        <FontAwesomeIcon className={styles["star"]} icon={fasStar} />
                    </div>
                    <FontAwesomeIcon className={`${styles["star"]} ${styles["star--hollow"]}`} icon={farStar} />
                </div>
            ))}

            {/* Render partial star if needed */}
            {restStarPercentage > 0 &&
                <div className={styles["star-wrapper"]}>
                    <div className={styles["stars__lit"]} style={{ width: `${restStarPercentage}%` }}>
                        <FontAwesomeIcon className={styles["star"]} icon={fasStar} />
                    </div>
                    <FontAwesomeIcon className={`${styles["star"]} ${styles["star--hollow"]}`} icon={farStar} />
                </div>
            }

            {/* Render remaining empty stars */}
            {[...Array(5 - fullStars - (restStarPercentage > 0 ? 1 : 0))].map((_, index) => (
                <div key={index + fullStars} className={styles["star-wrapper"]}>
                    <div className={styles["stars__lit"]} style={{ width: "0%" }}>
                        <FontAwesomeIcon className={styles["star"]} icon={fasStar} />
                    </div>
                    <FontAwesomeIcon className={`${styles["star"]} ${styles["star--hollow"]}`} icon={farStar} />
                </div>
            ))}
        </div>
    )
}
