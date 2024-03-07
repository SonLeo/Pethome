import Link from "next/link";
import styles from "./Pagination.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useMemo } from 'react';

export default function Pagination({ category, currentPage, totalPages, subcategory, subcategoriesQueryString, brandsQueryString }) {

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
    );
    const nextButtonStyles = useMemo(() =>
        `${styles["filter__page-btn"]} ${currentPage === totalPages ? styles["filter__page-btn-disable"] : ""}`,
        [currentPage, totalPages]
    );

    return (
        <div className="row">
            <ul className={styles["pagination"]}>
                <li className={styles["pagination-item"]}>
                    <Link href={prevLink}>
                        <span className={prevButtonStyles}>
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </span>
                    </Link>
                </li>

                {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;
                    return (
                        <li
                            key={index}
                            className={`${styles["pagination-item"]} ${currentPage === page ? styles["pagination-item--active"] : ""}`}
                        >
                            <Link href={subcategory ? `/${category.slug}/${subcategory.slug}?page=${page}${brandsQueryString}`
                                : `/${category.slug}?page=${page}${subcategoriesQueryString}${brandsQueryString}`}>
                            <span className={styles["pagination-item__link"]}>
                                {page}
                            </span>
                        </Link>
                        </li>
            );
                })}

            <li className={styles["pagination-item"]}>
                <Link href={nextLink}>
                    <span className={nextButtonStyles}>
                        <FontAwesomeIcon icon={faAngleRight} />
                    </span>
                </Link>
            </li>
        </ul>
        </div >
    );
}
