// TeamDetailsPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTeamContext } from "./TeamContext";
// Same as original: chart.js/auto
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

import TopBar from "./TopBar";
import ValidationModal from "./ValidationModal";
import CategoryLimitModal from "./CategoryLimitModal";
import SliderWithButtons from "./SliderWithButtons";

import "./SliderWithButtons.css";
import "./styles.css"; // Ensure your own styling is imported

function TeamDetailsPage() {
    const navigate = useNavigate();
    const { workspaceId } = useParams();

    const {
        getWorkspaceById,
        updateWorkspace,
        canAddMoreCustomCategories,
        incrementCustomCategories
    } = useTeamContext();

    // -----------------------------
    // STATE
    // -----------------------------
    // Business format
    const [localFormat, setLocalFormat] = useState("");

    // NEW: Reserved Equity Pools (Employee stock pool, board, advisors, etc.)
    const [reservedPools, setReservedPools] = useState([]);

    // Contribution Areas + Intangible Factors
    const [localAreas, setLocalAreas] = useState([]);
    const [intangibleFactors, setIntangibleFactors] = useState([]);

    // Team members
    const [members, setMembers] = useState([]);

    // For adding new custom items
    const [newReservedPool, setNewReservedPool] = useState("");
    const [newArea, setNewArea] = useState("");
    const [newIntangibleFactor, setNewIntangibleFactor] = useState("");

    // Modals & flags
    const [showValidation, setShowValidation] = useState(false);
    const [showCategoryLimitModal, setShowCategoryLimitModal] = useState(false);
    const [hasAdjusted, setHasAdjusted] = useState(false);

    // Floating "?" help panel
    const [showHelpPanel, setShowHelpPanel] = useState(false);

    // Pagination/search for Areas
    const [searchArea, setSearchArea] = useState("");
    const [currentAreaPage, setCurrentAreaPage] = useState(0);
    const pageSizeAreas = 6;

    // Pagination/search for Intangible Factors
    const [searchFactor, setSearchFactor] = useState("");
    const [currentFactorPage, setCurrentFactorPage] = useState(0);
    const pageSizeFactors = 6;

    // For custom tooltips on hover
    const [hoveredItem, setHoveredItem] = useState(null);

    // Example sets of "suggested" items
    const suggestedPools = [
        {
            name: "Employee Stock Pool",
            tooltip: "Shares reserved for employee grants or options"
        },
        {
            name: "Independent Directors",
            tooltip: "Equity allocated for independent board directors"
        },
        {
            name: "Third Party Advisors and Specialists",
            tooltip: "External advisors providing specialized guidance"
        },
        {
            name: "Potential Investors",
            tooltip: "Equity earmarked for future or potential investors"
        },
        {
            name: "Others",
            tooltip: "Any other reserved pool not covered above"
        },
    ];

    const suggestedAreas = [
        {
            name: "Monetary Capital Contributions",
            tooltip: "Direct cash injections or ongoing funding commitments"
        },
        {
            name: "Non-Monetary Tangible Contributions",
            tooltip: "Office space, equipment, or other physical resources provided"
        },
        {
            name: "Corporate Operation Contributions",
            tooltip: "Daily operations, management, team-building, problem-solving, etc."
        },
        {
            name: "Product & Service Development",
            tooltip: "R&D efforts, MVP creation, or technical implementations"
        },
        {
            name: "Market & Customer Outreach",
            tooltip: "Marketing, sales, user acquisition, securing early adopters"
        },
        {
            name: "Business Development & Partnerships",
            tooltip: "Forming strategic deals, negotiating with suppliers or agencies"
        },
        {
            name: "Fundraising & Future Expansions",
            tooltip: "Planning/investing effort for upcoming financing rounds, new partner integration"
        },
        {
            name: "Future Expansion & Fundraising",
            tooltip: "Planning for future investment rounds, expansions, or new partner integration"
        },
    ];

    const suggestedIntangibles = [
        {
            name: "Control & Governance",
            tooltip: "Leadership, vision-setting, high-level decision-making, risk-bearing appetite"
        },
        {
            name: "Business Idea Ownership",
            tooltip: "Who originated the core concept or IP behind the venture"
        },
        {
            name: "Founder Reputation & Personal Brand",
            tooltip: "Industry influence, credibility, or celebrity status"
        },
        {
            name: "Skill Sets & Expertise",
            tooltip: "Specialized know-how, track record of successful businesses, advanced degrees"
        },
        {
            name: "Network & Connections",
            tooltip: "Existing market channels, personal referrals, strategic relationships"
        },
        {
            name: "Intellectual Capital",
            tooltip: "Patents, trademarks, academic literature, or proprietary processes contributed"
        },
        {
            name: "Team-Building & Emotional Intelligence",
            tooltip: "Ability to attract talent, manage conflicts, and foster a positive culture"
        },
        {
            name: "Innovation & Creativity",
            tooltip: "New product ideas, forward-thinking solutions, and unique problem-solving approaches"
        },
        {
            name: "Solo Work Prior to Team Formation",
            tooltip: "Milestones or prototypes completed individually before co-founders joined"
        },
        {
            name: "Idea Maturity",
            tooltip: "How fleshed-out the concept was—prototypes, research, patents—before the team"
        },
        {
            name: "Family or Personal Loans/Credibility",
            tooltip: "Funds or endorsements from family/personal networks that bootstrap the company"
        },
        {
            name: "Customer & Partner Acquisitions",
            tooltip: "Early pilot users, key contracts, or major business partners brought onboard"
        },
        {
            name: "Future Availability Commitment",
            tooltip: "Pledging more dedicated time or full-time involvement at a later stage"
        },
        {
            name: "Past Success Track Record",
            tooltip: "History of having founded or scaled successful ventures in the past"
        },
        {
            name: "Key-Man Risk & Founder Dependency",
            tooltip: "Whether the venture depends heavily on one person’s presence or expertise"
        },
    ];

    // Fetch workspace
    const workspace = getWorkspaceById(workspaceId);

    // Load data on mount or when workspace changes
    useEffect(() => {
        if (workspace) {
            setLocalFormat(workspace.format || "");
            setReservedPools(workspace.reservedPools || []);
            setLocalAreas(workspace.areas || []);
            setIntangibleFactors(workspace.intangibleFactors || []);
            setMembers(workspace.members || []);
            setHasAdjusted(false);
        }
    }, [workspace]);

    if (!workspace) {
        return (
            <div className="wrapper">
                <TopBar />
                <h1>Workspace not found!</h1>
            </div>
        );
    }

    // -----------------------------
    // HELPER + HANDLERS
    // -----------------------------
    // Summation of reserved + areas + intangible must be 100
    function getTotalAllocation(rPools, areasArr, factorsArr) {
        const sumReserved = rPools.reduce((acc, r) => acc + r.weight, 0);
        const sumAreas = areasArr.reduce((acc, a) => acc + a.weight, 0);
        const sumFactors = factorsArr.reduce((acc, f) => acc + f.weight, 0);
        return sumReserved + sumAreas + sumFactors;
    }

    const totalAllocation = getTotalAllocation(reservedPools, localAreas, intangibleFactors).toFixed(2);

    // -----------------------------
    // Reserved Pools
    // -----------------------------
    function handleReservedWeightChange(idx, newWeight) {
        setHasAdjusted(true);
        const updated = [...reservedPools];
        updated[idx].weight = Number(newWeight);

        if (getTotalAllocation(updated, localAreas, intangibleFactors) > 100) {
            const overflow = getTotalAllocation(updated, localAreas, intangibleFactors) - 100;
            updated[idx].weight = Math.max(updated[idx].weight - overflow, 0);
        }
        setReservedPools(updated);
    }

    function addSuggestedReserved(poolName) {
        if (reservedPools.some((r) => r.name === poolName)) return;

        if (!hasAdjusted) {
            // even distribution
            const countAll = reservedPools.length + localAreas.length + intangibleFactors.length + 1;
            const newWeight = parseFloat((100 / countAll).toFixed(2));

            const updPools = reservedPools.map((rp) => ({ ...rp, weight: newWeight }));
            const updAreas = localAreas.map((a) => ({ ...a, weight: newWeight }));
            const updFactors = intangibleFactors.map((f) => ({ ...f, weight: newWeight }));

            updPools.push({ name: poolName, weight: newWeight });
            setReservedPools(updPools);
            setLocalAreas(updAreas);
            setIntangibleFactors(updFactors);
        } else {
            setReservedPools((prev) => [...prev, { name: poolName, weight: 0 }]);
        }
    }

    function handleAddCustomReservedPool() {
        if (!newReservedPool.trim()) return;
        const lower = newReservedPool.trim().toLowerCase();
        if (reservedPools.some((rp) => rp.name.toLowerCase() === lower)) {
            setNewReservedPool("");
            return;
        }

        if (!hasAdjusted) {
            const countAll = reservedPools.length + localAreas.length + intangibleFactors.length + 1;
            const newWeight = parseFloat((100 / countAll).toFixed(2));

            const updPools = reservedPools.map((rp) => ({ ...rp, weight: newWeight }));
            const updAreas = localAreas.map((a) => ({ ...a, weight: newWeight }));
            const updFactors = intangibleFactors.map((f) => ({ ...f, weight: newWeight }));

            updPools.push({ name: newReservedPool.trim(), weight: newWeight });
            setReservedPools(updPools);
            setLocalAreas(updAreas);
            setIntangibleFactors(updFactors);
        } else {
            setReservedPools((prev) => [...prev, { name: newReservedPool.trim(), weight: 0 }]);
        }

        setNewReservedPool("");
    }

    function handleRemoveReservedPool(idx) {
        const updated = [...reservedPools];
        updated.splice(idx, 1);
        setReservedPools(updated);
    }

    // -----------------------------
    // Contribution Areas
    // -----------------------------
    function handleAreaWeightChange(idx, newWeight) {
        setHasAdjusted(true);
        const updatedAreas = [...localAreas];
        updatedAreas[idx].weight = Number(newWeight);

        if (getTotalAllocation(reservedPools, updatedAreas, intangibleFactors) > 100) {
            const overflow = getTotalAllocation(reservedPools, updatedAreas, intangibleFactors) - 100;
            updatedAreas[idx].weight = Math.max(updatedAreas[idx].weight - overflow, 0);
        }
        setLocalAreas(updatedAreas);
    }

    function addSuggestedArea(areaName) {
        if (localAreas.some((a) => a.name === areaName)) return;

        if (!hasAdjusted) {
            const newTotal = reservedPools.length + localAreas.length + intangibleFactors.length + 1;
            const newWeight = parseFloat((100 / newTotal).toFixed(2));

            const updPools = reservedPools.map((rp) => ({ ...rp, weight: newWeight }));
            const updAreas = localAreas.map((a) => ({ ...a, weight: newWeight }));
            const updFactors = intangibleFactors.map((f) => ({ ...f, weight: newWeight }));

            updAreas.push({ name: areaName, weight: newWeight });
            setReservedPools(updPools);
            setLocalAreas(updAreas);
            setIntangibleFactors(updFactors);
        } else {
            setLocalAreas((prev) => [...prev, { name: areaName, weight: 0 }]);
        }
    }

    function handleAddCustomArea() {
        if (!newArea.trim()) return;
        if (!canAddMoreCustomCategories()) {
            setShowCategoryLimitModal(true);
            return;
        }
        const lower = newArea.trim().toLowerCase();
        if (localAreas.some((a) => a.name.toLowerCase() === lower)) {
            setNewArea("");
            return;
        }

        if (!hasAdjusted) {
            const newTotal = reservedPools.length + localAreas.length + intangibleFactors.length + 1;
            const newWeight = parseFloat((100 / newTotal).toFixed(2));

            const updPools = reservedPools.map((rp) => ({ ...rp, weight: newWeight }));
            const updAreas = localAreas.map((a) => ({ ...a, weight: newWeight }));
            const updFactors = intangibleFactors.map((f) => ({ ...f, weight: newWeight }));

            updAreas.push({ name: newArea.trim(), weight: newWeight });
            setReservedPools(updPools);
            setLocalAreas(updAreas);
            setIntangibleFactors(updFactors);
        } else {
            setLocalAreas((prev) => [...prev, { name: newArea.trim(), weight: 0 }]);
        }

        incrementCustomCategories();
        setNewArea("");
    }

    function handleRemoveArea(index) {
        const updated = [...localAreas];
        updated.splice(index, 1);
        setLocalAreas(updated);
    }

    // -----------------------------
    // Intangible Factors
    // -----------------------------
    function handleFactorWeightChange(idx, newWeight) {
        setHasAdjusted(true);
        const updatedFactors = [...intangibleFactors];
        updatedFactors[idx].weight = Number(newWeight);

        if (getTotalAllocation(reservedPools, localAreas, updatedFactors) > 100) {
            const overflow = getTotalAllocation(reservedPools, localAreas, updatedFactors) - 100;
            updatedFactors[idx].weight = Math.max(updatedFactors[idx].weight - overflow, 0);
        }
        setIntangibleFactors(updatedFactors);
    }

    function addSuggestedIntangibleFactor(factorName) {
        if (intangibleFactors.some((f) => f.name === factorName)) return;

        if (!hasAdjusted) {
            const newTotal = reservedPools.length + localAreas.length + intangibleFactors.length + 1;
            const newWeight = parseFloat((100 / newTotal).toFixed(2));

            const updPools = reservedPools.map((rp) => ({ ...rp, weight: newWeight }));
            const updAreas = localAreas.map((a) => ({ ...a, weight: newWeight }));
            const updFactors = intangibleFactors.map((f) => ({ ...f, weight: newWeight }));

            updFactors.push({ name: factorName, weight: newWeight });
            setReservedPools(updPools);
            setLocalAreas(updAreas);
            setIntangibleFactors(updFactors);
        } else {
            setIntangibleFactors((prev) => [...prev, { name: factorName, weight: 0 }]);
        }
    }

    function handleAddCustomIntangibleFactor() {
        if (!newIntangibleFactor.trim()) return;
        const lower = newIntangibleFactor.trim().toLowerCase();
        if (intangibleFactors.some((f) => f.name.toLowerCase() === lower)) {
            setNewIntangibleFactor("");
            return;
        }

        if (!hasAdjusted) {
            const newTotal = reservedPools.length + localAreas.length + intangibleFactors.length + 1;
            const newWeight = parseFloat((100 / newTotal).toFixed(2));

            const updPools = reservedPools.map((rp) => ({ ...rp, weight: newWeight }));
            const updAreas = localAreas.map((a) => ({ ...a, weight: newWeight }));
            const updFactors = intangibleFactors.map((f) => ({ ...f, weight: newWeight }));

            updFactors.push({ name: newIntangibleFactor.trim(), weight: newWeight });
            setReservedPools(updPools);
            setLocalAreas(updAreas);
            setIntangibleFactors(updFactors);
        } else {
            setIntangibleFactors((prev) => [...prev, { name: newIntangibleFactor.trim(), weight: 0 }]);
        }

        setNewIntangibleFactor("");
    }

    function handleRemoveIntangibleFactor(index) {
        const updated = [...intangibleFactors];
        updated.splice(index, 1);
        setIntangibleFactors(updated);
    }

    // -----------------------------
    // Save + Validate
    // -----------------------------
    function handleUpdate() {
        // Must sum up to exactly 100
        const totalNow = Math.round(getTotalAllocation(reservedPools, localAreas, intangibleFactors));
        if (totalNow !== 100) {
            alert("Total allocation must equal 100%");
            return;
        }
        const updatedWs = {
            ...workspace,
            format: localFormat,
            // This merges the new reservedPools into the workspace
            reservedPools,
            areas: localAreas,
            intangibleFactors,
            members,
        };
        updateWorkspace(workspaceId, updatedWs);
    }

    function handleValidate() {
        handleUpdate();
        setShowValidation(true);
    }
    function closeValidation() {
        setShowValidation(false);
    }

    // -----------------------------
    // Team members
    // -----------------------------
    function handleEditMember(memberId) {
        navigate(`/edit-member/${workspaceId}/${memberId}`);
    }
    function handleDeleteMember(memberId) {
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
    }

    // -----------------------------
    // Pagination + Search
    // -----------------------------
    function getFilteredPageData(allItems, searchValue, currentPage, pageSize) {
        const filtered = allItems.filter((item) =>
            item.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        const startIdx = currentPage * pageSize;
        const endIdx = startIdx + pageSize;
        return {
            pageItems: filtered.slice(startIdx, endIdx),
            totalCount: filtered.length,
        };
    }

    const { pageItems: areasPage, totalCount: totalAreasFound } = getFilteredPageData(
        suggestedAreas,
        searchArea,
        currentAreaPage,
        pageSizeAreas
    );

    const { pageItems: factorsPage, totalCount: totalFactorsFound } = getFilteredPageData(
        suggestedIntangibles,
        searchFactor,
        currentFactorPage,
        pageSizeFactors
    );

    // -----------------------------
    // Chart data for the entire workspace
    // (reservedPools + areas + intangibleFactors)
    // -----------------------------
    const chartLabels = [
        ...reservedPools.map((r) => r.name),
        ...localAreas.map((a) => a.name),
        ...intangibleFactors.map((f) => f.name),
    ];
    const chartValues = [
        ...reservedPools.map((r) => r.weight),
        ...localAreas.map((a) => a.weight),
        ...intangibleFactors.map((f) => f.weight),
    ];

    const areaChartData = {
        labels: chartLabels,
        datasets: [
            {
                data: chartValues,
                backgroundColor: [
                    "#8b5cf6","#a78bfa","#ef4444","#f97316",
                    "#f59e0b","#84cc16","#22c55e","#14b8a6",
                    "#3b82f6","#ec4899","#a855f7","#f43f5e",
                ].slice(0, chartLabels.length),
            },
        ],
    };

    return (
        <div className="wrapper">
            <TopBar />

            {/* Floating Help Button (bottom-right) */}
            <div
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    zIndex: 9999,
                }}
            >
                {showHelpPanel && (
                    <div
                        style={{
                            backgroundColor: "#e5f4f9",
                            border: "1px solid #ccc",
                            padding: "12px",
                            borderRadius: "6px",
                            marginBottom: "8px",
                            width: "200px",
                        }}
                    >
                        <p><strong>Are you stuck?</strong></p>
                        <p>Want to find out if you should get more equity?</p>
                        <p>
                            <a
                                href="https://thecofoundershub.com/"
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "#0a66c2", textDecoration: "underline" }}
                            >
                                Reach out to us
                            </a>
                        </p>
                    </div>
                )}
                <button
                    onClick={() => setShowHelpPanel(!showHelpPanel)}
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#0a66c2",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "18px",
                    }}
                    title="Need help?"
                >
                    ?
                </button>
            </div>

            <div className="section">
                <h1>Team Details (Workspace #{workspaceId})</h1>

                {/* Business Format */}
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

                {/* RESERVED EQUITY POOLS */}
                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        marginBottom: "16px",
                        borderRadius: "4px"
                    }}
                >
                    <h2>Reserved Equity Pool</h2>

                    <div style={{ marginBottom: "8px" }}>
                        {suggestedPools.map((p) => (
                            <div
                                key={p.name}
                                style={{ position: "relative", display: "inline-block", marginRight: "8px" }}
                                onMouseEnter={() => setHoveredItem(p.name)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <button
                                    onClick={() => addSuggestedReserved(p.name)}
                                    style={{
                                        marginRight: "8px",
                                        marginBottom: "8px",
                                        padding: "6px 12px",
                                        backgroundColor: "#14B8A6", // <-- TEAL
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        transition: "background-color 0.3s",
                                    }}
                                    onMouseOver={(e) => { e.target.style.backgroundColor = "#0D9488"; }}
                                    onMouseOut={(e) => { e.target.style.backgroundColor = "#14B8A6"; }}
                                >
                                    {p.name}
                                </button>
                                {hoveredItem === p.name && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: "100%",
                                            left: 0,
                                            backgroundColor: "#fff",
                                            border: "1px solid #ccc",
                                            padding: "6px",
                                            borderRadius: "4px",
                                            minWidth: "160px",
                                            zIndex: 1000,
                                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                        }}
                                    >
                                        {p.tooltip}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                        <input
                            type="text"
                            placeholder="Custom Equity Pool"
                            value={newReservedPool}
                            onChange={(e) => setNewReservedPool(e.target.value)}
                            style={{
                                padding: "6px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                                marginRight: "8px",
                            }}
                        />
                        <button
                            onClick={handleAddCustomReservedPool}
                            style={{
                                padding: "6px 12px",
                                backgroundColor: "#3b82f6",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                transition: "background-color 0.3s",
                            }}
                            onMouseOver={(e) => { e.target.style.backgroundColor = "#2563eb"; }}
                            onMouseOut={(e) => { e.target.style.backgroundColor = "#3b82f6"; }}
                        >
                            + Add
                        </button>
                    </div>

                    {reservedPools.length === 0 && <p>No reserved equity pools yet.</p>}
                    {reservedPools.map((pool, idx) => (
                        <div
                            key={idx}
                            style={{ marginBottom: "12px", display: "flex", alignItems: "center" }}
                        >
                            <strong style={{ width: "220px" }}>{pool.name}</strong>
                            <SliderWithButtons
                                value={pool.weight}
                                min={0}
                                max={100}
                                step={1}
                                onChange={(val) => handleReservedWeightChange(idx, val)}
                            />
                            <button
                                onClick={() => handleRemoveReservedPool(idx)}
                                style={{
                                    marginLeft: "12px",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "20px",
                                    color: "#ef4444",
                                    padding: "0",
                                }}
                                aria-label={`Remove ${pool.name}`}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>

                {/* CONTRIBUTION AREAS WINDOW */}
                <div
                    className="areas-window"
                    style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        marginBottom: "16px",
                        borderRadius: "4px"
                    }}
                >
                    <h2>Contribution Areas</h2>

                    {/* Search + Pagination for Areas */}
                    <div style={{marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px"}}>
                        <input
                            type="text"
                            placeholder="Search contribution areas..."
                            value={searchArea}
                            onChange={(e) => {
                                setSearchArea(e.target.value);
                                setCurrentAreaPage(0);
                            }}
                            style={{
                                width: "200px",       // NEW: fixed width
                                padding: "6px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}
                        />
                        <div
                            style={{
                                marginLeft: "auto",     // makes the buttons ‘stick’ to the right
                                display: "flex",
                                gap: "8px",             // small spacing between buttons
                            }}
                        >
                            <button
                                onClick={() => setCurrentAreaPage(Math.max(currentAreaPage - 1, 0))}
                                disabled={currentAreaPage === 0}
                            >
                                &lt;
                            </button>
                            <button
                                onClick={() => {
                                    const maxPage = Math.ceil(totalAreasFound / pageSizeAreas) - 1;
                                    setCurrentAreaPage(Math.min(currentAreaPage + 1, maxPage));
                                }}
                                disabled={currentAreaPage >= Math.ceil(totalAreasFound / pageSizeAreas) - 1}
                            >
                                &gt;
                            </button>
                        </div>
                        </div>

                        {/* Paged Suggested Areas + tooltips */}
                        <div style={{marginBottom: "8px"}}>
                            {areasPage.map((s) => (
                                <div
                                    key={s.name}
                                    style={{position: "relative", display: "inline-block", marginRight: "8px"}}
                                    onMouseEnter={() => setHoveredItem(s.name)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >
                                    <button
                                        onClick={() => addSuggestedArea(s.name)}
                                        style={{
                                            marginBottom: "8px",
                                            padding: "6px 12px",
                                            backgroundColor: "#F26E21",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            transition: "background-color 0.3s",
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.backgroundColor = "#d35b19";
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.backgroundColor = "#F26E21";
                                        }}
                                    >
                                        {s.name}
                                    </button>
                                    {hoveredItem === s.name && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: "100%",
                                                left: 0,
                                                backgroundColor: "#fff",
                                                border: "1px solid #ccc",
                                                padding: "6px",
                                                borderRadius: "4px",
                                                minWidth: "160px",
                                                zIndex: 1000,
                                                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                            }}
                                        >
                                            {s.tooltip}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add Custom Area */}
                        <div style={{marginBottom: "16px"}}>
                            <input
                                type="text"
                                placeholder="Custom area"
                                value={newArea}
                                onChange={(e) => setNewArea(e.target.value)}
                                style={{
                                    padding: "6px",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                    marginRight: "8px",
                                }}
                            />
                            <button
                                onClick={handleAddCustomArea}
                                style={{
                                    padding: "6px 12px",
                                    backgroundColor: "#3b82f6",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s",
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = "#2563eb";
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = "#3b82f6";
                                }}
                            >
                                + Add
                            </button>
                        </div>

                        {/* Display Areas */}
                        {localAreas.length === 0 && <p>No contribution areas yet.</p>}
                        {localAreas.map((area, idx) => (
                            <div key={idx} style={{marginBottom: "12px", display: "flex", alignItems: "center"}}>
                                <strong style={{width: "200px"}}>{area.name}</strong>
                                <SliderWithButtons
                                    value={area.weight}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onChange={(val) => handleAreaWeightChange(idx, val)}
                                />
                                <button
                                    onClick={() => handleRemoveArea(idx)}
                                    style={{
                                        marginLeft: "12px",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "20px",
                                        color: "#ef4444",
                                        padding: "0",
                                    }}
                                    aria-label={`Remove ${area.name}`}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* INTANGIBLE FACTORS WINDOW */}
                    <div
                        className="factors-window"
                        style={{
                            border: "1px solid #ccc",
                            padding: "8px",
                            marginBottom: "16px",
                            borderRadius: "4px"
                        }}
                >
                    <h2>Intangible Factors</h2>

                    {/* Search + Pagination */}
                    <div style={{marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px"}}>
                        <input
                            type="text"
                            placeholder="Search intangible factors..."
                            value={searchFactor}
                            onChange={(e) => {
                                setSearchFactor(e.target.value);
                                setCurrentFactorPage(0);
                            }}
                            style={{
                                width: "200px",       // NEW: fixed width
                                padding: "6px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}
                        />
                        <div
                            style={{
                                marginLeft: "auto",     // makes the buttons ‘stick’ to the right
                                display: "flex",
                                gap: "8px",             // small spacing between buttons
                            }}
                        >
                            <button
                                onClick={() => setCurrentFactorPage(Math.max(currentFactorPage - 1, 0))}
                                disabled={currentFactorPage === 0}
                                style={{
                                    backgroundColor: "#8B5CF6",  // match intangible factor color
                                    color: "#fff",
                                    padding: "6px 12px",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s",
                                }}
                                onMouseOver={(e) => { e.target.style.backgroundColor = "#7C3AED"; }}
                                onMouseOut={(e) => { e.target.style.backgroundColor = "#8B5CF6"; }}
                            >
                                &lt;
                            </button>
                            <button
                                onClick={() => {
                                    const maxPage = Math.ceil(totalFactorsFound / pageSizeFactors) - 1;
                                    setCurrentFactorPage(Math.min(currentFactorPage + 1, maxPage));
                                }}
                                disabled={currentFactorPage >= Math.ceil(totalFactorsFound / pageSizeFactors) - 1}
                                style={{
                                    backgroundColor: "#8B5CF6",  // match intangible factor color
                                    color: "#fff",
                                    padding: "6px 12px",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s",
                                }}
                                onMouseOver={(e) => { e.target.style.backgroundColor = "#7C3AED"; }}
                                onMouseOut={(e) => { e.target.style.backgroundColor = "#8B5CF6"; }}
                            >
                                &gt;
                            </button>
                        </div>
                        </div>

                        {/* Paged Suggested Intangible Factors with Custom Tooltips */}
                        <div style={{marginBottom: "8px"}}>
                            {factorsPage.map((f) => (
                                <div
                                    key={f.name}
                                    style={{position: "relative", display: "inline-block", marginRight: "8px"}}
                                    onMouseEnter={() => setHoveredItem(f.name)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >
                                    <button
                                        onClick={() => addSuggestedIntangibleFactor(f.name)}
                                        style={{
                                            marginBottom: "8px",
                                            padding: "6px 12px",
                                            backgroundColor: "#8B5CF6",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            transition: "background-color 0.3s",
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.backgroundColor = "#7C3AED";
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.backgroundColor = "#8B5CF6";
                                        }}
                                    >
                                        {f.name}
                                    </button>

                                    {hoveredItem === f.name && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: "100%",
                                                left: 0,
                                                backgroundColor: "#fff",
                                                border: "1px solid #ccc",
                                                padding: "6px",
                                                borderRadius: "4px",
                                                minWidth: "160px",
                                                zIndex: 1000,
                                                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                            }}
                                        >
                                            {f.tooltip}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add Custom Intangible Factor */}
                        <div style={{marginBottom: "16px"}}>
                            <input
                                type="text"
                                placeholder="Custom intangible factor"
                                value={newIntangibleFactor}
                                onChange={(e) => setNewIntangibleFactor(e.target.value)}
                                style={{
                                    padding: "6px",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                    marginRight: "8px",
                                }}
                            />
                            <button
                                onClick={handleAddCustomIntangibleFactor}
                                style={{
                                    padding: "6px 12px",
                                    backgroundColor: "#3b82f6",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s",
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = "#2563eb";
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = "#3b82f6";
                                }}
                            >
                                + Add
                            </button>
                        </div>

                        {/* Display Intangible Factors */}
                        {intangibleFactors.length === 0 && <p>No intangible factors yet.</p>}
                        {intangibleFactors.map((factor, idx) => (
                            <div key={idx} style={{marginBottom: "12px", display: "flex", alignItems: "center"}}>
                                <strong style={{width: "200px"}}>{factor.name}</strong>
                                <SliderWithButtons
                                    value={factor.weight}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onChange={(val) => handleFactorWeightChange(idx, val)}
                                />
                                <button
                                    onClick={() => handleRemoveIntangibleFactor(idx)}
                                    style={{
                                        marginLeft: "12px",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "20px",
                                        color: "#ef4444",
                                        padding: "0",
                                    }}
                                    aria-label={`Remove ${factor.name}`}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Total Allocation */}
                    <div style={{marginTop: "12px"}}>
                        <strong>Total Allocation:</strong> {totalAllocation}%
                        {totalAllocation !== "100.00" && (
                        <span style={{ color: "#ef4444", marginLeft: "8px" }}>
                            (Total must be exactly 100%)
                        </span>
                    )}
                </div>

                {/* Overall Pie Chart */}
                <div className="chart-container" style={{ marginTop: "24px", height: "300px" }}>
                    <Pie data={areaChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>

                {/* Update + Validate */}
                <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
                    <button
                        onClick={handleUpdate}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#10B981",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                        }}
                        onMouseOver={(e) => { e.target.style.backgroundColor = "#059669"; }}
                        onMouseOut={(e) => { e.target.style.backgroundColor = "#10B981"; }}
                        disabled={totalAllocation !== "100.00"}
                    >
                        Update
                    </button>
                    <button
                        onClick={handleValidate}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#3b82f6",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                        }}
                        onMouseOver={(e) => { e.target.style.backgroundColor = "#2563eb"; }}
                        onMouseOut={(e) => { e.target.style.backgroundColor = "#3b82f6"; }}
                        disabled={totalAllocation !== "100.00"}
                    >
                        Validate
                    </button>
                </div>
            </div>

            {/* Team Members Section */}
            <div className="section" style={{ marginTop: "40px" }}>
                <h2>Team Members</h2>
                {members.length === 0 && <p>No members yet.</p>}
                {members.map((m) => {
                    // Members only allocate from localAreas + intangibleFactors, not reservedPools
                    const dist = [
                        ...localAreas.map((a) => (m.contributions[a.name] || 0).toFixed(2)),
                        ...intangibleFactors.map((f) => (m.contributions[f.name] || 0).toFixed(2)),
                    ];
                    const memberChartData = {
                        labels: [
                            ...localAreas.map((a) => a.name),
                            ...intangibleFactors.map((f) => f.name),
                        ],
                        datasets: [
                            {
                                data: dist.map(Number),
                                backgroundColor: [
                                    "#f97316","#f59e0b","#84cc16","#22c55e",
                                    "#14b8a6","#3b82f6","#8b5cf6","#ec4899",
                                    "#a855f7","#f43f5e",
                                ].slice(0, dist.length),
                            },
                        ],
                    };
                    const totalEquity = Object.values(m.contributions).reduce(
                        (acc, val) => acc + val,
                        0
                    ).toFixed(2);

                    return (
                        <div
                            className="member-box"
                            key={m.id}
                            style={{
                                border: "1px solid #ccc",
                                padding: "16px",
                                borderRadius: "6px",
                                marginBottom: "24px",
                            }}
                        >
                            <h3>{m.name}</h3>
                            {m.photoUrl && (
                                <img
                                    src={m.photoUrl}
                                    alt={m.name}
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        marginBottom: "12px",
                                    }}
                                />
                            )}
                            <p>
                                <strong>Total Equity:</strong> {totalEquity}%
                            </p>
                            {/* Show their area/factor contributions */}
                            {Object.entries(m.contributions).map(([areaName, val]) => (
                                <div key={areaName}>
                                    {areaName}: {val}%
                                </div>
                            ))}

                            <div className="chart-container" style={{ marginTop: "16px", height: "200px" }}>
                                <Pie data={memberChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                            </div>

                            <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
                                <button
                                    onClick={() => handleEditMember(m.id)}
                                    style={{
                                        padding: "6px 12px",
                                        backgroundColor: "#3b82f6",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        transition: "background-color 0.3s",
                                    }}
                                    onMouseOver={(e) => { e.target.style.backgroundColor = "#2563eb"; }}
                                    onMouseOut={(e) => { e.target.style.backgroundColor = "#3b82f6"; }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteMember(m.id)}
                                    style={{
                                        padding: "6px 12px",
                                        backgroundColor: "#ef4444",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        transition: "background-color 0.3s",
                                    }}
                                    onMouseOver={(e) => { e.target.style.backgroundColor = "#dc2626"; }}
                                    onMouseOut={(e) => { e.target.style.backgroundColor = "#ef4444"; }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}

                <button
                    onClick={() => navigate(`/new-member/${workspaceId}`)}
                    style={{
                        marginTop: "24px",
                        padding: "10px 20px",
                        backgroundColor: "#10B981",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                    }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = "#059669"; }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = "#10B981"; }}
                >
                    + Add Member
                </button>
            </div>

            {/* Modals */}
            {showValidation && <ValidationModal onClose={closeValidation} workspaceId={workspaceId} />}
            {showCategoryLimitModal && (
                <CategoryLimitModal onClose={() => setShowCategoryLimitModal(false)} />
            )}
        </div>
    );
}

export default TeamDetailsPage;
