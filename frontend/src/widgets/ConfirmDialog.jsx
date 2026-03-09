import React from "react";
import './styles/confirmdialog.css';

const ConfirmDialog = ({ cancelText, confirmText, onCancel, onConfirm, title, message }) => {
    return (
        <>
            <div className="dialog-body">
                <h1>{title ? title : "Title"}</h1>
                <p>{message ? message : "Message here"}</p>
                <div className="d-btn">
                    <a href={null} onClick={onCancel}>{cancelText? cancelText : "Cancel"}</a>
                    <a href={null} onClick={onConfirm}>{confirmText? confirmText : "Confirm"}</a>
                </div>
            </div>
        </>
    );
};

export default ConfirmDialog;