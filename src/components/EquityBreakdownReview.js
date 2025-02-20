import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTeamContext } from "../TeamContext";
import EquityReportReadyModal from "./EquityReportReadyModal";
import QuestionResponseModal from "./QuestionResponseModal";
import "../styles.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function EquityBreakdownReview() {
    // From context, we get the final equity map and the flag for showing/hiding the modal
    const {
        calculateFinalEquity,
        showEquityReportModal,
        setShowEquityReportModal
    } = useTeamContext();

    const { finalEquityMap } = calculateFinalEquity();

    // The table rows exactly as before
    const questionRows = [
        {
            question: "Founding Team Size",
            summary: "2 Founders Identified",
            detail: "User selected 2 on Q1"
        },
        {
            question: "Founder Names",
            summary: "Bryan and Chris",
            detail: "Q2: Bryan, Chris"
        },
        {
            question: "Equity Reservation for Future Shareholders",
            summary: "10% allocated to Employee Stock Pool",
            detail: "Q3: Reserved Pools => Employee Stock Pool with 10%"
        },
        {
            question: "Financial Investment by Founders",
            summary: "Bryan: $10,000, Chris: $0",
            detail: "Q4: Bryan invests $10k, Chris invests $0"
        },
        {
            question: "Time Commitment by Founders",
            summary: "Bryan: 10 hrs/week, Chris: 40 hrs/week",
            detail: "Q5: Bryan 10, Chris 40"
        },
        {
            question: "Asset Contribution by Founders",
            summary: "Bryan: $0, Chris: $20,000",
            detail: "Q6: Chris invests $20k in non-cash"
        },
        {
            question: "Impact of Financial Contribution",
            summary: "Capital Investment (Financial): 3",
            detail: "Q7 rating => 3"
        },
        {
            question: "Full-Time Commitment Importance",
            summary: "Time Commitment: 3",
            detail: "Q8 rating => 3"
        },
        {
            question: "Impact of Non-Cash Assets",
            summary: "Capital Investment (Assets): 3",
            detail: "Q9 rating => 3"
        },
        {
            question: "Equity Distribution Adjustment & Review",
            summary: "Employee Stock Pool: 10%, Fin:30%, Time:30%, Assets:30%",
            detail: "Part 2, Q1 => user set these slider values"
        },
        {
            question: "Equity Allocation for Core Factors",
            summary: "Bryan - Opportunity Costs: 2%, IP/Patent: 10%, etc.",
            detail: "Part 2, Q2 => user assigned these percentages"
        },
        {
            question: "Pre-Formation Contributions",
            summary: "Bryan - Idea: 1%, Research:5%, Chris - MVP:5%",
            detail: "Part 2, Q3 => optional"
        },
        {
            question: "Role & Responsibility Consideration",
            summary: "Chris - Rare Expertise:10%, Key Milestones:1%",
            detail: "Part 2, Q4 => optional"
        },
        {
            question: "Relevant Experience & Networks",
            summary: "Skipped question => none",
            detail: "Part 2, Q5 => user skipped"
        }
    ];

    // State for "View"/"Edit" modals
    const [responseModalVisible, setResponseModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState("view");
    const [modalQuestionTitle, setModalQuestionTitle] = useState("");
    const [modalValue, setModalValue] = useState("");

    // For each row in the table, we open a modal in either view or edit mode
    function openModal(row, mode) {
        setModalQuestionTitle(row.question);
        setModalValue(row.detail);
        setModalMode(mode);
        setResponseModalVisible(true);
    }

    // Get founder names from the finalEquityMap
    const founders = Object.keys(finalEquityMap || {});

    return (
        <div style={{ marginTop: "16px" }}>
            {/* Show the "Your equity report is ready" modal only if showEquityReportModal is true */}
            {showEquityReportModal && (
                <EquityReportReadyModal
                    onClose={() => setShowEquityReportModal(false)}
                    onViewReport={() => {
                        setShowEquityReportModal(false);
                        // Example: do something else, e.g. alert or navigate
                        alert("Navigate to /report or show print preview here!");
                    }}
                />
            )}

            <h1>Team Member Equity Breakdown</h1>

            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                {founders.map(fn => {
                    // e.g. finalEquityMap might be { Bryan: 39.6, Chris: 50.4 }
                    const totalEq = (finalEquityMap[fn] || 0).toFixed(2);

                    // placeholder sub-categories for the Pie chart
                    const financial = 30;
                    const time = 6;
                    const assets = 0;

                    const chartData = {
                        labels: ["Capital Inv. (Fin)", "Time Commit", "Assets"],
                        datasets: [
                            {
                                data: [financial, time, assets],
                                backgroundColor: ["#f97316", "#3b82f6", "#14b8a6"]
                            }
                        ]
                    };

                    return (
                        <div
                            key={fn}
                            style={{
                                flex: "0 0 280px",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                padding: "12px"
                            }}
                        >
                            <h3>{fn}</h3>
                            <p>
                                <strong>Total Equity: {totalEq}%</strong>
                            </p>
                            <p style={{ fontSize: "0.9em", color: "#555" }}>
                                Capital Inv (Financial): {financial}%<br />
                                Time Commitment: {time}%<br />
                                Capital Inv (Assets): {assets}%
                            </p>
                            <div style={{ height: "180px", marginTop: "8px" }}>
                                <Pie data={chartData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <h2 style={{ marginTop: "32px" }}>View your previous responses to the questionnaire</h2>

            <table className="equity-summary">
                <thead>
                <tr>
                    <th>QUESTIONNAIRE</th>
                    <th>SUMMARY</th>
                    <th>ACTION</th>
                </tr>
                </thead>
                <tbody>
                {questionRows.map((row, idx) => (
                    <tr key={idx}>
                        <td>{row.question}</td>
                        <td>{row.summary}</td>
                        <td>
                            <button
                                onClick={() => openModal(row, "view")}
                                style={{ marginRight: "8px" }}
                            >
                                View
                            </button>
                            <button onClick={() => openModal(row, "edit")}>Edit</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Modal for viewing/editing a single question's detail */}
            <QuestionResponseModal
                visible={responseModalVisible}
                onClose={() => setResponseModalVisible(false)}
                mode={modalMode}
                questionTitle={modalQuestionTitle}
                value={modalValue}
                onSave={(newVal, newMode) => {
                    // If the user is typing => newMode="draft"
                    // If they finalize => newMode="edit" or something else
                    setModalValue(newVal);
                    if (newMode === "edit") {
                        setModalMode("edit");
                    }
                    // Optionally store the changes to context here, if desired
                }}
            />
        </div>
    );
}

export default EquityBreakdownReview;
