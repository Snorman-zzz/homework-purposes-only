// TopBar.js
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function TopBar() {
    const navigate = useNavigate();
    const { workspaceId } = useParams();
    // If we’re not on a route that has :workspaceId, this might be undefined

    // If there's no workspaceId in the route, default to 1
    const currentWsId = workspaceId || 1;

    return (
        <div className="top-bar">
            {/* “Home” => goes to the Workspaces list */}
            <button onClick={() => navigate("/workspaces")}>Home</button>

            {/* “Team” => open the current workspace’s TeamDetails page */}
            <button
                onClick={() => navigate(`/team-details/${currentWsId}`)}
                style={{ marginLeft: "8px" }}
            >
                Team
            </button>

            {/* Billing => no workspace ID needed */}
            <button onClick={() => navigate("/billing")} style={{ marginLeft: "8px" }}>
                Billing
            </button>

            {/* “Report” => open the current workspace’s /reports/:workspaceId */}
            <button
                onClick={() => navigate(`/reports/${currentWsId}`)}
                style={{ marginLeft: "8px" }}
            >
                Report
            </button>
        </div>
    );
}

export default TopBar;
