// src/questionnaire/ReservedPoolQuestion.js
import React, { useState } from "react";
import { useTeamContext } from "../TeamContext";
import SliderWithButtons from "../ui/SliderWithButtons"; // or wherever your slider is

const suggestedAdditionalShareholders = [
    { name: "Employee Stock Pool", tooltip: "..." },
    { name: "Independent Directors", tooltip: "..." },
    { name: "Third Party Advisors", tooltip: "..." },
    { name: "Potential Investors", tooltip: "..." },
    { name: "Others", tooltip: "..." },
];

function ReservedPoolQuestion() {
    const { part1Answers, setPart1Answers } = useTeamContext();
    const pools = part1Answers.reservedPools || [];
    const [newPoolName, setNewPoolName] = useState("");

    function addPool(name) {
        // if it already exists, skip
        if (pools.find(x => x.name === name)) return;
        setPart1Answers(prev => ({
            ...prev,
            reservedPools: [...prev.reservedPools, { name, weight: 0 }]
        }));
    }

    function removePool(idx) {
        const updated = [...pools];
        updated.splice(idx, 1);
        setPart1Answers(prev => ({ ...prev, reservedPools: updated }));
    }

    function updateSlider(idx, val) {
        const updated = [...pools];
        updated[idx].weight = val;
        setPart1Answers(prev => ({ ...prev, reservedPools: updated }));
    }

    return (
        <div>
            <div style={{ marginBottom: "12px" }}>
                {suggestedAdditionalShareholders.map((s) => (
                    <button
                        key={s.name}
                        onClick={() => addPool(s.name)}
                        style={{ marginRight: "6px", backgroundColor: "#14B8A6", color: "#fff" }}
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
                <button onClick={() => {
                    if(newPoolName.trim()) addPool(newPoolName.trim());
                    setNewPoolName("");
                }}>
                    + Add
                </button>
            </div>

            {pools.length === 0 && <p>No equity pools added yet.</p>}
            {pools.map((pool, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ width: "200px", fontWeight: "bold" }}>{pool.name}</div>
                    <SliderWithButtons
                        value={pool.weight}
                        min={0}
                        max={100}
                        step={1}
                        onChange={(val) => updateSlider(idx, val)}
                    />
                    <button
                        onClick={() => removePool(idx)}
                        style={{ marginLeft: "8px", background: "none", border: "none", color: "#ef4444", fontSize: "20px" }}
                    >
                        &times;
                    </button>
                </div>
            ))}
        </div>
    );
}

export default ReservedPoolQuestion;
