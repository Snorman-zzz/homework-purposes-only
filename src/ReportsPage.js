// ReportsPage.js
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTeamContext } from "./TeamContext";
import { Pie } from "react-chartjs-2";
import TopBar from "./TopBar";
import "./styles.css";

function ReportsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { workspaceId } = useParams();
    const { getWorkspaceById } = useTeamContext();

    const workspace = getWorkspaceById(workspaceId);
    if (!workspace) {
        return (
            <div className="wrapper">
                <TopBar />
                <h1>Workspace not found!</h1>
            </div>
        );
    }

    // Destructure out the data
    const {
        format,
        reservedPools = [],
        areas = [],
        intangibleFactors = [],
        members = [],
    } = workspace;

    // 1) Filter members by search term
    const filteredMembers = members.filter((m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2) "By Project" chart (reservedPools + areas + intangibleFactors)
    const chartLabels = [
        ...reservedPools.map((p) => p.name),
        ...areas.map((a) => a.name),
        ...intangibleFactors.map((f) => f.name),
    ];
    const chartValues = [
        ...reservedPools.map((p) => p.weight),
        ...areas.map((a) => a.weight),
        ...intangibleFactors.map((f) => f.weight),
    ];

    const projectData = {
        labels: chartLabels,
        datasets: [
            {
                data: chartValues,
                backgroundColor: [
                    "#8b5cf6",
                    "#a78bfa",
                    "#ef4444",
                    "#f97316",
                    "#f59e0b",
                    "#84cc16",
                    "#22c55e",
                    "#14b8a6",
                    "#3b82f6",
                    "#ec4899",
                    "#a855f7",
                    "#f43f5e",
                    "#10b981",
                    "#0ea5e9",
                    "#d946ef",
                ].slice(0, chartLabels.length),
            },
        ],
    };

    // 3) "By Team Member (Equity)" CHART
    // Now includes each member's totalEquity PLUS the reservedPools slices
    const combinedLabels = [
        ...members.map((m) => m.name),
        ...reservedPools.map((rp) => rp.name),
    ];
    const combinedValues = [
        ...members.map((m) => m.totalEquity),
        ...reservedPools.map((rp) => rp.weight),
    ];

    const memberData = {
        labels: combinedLabels,
        datasets: [
            {
                data: combinedValues,
                backgroundColor: [
                    "#f97316",
                    "#f59e0b",
                    "#84cc16",
                    "#22c55e",
                    "#14b8a6",
                    "#3b82f6",
                    "#8b5cf6",
                    "#ec4899",
                    "#a855f7",
                    "#f43f5e",
                    "#2dd4bf",
                    "#eab308",
                    "#6366f1",
                    "#ef4444",
                    "#14b8a6",
                ].slice(0, combinedLabels.length),
            },
        ],
    };

    // 4) TABLE & CSV: Exclude reservedPools from the columns
    const tableLabels = [
        ...areas.map((a) => a.name),
        ...intangibleFactors.map((f) => f.name),
    ];

    // CSV Export (still skipping reservedPools for the column data)
    function exportToCSV() {
        let csv = "Team Member,";
        tableLabels.forEach((header) => {
            csv += `${header},`;
        });
        csv += "Total Equity\n";

        filteredMembers.forEach((m) => {
            csv += `${m.name},`;
            tableLabels.forEach((lbl) => {
                const val = m.contributions[lbl] || 0;
                csv += `${val}%,`;
            });
            csv += `${m.totalEquity}%\n`;
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "team_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="wrapper">
            <TopBar />
            <h1>Reports Page (Workspace #{workspaceId})</h1>
            <h2>{format || "Company / Format"}</h2>

            <div className="section" style={{ marginBottom: "1rem" }}>
                {/* Search + CSV export */}
                <div style={{ marginBottom: "8px", display: "flex", gap: "8px" }}>
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={exportToCSV}>Export to CSV</button>
                </div>

                {/* TABLE of members' area/factor contributions (no reserved pool columns) */}
                <table>
                    <thead>
                    <tr>
                        <th>Team Member</th>
                        {tableLabels.map((lbl) => (
                            <th key={lbl}>{lbl}</th>
                        ))}
                        <th>Total Equity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredMembers.map((m) => (
                        <tr key={m.id}>
                            <td>{m.name}</td>
                            {tableLabels.map((lbl) => (
                                <td key={lbl}>{(m.contributions[lbl] || 0)}%</td>
                            ))}
                            <td>{m.totalEquity}%</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* NEW: Reserved Equity Pools table */}
                {reservedPools.length > 0 && (
                    <div style={{ marginTop: "2rem" }}>
                        <h3>Reserved Equity Pools</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>Pool Name</th>
                                <th>Weight (%)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {reservedPools.map((pool) => (
                                <tr key={pool.name}>
                                    <td>{pool.name}</td>
                                    <td>{pool.weight}%</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* CHARTS */}
            <div className="section reports-charts-container">
                <div className="chart-container">
                    <h3>By Project (Reserved + Areas + Factors)</h3>
                    <div style={{ height: "300px" }}>
                        <Pie
                            data={projectData}
                            options={{ responsive: true, maintainAspectRatio: false }}
                        />
                    </div>
                </div>

                <div className="chart-container">
                    <h3>By Team Member (Equity)</h3>
                    <div style={{ height: "300px" }}>
                        <Pie
                            data={memberData}
                            options={{ responsive: true, maintainAspectRatio: false }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportsPage;
