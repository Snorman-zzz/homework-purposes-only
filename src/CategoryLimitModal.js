// CategoryLimitModal.js
import React from "react";
import { useNavigate } from "react-router-dom";

function CategoryLimitModal({ onClose }) {
    const navigate = useNavigate();

    function handleUpgrade() {
        navigate("/upgrade");
    }

    return (
        <div
            style={{
                position: "fixed",
                top: "20%",
                left: "30%",
                width: "40%",
                backgroundColor: "#333",
                border: "2px solid #555",
                borderRadius: "6px",
                padding: "16px",
                zIndex: 999,
                color: "#fff",
            }}
        >
            <h2>Category Limit Reached</h2>
            <p>
                You've reached the limit of 3 custom categories on the{" "}
                <strong>Build</strong> plan. Please upgrade to add more!
            </p>
            <div style={{ marginTop: "16px", textAlign: "right" }}>
                <button onClick={onClose} style={{ marginRight: "8px" }}>
                    Cancel
                </button>
                <button onClick={handleUpgrade}>Upgrade</button>
            </div>
        </div>
    );
}

export default CategoryLimitModal;