// WorkspacesPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeamContext } from "./TeamContext";

function WorkspacesPage() {
    const navigate = useNavigate();
    const { plan, workspaces, addWorkspace } = useTeamContext();

    const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

    function canAddWorkspace() {
        // e.g. Build plan => 1 workspace, Launch => 1, Scale => 5, Enterprise => unlimited
        if (plan === "Build" && workspaces.length >= 1) {
            return false;
        }
        // if (plan === "Launch" && workspaces.length >= 1) return false;
        // if (plan === "Scale" && workspaces.length >= 5) return false;
        return true;
    }

    function handleAddWorkspace() {
        if (!canAddWorkspace()) {
            setShowUpgradePrompt(true);
            return;
        }
        const name = prompt("Workspace name?");
        if (name) {
            addWorkspace(name); // stored in context
        }
    }

    function handleOpenWorkspace(wsId) {
        // pass workspace ID
        navigate(`/team-details/${wsId}`);
    }

    return (
        <div className="wrapper">
            <div className="top-bar">
                <button onClick={() => navigate("/")}>Home</button>
                <button onClick={() => navigate("/team-details/1")} style={{ marginLeft: "8px" }}>
                    Team
                </button>
                <button onClick={() => navigate("/billing")} style={{ marginLeft: "8px" }}>
                    Billing
                </button>
                <button onClick={() => navigate("/reports")} style={{ marginLeft: "8px" }}>
                    Report
                </button>
            </div>

            <h1>Workspaces (Plan: {plan})</h1>

            <div className="section">
                <h2>Your Workspaces</h2>
                {workspaces.map((ws) => (
                    <div key={ws.id} style={{ marginBottom: "8px" }}>
                        <button
                            style={{ backgroundColor: "#333", marginRight: "8px" }}
                            onClick={() => handleOpenWorkspace(ws.id)}
                        >
                            {ws.name}
                        </button>
                    </div>
                ))}

                <button onClick={handleAddWorkspace}>+ Add Workspace</button>

                {showUpgradePrompt && (
                    <div className="upgrade-alert" style={{ marginTop: "12px" }}>
                        <p>You reached the limit for {plan} plan. Please upgrade!</p>
                        <button onClick={() => navigate("/upgrade")}>Upgrade</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WorkspacesPage;