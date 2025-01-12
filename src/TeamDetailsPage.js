// TeamDetailsPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeamContext } from "./TeamContext";
import { Pie } from "react-chartjs-2";
import ValidationModal from "./ValidationModal";
import "chart.js/auto";
import TopBar from "./TopBar";

// IMPORTANT: Import the new CategoryLimitModal
import CategoryLimitModal from "./CategoryLimitModal";

function TeamDetailsPage() {
    const navigate = useNavigate();

    // EXACT as before, plus we import the new canAddMoreCustomCategories & incrementCustomCategories
    const {
        format,
        setFormat,
        areas,
        updateAreas,
        members,
        removeMember,
        clearMembers,
        canAddMoreCustomCategories,  // NEW
        incrementCustomCategories,   // NEW
    } = useTeamContext();

    const [localFormat, setLocalFormat] = useState(format || "");
    const [localAreas, setLocalAreas] = useState(areas || []);
    const [newArea, setNewArea] = useState("");
    const [showValidation, setShowValidation] = useState(false);

    // NEW: State to control showing CategoryLimitModal
    const [showCategoryLimitModal, setShowCategoryLimitModal] = useState(false);

    // Default suggestions including "Funding"
    const suggestedAreas = [
        "Funding",
        "Feature Design",
        "Product Development",
        "Fundraising",
        "Business Development",
        "Operations",
    ];

    function handleWeightChange(idx, value) {
        const updated = [...localAreas];
        updated[idx].weight = Number(value);

        const sum = updated.reduce((acc, cat) => acc + cat.weight, 0);
        if (sum > 100) {
            const overflow = sum - 100;
            updated[idx].weight = updated[idx].weight - overflow;
        }
        setLocalAreas(updated);
    }

    function addSuggestedArea(areaName) {
        if (localAreas.some((a) => a.name === areaName)) return;
        setLocalAreas((prev) => [...prev, { name: areaName, weight: 0 }]);
    }

    function handleAddCustomArea() {
        if (!newArea.trim()) return;
        // NEW LOGIC: check if we can add more custom categories
        if (!canAddMoreCustomCategories()) {
            // Instead of alert, show the modal
            setShowCategoryLimitModal(true);
            return;
        }
        // proceed as before
        if (localAreas.some((a) => a.name === newArea)) {
            setNewArea("");
            return;
        }
        setLocalAreas((prev) => [...prev, { name: newArea, weight: 0 }]);
        // increment usage
        incrementCustomCategories();
        setNewArea("");
    }

    function handleRemoveArea(index) {
        const updated = [...localAreas];
        updated.splice(index, 1);
        setLocalAreas(updated);
    }

    function handleUpdate() {
        setFormat(localFormat);
        updateAreas(localAreas);
        clearMembers();
    }

    function handleValidate() {
        setShowValidation(true);
    }
    function closeValidation() {
        setShowValidation(false);
    }

    function handleEditMember(memberId) {
        navigate(`/edit-member/${memberId}`);
    }

    function handleDeleteMember(memberId) {
        removeMember(memberId);
    }

    // Pie data for local areas
    const areaChartData = {
        labels: localAreas.map((a) => a.name),
        datasets: [
            {
                data: localAreas.map((a) => a.weight),
                backgroundColor: [
                    "#ef4444",
                    "#f97316",
                    "#f59e0b",
                    "#84cc16",
                    "#22c55e",
                    "#14b8a6",
                    "#3b82f6",
                    "#8b5cf6",
                    "#ec4899",
                ].slice(0, localAreas.length),
            },
        ],
    };

    // Render
    return (
        <div className="wrapper">
            <TopBar />

            <div className="section">
                <h1>Team Details Page</h1>

                <div style={{ marginBottom: "16px" }}>
                    <label>Type of Business: </label>
                    <select
                        value={localFormat}
                        onChange={(e) => setLocalFormat(e.target.value)}
                        style={{ marginLeft: "8px" }}
                    >
                        <option value="">-- Select a Format --</option>
                        <optgroup label="Tech Startup">
                            <option value="Tech Startup / Pre-seed">Pre-seed</option>
                            <option value="Tech Startup / Seed">Seed</option>
                            <option value="Tech Startup / Series A">Series A</option>
                            <option value="Tech Startup / Series B">Series B</option>
                            <option value="Tech Startup / Series C">Series C</option>
                            <option value="Tech Startup / Series D">Series D</option>
                        </optgroup>
                        <optgroup label="Traditional Business">
                            <option value="Traditional Business / Small Business">Small Business</option>
                            <option value="Traditional Business / Franchise">Franchise</option>
                        </optgroup>
                    </select>
                </div>

                <hr />

                <h2>Contribution Areas</h2>

                <div style={{ marginBottom: "8px" }}>
                    {suggestedAreas.map((s) => (
                        <button
                            key={s}
                            onClick={() => addSuggestedArea(s)}
                            style={{ marginRight: "8px" }}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <div style={{ marginBottom: "16px" }}>
                    <input
                        type="text"
                        placeholder="Custom area"
                        value={newArea}
                        onChange={(e) => setNewArea(e.target.value)}
                    />
                    <button onClick={handleAddCustomArea} style={{ marginLeft: "8px" }}>
                        + Add
                    </button>
                </div>

                {localAreas.length === 0 && <p>No categories yet.</p>}
                {localAreas.map((a, idx) => (
                    <div key={idx} style={{ marginBottom: "8px" }}>
                        <strong>{a.name}</strong>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={a.weight}
                            onChange={(e) => handleWeightChange(idx, e.target.value)}
                        />
                        <span style={{ marginLeft: "8px" }}>{a.weight}%</span>
                        <button
                            onClick={() => handleRemoveArea(idx)}
                            style={{ marginLeft: "8px" }}
                        >
                            Remove
                        </button>
                    </div>
                ))}

                <div className="chart-container">
                    <Pie
                        data={areaChartData}
                        options={{ responsive: true, maintainAspectRatio: false }}
                    />
                </div>

                <button onClick={handleUpdate} style={{ marginRight: "8px" }}>
                    Update
                </button>
                <button onClick={handleValidate}>Validate</button>
            </div>

            <div className="section">
                <h2>Team Members</h2>
                {members.length === 0 && <p>No members yet.</p>}
                {members.map((m) => {
                    const dist = areas.map((area) => {
                        return (area.weight * (m.contributions[area.name] || 0)) / 100;
                    });
                    const memberChartData = {
                        labels: areas.map((a) => a.name),
                        datasets: [
                            {
                                data: dist,
                                backgroundColor: [
                                    "#f97316",
                                    "#f59e0b",
                                    "#84cc16",
                                    "#22c55e",
                                    "#14b8a6",
                                    "#3b82f6",
                                    "#8b5cf6",
                                    "#ec4899",
                                ].slice(0, areas.length),
                            },
                        ],
                    };

                    return (
                        <div className="member-box" key={m.id}>
                            <h3>{m.name}</h3>
                            {m.photoUrl && (
                                <img
                                    src={m.photoUrl}
                                    alt={m.name}
                                    style={{ width: "80px", height: "80px" }}
                                />
                            )}
                            <p>
                                <strong>Total Equity:</strong> {m.totalEquity.toFixed(2)}%
                            </p>
                            {Object.entries(m.contributions).map(([areaName, val]) => (
                                <div key={areaName}>
                                    {areaName}: {val}%
                                </div>
                            ))}
                            <div className="chart-container">
                                <Pie
                                    data={memberChartData}
                                    options={{ responsive: true, maintainAspectRatio: false }}
                                />
                            </div>

                            <button onClick={() => handleEditMember(m.id)} style={{ marginRight: "8px" }}>
                                Edit
                            </button>
                            <button onClick={() => removeMember(m.id)}>Delete</button>
                        </div>
                    );
                })}

                <button onClick={() => navigate("/new-member")} style={{ marginRight: "8px" }}>
                    + Add Member
                </button>
            </div>

            {/* If user clicks Validate */}
            {showValidation && <ValidationModal onClose={closeValidation} />}

            {/* Show the CategoryLimitModal if user tries > 3 categories */}
            {showCategoryLimitModal && (
                <CategoryLimitModal onClose={() => setShowCategoryLimitModal(false)} />
            )}
        </div>
    );
}

export default TeamDetailsPage;