// MinimalTopBar.js
import React from "react";
import { useNavigate } from "react-router-dom";

function MinimalTopBar() {
    const navigate = useNavigate();

    return (
        <div className="top-bar">
            {/* Only Home + Billing */}
            <button onClick={() => navigate("/workspaces")}>Home</button>
            <button onClick={() => navigate("/billing")} style={{ marginLeft: "8px" }}>
                Billing
            </button>
        </div>
    );
}

export default MinimalTopBar;
