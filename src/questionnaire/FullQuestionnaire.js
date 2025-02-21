// src/questionnaire/FullQuestionnaire.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeamContext } from "../TeamContext";
import FullQuestionnaireLeftNav from "./FullQuestionnaireLeftNav";

import ReservedPoolQuestion from "./ReservedPoolQuestion";
import DistributionAdjustmentQuestion from "./DistributionAdjustmentQuestion";
import FactorAllocationQuestion from "./FactorAllocationQuestion";
import EquityReportReadyModal from "../components/EquityReportReadyModal";

import "../styles.css";

function FullQuestionnaire() {
    const navigate = useNavigate();
    const { activeWorkspaceId, getWorkspaceById, updateWorkspaceData } = useTeamContext();
    const workspace = getWorkspaceById(activeWorkspaceId);
    if (!workspace) {
        return (
            <div style={{ padding: "16px" }}>
                <h2>Workspace data not found!</h2>
            </div>
        );
    }

    const wsP1 = workspace.part1Answers || { reservedPools: [] };
    const wsP2 = workspace.part2Answers || {};
    const visitedQuestionsPart1 = workspace.visitedQuestionsPart1 || {};
    const visitedQuestionsPart2 = workspace.visitedQuestionsPart2 || {};

    const [currentIndex, setCurrentIndex] = useState(0);
    const [showReportModal, setShowReportModal] = useState(false);

    // Merge visited flags for left nav
    const visitedAll = { ...visitedQuestionsPart1, ...visitedQuestionsPart2 };

    const steps = [
        { id: 1, title: "Number of Founders" },
        { id: 2, title: "Founder Names" },
        { id: 3, title: "Reserve Equity for Future Shareholders" },
        { id: 4, title: "Financial Investment by Founders" },
        { id: 5, title: "Time Commitment by Founders" },
        { id: 6, title: "Asset Contribution by Founders" },
        { id: 7, title: "Impact if Founders’ Cash Was Absent" },
        { id: 8, title: "Full-Time Commitment Importance" },
        { id: 9, title: "Impact if Non-Cash Assets Were Absent" },
        { id: 10, title: "Equity Distribution Adjustment & Review" },
        { id: 11, title: "Equity Allocation for Core Factors" },
        { id: 12, title: "Pre-Formation Contributions" },
        { id: 13, title: "Role & Responsibility Consideration" },
        { id: 14, title: "Relevant Experience & Networks" },
    ];

    function markVisited(idx) {
        const updatedV1 = { ...visitedQuestionsPart1 };
        const updatedV2 = { ...visitedQuestionsPart2 };
        if (idx < 9) {
            updatedV1[idx] = true;
        } else {
            updatedV2[idx - 9] = true;
        }
        updateWorkspaceData(workspace.id, {
            ...workspace,
            visitedQuestionsPart1: updatedV1,
            visitedQuestionsPart2: updatedV2,
        });
    }

    function goNext() {
        markVisited(currentIndex);
        if (currentIndex < steps.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    }

    function goPrev() {
        markVisited(currentIndex);
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    }

    function skipQuestion() {
        markVisited(currentIndex);
        goNext();
    }

    function finishAll() {
        markVisited(currentIndex);
        // Mark questionnaire complete in the workspace data
        updateWorkspaceData(workspace.id, { ...workspace, isFullQuestionnaireComplete: true });
        setShowReportModal(true);
    }

    function renderQuestion(stepId) {
        switch (stepId) {
            case 1:
                return (
                    <div>
                        <h3>Question 1/14</h3>
                        <p>How many founding team members?</p>
                        <div style={{ marginTop: "8px" }}>
                            {[1, 2, 3].map((n) => (
                                <label key={n} style={{ display: "block" }}>
                                    <input
                                        type="radio"
                                        checked={wsP1.foundingTeamSize === n}
                                        onChange={() => {
                                            const newP1 = { ...wsP1, foundingTeamSize: n };
                                            updateWorkspaceData(workspace.id, { ...workspace, part1Answers: newP1 });
                                        }}
                                    />
                                    {n}
                                </label>
                            ))}
                            <label style={{ display: "block", marginTop: "8px" }}>
                                Other:
                                <input
                                    type="number"
                                    style={{ width: "60px", marginLeft: "4px" }}
                                    value={wsP1.foundingTeamSize > 3 ? wsP1.foundingTeamSize : ""}
                                    onChange={(e) => {
                                        let val = parseInt(e.target.value || "0", 10);
                                        if (isNaN(val) || val < 0) val = 0;
                                        const newP1 = { ...wsP1, foundingTeamSize: val };
                                        updateWorkspaceData(workspace.id, { ...workspace, part1Answers: newP1 });
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h3>Question 2/14</h3>
                        <p>Please list the names of all founding team members.</p>
                        {Array.from({ length: wsP1.foundingTeamSize }).map((_, i) => (
                            <div key={i} style={{ marginBottom: "8px" }}>
                                <input
                                    type="text"
                                    placeholder={`Name of founder #${i + 1}`}
                                    style={{ width: "250px" }}
                                    value={wsP1.founderNames[i] || ""}
                                    onChange={(e) => {
                                        const copy = [...wsP1.founderNames];
                                        copy[i] = e.target.value;
                                        const newP1 = { ...wsP1, founderNames: copy };
                                        updateWorkspaceData(workspace.id, { ...workspace, part1Answers: newP1 });
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h3>Question 3/14</h3>
                        <p>How much equity (%) to reserve for future shareholders?</p>
                        <ReservedPoolQuestion workspace={workspace} />
                    </div>
                );
            case 4:
                return (
                    <div>
                        <h3>Question 4/14</h3>
                        <p>How much money has each founder invested?</p>
                        {wsP1.founderNames.map((fn) => (
                            <div key={fn} style={{ marginBottom: "8px" }}>
                                <label>{fn}: $</label>
                                <input
                                    type="number"
                                    style={{ width: "100px", marginLeft: "4px" }}
                                    value={wsP1.foundersCashInvested[fn] || ""}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        const newP1 = {
                                            ...wsP1,
                                            foundersCashInvested: { ...wsP1.foundersCashInvested, [fn]: val },
                                        };
                                        updateWorkspaceData(workspace.id, { ...workspace, part1Answers: newP1 });
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                );
            case 5:
                return (
                    <div>
                        <h3>Question 5/14</h3>
                        <p>How many hours per week does each founder commit?</p>
                        {wsP1.founderNames.map((fn) => (
                            <div key={fn} style={{ marginBottom: "8px" }}>
                                <label>{fn}: </label>
                                <input
                                    type="number"
                                    style={{ width: "60px", marginLeft: "4px" }}
                                    value={wsP1.foundersTime[fn] || ""}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        const newP1 = {
                                            ...wsP1,
                                            foundersTime: { ...wsP1.foundersTime, [fn]: val },
                                        };
                                        updateWorkspaceData(workspace.id, { ...workspace, part1Answers: newP1 });
                                    }}
                                />
                                hrs/week
                            </div>
                        ))}
                    </div>
                );
            case 6:
                return (
                    <div>
                        <h3>Question 6/14</h3>
                        <p>What is the total value of assets each founder contributed?</p>
                        {wsP1.founderNames.map((fn) => (
                            <div key={fn} style={{ marginBottom: "8px" }}>
                                <label>{fn}: $</label>
                                <input
                                    type="number"
                                    style={{ width: "100px", marginLeft: "4px" }}
                                    value={wsP1.foundersAssets[fn] || ""}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        const newP1 = {
                                            ...wsP1,
                                            foundersAssets: { ...wsP1.foundersAssets, [fn]: val },
                                        };
                                        updateWorkspaceData(workspace.id, { ...workspace, part1Answers: newP1 });
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                );
            case 7:
                return (
                    <div>
                        <h3>Question 7/14</h3>
                        <p>
                            How would the absence of founders’ cash affect the business? (1 = minimal, 5 = can't launch)
                        </p>
                        <input
                            type="range"
                            min={1}
                            max={5}
                            step={1}
                            value={wsP1.ratingFinancialImpact}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                const newP1 = { ...wsP1, ratingFinancialImpact: val };
                                updateWorkspaceData(workspace.id, { ...workspace, part1Answers: newP1 });
                            }}
                        />
                        <span style={{ marginLeft: "8px" }}>{wsP1.ratingFinancialImpact}</span>
                    </div>
                );
            case 8:
                return (
                    <div>
                        <h3>Question 8/14</h3>
                        <p>
                            How critical is full-time commitment for success? (1 = no impact, 5 = essential)
                        </p>
                        <input
                            type="range"
                            min={1}
                            max={5}
                            step={1}
                            value={wsP1.ratingTimeImportance}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                const newP1 = { ...wsP1, ratingTimeImportance: val };
                                updateWorkspaceData(workspace.id, { ...workspace, part1Answers: newP1 });
                            }}
                        />
                        <span style={{ marginLeft: "8px" }}>{wsP1.ratingTimeImportance}</span>
                    </div>
                );
            case 9:
                return (
                    <div>
                        <h3>Question 9/14</h3>
                        <p>
                            Impact if founders' non-cash assets didn't exist? (1 = minimal, 5 = severely impaired)
                        </p>
                        <input
                            type="range"
                            min={1}
                            max={5}
                            step={1}
                            value={wsP1.ratingAssetImportance}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                const newP1 = { ...wsP1, ratingAssetImportance: val };
                                updateWorkspaceData(workspace.id, { ...workspace, part1Answers: newP1 });
                            }}
                        />
                        <span style={{ marginLeft: "8px" }}>{wsP1.ratingAssetImportance}</span>
                    </div>
                );
            case 10:
                return <DistributionAdjustmentQuestion workspace={workspace} />;
            case 11:
                return (
                    <FactorAllocationQuestion
                        workspace={workspace}
                        questionIndex={11}
                        questionTitle="Equity Allocation for Core Factors"
                        disclaimer="*Percentages represent relative contributions..."
                        suggestedFactors={[
                            { name: "Opportunity Costs", tooltip: "Salary forgone, or similar" },
                            { name: "Personal Risk", tooltip: "Savings, mortgage, loan" },
                            { name: "IP/Patent", tooltip: "Value from IP contributed" },
                            { name: "Liability Assumption", tooltip: "Collateral, personal guarantees" },
                        ]}
                        answerKey="coreFactors"
                    />
                );
            case 12:
                return (
                    <FactorAllocationQuestion
                        workspace={workspace}
                        questionIndex={12}
                        questionTitle="Pre-Formation Contributions"
                        disclaimer="You can skip if none apply."
                        suggestedFactors={[
                            { name: "Idea", tooltip: "Who contributed the core idea?" },
                            { name: "Research/Market Data", tooltip: "Time spent on early research" },
                            { name: "MVP", tooltip: "Did someone build the MVP alone?" },
                            { name: "Signed Contracts", tooltip: "Deals prior to formation" },
                            { name: "Prototype", tooltip: "Significant dev or prototypes" },
                            { name: "Social Presence", tooltip: "Early marketing presence" },
                            { name: "LOI/Pre-approval", tooltip: "Letters of intent or early approvals" },
                            { name: "Business Plan/Modelling", tooltip: "Detailed business plan" },
                            { name: "Brand Establishment", tooltip: "Logos, identity, etc." },
                            { name: "Investment approvals", tooltip: "Securing term sheets" },
                        ]}
                        answerKey="preFormation"
                    />
                );
            case 13:
                return (
                    <FactorAllocationQuestion
                        workspace={workspace}
                        questionIndex={13}
                        questionTitle="Role & Responsibility Consideration"
                        disclaimer="Skip if none apply."
                        suggestedFactors={[
                            { name: "Rare Expertise", tooltip: "Hard to replace specialized skill" },
                            { name: "Key Milestones Impact", tooltip: "Key to product launch, fundraising, revenue targets" },
                            { name: "Strategic Role", tooltip: "Key to company’s competitive advantage, reputation, or compliance" },
                            { name: "Revenue/Partnership Impact", tooltip: "Influences customer acquisition, partnerships, sales" },
                            { name: "Regulatory/Compliance Onus", tooltip: "Personal liability for compliance failures or legal risks" },
                            { name: "Pre-Revenue Salary Need", tooltip: "Needs a salary before the company generates revenue" },
                            { name: "Business Continuity Risk", tooltip: "Business would not continue without this founder" },
                            { name: "Service Impact", tooltip: "Founder’s departure would severely disrupt product/service delivery" },
                            { name: "Key Component Risk", tooltip: "Key component of business lost if founder leaves" },
                            { name: "Customer Acquisition Difficulty", tooltip: "Customer acquisition would be difficult without this founder" },
                            { name: "Time to Market Delay", tooltip: "Negative impact on product launch timeline" },
                            { name: "Founder Reliant Product/Service", tooltip: "The main product or service cannot function without this founder" },
                        ]}
                        answerKey="roleResponsibility"
                    />
                );
            case 14:
                return (
                    <FactorAllocationQuestion
                        workspace={workspace}
                        questionIndex={14}
                        questionTitle="Relevant Experience & Networks"
                        disclaimer="Skip if none apply."
                        suggestedFactors={[
                            { name: "Influencer Status", tooltip: "Large personal brand or media presence" },
                            { name: "Speaker/Writer", tooltip: "Public recognition and thought leadership" },
                            { name: "Research Grants", tooltip: "Experience with securing grants or research funding" },
                            { name: "Trade Secrets", tooltip: "Proprietary processes or confidential knowledge" },
                            { name: "Successful Exits", tooltip: "Founder has prior successful business exits" },
                            { name: "Social Capital", tooltip: "Strong industry connections and network" },
                            { name: "Product Knowledge", tooltip: "Deep expertise in product development" },
                            { name: "Industry Knowledge", tooltip: "Extensive understanding of industry trends" },
                            { name: "Supplier Knowledge", tooltip: "Deep and provable expertise in supplier management" },
                            { name: "Manufacturing Knowledge", tooltip: "Deep and provable experience in manufacturing" },
                            { name: "Distribution Knowledge", tooltip: "Deep and provable knowledge of distribution systems" },
                            { name: "Operations Knowledge", tooltip: "Expertise in optimizing business operations" },
                            { name: "Marketing Knowledge", tooltip: "Deep understanding of branding and marketing" },
                            { name: "Financial Knowledge", tooltip: "Strong background in financial planning" },
                            { name: "Competitor Knowledge", tooltip: "Awareness of market competition" },
                            { name: "Local Knowledge", tooltip: "Deep understanding of regional markets" },
                            { name: "Global Expansion", tooltip: "Proven experience scaling businesses globally" },
                            { name: "Scaling Knowledge", tooltip: "Experience in business growth strategies" },
                            { name: "Regulatory Knowledge", tooltip: "Expertise in compliance and industry regulations" },
                            { name: "Lobbying Knowledge", tooltip: "Understanding of policy influence and lobbying" },
                            { name: "Legal Knowledge", tooltip: "Expertise in business law and contracts" },
                            { name: "Fundraising Network", tooltip: "Connections to investors and funding sources" },
                            { name: "Regulatory Network", tooltip: "Connections with regulators and policymakers" },
                            { name: "Supplier Network", tooltip: "Strong relationships with key suppliers" },
                            { name: "Manufacturing Network", tooltip: "Established partnerships in manufacturing" },
                            { name: "Recruiting Network", tooltip: "Access to top talent and hiring resources" },
                            { name: "Distribution Network", tooltip: "Access to key distribution channels" },
                            { name: "Client Network", tooltip: "Established customer and client base" },
                        ]}
                        answerKey="experienceNetworks"
                    />
                );
            default:
                return null;
        }
    }

    const step = steps[currentIndex];

    return (
        <div className="full-questionnaire-container">
            <h2 className="questionnaire-title">Combined 14-Question Equity Calculator</h2>

            {showReportModal && (
                <EquityReportReadyModal
                    onClose={() => setShowReportModal(false)}
                    onViewReport={() => {
                        setShowReportModal(false);
                        navigate("/report");
                    }}
                />
            )}

            <div style={{ display: "flex" }}>
                <FullQuestionnaireLeftNav
                    steps={steps}
                    currentIndex={currentIndex}
                    visited={visitedAll}
                />

                <div className="question-area" style={{ marginLeft: "16px" }}>
                    <div className="company-name-container" style={{ marginBottom: "16px" }}>
                        <label>Company Name: </label>
                        <input
                            type="text"
                            style={{ marginLeft: "8px" }}
                            value={wsP1.companyName}
                            onChange={(e) => {
                                const newP1 = { ...wsP1, companyName: e.target.value };
                                updateWorkspaceData(workspace.id, { ...workspace, part1Answers: newP1 });
                            }}
                        />
                    </div>

                    <div className="question-content">{renderQuestion(step.id)}</div>

                    <div className="question-nav-buttons">
                        {currentIndex > 0 && (
                            <button
                                onClick={() => {
                                    markVisited(currentIndex);
                                    setCurrentIndex(currentIndex - 1);
                                }}
                            >
                                Previous
                            </button>
                        )}

                        {step.id >= 12 && step.id <= 14 && currentIndex < steps.length - 1 && (
                            <button
                                onClick={() => {
                                    markVisited(currentIndex);
                                    setCurrentIndex(currentIndex + 1);
                                }}
                            >
                                Skip
                            </button>
                        )}

                        {currentIndex < steps.length - 1 && (
                            <button
                                onClick={() => {
                                    markVisited(currentIndex);
                                    setCurrentIndex(currentIndex + 1);
                                }}
                            >
                                Next
                            </button>
                        )}

                        {currentIndex === steps.length - 1 && (
                            <button onClick={finishAll}>Finish All 14 Questions</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FullQuestionnaire;
