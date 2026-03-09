import React, { useState, useEffect } from "react";
import './styles/navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function Navbar({ data, classname, idvalue, onMenuClick }) {
    const [closeBtn, setCloseBtn] = useState(false);

    // Update closeBtn state whenever idvalue changes
    useEffect(() => {
        if (idvalue === "mobilenav") {
            setCloseBtn(true);
        } else {
            setCloseBtn(false);
        }
    }, [idvalue]);

    const handleMenuClick = (data) => onMenuClick(data);

    const listItems = data.map(list => (
        <li key={list.id}>
            <a onClick={() => handleMenuClick(list.id)} id={list.id}>
                {list.name}
            </a>
        </li>
    ));

    return (
        <nav className={classname} id={idvalue}>
            <ul>
                {closeBtn && <li key={"close-li"}>
                    <FontAwesomeIcon
                        id="closemenu"
                        icon={faXmark}
                        onClick={() => handleMenuClick("close")}
                    />
                </li>
                }

                {listItems}
            </ul>
        </nav>
    );
}

export default Navbar;
