import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTeamContext } from "./TeamContext";
import { Pie } from "react-chartjs-2";
import "./styles.css";
import "chart.js/auto";
import TopBar from "./TopBar";

function NewMemberPage() {
    const navigate = useNavigate();
    const { memberId } = useParams();
    const {
        areas,
        members,
        addMember,
        updateMember,
        calculateTotalEquity,
        getRemainingForArea,
    } = useTeamContext();

    const existingMember = members.find((m) => m.id === Number(memberId));

    const [name, setName] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [contributions, setContributions] = useState({});

    useEffect(() => {
        if (existingMember) {
            setName(existingMember.name);
            setPhotoUrl(existingMember.photoUrl);
            setContributions(existingMember.contributions);
        } else {
            // brand-new
            let initial = {};
            areas.forEach((a) => {
                initial[a.name] = 0;
            });
            setContributions(initial);
        }
    }, [existingMember, areas]);

    function handleContributionChange(areaName, value) {
        const excludeId = existingMember ? existingMember.id : undefined;
        const maxRemain = getRemainingForArea(areaName, excludeId);

        const newVal = Number(value);
        setContributions((prev) => ({
            ...prev,
            [areaName]: Math.min(newVal, maxRemain),
        }));
    }

    function handleSaveMember() {
        const total = calculateTotalEquity(contributions);

        const newMemberData = {
            id: existingMember ? existingMember.id : members.length + 1,
            name,
            photoUrl,
            contributions,
            totalEquity: parseFloat(total.toFixed(2)),
        };

        if (existingMember) {
            updateMember(existingMember.id, newMemberData);
        } else {
            addMember(newMemberData);
        }
        navigate("/team-details/:workspaceId");
    }

    // Build the chart for this member
    const chartLabels = areas.map((a) => a.name);
    const chartValues = areas.map((a) => {
        return (a.weight * (contributions[a.name] || 0)) / 100;
    });

    const pieData = {
        labels: chartLabels,
        datasets: [
            {
                data: chartValues,
                backgroundColor: [
                    "#f97316",
                    "#f59e0b",
                    "#84cc16",
                    "#22c55e",
                    "#14b8a6",
                    "#3b82f6",
                    "#8b5cf6",
                    "#ec4899",
                ].slice(0, chartValues.length),
            },
        ],
    };
    const totalEquity = chartValues.reduce((acc, v) => acc + v, 0).toFixed(2);
    const pageTitle = existingMember ? "Edit Member" : "New Member";

    return (
        <div className="wrapper">
            <TopBar />

            <div className="section">
                <h1>{pageTitle} Page</h1>

                <div style={{ marginBottom: "16px" }}>
                    <label>Name: </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ marginLeft: "8px" }}
                    />
                </div>
                <div style={{ marginBottom: "16px" }}>
                    <label>Headshot URL (optional): </label>
                    <input
                        type="text"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        style={{ marginLeft: "8px", width: "250px" }}
                    />
                </div>

                <h2>Contributions</h2>
                {areas.map((a) => {
                    const excludeId = existingMember ? existingMember.id : undefined;
                    const remaining = getRemainingForArea(a.name, excludeId);
                    const currentVal = contributions[a.name] || 0;

                    return (
                        <div key={a.name} style={{ marginBottom: "8px" }}>
                            <strong>{a.name}</strong> (Remaining: {remaining}%):
                            <input
                                type="range"
                                min="0"
                                max={remaining}
                                value={currentVal}
                                onChange={(e) => handleContributionChange(a.name, e.target.value)}
                                style={{ marginLeft: "8px", verticalAlign: "middle" }}
                            />
                            <span style={{ marginLeft: "8px" }}>{currentVal}%</span>
                        </div>
                    );
                })}

                <div className="chart-container">
                    <Pie
                        data={pieData}
                        options={{ responsive: true, maintainAspectRatio: false }}
                    />
                </div>
                <p>
                    <strong>Total Equity for {name || "(Member)"}:</strong> {totalEquity}%
                </p>

                <button onClick={handleSaveMember}>
                    {existingMember ? "Update Member" : "Save Member"}
                </button>
            </div>
        </div>
    );
}

export default NewMemberPage;
