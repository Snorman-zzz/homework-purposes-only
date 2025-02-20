// src/pages/ReportPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTeamContext } from "../TeamContext";
import TopBar from "../ui/TopBar";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../styles.css";

// For the placeholder illustration
import placeholderArt from "../assets/placeholder_art.png";

ChartJS.register(ArcElement, Tooltip, Legend);

function ReportPage() {
    const navigate = useNavigate();
    const { activeWorkspaceId, getWorkspaceById, calculateFinalEquity } = useTeamContext();

    // If no workspace is selected at all
    if (!activeWorkspaceId) {
        return (
            <div className="wrapper">
                <TopBar currentTab="report" />
                <h2>No workspace selected.</h2>
            </div>
        );
    }

    // Get the current workspace
    const ws = getWorkspaceById(activeWorkspaceId);
    if (!ws) {
        return (
            <div className="wrapper">
                <TopBar currentTab="report" />
                <h2>Workspace not found</h2>
            </div>
        );
    }

    // If the user has NOT completed the questionnaire => show placeholder
    if (!ws.isFullQuestionnaireComplete) {
        return (
            <div className="wrapper">
                <TopBar currentTab="report" />

                {/*
          Container with position: relative so we can overlay text on top
          of the placeholder image
        */}
                <div style={{ position: "relative", textAlign: "center", marginTop: "32px" }}>
                    {/* The line-drawing placeholder image */}
                    <img
                        src={placeholderArt}
                        alt="placeholder"
                        style={{width: "100%", maxWidth: "800px", marginLeft: "-100px"}}
                    />

                    {/*
            Overlay container for text & button
            - absolute positioning
            - backgroundColor: "rgba(255,255,255,0.8)" for a slight white overlay
          */}
                    <div
                        style={{
                            position: "absolute",
                            top: "40%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            color: "#333",
                            backgroundColor: "rgba(255,255,255,0.8)",
                            padding: "16px",
                            borderRadius: "8px",
                            maxWidth: "80%",
                        }}
                    >
                        <h2 style={{ marginBottom: "8px" }}>
                            The secret of getting ahead is getting started
                        </h2>
                        <p style={{ marginBottom: "16px" }}>
                            To calculate your equity split, get started with the questionnaires below.
                        </p>
                        <button
                            onClick={() => navigate("/calculator")}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#10B981",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "16px",
                            }}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ------------------------------
    // Otherwise, user completed the questionnaire => show final report:
    const { finalEquityMap } = calculateFinalEquity();
    const reservedPools = ws.part1Answers.reservedPools || [];
    const founderEntries = Object.entries(finalEquityMap || {});

    // Build arrays for the pie chart
    const pieLabels = [];
    const pieVals = [];
    founderEntries.forEach(([fn, eq]) => {
        pieLabels.push(fn);
        pieVals.push(eq);
    });
    reservedPools.forEach((rp) => {
        pieLabels.push(rp.name);
        pieVals.push(rp.weight);
    });

    const chartData = {
        labels: pieLabels,
        datasets: [
            {
                data: pieVals,
                backgroundColor: [
                    "#3b82f6",
                    "#ec4899",
                    "#f97316",
                    "#14B8A6",
                    "#8b5cf6",
                    "#f59e0b",
                    "#F43F5E",
                    "#6EE7B7",
                    "#C084FC",
                    "#22D3EE",
                ].slice(0, pieLabels.length),
            },
        ],
    };

    // Use the company name if present, else fallback to workspace name
    const companyName = ws.part1Answers.companyName || ws.name;

    return (
        <div className="wrapper">
            <TopBar currentTab="report" />
            <h1>Equity Report for {companyName}</h1>

            {/* Founders Table */}
            <div className="section">
                <h2>Founders</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Founder</th>
                        <th>Total Equity (%)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {founderEntries.map(([fn, eq]) => (
                        <tr key={fn}>
                            <td>{fn}</td>
                            <td>{eq.toFixed(2)}%</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Reserved Pools Table */}
            {reservedPools.length > 0 && (
                <div className="section">
                    <h2>Reserved Pools</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Pool</th>
                            <th>Weight (%)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reservedPools.map((p, i) => (
                            <tr key={i}>
                                <td>{p.name}</td>
                                <td>{p.weight.toFixed(2)}%</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pie Chart */}
            <div className="section" style={{ marginTop: "24px" }}>
                <h2>Combined Pie: Founders + Pools</h2>
                <div style={{ height: "300px", maxWidth: "600px" }}>
                    <Pie data={chartData} options={{ maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
}

export default ReportPage;
