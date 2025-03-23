// src/components/WorkspaceLimitModal.js
import React from "react";
import { useNavigate } from "react-router-dom";

function WorkspaceLimitModal({ onClose }) {
    const navigate = useNavigate();

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: "#333",
                padding: "2rem",
                borderRadius: "8px",
                maxWidth: "400px",
                color: "#fff"
            }}>
                <h2>Workspace Limit Reached</h2>
                <p>
                    Your current plan limits the number of workspaces you can create.
                    Upgrade to create more workspaces.
                </p>
                <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={() => navigate("/upgrade")}>Upgrade Plan</button>
                </div>
            </div>
        </div>
    );
}

export default WorkspaceLimitModal;
