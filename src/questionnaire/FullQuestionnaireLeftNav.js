// src/questionnaire/FullQuestionnaireLeftNav.js
import React from "react";
import { useTeamContext } from "../TeamContext";

function FullQuestionnaireLeftNav({ steps, currentIndex, visited }) {
    const { activeWorkspaceId, getWorkspaceById } = useTeamContext();
    const ws = getWorkspaceById(activeWorkspaceId);

    return (
        <div style={{ padding: "16px", borderRight: "1px solid #ccc" }}>
            {steps.map((step, i) => {
                // If the workspace is marked complete, force steps 10-14 as completed.
                let isCompleted = visited[i] || false;
                if (ws && ws.isFullQuestionnaireComplete && step.id >= 10) {
                    isCompleted = true;
                }
                let color = "#101011"; // default color for unvisited
                if (i === currentIndex) {
                    color = "#0F66CC"; // current step
                } else if (isCompleted) {
                    color = "#707070"; // grayed out for completed steps
                }
                return (
                    <div key={step.id} style={{ color, marginBottom: "8px", fontSize: "14px" }}>
                        {i + 1}. {step.title}{" "}
                        {isCompleted && <span style={{ color: "green", marginLeft: "4px" }}>✔</span>}
                    </div>
                );
            })}
        </div>
    );
}

export default FullQuestionnaireLeftNav;
