import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeamContext } from "./TeamContext";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import "./styles.css"; // ensure your updated CSS is imported
import TopBar from "./TopBar";

function ReportsPage() {
    const navigate = useNavigate();
    const { format, areas, members } = useTeamContext();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredMembers = members.filter((m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // By Project (Areas)
    const projectData = {
        labels: areas.map((a) => a.name),
        datasets: [
            {
                data: areas.map((a) => a.weight),
                backgroundColor: [
                    "#6366f1",
                    "#a78bfa",
                    "#c084fc",
                    "#ec4899",
                    "#f43f5e",
                    "#fb7185",
                    "#34d399",
                    "#22c55e",
                ].slice(0, areas.length),
            },
        ],
    };

    // By Team Member (Equity)
    const memberData = {
        labels: members.map((m) => m.name),
        datasets: [
            {
                data: members.map((m) => m.totalEquity),
                backgroundColor: [
                    "#f97316",
                    "#f59e0b",
                    "#84cc16",
                    "#22c55e",
                    "#14b8a6",
                    "#3b82f6",
                    "#8b5cf6",
                    "#ec4899",
                ].slice(0, members.length),
            },
        ],
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
    };

    function exportToCSV() {
        let csv = "Team Member,";
        areas.forEach((a) => {
            csv += `${a.name},`;
        });
        csv += "Total Equity\n";

        filteredMembers.forEach((m) => {
            csv += `${m.name},`;
            areas.forEach((a) => {
                const val = m.contributions[a.name] || 0;
                csv += val + "%,";
            });
            csv += m.totalEquity + "%\n";
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

            <h1>Reports Page</h1>
            <h2>{format || "Company Name / Format"}</h2>

            {/* TABLE + CONTROLS */}
            <div className="section" style={{ marginBottom: "1rem" }}>
                <div style={{ marginBottom: "8px", display: "flex", gap: "8px" }}>
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={exportToCSV}>Export to CSV</button>
                </div>

                <table>
                    <thead>
                    <tr>
                        <th>Team Member</th>
                        {areas.map((a) => (
                            <th key={a.name}>{a.name}</th>
                        ))}
                        <th>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredMembers.map((m) => (
                        <tr key={m.id}>
                            <td>{m.name}</td>
                            {areas.map((a) => (
                                <td key={a.name}>{(m.contributions[a.name] || 0) + "%"}</td>
                            ))}
                            <td>{m.totalEquity + "%"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* CHARTS (By Project vs. By Member) side by side */}
            <div className="section reports-charts-container">
                <div className="chart-container">
                    <h3>By Project (Contribution Areas)</h3>
                    <div style={{ height: "300px" }}>
                        <Pie data={projectData} options={chartOptions} />
                    </div>
                </div>

                <div className="chart-container">
                    <h3>By Team Member (Equity)</h3>
                    <div style={{ height: "300px" }}>
                        <Pie data={memberData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportsPage;
