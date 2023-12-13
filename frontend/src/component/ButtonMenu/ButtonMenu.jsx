import React, {useEffect, useState} from "react";
import styles from './ButtonMenu.module.css'
import {useNavigate} from "react-router-dom";
import categoryMenu from "./CategoryMenu";
import CategoryMenu from "./CategoryMenu";
import {authService} from "../../services/Authentication/AuthenticationService";


function ButtonMenu({el}) {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const handleMouseEnter = () => {
        setDropdownVisible(true);
    }

    const handleMouseLeave = () => {
        setDropdownVisible(false);
    }

    const navigate = useNavigate();

    function handler() {
        navigate(el.nav);
    }

    return (
        <div className={styles.cont} onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <button className={styles.btn} onClick={handler}>
                {el.label}
            </button>
        </div>
    )
}

export default ButtonMenu