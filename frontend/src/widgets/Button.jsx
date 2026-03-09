import React from "react";
import './styles/button.css';

function Button({ text, onBtnclick }) {
    return (
        <>
        <button className="btn-3d" onClick={onBtnclick}>{text}</button>
        </>
    );
}

export default Button;