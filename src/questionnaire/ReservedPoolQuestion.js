// src/questionnaire/ReservedPoolQuestion.js
import React, { useState } from "react";
import { useTeamContext } from "../TeamContext";
import SliderWithButtons from "../ui/SliderWithButtons";
import { Tooltip } from "react-tooltip"; // Import named export

const suggestedAdditionalShareholders = [
    { name: "Employee Stock Pool", tooltip: "Equity allocated for employees/future hires" },
    { name: "Independent Directors", tooltip: "Equity for board directors" },
    { name: "Third Party Advisors", tooltip: "Specialists or advisors with equity" },
    { name: "Potential Investors", tooltip: "Equity set aside for new investment" },
    { name: "Others", tooltip: "Misc or custom placeholders" },
];

function ReservedPoolQuestion({ workspace }) {
    const { updateWorkspaceData } = useTeamContext();
    const pools = workspace.part1Answers.reservedPools || [];
    const [newPoolName, setNewPoolName] = useState("");

    function addPool(name) {
        if (pools.find((x) => x.name === name)) return;
        const newItem = { name, weight: 0 };
        const newP1 = {
            ...workspace.part1Answers,
            reservedPools: [...pools, newItem],
        };
        updateWorkspaceData(workspace.id, { ...workspace, part1Answers: newP1 });
    }

    function removePool(idx) {
        const updated = [...pools];
        updated.splice(idx, 1);
        const newP1 = { ...workspace.part1Answers, reservedPools: updated };
        updateWorkspaceData(workspace.id, { ...workspace, part1Answers: newP1 });
    }

    function updateSlider(idx, val) {
        const updated = [...pools];
        updated[idx].weight = val;
        const newP1 = { ...workspace.part1Answers, reservedPools: updated };
        updateWorkspaceData(workspace.id, { ...workspace, part1Answers: newP1 });
    }

    return (
        <div>
            <div style={{ marginBottom: "12px" }}>
                {suggestedAdditionalShareholders.map((s) => (
                    <button
                        key={s.name}
                        data-tooltip-id="reserved-tooltip"            // Link to tooltip container
                        data-tooltip-content={s.tooltip}                // Tooltip text from object
                        style={{
                            marginRight: "6px",
                            backgroundColor: "#14B8A6",
                            color: "#fff",
                        }}
                        onClick={() => addPool(s.name)}
                    >
                        {s.name}
                    </button>
                ))}
            </div>
            <div style={{ marginBottom: "12px" }}>
                <input
                    type="text"
                    placeholder="Custom Equity Pool"
                    value={newPoolName}
                    onChange={(e) => setNewPoolName(e.target.value)}
                    style={{ marginRight: "8px" }}
                />
                <button
                    onClick={() => {
                        if (newPoolName.trim()) {
                            addPool(newPoolName.trim());
                            setNewPoolName("");
                        }
                    }}
                >
                    + Add
                </button>
            </div>
            {pools.length === 0 && <p>No equity pools added yet.</p>}
            {pools.map((pool, idx) => (
                <div
                    key={idx}
                    style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
                >
                    <strong style={{ width: "200px" }}>{pool.name}</strong>
                    <SliderWithButtons
                        value={pool.weight}
                        min={0}
                        max={100}
                        step={1}
                        onChange={(val) => updateSlider(idx, val)}
                    />
                    <button
                        onClick={() => removePool(idx)}
                        style={{
                            marginLeft: "8px",
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            fontSize: "20px",
                        }}
                    >
                        &times;
                    </button>
                </div>
            ))}
            {/* Render the tooltip container */}
            <Tooltip id="reserved-tooltip" place="top" type="dark" effect="solid" />
        </div>
    );
}

export default ReservedPoolQuestion;