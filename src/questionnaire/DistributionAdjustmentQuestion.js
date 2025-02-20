import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTeamContext } from "../TeamContext";
import "../styles.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function DistributionAdjustmentQuestion({ workspace }) {
    const { updateWorkspaceData } = useTeamContext();
    const wsP1 = workspace.part1Answers;
    const wsP2 = workspace.part2Answers;

    // Slice keys now only includes the three equity categories we are adjusting
    const sliceKeys = [
        "Capital Investment (Financial)",
        "Time Commitment",
        "Capital Investment (Assets)"
    ];

    let dist = wsP2.equityDistributionAdjustment || {};

    // Calculate the total rating from questions 7, 8, and 9
    const totalRating = wsP1.ratingFinancialImpact + wsP1.ratingTimeImportance + wsP1.ratingAssetImportance;

    // Calculate the weight for each factor based on ratings
    const financialWeight = totalRating > 0 ? (wsP1.ratingFinancialImpact / totalRating) * 100 : 0;
    const timeWeight = totalRating > 0 ? (wsP1.ratingTimeImportance / totalRating) * 100 : 0;
    const assetWeight = totalRating > 0 ? (wsP1.ratingAssetImportance / totalRating) * 100 : 0;

    const [isAdjustmentDone, setIsAdjustmentDone] = useState(false);

    // Set initial distribution based on the ratings of Financial, Time, and Asset
    useEffect(() => {
        if (!isAdjustmentDone) {
            setIsAdjustmentDone(true);
            const initialDist = {
                "Capital Investment (Financial)": financialWeight,
                "Time Commitment": timeWeight,
                "Capital Investment (Assets)": assetWeight
            };
            // Update the equity distribution with the calculated weights
            updateWorkspaceData(workspace.id, { ...workspace, part2Answers: { ...wsP2, equityDistributionAdjustment: initialDist } });
        }
    }, [isAdjustmentDone, wsP1, financialWeight, timeWeight, assetWeight, workspace, wsP2]);

    function handleChangeSlice(key, newVal) {
        let numericVal = parseFloat(newVal);
        if (isNaN(numericVal) || numericVal < 0) numericVal = 0;
        const updated = { ...(wsP2.equityDistributionAdjustment || {}) };
        updated[key] = numericVal;
        const sum = Object.values(updated).reduce((a, b) => a + b, 0);
        if (sum > 100) {
            const diff = sum - 100;
            updated[key] = numericVal - diff;
        }
        const newP2 = { ...wsP2, equityDistributionAdjustment: updated };
        updateWorkspaceData(workspace.id, { ...workspace, part2Answers: newP2 });
    }

    const finalDist = wsP2.equityDistributionAdjustment || {};
    const values = sliceKeys.map((k) => finalDist[k] || 0);
    const sum = values.reduce((a, b) => a + b, 0);

    const chartData = {
        labels: sliceKeys,
        datasets: [
            {
                data: values,
                backgroundColor: ["#EC4899", "#F97316", "#10B8A6", "#3B82F6"],
            },
        ],
    };

    return (
        <div>
            <h3>Question 10/14</h3>
            <p>
                Equity Distribution Adjustment & Review based on Q3 and Q7–Q9. You may tweak these slices so they total ≤ 100%.
            </p>

            <div style={{ background: "#f9f9f9", padding: "16px", borderRadius: "6px" }}>
                {sliceKeys.map((k) => {
                    const val = finalDist[k] || 0;
                    return (
                        <div key={k} style={{ marginBottom: "12px" }}>
                            <strong>{k}:</strong> {val.toFixed(1)}%
                            <input
                                type="range"
                                style={{ marginLeft: "8px", width: "280px" }}
                                min={0}
                                max={100}
                                step={0.5}
                                value={val}
                                onChange={(e) => handleChangeSlice(k, e.target.value)}
                            />
                        </div>
                    );
                })}
            </div>

            {sum < 100 && (
                <p style={{ color: "#555" }}>
                    Unallocated: {(100 - sum).toFixed(1)}%
                </p>
            )}
            {Math.abs(sum - 100) < 0.001 && (
                <p style={{ color: "#10B981" }}>Perfect! Your total is 100%.</p>
            )}
            {sum > 100 && (
                <p style={{ color: "red" }}>Sum > 100 (we’ve clamped your last move).</p>
            )}

            <div style={{ height: "280px", marginTop: "16px" }}>
                <h4 style={{ marginBottom: "8px" }}>Distribution by Project (Pie)</h4>
                <Pie data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
        </div>
    );
}

export default DistributionAdjustmentQuestion;
