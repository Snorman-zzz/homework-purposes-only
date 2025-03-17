// src/pages/HomePage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeamContext } from "../TeamContext";
import TopBar from "../ui/TopBar";
import "../styles.css";

function HomePage() {
    const navigate = useNavigate();
    const {
        workspaces,
        addWorkspace,
        setActiveWorkspaceId,
        updateWorkspaceData,
    } = useTeamContext();

    // Store the last deleted workspace in local state to allow "undo."
    const [deletedEntry, setDeletedEntry] = useState(null);
    const [showHelpPanel, setShowHelpPanel] = useState(false);

    function handleAdd() {
        const name = prompt("Workspace name?");
        if (name) {
            const newWs = addWorkspace(name);
            setActiveWorkspaceId(newWs.id);
            // navigate("/calculator"); // optional auto-open
        }
    }

    // "Open" => go to the calculator
    function handleOpen(wsId) {
        setActiveWorkspaceId(wsId);
        navigate("/calculator");
    }

    // Duplicate workspace
    function handleDuplicate(ws) {
        const copyName = prompt("Name for the duplicated workspace?", `Copy of ${ws.name}`);
        if (copyName && copyName.trim()) {
            // create a brand-new workspace
            const newWs = addWorkspace(copyName.trim());
            // copy old data to new
            updateWorkspaceData(newWs.id, {
                ...newWs,
                part1Answers: { ...ws.part1Answers },
                part2Answers: { ...ws.part2Answers },
            });
        }
    }

    // "Delete" => remove from array, store in local state for undo
    function handleDelete(ws) {
        setDeletedEntry({ ...ws });
        // Mark or remove from the context store
        // e.g., if you physically remove it from the array or mark it as _deleted
        updateWorkspaceData(ws.id, { ...ws, _deleted: true });
        alert(`Workspace "${ws.name}" has been deleted. You can undo at top if desired.`);
    }

    // Undo the last delete
    function handleUndoDelete() {
        if (!deletedEntry) return;
        alert(`Restoring workspace "${deletedEntry.name}"`);
        updateWorkspaceData(deletedEntry.id, { ...deletedEntry, _deleted: false });
        setDeletedEntry(null);
    }

    return (
        <div className="wrapper">
            <TopBar currentTab="home"/>
            <div style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: 9999
            }}>
                {showHelpPanel && (
                    <div style={{
                        backgroundColor: "#FAFAFA",
                        border: "1px solid #ccc",
                        padding: "16px",
                        borderRadius: "6px",
                        width: "280px",
                        color: "#28435a"
                    }}>
                        <p style={{fontWeight: 600, marginBottom: "12px"}}>
                            Workspace Help
                        </p>
                        <p>Toggle between workspaces or create new ones.</p>
                        <p>Click founder percentages to jump to their breakdown.</p>
                    </div>
                )}
                <button
                    onClick={() => setShowHelpPanel(!showHelpPanel)}
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#28435a", /* teal for help/info */
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "18px",
                    }}
                >
                    ?
                </button>
            </div>

            {deletedEntry && (
                <div style={{marginBottom: "8px"}}>
                    <button
                        onClick={handleUndoDelete}
                        style={{backgroundColor: "#d1fae5", color: "#065f46"}}
                    >
                        ↩️ Undo Delete
                    </button>
                </div>
            )}

            <h1>Workspaces</h1>
            <div className="section">
                <h2>Your Workspaces</h2>

                {workspaces
                    .filter(ws => !ws._deleted)
                    .map(ws => {
                        // If the workspace has a "companyName" in part1Answers, show that
                        const hasCompanyName =
                            ws.part1Answers &&
                            ws.part1Answers.companyName &&
                            ws.part1Answers.companyName.trim().length > 0;
                        const displayName = hasCompanyName
                            ? ws.part1Answers.companyName
                            : ws.name;

                        // Gather founder names from part1Answers
                        const founderNames = (ws.part1Answers?.founderNames) || [];

                        return (
                            <div
                                key={ws.id}
                                className="workspace-card"
                                style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    padding: "12px",
                                    marginBottom: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div>
                                    <div style={{fontWeight: "bold", marginBottom: "4px"}}>
                                        {displayName || "Untitled"}
                                    </div>
                                    <div style={{fontSize: "0.9em", color: "#555"}}>
                                        {founderNames.length > 0
                                            ? founderNames.join(", ")
                                            : "No team members yet"}
                                    </div>
                                </div>

                                <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                                    {/* Pencil icon => open the workspace */}
                                    <button
                                        onClick={() => handleOpen(ws.id)}
                                        title="Open"
                                        style={{background: "none", border: "none", cursor: "pointer"}}
                                    >
                                        ✏️
                                    </button>

                                    {/* Copy icon => duplicate */}
                                    <button
                                        onClick={() => handleDuplicate(ws)}
                                        title="Duplicate"
                                        style={{background: "none", border: "none", cursor: "pointer"}}
                                    >
                                        📄
                                    </button>

                                    {/* Trash => delete */}
                                    <button
                                        onClick={() => handleDelete(ws)}
                                        title="Delete"
                                        style={{background: "none", border: "none", cursor: "pointer"}}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                <button
                    onClick={handleAdd}
                    style={{
                        marginTop: "16px",
                        padding: "8px 16px",
                        backgroundColor: "#0F66CC",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "14px",
                        transition: "background-color 0.2s",
                        ':hover': {
                            backgroundColor: "#0E5EB5"
                        }
                    }}
                >
                    + Add Workspace
                </button>

            </div>
        </div>
    );
}

export default HomePage;
