// NewMemberPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTeamContext } from "./TeamContext";
import { Pie } from "react-chartjs-2";
import TopBar from "./TopBar";
import SliderWithButtons from "./SliderWithButtons";
import "./styles.css";

function NewMemberPage() {
    const navigate = useNavigate();
    const { workspaceId, memberId } = useParams();

    const {
        getWorkspaceById,
        updateWorkspace,
        calculateTotalEquity,
        getRemainingForArea
    } = useTeamContext();

    const [name, setName] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [contributions, setContributions] = useState({});

    // Fetch workspace
    const workspace = getWorkspaceById(workspaceId);

    // existingMember
    const existingMember = workspace && memberId
        ? workspace.members.find((m) => m.id === Number(memberId))
        : null;

    useEffect(() => {
        if (existingMember) {
            setName(existingMember.name);
            setPhotoUrl(existingMember.photoUrl || "");
            setContributions(existingMember.contributions || {});
        } else if (workspace) {
            // Initialize only from areas + intangibleFactors, NOT from reservedPools
            const initContrib = {};
            workspace.areas.forEach((a) => {
                initContrib[a.name] = 0;
            });
            workspace.intangibleFactors.forEach((f) => {
                initContrib[f.name] = 0;
            });
            setContributions(initContrib);
        }
    }, [existingMember, workspace]);

    if (!workspace) {
        return (
            <div className="wrapper">
                <TopBar />
                <h1>Workspace not found!</h1>
            </div>
        );
    }

    function handleContributionChange(areaName, newVal) {
        const excludeId = existingMember ? existingMember.id : undefined;
        const remaining = getRemainingForArea(workspace, areaName, excludeId);
        setContributions((prev) => ({
            ...prev,
            [areaName]: Math.min(Number(newVal), remaining),
        }));
    }

    function handleSaveMember() {
        const total = calculateTotalEquity(contributions);

        const newMemberData = {
            id: existingMember ? existingMember.id : Date.now(),
            name,
            photoUrl,
            contributions,
            totalEquity: parseFloat(total.toFixed(2)),
        };

        let updatedMembers;
        if (existingMember) {
            updatedMembers = workspace.members.map((m) =>
                m.id === existingMember.id ? newMemberData : m
            );
        } else {
            updatedMembers = [...workspace.members, newMemberData];
        }

        const updatedWs = { ...workspace, members: updatedMembers };
        updateWorkspace(workspaceId, updatedWs);
        navigate(`/team-details/${workspaceId}`);
    }

    // Prepare chart data (only from .areas + .intangibleFactors)
    const chartLabels = [
        ...workspace.areas.map((a) => a.name),
        ...workspace.intangibleFactors.map((f) => f.name),
    ];
    const chartValues = chartLabels.map((lbl) => contributions[lbl] || 0);

    const pieData = {
        labels: chartLabels,
        datasets: [
            {
                data: chartValues,
                backgroundColor: [
                    "#f97316","#f59e0b","#84cc16","#22c55e",
                    "#14b8a6","#3b82f6","#8b5cf6","#ec4899",
                    "#a855f7","#f43f5e"
                ].slice(0, chartValues.length),
            },
        ],
    };

    const totalEquity = chartValues.reduce((a, b) => a + b, 0).toFixed(2);
    const pageTitle = existingMember ? "Edit Member" : "New Member";

    return (
        <div className="wrapper">
            <TopBar />
            <div className="section">
                <h1>{pageTitle} (Workspace #{workspaceId})</h1>

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

                <h2>Contributions (Areas + Intangibles)</h2>
                {[...workspace.areas, ...workspace.intangibleFactors].map((item) => {
                    const r = getRemainingForArea(
                        workspace,
                        item.name,
                        existingMember ? existingMember.id : undefined
                    );
                    const currVal = contributions[item.name] || 0;
                    return (
                        <div key={item.name} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                            <strong style={{ width: "200px" }}>
                                {item.name} (Remaining: {r}%)
                            </strong>
                            <SliderWithButtons
                                value={currVal}
                                min={0}
                                max={item.weight}
                                step={1}
                                onChange={(val) => handleContributionChange(item.name, val)}
                            />
                        </div>
                    );
                })}

                <div className="chart-container" style={{ marginTop: "16px", height: "200px" }}>
                    <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                </div>

                <p>
                    <strong>Total Equity for {name || "This Member"}: </strong> {totalEquity}%
                </p>

                <button onClick={handleSaveMember} style={{ marginTop: "16px" }}>
                    {existingMember ? "Update Member" : "Save Member"}
                </button>
            </div>
        </div>
    );
}

export default NewMemberPage;
