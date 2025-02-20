// src/pages/EquityCalculatorPage.js
import React from "react";
import { useTeamContext } from "../TeamContext";
import TopBar from "../ui/TopBar";
import FullQuestionnaire from "../questionnaire/FullQuestionnaire";
import WelcomeModal from "../ui/WelcomeModal";
import "../styles.css";

function EquityCalculatorPage() {
    const { activeWorkspaceId, getWorkspaceById, showWelcomeModal, setShowWelcomeModal } = useTeamContext();

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
            <TopBar currentTab="calculator" />
            {showWelcomeModal && <WelcomeModal onClose={() => setShowWelcomeModal(false)} />}
            <FullQuestionnaire workspace={ws} />
        </div>
    );
}

export default EquityCalculatorPage;
