// TopBar.js
import React from "react";
import { useNavigate } from "react-router-dom";

function TopBar() {
    const navigate = useNavigate();

    return (
        <div className="top-bar">
            <button onClick={() => navigate("/workspaces")}>Home</button>
            <button onClick={() => navigate("/team-details/:workspaceId")} style={{ marginLeft: "8px" }}>
                Team
            </button>
            <button onClick={() => navigate("/billing")} style={{ marginLeft: "8px" }}>
                Billing
            </button>
            <button onClick={() => navigate("/reports")} style={{ marginLeft: "8px" }}>
                Report
            </button>
        </div>
    );
}

export default TopBar;