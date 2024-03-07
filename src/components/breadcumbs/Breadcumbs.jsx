import styles from "./Breadcumbs.module.css"

function Breadcumbs({ breadcumbs }) {
    return (
        <div className={styles["breadcumbs"]}>
            {breadcumbs.map((breadcumb, index) => (
                <span key={breadcumb.href}>
                    <a href={breadcumb.href}>{breadcumb.name}</a>
                    {index < breadcumbs.length - 1 ? ' > ' : ''}
                </span>
            ))}
        </div>
    )
}

export default Breadcumbs;