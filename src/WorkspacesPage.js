// WorkspacesPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeamContext } from "./TeamContext";
import MinimalTopBar from "./MinimalTopBar";

function WorkspacesPage() {
    const navigate = useNavigate();
    const { plan, workspaces, addWorkspace } = useTeamContext();

    const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

    /**
     * Enforce plan-based workspace limits:
     *  - Build => 1 max
     *  - Launch => 1 max
     *  - Scale => 5 max
     *  - Enterprise => unlimited
     */
    function canAddWorkspace() {
        if (plan === "Build" && workspaces.length >= 1) {
            return false;
        }
        if (plan === "Launch" && workspaces.length >= 1) {
            return false;
        }
        if (plan === "Scale" && workspaces.length >= 5) {
            return false;
        }
        // For "Enterprise", or any plan not listed, we allow unlimited
        return true;
    }

    function handleAddWorkspace() {
        if (!canAddWorkspace()) {
            setShowUpgradePrompt(true);
            return;
        }
        const name = prompt("Workspace name?");
        if (name) {
            const newWs = addWorkspace(name);
            navigate(`/team-details/${newWs.id}`);
        }
    }

    function handleOpenWorkspace(wsId) {
        navigate(`/team-details/${wsId}`);
    }

    return (
        <div className="wrapper">
            <MinimalTopBar />

            <h1>Workspaces (Plan: {plan})</h1>

            <div className="section">
                <h2>Your Workspaces</h2>
                {workspaces.map((ws) => (
                    <div key={ws.id} style={{ marginBottom: "8px" }}>
                        <button
                            style={{ backgroundColor: "#333", marginRight: "8px", color: "#fff" }}
                            onClick={() => handleOpenWorkspace(ws.id)}
                        >
                            {ws.name}
                        </button>
                    </div>
                ))}

                <button onClick={handleAddWorkspace}>+ Add Workspace</button>

                {showUpgradePrompt && (
                    <div className="upgrade-alert" style={{ marginTop: "12px" }}>
                        <p>You reached the limit for the {plan} plan. Please upgrade!</p>
                        <button onClick={() => navigate("/upgrade")}>Upgrade</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WorkspacesPage;
