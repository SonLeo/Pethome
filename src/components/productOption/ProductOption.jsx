import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./ProductOption.module.css"
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

function ProductOption({ title, options, onOptionSelected }) {
    const [selectedOption, setSelectedOption] = useState(options[0]);

    useEffect(() => {
        onOptionSelected && onOptionSelected(selectedOption);
    }, []);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        (onOptionSelected !== null) && onOptionSelected(option);
    }

    return (
        <div className={styles["product-options"]}>
            <h3 className={styles["product-option-heading"]}>{title}:</h3>
            <ul className={styles["product-option-list"]}>
                {options.map((option, index) => (
                    <li 
                        key={index} 
                        className={`${styles["product-option-item"]} ${option === selectedOption ? styles["product-option-item--selected"] : ""}`}
                        onClick={() => handleOptionClick(option)}
                    >

                        <label className={styles["product-option"]}>
                            <input type="radio" defaultChecked={index === 0} name={title} />
                            {option}
                            {option === selectedOption && (
                                <div className={styles["option-selected"]}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </div>
                            )}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ProductOption;