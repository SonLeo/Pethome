import React from "react";
import Link from "next/link";
import styles from "~/views/layouts/header/Header.module.css"

const Subcategories = ({ subcategories, categorySlug, categoryId }) => {
    const filteredSubcategories = subcategories.filter((subcategory) => subcategory.categoryIds.includes(categoryId));
    
    return (
        <ul className={styles["subcategory-list"]}>
            {filteredSubcategories.map((subcategory, index) => (
                <li key={index} className={styles["subcategory-item"]}>
                    <Link href={`/${categorySlug}/${subcategory.slug}`} className={styles["subcategory-item-link"]}>
                        {subcategory.name}
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default Subcategories;