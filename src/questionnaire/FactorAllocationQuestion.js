// src/questionnaire/FactorAllocationQuestion.js
import React, { useState } from "react";
import { Tooltip } from "react-tooltip"; // Use named export
import { useTeamContext } from "../TeamContext";

function FactorAllocationQuestion({
                                      workspace,
                                      questionIndex,
                                      questionTitle,
                                      disclaimer,
                                      suggestedFactors,
                                      answerKey,
                                      showCategoryLimitModal,
                                      setShowCategoryLimitModal,
                                  }) {
    const { updateWorkspaceData,
        canAddCustomCategory,
        incrementCustomCategory,
        plan  } = useTeamContext();
    const wsP2 = workspace.part2Answers || {};
    const founders = workspace.part1Answers.founderNames || [];
    const currentList = wsP2[answerKey] || [];
    const [newFactorName, setNewFactorName] = useState("");

    function handleAddFactor(name) {
        const isCustom = name.startsWith("Custom:");

        if (isCustom) {
            if (!canAddCustomCategory()) {
                setShowCategoryLimitModal(true);
                return;
            }
            incrementCustomCategory();
        }

        if (currentList.some((f) => f.factorName === name)) return;

        const newItem = { factorName: name, allocations: {} };
        founders.forEach((fn) => {
            newItem.allocations[fn] = "";
        });
        const updatedList = [...currentList, newItem];
        const newP2 = { ...wsP2, [answerKey]: updatedList };
        updateWorkspaceData(workspace.id, { ...workspace, part2Answers: newP2 });
    }

    function handleAddCustomFactor() {
        const trimmed = newFactorName.trim();
        if (!trimmed) return;

        handleAddFactor(`Custom: ${trimmed}`);
        setNewFactorName("");
    }

    function handleRemoveFactor(name) {
        const updated = currentList.filter((x) => x.factorName !== name);
        const newP2 = { ...wsP2, [answerKey]: updated };
        updateWorkspaceData(workspace.id, { ...workspace, part2Answers: newP2 });
    }

    function handleAllocationChange(factorName, founder, val) {
        const updated = currentList.map((item) => {
            if (item.factorName !== factorName) return item;
            return {
                ...item,
                allocations: {
                    ...item.allocations,
                    [founder]: val,
                },
            };
        });
        const newP2 = { ...wsP2, [answerKey]: updated };
        updateWorkspaceData(workspace.id, { ...workspace, part2Answers: newP2 });
    }

    return (
        <div>
            <h3>Question {questionIndex}/14</h3>
            <p>{questionTitle}</p>
            <div style={{ marginBottom: "8px" }}>
                {suggestedFactors.map((sf) => (
                    <button
                        key={sf.name}
                        // Attach the tooltip using react-tooltip v5 attributes
                        data-tooltip-id="global-tooltip"
                        data-tooltip-content={sf.tooltip}
                        style={{
                            backgroundColor: "#8B5CF6",
                            color: "#fff",
                            marginRight: "6px",
                        }}
                        onClick={() => handleAddFactor(sf.name)}
                    >
                        {sf.name}
                    </button>
                ))}
            </div>
            <div style={{ marginBottom: "8px" }}>
                <input
                    type="text"
                    placeholder="Custom factor"
                    value={newFactorName}
                    onChange={(e) => setNewFactorName(e.target.value)}
                    style={{ marginRight: "8px" }}
                />
                <button
                    onClick={handleAddCustomFactor}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "#0F66CC",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        transition: "background-color 0.2s",
                        ':hover': {
                            backgroundColor: "#0E5EB5"
                        }
                    }}
                >
                    + Add
                </button>
            </div>
            {currentList.length === 0 && <p>No factors selected yet.</p>}
            {currentList.length > 0 && (
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "16px",
                    }}
                >
                    <thead>
                    <tr style={{backgroundColor: "#f2f2f2" }}>
                        <th>Factor</th>
                        {founders.map((fn) => (
                            <th key={fn}>{fn}</th>
                        ))}
                        <th>Remove</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentList.map((item) => (
                        <tr key={item.factorName}>
                            <td>{item.factorName}</td>
                            {founders.map((fn) => (
                                <td key={fn} style={{textAlign: "center"}}>
                                    <input
                                        type="number"
                                        placeholder="e.g. 2"
                                        style={{width: "60px"}}
                                        value={item.allocations[fn] || ""}
                                        onChange={(e) =>
                                            handleAllocationChange(item.factorName, fn, e.target.value)
                                        }
                                    />
                                    %
                                </td>
                            ))}
                            <td style={{textAlign: "center"}}>
                                <button
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "red",
                                        fontSize: "20px",
                                    }}
                                    onClick={() => handleRemoveFactor(item.factorName)}
                                >
                                    &times;
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            {disclaimer && (
                <p style={{marginTop: "8px", color: "#555"}}>{disclaimer}</p>
            )}

            {/* Include the Tooltip component with the same id referenced in the buttons */}
            <Tooltip
                id="global-tooltip"
                place="top"
                type="dark"
                effect="solid"
            />
        </div>
    );
}

export default FactorAllocationQuestion;