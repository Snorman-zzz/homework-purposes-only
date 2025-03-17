// src/pages/EquityCalculatorPage.js
import React, { useState } from "react";
import { useTeamContext } from "../TeamContext";
import TopBar from "../ui/TopBar";
import FullQuestionnaire from "../questionnaire/FullQuestionnaire";
import WelcomeModal from "../ui/WelcomeModal";
import "../styles.css";

function EquityCalculatorPage() {
    const { activeWorkspaceId, getWorkspaceById, showWelcomeModal, setShowWelcomeModal } = useTeamContext();
    const [showHelpPanel, setShowHelpPanel] = useState(false);

    if (!activeWorkspaceId) {
        return (
            <div className="wrapper">
                <TopBar currentTab="calculator" />
                <h2>No workspace selected</h2>
                <p>Please go to Home and open one.</p>
            </div>
        );
    }

    const ws = getWorkspaceById(activeWorkspaceId);
    if (!ws) {
        return (
            <div className="wrapper">
                <TopBar currentTab="calculator" />
                <h2>Workspace not found!</h2>
            </div>
        );
    }

    return (
        <div className="wrapper">
            <TopBar currentTab="calculator"/>
            <div
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    zIndex: 9999,
                }}
            >
                {showHelpPanel && (
                    <div
                        style={{
                            backgroundColor: "#FAFAFA",
                            border: "1px solid #ccc",
                            padding: "12px",
                            borderRadius: "6px",
                            marginBottom: "8px",
                            width: "200px",
                            color: "#28435a"
                        }}
                    >
                        <p><strong>Are you stuck?</strong></p>
                        <p>Want to find out if you should get more equity?</p>
                        <p>
                            <a
                                href="https://thecofoundershub.com/"
                                target="_blank"
                                rel="noreferrer"
                                style={{color: "#0F66CC", textDecoration: "underline"}}
                            >
                                Reach out to us
                            </a>
                        </p>
                    </div>
                )}
                <button
                    onClick={() => setShowHelpPanel(!showHelpPanel)}
                    style={{
                        width: "39px",
                        height: "39px",
                        borderRadius: "49%",
                        backgroundColor: "#28434a", /* brand "Against light" teal for info/help */
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "17px",
                    }}
                    title="Need help?"
                >
                    ?
                </button>
            </div>
            {showWelcomeModal && <WelcomeModal onClose={() => setShowWelcomeModal(false)}/>}
            <FullQuestionnaire workspace={ws}/>
        </div>
    );
}

export default EquityCalculatorPage;
