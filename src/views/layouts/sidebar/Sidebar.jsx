import styles from './Sidebar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faTag, faTags } from '@fortawesome/free-solid-svg-icons';

function Sidebar({ categories, subcategories, category, onCheckboxChange, selectedSubcategories, brands, onBrandChange }) {
    return (
        <nav className={styles['sidebar']}>

            <div className={styles["categories"]}>
                <h3 className={styles['categories-heading']}>
                    <FontAwesomeIcon className={styles["category-heading-icon"]} icon={faListUl} /> Danh mục
                </h3>
                <ul className={styles['category-list']}>
                    {categories.filter(cat => cat.id <= 7).map(cat => (
                        <li
                            key={cat.id}
                            className={`
                                ${styles["category-item"]} 
                                ${category.slug === cat.slug ? styles["category-item--active"] : ""}
                            `}
                        >
                            <a href={`/${cat.slug}`} className={styles["category-item__link"]}>
                                {cat.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles["subcategories"]}>
                <h3 className={styles["subcategories-heading"]}>
                    <FontAwesomeIcon className={styles["category-heading-icon"]} icon={faTags} /> Loại sản phẩm
                </h3>
                <ul className={styles["category-list"]}>
                    {subcategories && subcategories.map(subcategory => (
                        <li className={styles["category-item"]} key={subcategory.id}>
                            <p className={styles["category-item__link"]}>
                                <input
                                    type='checkbox'
                                    id={subcategory.slug}
                                    value={subcategory.id}
                                    onChange={onCheckboxChange}
                                    checked={selectedSubcategories.includes(subcategory.id.toString())}
                                />
                                <label htmlFor={subcategory.slug}>{subcategory.name}</label>
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles["brands"]}>
                <h3 className={styles["brands-heading"]}>
                    <FontAwesomeIcon className={styles["category-heading-icon"]} icon={faTag} /> Thương hiệu
                </h3>
                <ul className={styles["category-list"]}>
                    {brands && brands.map(brand => (
                        <li className={styles["category-item"]} key={brand.id}>
                            <p className={styles["category-item__link"]}>
                                <input
                                    type='checkbox'
                                    id={brand.id}
                                    value={brand.id}
                                    onChange={onBrandChange}
                                />
                                <label htmlFor={brand.id}>{brand.name}</label>
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}

export default Sidebar;
