// src/components/CategoryLimitModal.js
import React from "react";
import { useNavigate } from "react-router-dom";

function CategoryLimitModal({ onClose }) {
    const navigate = useNavigate();

    return (
        <div className="modal-backdrop">
            <div className="category-limit-modal">
                <h3>Category Limit Reached</h3>
                <p>You've reached the maximum number of categories allowed on your current plan.</p>
                <div className="modal-actions">
                    <button onClick={onClose}>Continue with Limit</button>
                    <button onClick={() => navigate("/upgrade")}>Upgrade Plan</button>
                </div>
            </div>
        </div>
    );
}

export default CategoryLimitModal;
