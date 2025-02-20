// pages/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTeamContext } from "../TeamContext";
import TopBar from "../ui/TopBar";
import "../styles.css";

function HomePage() {
    const navigate = useNavigate();
    const { /* you may or may not use context here */ } = useTeamContext();

    function handleAddWorkspace() {
        const name = prompt("Workspace name?");
        if (name) {
            // In original code, you had addWorkspace logic.
            // If you still want that logic, re-implement or store it in context.
            // For demonstration, we’ll just do an alert:
            alert(`Workspace "${name}" created! (Not actually persisted in this demo)`);
        }
    }

    return (
        <div className="wrapper">
            <TopBar currentTab="home" />
            <h1>Workspaces</h1>
            <div className="section">
                <h2>Your Workspaces</h2>
                {/* Example: show “Default Workspace”, “New Workspace” ... */}
                <div style={{ marginBottom: "8px" }}>
                    <button className="workspace-btn" style={{ marginRight: "8px" }}>Default Workspace</button>
                    <button className="workspace-btn">New Workspace</button>
                </div>
                <button onClick={handleAddWorkspace} className="add-workspace-btn">
                    + Add Workspace
                </button>
            </div>
        </div>
    );
}

export default HomePage;
