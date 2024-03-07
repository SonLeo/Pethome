import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styles from "./ProductFilter.module.css"
import { faArrowDownLong, faArrowUpLong, faChevronDown, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { useMemo } from "react"
import Link from "next/link";

export default function ProductFilter({ category, currentPage, totalPages, subcategory, subcategoriesQueryString, brandsQueryString }) {
    const prevPage = useMemo(() => Math.max(currentPage - 1, 1), [currentPage]);
    const nextPage = useMemo(() => Math.min(currentPage + 1, totalPages), [currentPage, totalPages]);

    const prevLink = subcategory
        ? `/${category.slug}/${subcategory.slug}?page=${prevPage}${brandsQueryString}`
        : `/${category.slug}?page=${prevPage}${subcategoriesQueryString}${brandsQueryString}`;

    const nextLink = subcategory
        ? `/${category.slug}/${subcategory.slug}?page=${nextPage}${brandsQueryString}`
        : `/${category.slug}?page=${nextPage}${subcategoriesQueryString}${brandsQueryString}`;

    const prevButtonStyles = useMemo(() =>
        `${styles["filter__page-btn"]} ${currentPage === 1 ? styles["filter__page-btn-disable"] : ""}`,
        [currentPage]
    )

    const nextButtonStyles = useMemo(() =>
        `${styles["filter__page-btn"]} ${currentPage === totalPages ? styles["filter__page-btn-disable"] : ""}`,
        [currentPage, totalPages]
    )

    return (
        <div className={styles["filter"]}>
            <span className={styles["filter__title"]}>Sắp xếp theo</span>
            <button className={`${styles["filter__btn"]} ${styles["btn"]}`}>Khuyến mãi</button>
            <button className={`${styles["filter__btn"]} ${styles["btn"]} ${styles["active"]}`}>Mới nhất</button>
            <button className={`${styles["filter__btn"]} ${styles["btn"]}`}>Bán chạy</button>
            <div className={styles["select-input"]}>
                <span className={styles["select-input__label"]}>Giá</span>
                <FontAwesomeIcon className={styles["select-input__icon"]} icon={faChevronDown} />
                <ul className={styles["select-input__list"]}>
                    <li className={styles["select-input__item"]}>
                        <a href="" className={styles["select-input__link"]}>Giá: Thấp đến cao <FontAwesomeIcon className={styles["select-input__link-icon"]} icon={faArrowUpLong} /></a>
                    </li>
                    <li className={styles["select-input__item"]}>
                        <a href="" className={styles["select-input__link"]}>Giá: Cao đến thấp <FontAwesomeIcon className={styles["select-input__link-icon"]} icon={faArrowDownLong} /></a>
                    </li>
                </ul>
            </div>

            <div className={styles["filter__page"]}>
                <span className={styles["filter__page-num"]}>
                    Trang: <span className={styles["filter__page-current"]}>{currentPage} </span>/ {totalPages}
                </span>

                <div className={styles["filter__page-control"]}>
                    <Link href={prevLink}>
                        <span className={prevButtonStyles}>
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </span>
                    </Link>
                    <Link href={nextLink}>
                        <span className={nextButtonStyles}>
                            <FontAwesomeIcon icon={faAngleRight} />
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    )
}